-- Categorias de Capawards con seleccion multiple (p.ej. disfraces en
-- grupo): una "papeleta" para esa categoria puede marcar a varios
-- pasajeros a la vez, formando un "grupo". Cada grupo distinto (por
-- combinacion exacta de personas) se cuenta por separado; el mismo grupo
-- repetido por distintos votantes suma votos para ese grupo.

alter table capawards_categories
  add column if not exists is_multi_select boolean not null default false;

-- Las categorias normales siguen usando nominee_passenger_id (una persona).
-- Las de seleccion multiple usan nominee_passenger_ids (array) y dejan
-- nominee_passenger_id a null, por eso deja de ser obligatoria.
alter table capawards_votes
  alter column nominee_passenger_id drop not null;

alter table capawards_votes
  add column if not exists nominee_passenger_ids uuid[];

alter table capawards_votes
  add constraint capawards_votes_nominee_shape_chk
  check (
    (nominee_passenger_id is not null and nominee_passenger_ids is null)
    or
    (nominee_passenger_id is null and nominee_passenger_ids is not null and array_length(nominee_passenger_ids, 1) >= 1)
  );

-- Reemplaza el envio de papeleta para admitir ambas formas: una persona
-- (nominee_passenger_id) o un grupo (nominee_passenger_ids).
create or replace function submit_capawards_ballot(p_voter_id uuid, p_votes jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ballot_id uuid;
  v_item jsonb;
  v_voting_open boolean;
  v_ids uuid[];
begin
  select capawards_voting_open into v_voting_open from app_settings limit 1;
  if not coalesce(v_voting_open, false) then
    raise exception 'VOTING_CLOSED';
  end if;

  if p_votes is null or jsonb_array_length(p_votes) = 0 then
    raise exception 'EMPTY_BALLOT';
  end if;

  insert into capawards_ballots (voter_passenger_id)
  values (p_voter_id)
  returning id into v_ballot_id;

  for v_item in select * from jsonb_array_elements(p_votes)
  loop
    if v_item ? 'nominee_passenger_ids' and jsonb_typeof(v_item -> 'nominee_passenger_ids') = 'array' then
      select array_agg(elem::uuid) into v_ids
      from jsonb_array_elements_text(v_item -> 'nominee_passenger_ids') as elem;

      if v_ids is null or array_length(v_ids, 1) is null then
        raise exception 'EMPTY_GROUP';
      end if;

      if p_voter_id = any(v_ids) then
        raise exception 'SELF_VOTE_NOT_ALLOWED';
      end if;

      insert into capawards_votes (ballot_id, category_id, nominee_passenger_ids)
      values (v_ballot_id, (v_item ->> 'category_id')::uuid, v_ids);
    else
      if (v_item ->> 'nominee_passenger_id')::uuid = p_voter_id then
        raise exception 'SELF_VOTE_NOT_ALLOWED';
      end if;

      insert into capawards_votes (ballot_id, category_id, nominee_passenger_id)
      values (
        v_ballot_id,
        (v_item ->> 'category_id')::uuid,
        (v_item ->> 'nominee_passenger_id')::uuid
      );
    end if;
  end loop;
end;
$$;

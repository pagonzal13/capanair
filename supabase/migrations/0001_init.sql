-- Capanair (Capafest) - esquema inicial
-- Ejecutar en el SQL Editor de Supabase (o via `supabase db push`).

create extension if not exists pgcrypto;

-- =========================================================
-- PASAJEROS (invitados)
-- =========================================================
create table if not exists passengers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  seat_code text,                          -- p.ej. "2A", "4F" (habitacion)
  editions_attended int not null default 1 check (editions_attended >= 0),
  is_dead boolean not null default false,  -- estado en el juego "La Mafia"
  died_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists passengers_full_name_idx on passengers (full_name);

-- =========================================================
-- HORARIO (panel de salidas/llegadas)
-- =========================================================
create table if not exists schedule_events (
  id uuid primary key default gen_random_uuid(),
  day text not null check (day in ('viernes', 'sabado', 'domingo')),
  event_time time not null,
  activity text not null,
  description text,
  location text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists schedule_events_day_time_idx on schedule_events (day, event_time);

-- =========================================================
-- AJUSTES GLOBALES (fila unica)
-- =========================================================
create table if not exists app_settings (
  id boolean primary key default true check (id),
  capawards_voting_open boolean not null default false,
  capawards_results_published boolean not null default false,
  updated_at timestamptz not null default now()
);

insert into app_settings (id)
values (true)
on conflict (id) do nothing;

-- =========================================================
-- CAPAWARDS
-- =========================================================
create table if not exists capawards_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  sort_order int not null default 0,
  winner_passenger_id uuid references passengers (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Un "ballot" (papeleta) por pasajero votante. Su existencia = "ya ha votado".
create table if not exists capawards_ballots (
  id uuid primary key default gen_random_uuid(),
  voter_passenger_id uuid not null unique references passengers (id),
  submitted_at timestamptz not null default now()
);

create table if not exists capawards_votes (
  id uuid primary key default gen_random_uuid(),
  ballot_id uuid not null references capawards_ballots (id) on delete cascade,
  category_id uuid not null references capawards_categories (id) on delete cascade,
  nominee_passenger_id uuid not null references passengers (id),
  unique (ballot_id, category_id)
);

create index if not exists capawards_votes_category_idx on capawards_votes (category_id);

-- Envio atomico de una papeleta completa (una fila por categoria).
-- p_votes: jsonb array de objetos {"category_id": "...", "nominee_passenger_id": "..."}
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
    if (v_item ->> 'nominee_passenger_id')::uuid = p_voter_id then
      raise exception 'SELF_VOTE_NOT_ALLOWED';
    end if;

    insert into capawards_votes (ballot_id, category_id, nominee_passenger_id)
    values (
      v_ballot_id,
      (v_item ->> 'category_id')::uuid,
      (v_item ->> 'nominee_passenger_id')::uuid
    );
  end loop;
end;
$$;

-- Calcula y guarda el ganador (mas votos; empate -> el que llego antes) de cada categoria.
create or replace function publish_capawards_results()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_voting_open boolean;
begin
  select capawards_voting_open into v_voting_open from app_settings limit 1;
  if coalesce(v_voting_open, false) then
    raise exception 'VOTING_STILL_OPEN';
  end if;

  update capawards_categories c
  set winner_passenger_id = w.nominee_passenger_id,
      updated_at = now()
  from (
    select distinct on (category_id)
      category_id,
      nominee_passenger_id
    from capawards_votes
    group by category_id, nominee_passenger_id
    order by category_id, count(*) desc, min(id::text) asc
  ) w
  where c.id = w.category_id;

  update app_settings set capawards_results_published = true, updated_at = now() where id = true;
end;
$$;

-- =========================================================
-- ROW LEVEL SECURITY
-- Toda la app usa la service_role key en el servidor (Next.js),
-- que ignora RLS. Activamos RLS sin policies para que las claves
-- publicas/anon (si alguna vez se usan) no puedan leer ni escribir nada.
-- =========================================================
alter table passengers enable row level security;
alter table schedule_events enable row level security;
alter table app_settings enable row level security;
alter table capawards_categories enable row level security;
alter table capawards_ballots enable row level security;
alter table capawards_votes enable row level security;

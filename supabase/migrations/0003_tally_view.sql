-- Vista de recuento de votos por categoria/nominado, usada por el panel
-- de administracion de Capawards (top 3 por categoria).
create or replace view capawards_tally as
select
  category_id,
  nominee_passenger_id,
  count(*) as votes_count
from capawards_votes
group by category_id, nominee_passenger_id;

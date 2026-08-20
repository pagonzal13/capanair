-- Campos adicionales detectados en el Excel real de gestion de Capafest:
-- - passengers.badges: etiquetas del pasajero (p.ej. "Organizacion", "DJ").
-- - schedule_events.icon: emoji asociado a la actividad, mostrado en el
--   panel de salidas/llegadas.

alter table passengers
  add column if not exists badges text[] not null default '{}';

alter table schedule_events
  add column if not exists icon text;

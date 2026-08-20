-- Datos de ejemplo (PLACEHOLDER).
-- Sustituye estos datos por los reales de tu Excel de pasajeros/horario,
-- ya sea a mano desde el panel /admin o con tus propios INSERT en el SQL Editor.
-- Puedes borrar este fichero de seed sin problema si no lo quieres ejecutar.

insert into passengers (full_name, seat_code, editions_attended) values
  ('Ana Garcia',      '1A', 8),
  ('Luis Martinez',   '1B', 6),
  ('Marta Fernandez', '1C', 4),
  ('Carlos Ruiz',     '2A', 2),
  ('Elena Sanchez',   '2B', 1),
  ('Pablo Lopez',     '2C', 5),
  ('Sofia Diaz',      '3A', 3),
  ('Javier Moreno',   '3B', 7),
  ('Lucia Alvarez',   '3C', 1),
  ('Diego Romero',    '4A', 2)
on conflict do nothing;

insert into schedule_events (day, event_time, activity, description, location, sort_order) values
  ('viernes', '18:00', 'Facturacion y bienvenida', 'Recogida de tarjetas de embarque (acreditaciones) y bienvenida a bordo.', 'Terminal principal', 10),
  ('viernes', '20:30', 'Cena de despegue', 'Cena inaugural para coger altitud.', 'Salon comedor', 20),
  ('viernes', '23:00', 'Fiesta de medianoche', 'Musica y barra libre hasta que el capitan lo permita.', 'Salon principal', 30),
  ('sabado',  '10:00', 'Desayuno a bordo', NULL, 'Salon comedor', 10),
  ('sabado',  '12:00', 'Actividades de tripulacion', 'Juegos y dinamicas de equipo.', 'Jardin exterior', 20),
  ('sabado',  '14:00', 'Almuerzo en ruta', NULL, 'Salon comedor', 30),
  ('sabado',  '18:00', 'Capawards', 'Entrega de los premios Capawards. ¡No te lo pierdas!', 'Salon principal', 40),
  ('sabado',  '21:00', 'Cena de gala', 'Cena tematica de esta edicion: viajes.', 'Salon comedor', 50),
  ('sabado',  '23:30', 'Fiesta nocturna', NULL, 'Salon principal', 60),
  ('domingo', '10:30', 'Desayuno de aterrizaje', NULL, 'Salon comedor', 10),
  ('domingo', '13:00', 'Despedida y checkout', 'Cierre del vuelo Capanair 2026. ¡Buen viaje de vuelta!', 'Terminal principal', 20)
on conflict do nothing;

insert into capawards_categories (name, description, sort_order) values
  ('Mejor disfraz',               'Quien mejor ha interpretado la tematica de este año.', 10),
  ('Alma de la fiesta',           'Quien no ha parado de bailar ni un segundo.', 20),
  ('Personaje mas escurridizo',   'Ese pasajero que desaparece y reaparece sin explicacion.', 30),
  ('Mejor anfitrion/a',           'Quien mas ha cuidado del resto de la tripulacion.', 40),
  ('Momento mas memorable',       'Protagonista de la anecdota de la que se hablara todo el año.', 50)
on conflict do nothing;

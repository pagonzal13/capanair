-- Datos reales de Capafest (edicion Viajes) importados desde el Excel de gestion.
-- Sustituye a los datos de ejemplo iniciales. Puedes seguir editando pasajeros
-- y horario desde /admin sin volver a tocar este fichero.

insert into passengers (full_name, seat_code, editions_attended, badges) values
  ('Ame', '2A', 3, '{}'),
  ('Jor', '2A', 3, '{}'),
  ('Marsi', '2B', 5, '{}'),
  ('Rubio', '2B', 5, '{}'),
  ('Samu', '2C', 2, '{}'),
  ('Serepi', '2C', 1, '{}'),
  ('Ana', '2D', 2, '{"Organización"}'),
  ('Andres', '2D', 5, '{"Organización"}'),
  ('Helen', '3A', 3, '{}'),
  ('JT', '3A', 2, '{}'),
  ('Kuchiki', '3A', 8, '{}'),
  ('Loarte', '3A', 8, '{}'),
  ('Bardan', '3B', 7, '{}'),
  ('Santini', '3B', 8, '{}'),
  ('Martagu', '3C', 8, '{}'),
  ('Mateo', '3C', 3, '{}'),
  ('Andriu', '3D', 2, '{}'),
  ('V4len', '3D', 8, '{"DJ"}'),
  ('Hardolfo', '3E', 8, '{"Organización","DJ"}'),
  ('Lau', '3E', 5, '{}'),
  ('Capa', '3F', 8, '{"Organización","DJ"}'),
  ('Paulish', '3F', 6, '{"Organización","DJ"}'),
  ('Capu', '4A', 3, '{}'),
  ('Chems', '4A', 3, '{}'),
  ('Faba', '4B', 1, '{}'),
  ('Goloti', '4B', 5, '{}'),
  ('Castillo', '4C', 2, '{}'),
  ('elsetas036', '4C', 6, '{"DJ"}'),
  ('Vane', '4D', 1, '{}'),
  ('Mich', '4D', 7, '{}'),
  ('Nana', '4D', 6, '{}'),
  ('Glezo', '4E', 3, '{}'),
  ('Raquel', '4E', 1, '{}'),
  ('Manu G', '4F', 1, '{}'),
  ('Breko', '4F', 5, '{}'),
  ('Marino', '4F', 2, '{}')
on conflict do nothing;

insert into schedule_events (day, event_time, activity, description, location, icon, sort_order) values
  ('viernes', '18:00', 'Empezamos!', 'Apertura de puertas y jolgorio', 'Exteriores & Pool', '🎉', 0),
  ('viernes', '20:00', 'Cabrones a ENCENDER LA BBQ!!!!', 'A echar una manita, venga', 'Exteriores', '🔥', 10),
  ('viernes', '21:00', 'Cena', 'Cena de sufrimiento animal y brócoli a la brasa', 'Exteriores', '🥩', 20),
  ('viernes', '00:00', 'Dance', 'Taki Taki Variado', 'Main Stage', '🪩', 30),
  ('viernes', '01:00', 'Paulish', 'DJs', 'Main Stage', '🕺', 40),
  ('viernes', '02:00', 'Hardolfo', 'DJs', 'Main Stage', '🎧', 50),
  ('viernes', '03:15', 'Capreini Drum & Bass', 'DJs', 'Main Stage', '🎧', 60),
  ('viernes', '04:30', 'elsetas036', 'DJs', 'Main Stage', null, 70),
  ('viernes', '06:00', 'Lo que surja', 'Como surja', 'Donde surja', '🎲', 80),
  ('viernes', '09:00', 'A recargarse que mañana hay más', 'Ibuprofeno y a la cama', 'Rooms', '😴', 90),
  ('sabado', '14:00', 'VIP Lounge opening', 'Cocktail bar feat altavoz', 'VIP Lounge', '🍹', 100),
  ('sabado', '14:30', 'A comeeer!', 'Paella', 'VIP Lounge', '🥘', 110),
  ('sabado', '16:00', 'Voley acuático', 'Cosas con balón en la piscina', 'VIP Lounge', '🏐', 120),
  ('sabado', '21:00', 'Cena', 'Pizzas, tortillas, sobras de la BBQ, sobras del arroz...lo que cada uno pille', 'Cocina', '🍕', 130),
  ('sabado', '22:30', 'Carnavaaal, Carnavaaal!', 'Toca lucir los disfraces infernales', 'Main Stage', '🎭', 140),
  ('sabado', '23:00', 'Capawards', 'Ceremonia de la 5ª edición (disfrazados)', 'Main Stage', '🏆', 150),
  ('sabado', '00:00', 'Dance', 'Como el viernes pero rellenos de tortilla y pizza', 'Main Stage', '🪩', 160),
  ('sabado', '02:00', 'V4', 'DJs', 'Main Stage', '🎧', 170),
  ('sabado', '03:15', 'Capa y espada (Capreini B2B V4)', 'DJs', 'Main Stage', '⚔️', 180),
  ('sabado', '04:30', 'DJ sorpresa', 'Sorpresa para todos porque no sabemos quién pillará la mesa', 'Main Stage', '🍄', 190),
  ('sabado', '05:00', 'Santini', 'Beso o chupito', 'Main Stage', '💋', 200),
  ('domingo', '10:00', 'Amanecer muertos vivientes', 'Esta vez con CHURROS', 'Main Stage', '🌅', 210),
  ('domingo', '11:30', 'Recogición', 'A echar una manita, venga', 'Por todas partes', '🧹', 220),
  ('domingo', '13:00', 'A vuestra puta casa', 'Hasta el próximo año!', 'Lejos de Cuerva', '👋', 230)
on conflict do nothing;

insert into capawards_categories (name, description, sort_order) values
  ('Mejor disfraz', 'Quien mejor ha interpretado la tematica de este año.', 10),
  ('Alma de la fiesta', 'Quien no ha parado de bailar ni un segundo.', 20),
  ('Personaje mas escurridizo', 'Ese pasajero que desaparece y reaparece sin explicacion.', 30),
  ('Mejor anfitrion/a', 'Quien mas ha cuidado del resto de la tripulacion.', 40),
  ('Momento mas memorable', 'Protagonista de la anecdota de la que se hablara todo el año.', 50)
on conflict do nothing;

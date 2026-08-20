# Capanair — la aerolínea de Capafest ✈️

Web para los invitados de Capafest (edición «Viajes»), con el aspecto de la
web de una aerolínea ficticia llamada **Capanair**. Construida con
**Next.js 14 (App Router) + TypeScript + Tailwind CSS**, alojada en
**Vercel** y con **Supabase** (Postgres) como base de datos.

> ⚠️ **Nota sobre el logo y los datos reales**: esta app se ha generado sin
> acceso a los ficheros adjuntos (logo de la aerolínea y Excel de
> pasajeros/horario/habitaciones), así que incluye un logo placeholder
> (`src/components/Logo.tsx`, generado a partir de la paleta de colores) y
> datos de ejemplo (`supabase/migrations/0002_seed.sql`). Antes de
> compartir la web con los invitados, sustituye ambas cosas — ver más abajo.

## Qué incluye

- **Acceso con contraseña única** (`/acceso`) para todo el sitio, con
  cookie de sesión de 7 días. Contraseña en variable de entorno, nunca en
  el bundle de cliente.
- **Inicio**: información general del evento + panel de horario estilo
  salidas/llegadas de aeropuerto.
- **Pasajeros** (`/pasajeros`): listado de invitados con su nivel
  *Capanair Club* (Clásica / Plata / Oro / Platino, calculado automáticamente
  a partir de las ediciones a las que han asistido) y su habitación.
- **Capawards** (`/capawards`): votación sin login, paso a paso por
  categoría, sin autovoto, una votación por pasajero (control por cookie de
  dispositivo + restricción en base de datos), resultados publicables por el
  admin.
- **La Mafia** (`/mafia`): explicación del juego, diagrama estilo tarjeta de
  seguridad de avión, listado de pasajeros con los eliminados marcados, y
  aviso mediante modal (por dispositivo, vía `localStorage`) cuando hay
  nuevas víctimas.
- **Panel de administración** (`/admin`, contraseña independiente, sin
  enlaces desde la web pública): gestión del horario, gestión de Capawards
  (abrir/cerrar votación, categorías, recuento top 3, publicar resultados),
  gestión de La Mafia (marcar eliminados) y gestión de pasajeros.

## 1. Requisitos previos

- Node.js 20+
- Una cuenta de [Supabase](https://supabase.com) (plan gratuito es
  suficiente)
- Una cuenta de [Vercel](https://vercel.com)

## 2. Configurar Supabase

1. Crea un proyecto nuevo en Supabase.
2. Ve a **SQL Editor** y ejecuta, en este orden, el contenido de:
   - `supabase/migrations/0001_init.sql` (tablas, función de voto atómico,
     función de publicación de resultados, RLS)
   - `supabase/migrations/0002_seed.sql` (datos de ejemplo — opcional,
     puedes saltarlo si vas a cargar tú los pasajeros/horario reales desde
     el panel de administración)
   - `supabase/migrations/0003_tally_view.sql` (vista de recuento de votos,
     usada por el panel de admin)
3. Ve a **Project Settings → API** y copia:
   - **Project URL** → `SUPABASE_URL`
   - **service_role key** (la secreta, no la `anon`) → `SUPABASE_SERVICE_ROLE_KEY`

La app usa exclusivamente la `service_role key` **desde el servidor**
(Server Components / Server Actions / Route Handlers) para leer y escribir.
Por eso las tablas tienen Row Level Security activado sin políticas: nada
es accesible con claves públicas, todo pasa por el servidor de Next.js, que
está protegido por la contraseña de `/acceso`.

## 3. Variables de entorno

Copia `.env.example` a `.env` (en local) y rellena:

```
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
SITE_PASSWORD=capafest2026
ADMIN_PASSWORD=admin2026
SESSION_SECRET=<genera uno con: openssl rand -hex 32>
```

`SESSION_SECRET` se usa para firmar las cookies de sesión (tanto la del
sitio como la del admin). Genera uno propio y no lo compartas.

## 4. Ejecutar en local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`. Te redirigirá a `/acceso`; entra con
`SITE_PASSWORD`. El panel de administración está en
`http://localhost:3000/admin` (contraseña `ADMIN_PASSWORD`, independiente).

## 5. Cargar tus datos reales

Cuando tengas el Excel real de pasajeros/habitaciones/horario, tienes dos
opciones:

- **Manual, desde `/admin`** (recomendado si son pocos cambios): añade
  pasajeros en `/admin/pasajeros` y actividades del horario en
  `/admin/horario`.
- **Por SQL**: exporta el Excel a CSV y usa el SQL Editor de Supabase con
  `insert into passengers (full_name, seat_code, editions_attended) values (...);`
  y lo equivalente para `schedule_events`. Revisa `0002_seed.sql` como
  plantilla y bórralo/sustitúyelo cuando ya no lo necesites.

Para el logo: sustituye `src/components/Logo.tsx` por tu logo real (por
ejemplo, colocando el fichero en `/public/logo.svg` o `/public/logo.png` y
usando `<Image src="/logo.svg" ... />` en su lugar). Se usa en la barra de
navegación y en `/acceso`. La paleta de colores (navy + dorado) está en
`tailwind.config.ts`; ajústala si tu logo real tiene otros colores.

Los datos generales del evento (fechas, lugar, contacto) están en
`src/lib/eventInfo.ts` — edítalos directamente, no requieren base de datos.

## 6. Desplegar en Vercel

1. Sube este repositorio a GitHub (ya está en la rama de este proyecto).
2. En Vercel: **Add New → Project**, importa el repositorio.
3. Framework preset: **Next.js** (autodetectado).
4. En **Environment Variables**, añade las mismas 5 variables del paso 3
   (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SITE_PASSWORD`,
   `ADMIN_PASSWORD`, `SESSION_SECRET`).
5. Deploy.
6. Verifica que `NODE_ENV=production` (Vercel lo hace automáticamente),
   necesario para que las cookies se marquen `Secure`.

## 7. Cómo probarlo todo (checklist)

**Acceso del sitio**
- [ ] Entrar a `/` sin cookie → redirige a `/acceso`.
- [ ] Contraseña incorrecta → mensaje de error, sigue en `/acceso`.
- [ ] Contraseña correcta (`capafest2026`) → entra y navega libremente.
- [ ] La navegación (menú superior / hamburguesa en móvil) funciona desde
      cualquier ruta, incluidas `/capawards` y `/mafia`.

**Pasajeros**
- [ ] Se listan todos, con badge de nivel Capanair Club correcto según
      ediciones asistidas (1-2 Clásica, 3-4 Plata, 5-7 Oro, 8+ Platino) y su
      habitación.

**Capawards**
- [ ] Con votación cerrada (por defecto): mensaje «Las votaciones aún no
      están abiertas…».
- [ ] Desde `/admin/capawards`, crea categorías si no usaste el seed, y
      pulsa **Abrir votaciones**.
- [ ] En `/capawards` (navegador normal o incógnito): intro → Comenzar →
      elegir pasajero votante → una pantalla por categoría (el votante no
      aparece como opción) → revisión → enviar.
- [ ] Tras enviar, recarga `/capawards` en el mismo dispositivo → mensaje
      «Ya has votado desde este dispositivo».
- [ ] Ese mismo pasajero ya no aparece en la lista de «quién vota» para
      nadie (compruébalo desde otra ventana de incógnito).
- [ ] Desde `/admin/capawards`, cierra votaciones y comprueba el top 3 por
      categoría.
- [ ] Pulsa **Publicar resultados** (solo disponible con votación cerrada)
      y comprueba que `/capawards` ahora muestra solo los ganadores.

**La Mafia**
- [ ] `/mafia` muestra las reglas, el diagrama y el listado alfabético.
- [ ] Desde `/admin/mafia`, marca a alguien como eliminado.
- [ ] En `/mafia` (en un navegador donde ya la habías visitado antes) verás
      aparecer un modal avisando de la nueva víctima; al cerrarlo y volver a
      entrar, no vuelve a salir para esa misma persona. Márcalo dos veces
      seguidas para comprobar que agrupa varios nombres nuevos en un mismo
      modal si hay más de una novedad.

**Admin**
- [ ] `/admin` no está enlazado desde ningún sitio de la web pública.
- [ ] Usa una contraseña distinta (`admin2026`) a la del sitio.
- [ ] Horario: añadir/editar/borrar una actividad y comprobar que se
      refleja en el panel de la portada.

## 8. Estructura del proyecto

```
src/
  app/
    (site)/          # rutas públicas protegidas por /acceso (usan NavBar)
      page.tsx        # inicio
      pasajeros/
      capawards/
      mafia/
    acceso/           # login del sitio
    admin/
      login/          # login del admin (contraseña propia)
      (protected)/    # resto del panel de admin, protegido por su propia cookie
    api/mafia/status/  # endpoint de polling para el aviso de nuevas víctimas
  components/
  lib/                # supabase, auth/sesión, tipos, fidelización
supabase/migrations/  # SQL a ejecutar en Supabase
```

## 9. Notas de seguridad

- Las contraseñas (`SITE_PASSWORD`, `ADMIN_PASSWORD`) solo se leen en el
  servidor y nunca se envían al cliente.
- Las cookies de sesión son `httpOnly`, `SameSite=Lax` y firmadas con HMAC
  (`SESSION_SECRET`) para que no se puedan falsificar.
- Todas las tablas tienen RLS activado sin políticas: solo la
  `service_role key`, usada exclusivamente en el servidor, puede leer o
  escribir.
- Este proyecto fija `next@14.2.35` (la última versión estable dentro de la
  serie 14.2.x en el momento de crear el proyecto). Antes del evento,
  ejecuta `npm audit` y valora actualizar a Next.js 15/16 si quieres ir a
  la versión más reciente.

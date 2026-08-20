import "server-only";
import { createClient } from "@supabase/supabase-js";

// Cliente Supabase con la service role key. SOLO debe usarse en el servidor
// (Server Components, Server Actions, Route Handlers). Ignora RLS por
// completo, asi que nunca debe importarse desde codigo de cliente.
// No generamos tipos de esquema a partir de Supabase en este proyecto,
// asi que tipamos el cliente como `any` para evitar que las tablas se
// infieran como `never` en las consultas.
let cachedClient: ReturnType<typeof createClient<any>> | null = null;

export function getSupabaseAdmin() {
  if (cachedClient) return cachedClient;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Faltan las variables de entorno SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  cachedClient = createClient<any>(url, key, {
    auth: { persistSession: false },
  });

  return cachedClient;
}

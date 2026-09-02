import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

/**
 * Cliente con la service_role key — bypassea RLS por completo. SÓLO se usa
 * desde el webhook de Mercado Pago (src/app/api/mercadopago/webhook/route.ts)
 * para escribir en data_subscriptions, que a propósito no tiene policy de
 * insert/update para el usuario (ver 0010_data_subscriptions.sql). Nunca
 * importar este archivo desde código que pueda correr en el navegador ni
 * desde una ruta que actúe en nombre de la sesión del usuario.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "[supabase/admin] Faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

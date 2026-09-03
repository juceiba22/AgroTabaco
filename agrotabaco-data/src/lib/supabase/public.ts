import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

/**
 * Cliente sin cookies para los fact_* de solo lectura pública (RLS "lectura
 * pública" en todos ellos). A diferencia de src/lib/supabase/server.ts, este
 * no usa next/headers -> lo usan las funciones de @/lib/panels/*\/data.ts
 * cacheadas con @/lib/cache, donde las APIs dinámicas de Next no aplican.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

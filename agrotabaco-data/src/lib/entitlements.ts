import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export type Plan = "anonymous" | "free" | "pro";

export type Entitlement = {
  user: User | null;
  plan: Plan;
};

const ANONYMOUS: Entitlement = { user: null, plan: "anonymous" };

/**
 * Sin sesión -> "anonymous". Con sesión pero sin fila "active" vigente en
 * data_subscriptions -> "free". Con fila "active" y current_period_end
 * todavía no vencido -> "pro". Nadie puede llegar a "pro" hasta la Fase 4
 * (el webhook de Mercado Pago es el único que escribe esa tabla).
 *
 * Nunca frena el render: si Supabase falla (env vars faltantes, tabla
 * todavía no migrada) se degrada a "anonymous" en vez de tirar abajo el
 * layout entero. El error especial "DYNAMIC_SERVER_USAGE" que Next.js usa
 * internamente durante el intento de pre-render estático se re-lanza tal
 * cual (no es un error real, es la señal que usa Next para decidir
 * renderizar la ruta dinámicamente en vez de estática).
 */
export async function getEntitlement(): Promise<Entitlement> {
  try {
    return await fetchEntitlement();
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error && String(error.digest).startsWith("DYNAMIC_SERVER_USAGE")) {
      throw error;
    }
    console.error("[agrotabaco-data] Error obteniendo la sesión:", error);
    return ANONYMOUS;
  }
}

async function fetchEntitlement(): Promise<Entitlement> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, plan: "anonymous" };

  const { data: subscription } = await supabase
    .from("data_subscriptions")
    .select("status, current_period_end")
    .eq("user_id", user.id)
    .maybeSingle();

  const isActive =
    subscription?.status === "active" &&
    !!subscription.current_period_end &&
    new Date(subscription.current_period_end) > new Date();

  return { user, plan: isActive ? "pro" : "free" };
}

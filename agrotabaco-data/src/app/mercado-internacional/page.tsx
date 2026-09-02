import { DashboardShell } from "@/components/panels/mercado-internacional/dashboard-shell";
import { getEntitlement } from "@/lib/entitlements";
import { getTobaccoProduction } from "@/lib/panels/mercado-internacional/data";
import type { TobaccoProduction } from "@/lib/panels/mercado-internacional/types";

export const dynamic = "force-dynamic";

const FREE_YEARS = 2;

export default async function MercadoInternacionalPage() {
  let data: TobaccoProduction[] = [];
  const { plan } = await getEntitlement();

  try {
    data = await getTobaccoProduction();
  } catch (error) {
    console.error("[agrotabaco-data] Error cargando datos de Mercado Internacional:", error);
  }

  // Recorte de seguridad: para quien no es "pro", el cliente sólo recibe
  // los últimos 2 años (alcanza para el Ranking y para el delta YoY; no
  // alcanza para un histórico útil, que es justamente lo que se bloquea).
  if (plan !== "pro" && data.length > 0) {
    const maxYear = Math.max(...data.map((d) => d.year));
    data = data.filter((d) => d.year >= maxYear - (FREE_YEARS - 1));
  }

  return <DashboardShell data={data} plan={plan} />;
}

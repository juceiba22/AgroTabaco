import { DashboardShell } from "@/components/panels/mercado-internacional/dashboard-shell";
import { getTobaccoProduction } from "@/lib/panels/mercado-internacional/data";
import type { TobaccoProduction } from "@/lib/panels/mercado-internacional/types";

export const dynamic = "force-dynamic";

export default async function MercadoInternacionalPage() {
  let data: TobaccoProduction[] = [];

  try {
    data = await getTobaccoProduction();
  } catch (error) {
    console.error("[agrotabaco-data] Error cargando datos de Mercado Internacional:", error);
  }

  return <DashboardShell data={data} />;
}

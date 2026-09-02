import { DashboardShell } from "@/components/panels/observatorio-fet/dashboard-shell";
import { getPoasTabaco } from "@/lib/panels/observatorio-fet/data";
import type { PoaTabaco } from "@/lib/panels/observatorio-fet/types";

export const dynamic = "force-dynamic";

export default async function ObservatorioFetPage() {
  let data: PoaTabaco[] = [];

  try {
    data = await getPoasTabaco();
  } catch (error) {
    console.error("[agrotabaco-data] Error cargando datos del Observatorio del FET:", error);
  }

  return <DashboardShell data={data} />;
}

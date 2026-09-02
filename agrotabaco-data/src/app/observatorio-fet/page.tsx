import { DashboardShell } from "@/components/panels/observatorio-fet/dashboard-shell";
import { getEntitlement } from "@/lib/entitlements";
import { getPoasTabaco } from "@/lib/panels/observatorio-fet/data";
import type { PoaTabaco } from "@/lib/panels/observatorio-fet/types";

export const dynamic = "force-dynamic";

export default async function ObservatorioFetPage() {
  let data: PoaTabaco[] = [];
  const { plan } = await getEntitlement();

  try {
    data = await getPoasTabaco();
  } catch (error) {
    console.error("[agrotabaco-data] Error cargando datos del Observatorio del FET:", error);
  }

  // Recorte de seguridad: para quien no es "pro", el cliente sólo recibe
  // el año de resolución más reciente (el "Resumen Ejecutivo del año
  // vigente" del plan de acceso) — el resto de las pestañas ni siquiera
  // reciben datos.
  if (plan !== "pro") {
    const anios = data.map((r) => r.anioResolucion).filter((a): a is number => a != null);
    if (anios.length > 0) {
      const maxYear = Math.max(...anios);
      data = data.filter((r) => r.anioResolucion === maxYear);
    }
  }

  return <DashboardShell data={data} plan={plan} />;
}

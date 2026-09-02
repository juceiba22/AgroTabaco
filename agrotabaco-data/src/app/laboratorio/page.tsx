import { DashboardShell } from "@/components/panels/laboratorio/dashboard-shell";
import { getConsumoAparente, getParticipacionMercado, getVolumenPrecios } from "@/lib/panels/laboratorio/data";

export const dynamic = "force-dynamic";

export default async function LaboratorioPage() {
  let volumenPrecios: Awaited<ReturnType<typeof getVolumenPrecios>> = [];
  let participacion: Awaited<ReturnType<typeof getParticipacionMercado>> = [];
  let consumoAparente: Awaited<ReturnType<typeof getConsumoAparente>> = [];
  try {
    [volumenPrecios, participacion, consumoAparente] = await Promise.all([
      getVolumenPrecios(),
      getParticipacionMercado(),
      getConsumoAparente(),
    ]);
  } catch (error) {
    console.error("[agrotabaco-data] Error cargando datos de Laboratorio Estadístico:", error);
  }

  return (
    <DashboardShell volumenPrecios={volumenPrecios} participacion={participacion} consumoAparente={consumoAparente} />
  );
}

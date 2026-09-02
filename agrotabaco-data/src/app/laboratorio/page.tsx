import { DashboardShell } from "@/components/panels/laboratorio/dashboard-shell";
import { getEntitlement } from "@/lib/entitlements";
import { getConsumoAparente, getParticipacionMercado, getVolumenPrecios } from "@/lib/panels/laboratorio/data";
import type { ConsumoAnio, ParticipacionMes, VolumenPrecio } from "@/lib/panels/laboratorio/types";

export const dynamic = "force-dynamic";

const FREE_MONTHS = 12;
const FREE_YEARS = 5;

function ultimosMeses<T extends { fecha: string }>(rows: T[], meses: number): T[] {
  if (rows.length === 0) return rows;
  const maxTime = Math.max(...rows.map((r) => new Date(r.fecha).getTime()));
  const corte = new Date(maxTime);
  corte.setMonth(corte.getMonth() - (meses - 1));
  return rows.filter((r) => new Date(r.fecha).getTime() >= corte.getTime());
}

function ultimosAnios(rows: ConsumoAnio[], anios: number): ConsumoAnio[] {
  return [...rows].sort((a, b) => a.anio - b.anio).slice(-anios);
}

export default async function LaboratorioPage() {
  let volumenPrecios: VolumenPrecio[] = [];
  let participacion: ParticipacionMes[] = [];
  let consumoAparente: ConsumoAnio[] = [];
  const { plan } = await getEntitlement();

  try {
    [volumenPrecios, participacion, consumoAparente] = await Promise.all([
      getVolumenPrecios(),
      getParticipacionMercado(),
      getConsumoAparente(),
    ]);
  } catch (error) {
    console.error("[agrotabaco-data] Error cargando datos de Laboratorio Estadístico:", error);
  }

  // Recorte de seguridad: para quien no es "pro", el array que llega al
  // cliente ya viene acotado — no es sólo un tema visual.
  if (plan !== "pro") {
    volumenPrecios = ultimosMeses(volumenPrecios, FREE_MONTHS);
    participacion = ultimosMeses(participacion, FREE_MONTHS);
    consumoAparente = ultimosAnios(consumoAparente, FREE_YEARS);
  }

  return (
    <DashboardShell
      volumenPrecios={volumenPrecios}
      participacion={participacion}
      consumoAparente={consumoAparente}
      plan={plan}
    />
  );
}

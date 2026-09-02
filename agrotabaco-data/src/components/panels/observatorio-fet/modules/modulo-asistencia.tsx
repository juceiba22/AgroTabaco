"use client";

import dynamic from "next/dynamic";
import { breakdownByAsistencia } from "@/lib/panels/observatorio-fet/filters";
import type { PoaTabaco } from "@/lib/panels/observatorio-fet/types";

const AsistenciaGroupedChart = dynamic(
  () => import("@/components/panels/observatorio-fet/charts/asistencia-grouped-chart").then((m) => m.AsistenciaGroupedChart),
  { ssr: false }
);

export function ModuloAsistencia({ dataFiltrado }: { dataFiltrado: PoaTabaco[] }) {
  const breakdown = breakdownByAsistencia(dataFiltrado);
  const totalPoas = breakdown.reduce((s, b) => s + b.countPoas, 0);
  const subsidios = breakdown.filter((b) => b.tipoAsistencia === "Aporte No Reintegrable (Subsidio)").reduce((s, b) => s + b.countPoas, 0);

  return (
    <>
      <div>
        <h3 className="font-serif text-lg font-bold text-brand-green-dark">🏦 Tipo de Asistencia y Modalidad de Desembolso</h3>
        <p className="text-sm text-muted-foreground">
          Casi todo el financiamiento del FET se otorga como aporte no reintegrable (subsidio) — pocos POAs son crédito con devolución.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-2">
        <AsistenciaGroupedChart data={breakdown} />
      </div>

      <div className="data-notice">
        {totalPoas > 0
          ? `${subsidios.toLocaleString("es-AR")} de ${totalPoas.toLocaleString("es-AR")} POAs filtrados (${((subsidios / totalPoas) * 100).toFixed(1)}%) son Aporte No Reintegrable (Subsidio); el resto es Crédito / Fondo Rotatorio.`
          : "No hay POAs para el filtro seleccionado."}
      </div>
    </>
  );
}

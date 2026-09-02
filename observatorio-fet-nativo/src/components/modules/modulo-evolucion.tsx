"use client";

import dynamic from "next/dynamic";
import { usdSeriesByYear } from "@/lib/filters";
import type { PoaTabaco } from "@/lib/types";

const UsdEvolutionChart = dynamic(() => import("@/components/charts/usd-evolution-chart").then((m) => m.UsdEvolutionChart), {
  ssr: false,
});

export function ModuloEvolucion({ dataFiltrado }: { dataFiltrado: PoaTabaco[] }) {
  const serie = usdSeriesByYear(dataFiltrado);
  const totalUsd = serie.reduce((s, d) => s + d.totalUsd, 0);
  const picoAnio = [...serie].sort((a, b) => b.totalUsd - a.totalUsd)[0];

  return (
    <>
      <div>
        <h3 className="font-serif text-lg font-bold text-brand-green-dark">📈 Evolución Histórica del FET Transferido</h3>
        <p className="text-sm text-muted-foreground">
          Serie anual en USD (única métrica comparable entre décadas) sobre el rango de años y filtros seleccionados.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-2">
        <UsdEvolutionChart data={serie} />
      </div>

      {picoAnio && (
        <div className="data-notice">
          El año con mayor monto USD verificado en el rango seleccionado es <strong>{picoAnio.anio}</strong>, con{" "}
          <strong>USD {picoAnio.totalUsd.toLocaleString("en-US", { maximumFractionDigits: 0 })}</strong> (
          {picoAnio.countConUsd} de {picoAnio.countTotal} POAs de ese año con monto verificado). Total del rango: USD{" "}
          {totalUsd.toLocaleString("en-US", { maximumFractionDigits: 0 })}.
        </div>
      )}
    </>
  );
}

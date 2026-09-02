"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import type { TobaccoProduction } from "@/lib/panels/mercado-internacional/types";

const TimeseriesChart = dynamic(() => import("@/components/panels/mercado-internacional/charts/timeseries-chart").then((m) => m.TimeseriesChart), { ssr: false });
const ComparativeGrowthChart = dynamic(
  () => import("@/components/panels/mercado-internacional/charts/comparative-growth-chart").then((m) => m.ComparativeGrowthChart),
  { ssr: false }
);

type Props = {
  dataFiltrado: TobaccoProduction[];
  selectedEntities: string[];
  startYear: number;
  endYear: number;
  unit: string;
  logScale: boolean;
  showMarkers: boolean;
};

export function ModuloEvolucionHistorica({ dataFiltrado, selectedEntities, startYear, endYear, unit, logScale, showMarkers }: Props) {
  const [showIndexed, setShowIndexed] = useState(false);

  const milestones = useMemo(() => {
    return selectedEntities
      .map((entity) => {
        const cDf = dataFiltrado.filter((d) => d.entity === entity);
        if (cDf.length === 0) return null;
        const peak = cDf.reduce((a, b) => (b.valueTonnes > a.valueTonnes ? b : a));
        const currRow = cDf.find((d) => d.year === endYear);
        const currVal = currRow?.valueTonnes ?? 0;
        const pctOfPeak = peak.valueTonnes > 0 ? (currVal / peak.valueTonnes) * 100 : 0;
        return {
          entity: cDf[0].entityDisplay,
          currVal,
          peakVal: peak.valueTonnes,
          peakYear: peak.year,
          pctOfPeak,
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);
  }, [dataFiltrado, selectedEntities, endYear]);

  if (selectedEntities.length === 0) {
    return <p className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">⚠️ Seleccioná al menos un país en la barra lateral para generar la gráfica temporal.</p>;
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="font-serif text-base font-bold text-brand-green-dark">📈 Evolución de Producción en Toneladas</h3>
        <p className="text-sm text-muted-foreground">Comparación de series temporales de producción para los países seleccionados.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-2">
        <TimeseriesChart data={dataFiltrado} selectedEntities={selectedEntities} unit={unit} logScale={logScale} showMarkers={showMarkers} />
      </div>

      <details className="rounded-xl border border-border bg-card p-4" open={showIndexed} onToggle={(e) => setShowIndexed(e.currentTarget.open)}>
        <summary className="cursor-pointer text-sm font-semibold text-foreground">🔍 Ver Análisis de Crecimiento Indexado (Base 100 = Año Inicial)</summary>
        {showIndexed && (
          <div className="mt-4">
            <p className="mb-3 text-sm text-muted-foreground">
              Este gráfico normaliza la producción de cada país a <strong>100 en el año {startYear}</strong> para contrastar qué países expandieron o contrajeron su capacidad productiva relativa.
            </p>
            <ComparativeGrowthChart data={dataFiltrado} selectedEntities={selectedEntities} baseYear={startYear} />
          </div>
        )}
      </details>

      <div>
        <h4 className="mb-2 font-serif text-sm font-bold text-brand-green-dark">📌 Hitos y Máximos Históricos en el Período</h4>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="px-3 py-2">País / Entidad</th>
                <th className="px-3 py-2">Producción {endYear} ({unit})</th>
                <th className="px-3 py-2">Pico Histórico</th>
                <th className="px-3 py-2">Año del Pico</th>
                <th className="px-3 py-2">% Nivel vs Pico ({endYear})</th>
              </tr>
            </thead>
            <tbody>
              {milestones.map((m) => (
                <tr key={m.entity} className="border-b border-border/50">
                  <td className="px-3 py-1.5">{m.entity}</td>
                  <td className="px-3 py-1.5">{m.currVal.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                  <td className="px-3 py-1.5">{m.peakVal.toLocaleString("en-US", { maximumFractionDigits: 0 })} {unit}</td>
                  <td className="px-3 py-1.5">{m.peakYear}</td>
                  <td className="px-3 py-1.5">{m.pctOfPeak.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

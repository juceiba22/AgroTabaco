"use client";

import dynamic from "next/dynamic";
import { rankingByProvincia } from "@/lib/filters";
import type { PoaTabaco } from "@/lib/types";

const ProvinciaRankingChart = dynamic(
  () => import("@/components/charts/provincia-ranking-chart").then((m) => m.ProvinciaRankingChart),
  { ssr: false }
);

export function ModuloProvincias({ dataFiltrado }: { dataFiltrado: PoaTabaco[] }) {
  const ranking = rankingByProvincia(dataFiltrado);

  return (
    <>
      <div>
        <h3 className="font-serif text-lg font-bold text-brand-green-dark">🗺️ FET Recibido por Provincia</h3>
        <p className="text-sm text-muted-foreground">
          Comparativo entre provincias tabacaleras, en USD histórico dentro del rango y filtros seleccionados.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-2">
        <ProvinciaRankingChart data={ranking} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="px-3 py-2">Provincia</th>
              <th className="px-3 py-2">Total USD</th>
              <th className="px-3 py-2">% del total</th>
              <th className="px-3 py-2">Cantidad de POAs</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((r) => (
              <tr key={r.provincia} className="border-b border-border/50">
                <td className="px-3 py-1.5">{r.provinciaDisplay}</td>
                <td className="px-3 py-1.5">USD {r.totalUsd.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                <td className="px-3 py-1.5">{r.share.toFixed(1)}%</td>
                <td className="px-3 py-1.5">{r.countPoas.toLocaleString("es-AR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

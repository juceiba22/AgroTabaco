"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { TobaccoProduction } from "@/lib/panels/mercado-internacional/types";

const WorldChoroplethMap = dynamic(() => import("@/components/panels/mercado-internacional/charts/world-choropleth-map").then((m) => m.WorldChoroplethMap), { ssr: false });

const EXCLUDED_AGGREGATES = new Set([
  "World",
  "High-income countries",
  "Low-income countries",
  "Lower-middle-income countries",
  "Upper-middle-income countries",
]);

export function ModuloMapa({ data, evalYear, unit }: { data: TobaccoProduction[]; evalYear: number; unit: string }) {
  const mapRows = useMemo(
    () =>
      data.filter(
        (d) => d.year === evalYear && d.entityType === "Country" && d.code && d.valueTonnes > 0
      ),
    [data, evalYear]
  );

  const worldRow = data.find((d) => d.year === evalYear && d.entity === "World");
  const worldProd = worldRow ? worldRow.valueTonnes : mapRows.reduce((s, d) => s + d.valueTonnes, 0);

  const regionalData = useMemo(() => {
    return data
      .filter((d) => d.year === evalYear && d.entityType === "Aggregate" && !EXCLUDED_AGGREGATES.has(d.entity))
      .sort((a, b) => b.valueTonnes - a.valueTonnes)
      .slice(0, 10);
  }, [data, evalYear]);

  return (
    <>
      <div>
        <h3 className="font-serif text-lg font-bold text-brand-green-dark">🗺️ Geografía Mundial de la Producción de Tabaco – Año {evalYear}</h3>
        <p className="text-sm text-muted-foreground">
          Visualización coroplética interactiva basada en códigos ISO-3 oficiales. La escala cromática resalta la intensidad de producción en toneladas.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-2">
        <WorldChoroplethMap
          data={mapRows.map((r) => ({ code: r.code as string, entityDisplay: r.entityDisplay, valueTonnes: r.valueTonnes }))}
          year={evalYear}
          unit={unit}
        />
      </div>

      <div>
        <h4 className="mb-2 font-serif text-sm font-bold text-brand-green-dark">🌐 Producción por Continentes y Bloques Regionales (FAO)</h4>
        {regionalData.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="px-3 py-2">Región / Bloque</th>
                  <th className="px-3 py-2">Producción ({unit})</th>
                  <th className="px-3 py-2">% del Total Mundial</th>
                </tr>
              </thead>
              <tbody>
                {regionalData.map((r) => (
                  <tr key={r.entity} className="border-b border-border/50">
                    <td className="px-3 py-1.5">{r.entityDisplay}</td>
                    <td className="px-3 py-1.5">{r.valueTonnes.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                    <td className="px-3 py-1.5">{worldProd > 0 ? ((r.valueTonnes / worldProd) * 100).toFixed(2) : "0.00"}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

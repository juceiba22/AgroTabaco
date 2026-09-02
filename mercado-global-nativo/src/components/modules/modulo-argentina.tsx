"use client";

import dynamic from "next/dynamic";
import { SUDAMERICA_COMPARATIVO } from "@/lib/config";
import type { TobaccoProduction } from "@/lib/types";

const TimeseriesChart = dynamic(() => import("@/components/charts/timeseries-chart").then((m) => m.TimeseriesChart), { ssr: false });

export function ModuloArgentina({ dataFiltrado, unit }: { dataFiltrado: TobaccoProduction[]; unit: string }) {
  const hasArgentina = dataFiltrado.some((d) => d.entity === "Argentina");

  return (
    <>
      <h3 className="font-serif text-lg font-bold text-brand-green-dark">🇦🇷 Análisis Estratégico: Argentina en el Tabaco Mundial</h3>

      {!hasArgentina ? (
        <p className="text-muted-foreground">No se encontraron registros específicos para Argentina en el dataset.</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="rounded-xl border border-border bg-card p-4 lg:col-span-2">
            <h4 className="font-serif text-base font-bold text-brand-green-dark">📋 Perfil Productivo Nacional</h4>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Argentina es uno de los productores tradicionales más destacados de Sudamérica y un exportador clave de tabaco Virginia y Burley.
            </p>
            <div className="mt-4 flex flex-col gap-2.5">
              <div className="rounded-md border-l-4 border-brand-green-dark bg-brand-gray px-3 py-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Volumen Reciente (2024)</span>
                <br />
                <strong className="text-lg text-foreground">80.786 toneladas</strong>
              </div>
              <div className="rounded-md border-l-4 border-brand-olive bg-brand-gray px-3 py-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Récord Histórico de Cosecha</span>
                <br />
                <strong className="text-lg text-foreground">167.936 t (Año 2005)</strong>
              </div>
              <div className="rounded-md border-l-4 border-amber-600 bg-brand-gray px-3 py-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Posición Global</span>
                <br />
                <strong className="text-lg text-foreground">Top 15 Mundial (#14 en 2024)</strong>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-2 lg:col-span-3">
            <TimeseriesChart
              data={dataFiltrado}
              selectedEntities={SUDAMERICA_COMPARATIVO}
              unit={unit}
              logScale={false}
              showMarkers
              height={380}
              title="Competitividad Regional: Argentina vs Países Sudamericanos"
            />
          </div>
        </div>
      )}
    </>
  );
}

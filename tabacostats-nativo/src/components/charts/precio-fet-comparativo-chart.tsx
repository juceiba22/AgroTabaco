"use client";

import type { Data } from "plotly.js";
import Plot from "./plot";
import { getCorporateLayout, PLOTLY_CONFIG } from "@/lib/plotly-layout";

type Row = { clase: string; resolucion: string; valor: number };

export function PrecioFetComparativoChart({ data, titulo, moneda }: { data: Row[]; titulo: string; moneda: string }) {
  const resoluciones = Array.from(new Set(data.map((d) => d.resolucion)));
  const clases = Array.from(new Set(data.map((d) => d.clase)));

  const traces: Data[] = resoluciones.map((res) => {
    const porClase = new Map(data.filter((d) => d.resolucion === res).map((d) => [d.clase, d.valor]));
    return {
      x: clases,
      y: clases.map((c) => porClase.get(c) ?? null),
      name: res,
      type: "bar",
    };
  });

  const layout = getCorporateLayout(titulo, 420);
  layout.barmode = "group";
  layout.xaxis = { ...(layout.xaxis as Record<string, unknown>), title: { text: "Clase" } };
  layout.yaxis = { ...(layout.yaxis as Record<string, unknown>), title: { text: `Precio Total Acumulado (${moneda})` } };

  return (
    <Plot
      data={traces}
      layout={layout}
      config={PLOTLY_CONFIG}
      useResizeHandler
      style={{ width: "100%", height: `${layout.height}px` }}
    />
  );
}

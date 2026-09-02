"use client";

import type { Data } from "plotly.js";
import Plot from "@/components/charts/plot";
import { getCorporateLayout, PLOTLY_CONFIG } from "@/lib/plotly-layout";

type Point = { campana: string; adelanto1: number | null; adelanto2: number | null; incremento: number | null };

const COMPONENT_COLORS: Record<string, string> = {
  "Adelanto 1": "#c9a227",
  "Adelanto 2": "#6b7a3a",
  Incremento: "#1a4329",
};

export function PrecioFetAreaChart({
  data,
  campanasOrden,
  titulo,
}: {
  data: Point[];
  campanasOrden: string[];
  titulo: string;
}) {
  const byCampana = new Map(data.map((d) => [d.campana, d]));

  const traces: Data[] = (["Adelanto 1", "Adelanto 2", "Incremento"] as const).map((label) => {
    const key = label === "Adelanto 1" ? "adelanto1" : label === "Adelanto 2" ? "adelanto2" : "incremento";
    return {
      x: campanasOrden,
      y: campanasOrden.map((c) => byCampana.get(c)?.[key] ?? null),
      name: label,
      mode: "lines",
      type: "scatter",
      stackgroup: "fet",
      line: { width: 0.5, color: COMPONENT_COLORS[label] },
      fillcolor: COMPONENT_COLORS[label],
    };
  });

  const layout = getCorporateLayout(titulo, 420);
  layout.xaxis = { ...(layout.xaxis as Record<string, unknown>), title: { text: "Campaña" } };
  layout.yaxis = { ...(layout.yaxis as Record<string, unknown>), title: { text: "Valor acumulado" } };

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

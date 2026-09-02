"use client";

import type { Data } from "plotly.js";
import Plot from "./plot";
import { CHART_COLORS, getCorporateLayout, PLOTLY_CONFIG } from "@/lib/plotly-layout";

type Point = { campana: string; precioAcopioPromedio: number; precioFetPromedio: number; pctFet: number };

export function PriceCompositionChart({ data }: { data: Point[] }) {
  const x = data.map((d) => d.campana);

  const traces: Data[] = [
    {
      x,
      y: data.map((d) => d.precioAcopioPromedio),
      name: "Precio Acopio Base ($/kg)",
      type: "bar",
      marker: { color: CHART_COLORS.precioAcopio },
      hovertemplate: "<b>%{x}</b><br>Acopio: $%{y:,.2f}/kg<extra></extra>",
    },
    {
      x,
      y: data.map((d) => d.precioFetPromedio),
      name: "Complemento FET ($/kg)",
      type: "bar",
      marker: { color: CHART_COLORS.complementoFet },
      hovertemplate: "<b>%{x}</b><br>FET: $%{y:,.2f}/kg<extra></extra>",
    },
    {
      x,
      y: data.map((d) => d.pctFet),
      name: "% Aporte FET",
      mode: "lines+markers",
      type: "scatter",
      line: { color: CHART_COLORS.pctFet, width: 3, dash: "dot" },
      yaxis: "y2",
      hovertemplate: "<b>%{x}</b><br>FET: %{y:.1f}%<extra></extra>",
    },
  ];

  const layout = getCorporateLayout("", 400);
  layout.barmode = "stack";
  layout.yaxis = { ...(layout.yaxis as Record<string, unknown>), title: { text: "Precio Promedio ($/kg)" } };
  layout.yaxis2 = { title: { text: "% FET s/ Total" }, overlaying: "y", side: "right", range: [0, 100], showgrid: false };

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

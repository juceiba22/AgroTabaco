"use client";

import type { Data } from "plotly.js";
import Plot from "./plot";
import { TOBACCO_PALETTE, getCorporateLayout, PLOTLY_CONFIG } from "@/lib/plotly-layout";

type Point = { year: number; valueUsd: number };

export function InternationalLineChart({
  virginia,
  burley,
}: {
  virginia: Point[];
  burley: Point[];
}) {
  const traces: Data[] = [
    {
      x: virginia.map((d) => d.year),
      y: virginia.map((d) => d.valueUsd),
      name: "Virginia",
      mode: "lines+markers",
      type: "scatter",
      line: { color: TOBACCO_PALETTE.Virginia, width: 3 },
      hovertemplate: "<b>Virginia %{x}</b><br>US$ %{y:,.0f}<extra></extra>",
    },
    {
      x: burley.map((d) => d.year),
      y: burley.map((d) => d.valueUsd),
      name: "Burley",
      mode: "lines+markers",
      type: "scatter",
      line: { color: TOBACCO_PALETTE.Burley, width: 3 },
      hovertemplate: "<b>Burley %{x}</b><br>US$ %{y:,.0f}<extra></extra>",
    },
  ];

  const layout = getCorporateLayout("Valor FOB de Exportaciones de EE. UU. al Mundo (USD)", 420);
  layout.xaxis = { ...(layout.xaxis as Record<string, unknown>), title: { text: "Año" }, dtick: 2 };
  layout.yaxis = { ...(layout.yaxis as Record<string, unknown>), title: { text: "Valor FOB (USD)" }, tickformat: ",.0f" };
  layout.hovermode = "x unified";

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

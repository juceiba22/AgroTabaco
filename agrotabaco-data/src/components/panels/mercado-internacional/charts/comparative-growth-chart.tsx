"use client";

import type { Data } from "plotly.js";
import Plot from "@/components/charts/plot";
import { getCorporateLayout, PLOTLY_CONFIG } from "@/lib/plotly-layout";
import { MERCADO_CHART_COLORS as COLOR_PALETTE } from "@/lib/panels/mercado-internacional/plotly-layout";
import type { TobaccoProduction } from "@/lib/panels/mercado-internacional/types";

export function ComparativeGrowthChart({
  data,
  selectedEntities,
  baseYear,
}: {
  data: TobaccoProduction[];
  selectedEntities: string[];
  baseYear: number;
}) {
  const traces: Data[] = [];

  selectedEntities.forEach((entity, idx) => {
    const entData = data
      .filter((d) => d.entity === entity && d.year >= baseYear)
      .sort((a, b) => a.year - b.year);
    if (entData.length === 0) return;

    const baseRow = entData.find((d) => d.year === baseYear);
    const baseNumber = baseRow && baseRow.valueTonnes !== 0 ? baseRow.valueTonnes : entData[0].valueTonnes;
    if (!baseNumber) return;

    const displayName = entData[0].entityDisplay;
    const color = COLOR_PALETTE[idx % COLOR_PALETTE.length];

    traces.push({
      x: entData.map((d) => d.year),
      y: entData.map((d) => (d.valueTonnes / baseNumber) * 100),
      mode: "lines",
      type: "scatter",
      name: displayName,
      line: { width: 2.5, color },
      hovertemplate: `<b>${displayName}</b><br>Año: %{x}<br>Índice: %{y:.1f} (Base ${baseYear}=100)<extra></extra>`,
    });
  });

  const layout = getCorporateLayout(`Evolución Relativa Indexada (Base 100 = ${baseYear})`, 450);
  layout.xaxis = { ...(layout.xaxis as Record<string, unknown>), title: { text: "Año" } };
  layout.yaxis = { ...(layout.yaxis as Record<string, unknown>), title: { text: "Índice Base 100" } };
  layout.hovermode = "x unified";
  layout.legend = {
    orientation: "h",
    yanchor: "bottom",
    y: -0.25,
    xanchor: "center",
    x: 0.5,
    bgcolor: "rgba(255,255,255,0.85)",
    bordercolor: "#e3e6dc",
    borderwidth: 1,
    font: { color: "#1b241d", size: 11 },
  };
  layout.shapes = [
    {
      type: "line",
      xref: "paper",
      x0: 0,
      x1: 1,
      yref: "y",
      y0: 100,
      y1: 100,
      line: { color: "#a3ae9d", width: 1, dash: "dot" },
    },
  ];

  return (
    <Plot
      data={traces}
      layout={layout}
      config={PLOTLY_CONFIG}
      useResizeHandler
      style={{ width: "100%", height: "450px" }}
    />
  );
}

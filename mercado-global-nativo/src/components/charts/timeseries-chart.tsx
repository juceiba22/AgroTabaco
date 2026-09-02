"use client";

import type { Data } from "plotly.js";
import Plot from "./plot";
import { COLOR_PALETTE, PLOTLY_CONFIG, getFaoLayout } from "@/lib/plotly-layout";
import type { TobaccoProduction } from "@/lib/types";

type Props = {
  data: TobaccoProduction[];
  selectedEntities: string[];
  unit?: string;
  logScale?: boolean;
  showMarkers?: boolean;
  height?: number;
  title?: string;
};

export function TimeseriesChart({
  data,
  selectedEntities,
  unit = "toneladas",
  logScale = false,
  showMarkers = true,
  height = 500,
  title,
}: Props) {
  const traces: Data[] = selectedEntities.map((entity, idx) => {
    const entData = data.filter((d) => d.entity === entity).sort((a, b) => a.year - b.year);
    const displayName = entData[0]?.entityDisplay ?? entity;
    const color = COLOR_PALETTE[idx % COLOR_PALETTE.length];
    return {
      x: entData.map((d) => d.year),
      y: entData.map((d) => d.valueTonnes),
      mode: showMarkers ? "lines+markers" : "lines",
      type: "scatter",
      name: displayName,
      line: { width: 2.8, color, shape: "spline" },
      marker: { size: 5, color },
      hovertemplate: `<b>${displayName}</b><br>Año: %{x}<br>Producción: %{y:,.0f} ${unit}<extra></extra>`,
    };
  });

  const layout = getFaoLayout({
    title: {
      text: title ?? `Evolución Histórica de Producción de Tabaco (${unit})`,
      font: { size: 16, color: "#1a4329", family: "Inter" },
      x: 0.01,
    },
    xaxis: { title: { text: "Año" } },
    yaxis: { title: { text: `Volumen (${unit}) ${logScale ? "[Escala Logarítmica]" : ""}` }, type: logScale ? "log" : "linear" },
    hovermode: "x unified",
    legend: {
      orientation: "h",
      yanchor: "bottom",
      y: -0.28,
      xanchor: "center",
      x: 0.5,
      bgcolor: "rgba(255,255,255,0.85)",
      bordercolor: "#e3e6dc",
      borderwidth: 1,
      font: { color: "#1b241d", size: 11 },
    },
    height,
  });

  return (
    <Plot
      data={traces}
      layout={layout}
      config={PLOTLY_CONFIG}
      useResizeHandler
      style={{ width: "100%", height: `${height}px` }}
    />
  );
}

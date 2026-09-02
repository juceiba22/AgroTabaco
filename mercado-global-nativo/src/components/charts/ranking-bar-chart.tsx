"use client";

import type { Data } from "plotly.js";
import Plot from "./plot";
import { PLOTLY_CONFIG, getFaoLayout } from "@/lib/plotly-layout";

type Row = { entity: string; entityDisplay: string; valueTonnes: number };

export function RankingBarChart({
  data,
  year,
  unit = "toneladas",
  highlightEntity = "Argentina",
}: {
  data: Row[];
  year: number;
  unit?: string;
  highlightEntity?: string;
}) {
  const plotRows = [...data].reverse();
  const colors = plotRows.map((r) => (r.entity === highlightEntity ? "#d9a441" : "#4f9169"));

  const traces: Data[] = [
    {
      x: plotRows.map((r) => r.valueTonnes),
      y: plotRows.map((r) => r.entityDisplay),
      orientation: "h",
      type: "bar",
      marker: { color: colors, line: { color: "#e3e6dc", width: 1 } },
      text: plotRows.map((r) => `${r.valueTonnes.toLocaleString("en-US", { maximumFractionDigits: 0 })} ${unit}`),
      textposition: "auto",
      textfont: { color: "#1b241d", size: 11 },
      hovertemplate: `<b>%{y}</b><br>Año ${year}: %{x:,.0f} ${unit}<extra></extra>`,
    },
  ];

  const height = Math.max(420, plotRows.length * 32);
  const layout = getFaoLayout({
    title: {
      text: `Ranking de Principales Productores Globales – Año ${year}`,
      font: { size: 16, color: "#1a4329", family: "Inter" },
      x: 0.01,
    },
    xaxis: { title: { text: `Producción (${unit})` } },
    yaxis: { title: "" },
    height,
    margin: { l: 150, r: 40, t: 50, b: 40 },
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

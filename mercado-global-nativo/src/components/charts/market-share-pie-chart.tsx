"use client";

import type { Data } from "plotly.js";
import Plot from "./plot";
import { PLOTLY_CONFIG, getFaoLayout } from "@/lib/plotly-layout";

type Row = { entityDisplay: string; value: number };

const COLORS = ["#4f9169", "#c68a4e", "#6fae87", "#a0522d", "#8a9c52", "#5c6b5e"];

export function MarketSharePieChart({ data, year, unit = "toneladas" }: { data: Row[]; year: number; unit?: string }) {
  const traces: Data[] = [
    {
      type: "pie",
      labels: data.map((d) => d.entityDisplay),
      values: data.map((d) => d.value),
      hole: 0.55,
      marker: { colors: COLORS.slice(0, data.length), line: { color: "#ffffff", width: 2 } },
      textinfo: "label+percent",
      textposition: "outside",
      hoverinfo: "label+value+percent",
      hovertemplate: `<b>%{label}</b><br>Volumen: %{value:,.0f} ${unit}<br>Cuota Mundial: %{percent}<extra></extra>`,
    },
  ];

  const layout = getFaoLayout({
    title: {
      text: `Cuota de Producción Mundial (% Share) – Año ${year}`,
      font: { size: 16, color: "#1a4329", family: "Inter" },
      x: 0.01,
    },
    showlegend: false,
    height: 420,
    annotations: [
      {
        text: `<b>${year}</b><br><span style="font-size:10px; color:#5c6b5e;">GLOBAL</span>`,
        x: 0.5,
        y: 0.5,
        font: { size: 16, color: "#1b241d" },
        showarrow: false,
      },
    ],
  });

  return (
    <Plot
      data={traces}
      layout={layout}
      config={PLOTLY_CONFIG}
      useResizeHandler
      style={{ width: "100%", height: "420px" }}
    />
  );
}

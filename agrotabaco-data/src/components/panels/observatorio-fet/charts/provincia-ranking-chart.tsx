"use client";

import type { Data } from "plotly.js";
import Plot from "@/components/charts/plot";
import { PLOTLY_CONFIG, getCorporateLayout } from "@/lib/plotly-layout";
import { PROVINCIA_PALETTE } from "@/lib/panels/observatorio-fet/plotly-layout";
import type { ProvinciaRanking } from "@/lib/panels/observatorio-fet/filters";

export function ProvinciaRankingChart({ data, height }: { data: ProvinciaRanking[]; height?: number }) {
  const plotRows = [...data].reverse();
  const chartHeight = height ?? Math.max(320, plotRows.length * 42);

  const traces: Data[] = [
    {
      x: plotRows.map((r) => r.totalUsd),
      y: plotRows.map((r) => r.provinciaDisplay),
      orientation: "h",
      type: "bar",
      marker: { color: plotRows.map((_, i) => PROVINCIA_PALETTE[i % PROVINCIA_PALETTE.length]), line: { color: "#e3e6dc", width: 1 } },
      text: plotRows.map((r) => `USD ${r.totalUsd.toLocaleString("en-US", { maximumFractionDigits: 0 })}`),
      textposition: "auto",
      textfont: { color: "#ffffff", size: 11 },
      hovertemplate: "<b>%{y}</b><br>Total USD: %{x:$,.0f}<br>POAs: %{customdata}<extra></extra>",
      customdata: plotRows.map((r) => r.countPoas),
    },
  ];

  const layout = getCorporateLayout("FET Recibido por Provincia (USD histórico)", chartHeight);
  layout.xaxis = { ...(layout.xaxis as Record<string, unknown>), title: { text: "Monto (USD)" } };
  layout.margin = { l: 130, r: 40, t: 50, b: 40 };

  return (
    <Plot data={traces} layout={layout} config={PLOTLY_CONFIG} useResizeHandler style={{ width: "100%", height: `${chartHeight}px` }} />
  );
}

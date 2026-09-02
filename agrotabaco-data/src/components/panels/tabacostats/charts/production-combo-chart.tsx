"use client";

import type { Data } from "plotly.js";
import Plot from "@/components/charts/plot";
import { getCorporateLayout, PLOTLY_CONFIG } from "@/lib/plotly-layout";
import { TABACOSTATS_CHART_COLORS as CHART_COLORS } from "@/lib/panels/tabacostats/plotly-layout";

type Point = { campana: string; produccionTn: number; supCosechadaHa: number };

export function ProductionComboChart({ data }: { data: Point[] }) {
  const x = data.map((d) => d.campana);

  const traces: Data[] = [
    {
      x,
      y: data.map((d) => d.produccionTn),
      name: "Producción (tn)",
      type: "bar",
      marker: { color: CHART_COLORS.produccion, opacity: 0.85 },
    },
    {
      x,
      y: data.map((d) => d.supCosechadaHa),
      name: "Sup. Cosechada (ha)",
      mode: "lines+markers",
      type: "scatter",
      line: { color: CHART_COLORS.superficie, width: 3 },
      yaxis: "y2",
    },
  ];

  const layout = getCorporateLayout("Evolución Histórica: Producción y Superficie Cosechada", 400);
  layout.xaxis = { ...(layout.xaxis as Record<string, unknown>), tickangle: -45 };
  layout.yaxis = { ...(layout.yaxis as Record<string, unknown>), title: { text: "Producción (tn)" } };
  layout.yaxis2 = { title: { text: "Superficie (ha)" }, overlaying: "y", side: "right", showgrid: false };

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

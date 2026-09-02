"use client";

import type { Data } from "plotly.js";
import Plot from "./plot";
import { PLOTLY_CONFIG, PROGRAMA_PALETTE, getCorporateLayout } from "@/lib/plotly-layout";
import type { ProgramaBreakdown } from "@/lib/filters";

export function ProgramaDonutChart({ data }: { data: ProgramaBreakdown[] }) {
  const traces: Data[] = [
    {
      type: "pie",
      labels: data.map((d) => d.objetoPrograma),
      values: data.map((d) => d.totalUsd),
      hole: 0.5,
      marker: { colors: PROGRAMA_PALETTE.slice(0, data.length) as unknown as string[], line: { color: "#ffffff", width: 2 } },
      textinfo: "percent",
      textposition: "inside",
      hovertemplate: "<b>%{label}</b><br>Total USD: %{value:$,.0f}<br>%{percent}<extra></extra>",
    },
  ];

  const layout = getCorporateLayout("Composición del Gasto por Programa (objeto_programa)", 440);
  layout.legend = { orientation: "v", x: 1.02, y: 0.5, font: { size: 10 } };

  return <Plot data={traces} layout={layout} config={PLOTLY_CONFIG} useResizeHandler style={{ width: "100%", height: "440px" }} />;
}

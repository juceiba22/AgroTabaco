"use client";

import type { Data } from "plotly.js";
import Plot from "@/components/charts/plot";
import { PLOTLY_CONFIG, getCorporateLayout } from "@/lib/plotly-layout";
import { OBSERVATORIO_CHART_COLORS as CHART_COLORS } from "@/lib/panels/observatorio-fet/plotly-layout";
import type { YearTotal } from "@/lib/panels/observatorio-fet/filters";

export function UsdEvolutionChart({ data, height = 420 }: { data: YearTotal[]; height?: number }) {
  const traces: Data[] = [
    {
      x: data.map((d) => d.anio),
      y: data.map((d) => d.totalUsd),
      type: "bar",
      marker: { color: CHART_COLORS.usd },
      customdata: data.map((d) => [d.countConUsd, d.countTotal]),
      hovertemplate:
        "<b>%{x}</b><br>Total USD: %{y:$,.0f}<br>Registros con monto: %{customdata[0]} de %{customdata[1]}<extra></extra>",
    },
  ];

  const layout = getCorporateLayout("Evolución Histórica del FET Transferido (USD)", height);
  layout.xaxis = { ...(layout.xaxis as Record<string, unknown>), title: { text: "Año de resolución" } };
  layout.yaxis = { ...(layout.yaxis as Record<string, unknown>), title: { text: "Monto (USD)" } };
  layout.hovermode = "x unified";

  return <Plot data={traces} layout={layout} config={PLOTLY_CONFIG} useResizeHandler style={{ width: "100%", height: `${height}px` }} />;
}

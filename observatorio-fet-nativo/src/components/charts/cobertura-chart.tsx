"use client";

import type { Data } from "plotly.js";
import Plot from "./plot";
import { CHART_COLORS, PLOTLY_CONFIG, getCorporateLayout } from "@/lib/plotly-layout";

type Row = { anio: number; pctCobertura: number; countTotal: number };

export function CoberturaChart({ data }: { data: Row[] }) {
  const traces: Data[] = [
    {
      x: data.map((d) => d.anio),
      y: data.map((d) => d.pctCobertura),
      type: "bar",
      marker: { color: CHART_COLORS.cobertura },
      customdata: data.map((d) => d.countTotal),
      hovertemplate: "<b>%{x}</b><br>Cobertura de monto USD: %{y:.1f}%<br>POAs ese año: %{customdata}<extra></extra>",
    },
  ];

  const layout = getCorporateLayout("Cobertura de Monto USD Verificado por Año", 380);
  layout.xaxis = { ...(layout.xaxis as Record<string, unknown>), title: { text: "Año de resolución" } };
  layout.yaxis = { ...(layout.yaxis as Record<string, unknown>), title: { text: "% de POAs con monto USD" }, range: [0, 100] };

  return <Plot data={traces} layout={layout} config={PLOTLY_CONFIG} useResizeHandler style={{ width: "100%", height: "380px" }} />;
}

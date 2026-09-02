"use client";

import type { Data } from "plotly.js";
import Plot from "@/components/charts/plot";
import { getCorporateLayout, PLOTLY_CONFIG } from "@/lib/plotly-layout";
import { LABORATORIO_CHART_COLORS as CHART_COLORS } from "@/lib/panels/laboratorio/plotly-layout";
import type { ParticipacionMes } from "@/lib/panels/laboratorio/types";

export function ShareAreaChart({ data }: { data: ParticipacionMes[] }) {
  const x = data.map((d) => d.fecha);

  const traces: Data[] = [
    {
      x,
      y: data.map((d) => d.porcentajeParticipacionGrandes),
      name: "Empresas Grandes",
      mode: "lines",
      type: "scatter",
      stackgroup: "share",
      line: { width: 0.5, color: CHART_COLORS.empresasGrandes },
      fillcolor: CHART_COLORS.empresasGrandes,
    },
    {
      x,
      y: data.map((d) => d.porcentajeParticipacionPymes),
      name: "PyMES",
      mode: "lines",
      type: "scatter",
      stackgroup: "share",
      line: { width: 0.5, color: CHART_COLORS.empresasPymes },
      fillcolor: CHART_COLORS.empresasPymes,
    },
  ];

  const layout = getCorporateLayout("Participación porcentual sobre el total del mercado", 400);
  layout.xaxis = { ...(layout.xaxis as Record<string, unknown>), title: { text: "Mes" } };
  layout.yaxis = {
    ...(layout.yaxis as Record<string, unknown>),
    title: { text: "Participación (%)" },
    range: [0, 100],
  };

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

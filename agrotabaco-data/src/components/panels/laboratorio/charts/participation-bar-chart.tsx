"use client";

import type { Data } from "plotly.js";
import Plot from "@/components/charts/plot";
import { getCorporateLayout, PLOTLY_CONFIG } from "@/lib/plotly-layout";
import { LABORATORIO_CHART_COLORS as CHART_COLORS } from "@/lib/panels/laboratorio/plotly-layout";
import type { ParticipacionMes } from "@/lib/panels/laboratorio/types";

export function ParticipationBarChart({ data }: { data: ParticipacionMes[] }) {
  const x = data.map((d) => d.fecha);

  const traces: Data[] = [
    {
      x,
      y: data.map((d) => d.empresasGrandes),
      name: "Empresas Grandes",
      type: "bar",
      marker: { color: CHART_COLORS.empresasGrandes },
    },
    {
      x,
      y: data.map((d) => d.empresasPymes),
      name: "PyMES",
      type: "bar",
      marker: { color: CHART_COLORS.empresasPymes },
    },
  ];

  const layout = getCorporateLayout("Volumen mensual (paquetes eq. 20 un.)", 400);
  layout.barmode = "stack";
  layout.xaxis = { ...(layout.xaxis as Record<string, unknown>), title: { text: "Mes" } };
  layout.yaxis = { ...(layout.yaxis as Record<string, unknown>), title: { text: "Paquetes" } };

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

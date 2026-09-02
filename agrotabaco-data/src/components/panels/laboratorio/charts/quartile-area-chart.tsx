"use client";

import type { Data } from "plotly.js";
import Plot from "@/components/charts/plot";
import { getCorporateLayout, PLOTLY_CONFIG } from "@/lib/plotly-layout";
import { LABORATORIO_CHART_COLORS as CHART_COLORS } from "@/lib/panels/laboratorio/plotly-layout";
import type { VolumenPrecio } from "@/lib/panels/laboratorio/types";

const QUARTILS: { key: keyof VolumenPrecio; label: string; color: string }[] = [
  { key: "primerQuartil", label: "Primer Cuartil", color: CHART_COLORS.primerQuartil },
  { key: "segundoQuartil", label: "Segundo Cuartil", color: CHART_COLORS.segundoQuartil },
  { key: "tercerQuartil", label: "Tercer Cuartil", color: CHART_COLORS.tercerQuartil },
  { key: "cuartoQuartil", label: "Cuarto Cuartil", color: CHART_COLORS.cuartoQuartil },
];

export function QuartileAreaChart({ data }: { data: VolumenPrecio[] }) {
  const x = data.map((d) => d.fecha);

  const traces: Data[] = QUARTILS.map(({ key, label, color }) => ({
    x,
    y: data.map((d) => d[key] as number | null),
    name: label,
    mode: "lines",
    type: "scatter",
    stackgroup: "cuartiles",
    line: { width: 0.5, color },
    fillcolor: color,
  }));

  const layout = getCorporateLayout(
    "Volumen de paquetes por cuartil (positivo = venta, negativo = devolución)",
    420
  );
  layout.xaxis = { ...(layout.xaxis as Record<string, unknown>), title: { text: "Mes" } };
  layout.yaxis = { ...(layout.yaxis as Record<string, unknown>), title: { text: "Paquetes" } };
  layout.shapes = [
    {
      type: "line",
      xref: "paper",
      x0: 0,
      x1: 1,
      yref: "y",
      y0: 0,
      y1: 0,
      line: { color: CHART_COLORS.zeroLine, width: 1 },
    },
  ];

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

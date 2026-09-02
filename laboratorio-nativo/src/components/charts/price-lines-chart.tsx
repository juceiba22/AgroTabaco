"use client";

import type { Data } from "plotly.js";
import Plot from "./plot";
import { CHART_COLORS, getCorporateLayout, PLOTLY_CONFIG } from "@/lib/plotly-layout";
import type { VolumenPrecio } from "@/lib/types";

export function PriceLinesChart({ data }: { data: VolumenPrecio[] }) {
  const x = data.map((d) => d.fecha);

  const traces: Data[] = [
    {
      x,
      y: data.map((d) => d.precioSuperior),
      name: "Precio Superior",
      mode: "lines",
      type: "scatter",
      line: { color: CHART_COLORS.precioSuperior, width: 1.5 },
    },
    {
      x,
      y: data.map((d) => d.precioPromedioPonderado),
      name: "Precio Promedio Ponderado",
      mode: "lines",
      type: "scatter",
      line: { color: CHART_COLORS.precioPromedioPonderado, width: 2.5 },
    },
    {
      x,
      y: data.map((d) => d.precioInferior),
      name: "Precio Inferior",
      mode: "lines",
      type: "scatter",
      line: { color: CHART_COLORS.precioInferior, width: 1.5 },
    },
  ];

  const layout = getCorporateLayout("Precio por paquete (equivalente 20 unidades)", 380);
  layout.xaxis = { ...(layout.xaxis as Record<string, unknown>), title: { text: "Mes" } };
  layout.yaxis = { ...(layout.yaxis as Record<string, unknown>), title: { text: "Precio ($)" } };

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

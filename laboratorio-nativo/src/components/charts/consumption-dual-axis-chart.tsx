"use client";

import type { Data } from "plotly.js";
import Plot from "./plot";
import { CHART_COLORS, getCorporateLayout, PLOTLY_CONFIG } from "@/lib/plotly-layout";
import type { ConsumoAnio } from "@/lib/types";

export function ConsumptionDualAxisChart({ data }: { data: ConsumoAnio[] }) {
  const x = data.map((d) => d.anio);

  const traces: Data[] = [
    {
      x,
      y: data.map((d) => d.consumoAparente),
      name: "Consumo Aparente (paq./hab./año)",
      mode: "lines",
      type: "scatter",
      line: { color: CHART_COLORS.consumoAparente, width: 2.5 },
      fill: "tozeroy",
      fillcolor: CHART_COLORS.consumoAparenteFill,
    },
    {
      x,
      y: data.map((d) => d.poblacion),
      name: "Población (INDEC)",
      mode: "lines",
      type: "scatter",
      line: { color: CHART_COLORS.poblacion, width: 1.5, dash: "dot" },
      yaxis: "y2",
    },
  ];

  const layout = getCorporateLayout("Serie secular 1910-2026", 440);
  // Ejes explícitos desde el arranque (acá fue donde la versión Python tuvo
  // un bug real: un update_yaxes() sin selector pisaba el título del eje
  // secundario con el del primario — ver comentario en app.py).
  layout.xaxis = { ...(layout.xaxis as Record<string, unknown>), title: { text: "Año" } };
  layout.yaxis = {
    ...(layout.yaxis as Record<string, unknown>),
    title: { text: "Consumo aparente (paquetes/habitante/año)" },
  };
  layout.yaxis2 = { title: { text: "Población" }, overlaying: "y", side: "right", showgrid: false };

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

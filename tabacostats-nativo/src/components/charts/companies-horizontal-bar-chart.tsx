"use client";

import type { Data } from "plotly.js";
import Plot from "./plot";
import { getCorporateLayout, PLOTLY_CONFIG } from "@/lib/plotly-layout";

type Row = { razonSocial: string; volumenTn: number; marketSharePct: number };

export function CompaniesHorizontalBarChart({ data }: { data: Row[] }) {
  // Top 10 por volumen, orden ascendente para que el líder quede arriba en
  // un gráfico de barras horizontales (mismo criterio que top_emp_data_sorted
  // en app.py).
  const top10 = [...data].sort((a, b) => a.volumenTn - b.volumenTn).slice(-10);

  const traces: Data[] = [
    {
      y: top10.map((d) => d.razonSocial),
      x: top10.map((d) => d.volumenTn),
      orientation: "h",
      type: "bar",
      marker: {
        color: top10.map((d) => d.volumenTn),
        colorscale: "Greens",
        showscale: false,
      },
      customdata: top10.map((d) => d.marketSharePct),
      hovertemplate: "<b>%{y}</b><br>Volumen: %{x:,.1f} tn<br>Cuota de Mercado: %{customdata:.2f}%<extra></extra>",
    },
  ];

  const layout = getCorporateLayout("", 380);
  layout.xaxis = { ...(layout.xaxis as Record<string, unknown>), title: { text: "Volumen Acopiado (tn)" } };
  layout.yaxis = { title: "" };

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

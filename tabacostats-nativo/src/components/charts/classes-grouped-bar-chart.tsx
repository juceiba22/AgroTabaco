"use client";

import type { Data } from "plotly.js";
import Plot from "./plot";
import { TOBACCO_PALETTE, getCorporateLayout, PLOTLY_CONFIG } from "@/lib/plotly-layout";

type Row = { claseComercial: string; tipoTabaco: string; volumenTn: number; volumenKg: number; sharePct: number };

export function ClassesGroupedBarChart({ data, order }: { data: Row[]; order: string[] }) {
  const byVariedad = new Map<string, Row[]>();
  for (const row of data) {
    if (!byVariedad.has(row.tipoTabaco)) byVariedad.set(row.tipoTabaco, []);
    byVariedad.get(row.tipoTabaco)!.push(row);
  }

  const traces: Data[] = Array.from(byVariedad.entries()).map(([variedad, rows]) => {
    const byClass = new Map(rows.map((r) => [r.claseComercial, r]));
    const x = order.filter((c) => byClass.has(c));
    return {
      x,
      y: x.map((c) => byClass.get(c)!.volumenTn),
      name: variedad,
      type: "bar",
      marker: { color: TOBACCO_PALETTE[variedad] ?? "#5c6b5e" },
      customdata: x.map((c) => [byClass.get(c)!.volumenKg, byClass.get(c)!.sharePct]),
      hovertemplate:
        `<b>Clase %{x}</b> (${variedad})<br>Volumen: %{y:,.1f} tn (%{customdata[0]:,.0f} kg)<br>Participación: %{customdata[1]:.2f}%<extra></extra>`,
    };
  });

  const layout = getCorporateLayout("", 420);
  layout.xaxis = { ...(layout.xaxis as Record<string, unknown>), title: { text: "Clase Comercial" }, tickangle: -45, categoryorder: "array", categoryarray: order };
  layout.yaxis = { ...(layout.yaxis as Record<string, unknown>), title: { text: "Volumen (tn)" } };

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

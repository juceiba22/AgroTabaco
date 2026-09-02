"use client";

import type { Data } from "plotly.js";
import Plot from "./plot";
import { PLOTLY_CONFIG, getCorporateLayout } from "@/lib/plotly-layout";
import type { AsistenciaBreakdown } from "@/lib/filters";

export function AsistenciaGroupedChart({ data }: { data: AsistenciaBreakdown[] }) {
  const modalidades = Array.from(new Set(data.map((d) => d.modalidadDesembolso)));
  const tipos = Array.from(new Set(data.map((d) => d.tipoAsistencia)));
  const colors = ["#1a4329", "#b8860b"];

  const traces: Data[] = modalidades.map((modalidad, idx) => {
    const rows = tipos.map((tipo) => data.find((d) => d.tipoAsistencia === tipo && d.modalidadDesembolso === modalidad));
    return {
      x: tipos,
      y: rows.map((r) => r?.countPoas ?? 0),
      type: "bar",
      name: modalidad,
      marker: { color: colors[idx % colors.length] },
      hovertemplate: `<b>%{x}</b><br>${modalidad}: %{y} POAs<extra></extra>`,
    };
  });

  const layout = getCorporateLayout("Tipo de Asistencia × Modalidad de Desembolso (cantidad de POAs)", 420);
  layout.barmode = "group";
  layout.xaxis = { ...(layout.xaxis as Record<string, unknown>), title: { text: "Tipo de asistencia" } };
  layout.yaxis = { ...(layout.yaxis as Record<string, unknown>), title: { text: "Cantidad de POAs" } };

  return <Plot data={traces} layout={layout} config={PLOTLY_CONFIG} useResizeHandler style={{ width: "100%", height: "420px" }} />;
}

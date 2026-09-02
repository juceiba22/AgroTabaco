"use client";

import type { Data } from "plotly.js";
import Plot from "./plot";
import { PLOTLY_CONFIG, getFaoLayout } from "@/lib/plotly-layout";

type Row = { code: string; entityDisplay: string; valueTonnes: number };

export function WorldChoroplethMap({ data, year, unit = "toneladas" }: { data: Row[]; year: number; unit?: string }) {
  const traces: Data[] = [
    {
      type: "choropleth",
      locations: data.map((r) => r.code),
      z: data.map((r) => Math.log10(r.valueTonnes + 1)),
      text: data.map((r) => r.entityDisplay),
      customdata: data.map((r) => r.valueTonnes),
      colorscale: "YlGn",
      marker: { line: { color: "#e3e6dc", width: 0.5 } },
      hovertemplate: `<b>%{text}</b><br>Producción: %{customdata:,.0f} ${unit}<extra></extra>`,
      colorbar: { title: { text: "Escala (Log)", font: { color: "#1a4329", size: 11 } }, len: 0.7, thickness: 14 },
    },
  ];

  const layout = getFaoLayout({
    title: {
      text: `Distribución Geográfica Mundial de Producción de Tabaco – Año ${year}`,
      font: { size: 16, color: "#1a4329", family: "Inter" },
      x: 0.01,
    },
    geo: {
      showframe: false,
      showcoastlines: true,
      coastlinecolor: "#c9d0c1",
      projection: { type: "equirectangular" },
      bgcolor: "#ffffff",
      showland: true,
      landcolor: "#f1f2ed",
      showocean: true,
      oceancolor: "#eaf2ee",
      showlakes: true,
      lakecolor: "#eaf2ee",
      showcountries: true,
      countrycolor: "#d7ddd0",
    },
    height: 520,
    margin: { l: 0, r: 0, t: 50, b: 0 },
  });

  return (
    <Plot
      data={traces}
      layout={layout}
      config={PLOTLY_CONFIG}
      useResizeHandler
      style={{ width: "100%", height: "520px" }}
    />
  );
}

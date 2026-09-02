import type { Config } from "plotly.js";

// Paleta por variedad, port directo de TOBACCO_PALETTE en
// mercado-argentino-tabaco/app.py — reusada en Calidad & Clases (color por
// variedad) y en Mercado Internacional (Virginia/Burley).
export const TOBACCO_PALETTE: Record<string, string> = {
  Virginia: "#c9a227",
  Burley: "#8a5a2e",
  "Criollo Misionero": "#1a4329",
  "Criollo Correntino": "#3d5a4c",
  "Criollo Chaqueño": "#a0522d",
  "Criollo Argentino": "#6b7a3a",
  "Criollo Salteño": "#a9b87a",
  Kentucky: "#5c4a3a",
  "Kentucky Ahumado": "#3d2b1f",
  Total: "#1b241d",
};

export const CHART_COLORS = {
  precioAcopio: "#1a4329",
  complementoFet: "#6b7a3a",
  pctFet: "#b8860b",
  produccion: "#1a4329",
  superficie: "#b8860b",
  empresasBar: "#1a4329",
  zeroLine: "#5c6b5e",
} as const;

/**
 * Port de get_corporate_layout() de app.py: mismo layout base (fuente Inter,
 * leyenda horizontal arriba a la derecha, márgenes, hoverlabel) reusado en
 * todos los gráficos de este dashboard.
 */
export function getCorporateLayout(title: string, height = 400): Record<string, unknown> {
  return {
    title: title
      ? {
          text: `<b>${title}</b>`,
          font: { size: 14, color: "#1b241d", family: "Inter, sans-serif" },
          x: 0.01,
          y: 0.96,
        }
      : undefined,
    height,
    margin: { l: 55, r: 30, t: title ? 45 : 25, b: 45 },
    font: { family: "Inter, -apple-system, sans-serif", size: 11, color: "#5c6b5e" },
    plot_bgcolor: "#ffffff",
    paper_bgcolor: "#ffffff",
    hoverlabel: { bgcolor: "#ffffff", font: { size: 12, family: "Inter" } },
    legend: {
      orientation: "h",
      yanchor: "bottom",
      y: 1.02,
      xanchor: "right",
      x: 1,
      bgcolor: "rgba(255, 255, 255, 0.8)",
      bordercolor: "rgba(0,0,0,0.06)",
      borderwidth: 1,
    },
    xaxis: { gridcolor: "#f1f2ed" },
    yaxis: { gridcolor: "#f1f2ed" },
  };
}

export const PLOTLY_CONFIG: Partial<Config> = {
  displaylogo: false,
  responsive: true,
  modeBarButtonsToRemove: ["lasso2d", "select2d"],
};

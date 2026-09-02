import type { Config } from "plotly.js";

// Paleta institucional para el Observatorio (misma estética clara del resto
// del ecosistema): verde de marca para USD/montos, ámbar para señales de
// cobertura/calidad de datos, tonos tierra para desglose por programa.
export const PROVINCIA_PALETTE = [
  "#1a4329", "#6b7a3a", "#8a5a2e", "#4a5a9c", "#2f8f8a", "#a0522d", "#a9b87a",
] as const;

export const PROGRAMA_PALETTE = [
  "#1a4329", "#6b7a3a", "#8a5a2e", "#b8860b", "#2f8f8a", "#4a5a9c", "#a0522d", "#a9b87a", "#5c6b5e",
] as const;

export const CHART_COLORS = {
  usd: "#1a4329",
  ars: "#8a5a2e",
  cobertura: "#2f8f8a",
  faltante: "#e3e6dc",
  argentina: "#b8860b",
} as const;

/**
 * Mismo layout base "corporativo" ya usado en tabacostats-nativo/
 * mercado-global-nativo (fuente Inter, leyenda horizontal arriba a la
 * derecha, márgenes, hoverlabel) — reusado en todos los gráficos de este
 * dashboard.
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

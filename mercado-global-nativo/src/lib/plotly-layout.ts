import type { Config } from "plotly.js";

// Port de COLOR_PALETTE en mercado-global-tabaco/charts.py — 14 tonos
// tierra/verde, no son "colores oscuros", funcionan igual sobre fondo claro.
export const COLOR_PALETTE = [
  "#4f9169", "#c68a4e", "#6fae87", "#a0522d", "#8a9c52", "#d9a441",
  "#5c8a68", "#b5804a", "#7a9e9f", "#a9b87a", "#8a5a2e", "#c2604a",
  "#4a7a5c", "#9c7a4a",
] as const;

/**
 * Port de apply_base_dark_layout() de charts.py, adaptado a la estética
 * clara del resto del ecosistema nativo (el usuario pidió pasar de dark a
 * light mode acá específicamente) — misma estructura (fuente Inter,
 * hoverlabel, márgenes), colores invertidos a fondo blanco.
 */
export function getFaoLayout(extra: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    paper_bgcolor: "#ffffff",
    plot_bgcolor: "#ffffff",
    font: { family: "Inter, sans-serif", color: "#1b241d", size: 12 },
    xaxis: {
      gridcolor: "#f1f2ed",
      zerolinecolor: "#e3e6dc",
      tickfont: { color: "#5c6b5e" },
      title: { font: { color: "#1a4329", size: 13 } },
    },
    yaxis: {
      gridcolor: "#f1f2ed",
      zerolinecolor: "#e3e6dc",
      tickfont: { color: "#5c6b5e" },
      title: { font: { color: "#1a4329", size: 13 } },
    },
    hoverlabel: { bgcolor: "#ffffff", bordercolor: "#1a4329", font: { family: "Inter, sans-serif", color: "#1b241d", size: 12 } },
    margin: { l: 40, r: 40, t: 50, b: 40 },
    ...extra,
  };
}

export const PLOTLY_CONFIG: Partial<Config> = {
  displaylogo: false,
  responsive: true,
  modeBarButtonsToRemove: ["lasso2d", "select2d"],
};

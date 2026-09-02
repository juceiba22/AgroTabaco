// Paletas del panel Observatorio del FET. getCorporateLayout()/
// PLOTLY_CONFIG viven ahora en @/lib/plotly-layout (compartidos entre los 4
// paneles) — acá sólo queda lo específico de este panel. CHART_COLORS se
// renombra a OBSERVATORIO_CHART_COLORS para no chocar con los otros 3.
export const PROVINCIA_PALETTE = [
  "#1a4329", "#6b7a3a", "#8a5a2e", "#4a5a9c", "#2f8f8a", "#a0522d", "#a9b87a",
] as const;

export const PROGRAMA_PALETTE = [
  "#1a4329", "#6b7a3a", "#8a5a2e", "#b8860b", "#2f8f8a", "#4a5a9c", "#a0522d", "#a9b87a", "#5c6b5e",
] as const;

export const OBSERVATORIO_CHART_COLORS = {
  usd: "#1a4329",
  ars: "#8a5a2e",
  cobertura: "#2f8f8a",
  faltante: "#e3e6dc",
  argentina: "#b8860b",
} as const;

// Paletas del panel TabacoStats Argentina, port directo de
// mercado-argentino-tabaco/app.py. getCorporateLayout()/PLOTLY_CONFIG viven
// ahora en @/lib/plotly-layout (compartidos entre los 4 paneles) — acá sólo
// queda lo específico de este panel.
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

export const TABACOSTATS_CHART_COLORS = {
  precioAcopio: "#1a4329",
  complementoFet: "#6b7a3a",
  pctFet: "#b8860b",
  produccion: "#1a4329",
  superficie: "#b8860b",
  empresasBar: "#1a4329",
  zeroLine: "#5c6b5e",
} as const;

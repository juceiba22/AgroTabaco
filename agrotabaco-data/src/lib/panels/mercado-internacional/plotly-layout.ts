// Paleta del panel Mercado Internacional de Tabaco, port de COLOR_PALETTE en
// mercado-global-tabaco/charts.py — 14 tonos tierra/verde. Antes se llamaba
// COLOR_PALETTE; renombrada acá para no chocar con las paletas de los otros
// 3 paneles al fusionarlos. getCorporateLayout()/PLOTLY_CONFIG viven ahora
// en @/lib/plotly-layout (compartidos).
export const MERCADO_CHART_COLORS = [
  "#4f9169", "#c68a4e", "#6fae87", "#a0522d", "#8a9c52", "#d9a441",
  "#5c8a68", "#b5804a", "#7a9e9f", "#a9b87a", "#8a5a2e", "#c2604a",
  "#4a7a5c", "#9c7a4a",
] as const;

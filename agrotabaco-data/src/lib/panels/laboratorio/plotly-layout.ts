// Paleta del panel Laboratorio Estadístico, port directo de los hex ya
// usados en laboratorio-estadistico/app.py. getCorporateLayout()/
// PLOTLY_CONFIG viven ahora en @/lib/plotly-layout (compartidos entre los
// 4 paneles) — acá sólo queda lo específico de este panel.
export const LABORATORIO_CHART_COLORS = {
  precioSuperior: "#c9a227",
  precioPromedioPonderado: "#1a4329",
  precioInferior: "#6b7a3a",
  primerQuartil: "#a9b87a",
  segundoQuartil: "#6b7a3a",
  tercerQuartil: "#3d5a4c",
  cuartoQuartil: "#1a4329",
  empresasGrandes: "#1a4329",
  empresasPymes: "#c9a227",
  consumoAparente: "#1a4329",
  consumoAparenteFill: "rgba(26,67,41,0.08)",
  poblacion: "#b8860b",
  zeroLine: "#5c6b5e",
} as const;

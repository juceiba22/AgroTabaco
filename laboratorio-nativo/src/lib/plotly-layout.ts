import type { Config } from "plotly.js";

// Paleta reusada en los 5 gráficos, port directo de los hex ya usados en
// laboratorio-estadistico/app.py (TOBACCO_PALETTE / colores ad-hoc de cada
// figura), para mantener paridad visual con la versión Streamlit.
export const CHART_COLORS = {
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

/**
 * Port de get_corporate_layout() de app.py: mismo layout base (fuente Inter,
 * leyenda horizontal arriba a la derecha, márgenes, hoverlabel) para los 5
 * gráficos de este dashboard.
 */
// Tipado laxo a propósito — ver el comentario en src/types/react-plotly.d.ts
// sobre por qué Layout no se usa acá para un objeto armado dinámicamente.
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

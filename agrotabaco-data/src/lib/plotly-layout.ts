import type { Config } from "plotly.js";

/**
 * Layout base "corporativo" compartido por los 4 paneles (fuente Inter,
 * leyenda horizontal arriba a la derecha, márgenes, hoverlabel). Antes vivía
 * duplicado en cada proyecto standalone (idéntico en 3 de 4, y como
 * `getFaoLayout()` con la misma forma en el cuarto) — dedupeado acá al
 * fusionarlos.
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

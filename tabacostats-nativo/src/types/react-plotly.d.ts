declare module "plotly.js-dist-min" {
  import * as Plotly from "plotly.js";
  export = Plotly;
}

declare module "react-plotly.js" {
  import type { Config, Data } from "plotly.js";
  import type { ComponentType } from "react";

  export type PlotParams = {
    data: Data[];
    // El paquete de tipos "nativos" de plotly.js (schema autogenerado) es
    // demasiado estricto/cambiante para layouts armados dinámicamente
    // (barmode, overlaying, shapes con yref) — se tipa laxo a propósito acá,
    // los traces (Data[]) sí quedan tipados.
    layout?: Record<string, unknown>;
    config?: Partial<Config>;
    style?: React.CSSProperties;
    className?: string;
    useResizeHandler?: boolean;
  };

  const Plot: ComponentType<PlotParams>;
  export default Plot;
}

declare module "react-plotly.js/factory" {
  import type { PlotParams } from "react-plotly.js";
  import type { ComponentType } from "react";

  export default function createPlotlyComponent(plotly: unknown): ComponentType<PlotParams>;
}

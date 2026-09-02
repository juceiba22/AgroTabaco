"use client";

// react-plotly.js espera el paquete completo "plotly.js" por defecto; acá
// usamos el build liviano "plotly.js-dist-min" (incluye todos los tipos de
// traza que necesitamos: scatter con stackgroup, bar, eje secundario) vía
// el factory que react-plotly.js expone justo para builds custom.
import Plotly from "plotly.js-dist-min";
import createPlotlyComponent from "react-plotly.js/factory";

const Plot = createPlotlyComponent(Plotly);

export default Plot;

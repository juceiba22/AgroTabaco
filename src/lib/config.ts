// URLs de los dashboards estadísticos (apps Streamlit separadas). Configurables
// por variable de entorno para apuntar al dominio real una vez desplegados.
//
// El query param ?embed=true es el modo "embed" nativo de Streamlit: oculta
// la barra "Fork / GitHub" que Streamlit Community Cloud agrega a las apps
// públicas y vuelve transparente el header propio de Streamlit, para que no
// compita visualmente con nuestra barra de marca.
const STATS_BASE_URL = process.env.NEXT_PUBLIC_STATS_URL || "http://localhost:8501";
const GLOBAL_MARKET_BASE_URL =
  process.env.NEXT_PUBLIC_GLOBAL_MARKET_URL || "http://localhost:8502";

export const STATS_DASHBOARD_URL = `${STATS_BASE_URL}?embed=true`;
export const GLOBAL_MARKET_DASHBOARD_URL = `${GLOBAL_MARKET_BASE_URL}?embed=true`;

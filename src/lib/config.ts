// URLs de los dashboards estadísticos (apps Streamlit separadas). Configurables
// por variable de entorno para apuntar al dominio real una vez desplegados.
export const STATS_DASHBOARD_URL =
  process.env.NEXT_PUBLIC_STATS_URL || "http://localhost:8501";

export const GLOBAL_MARKET_DASHBOARD_URL =
  process.env.NEXT_PUBLIC_GLOBAL_MARKET_URL || "http://localhost:8502";

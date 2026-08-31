// URL del dashboard estadístico (TabacoStats Argentina, app Streamlit
// separada). Configurable por variable de entorno para apuntar al dominio
// real una vez que se despliegue.
export const STATS_DASHBOARD_URL =
  process.env.NEXT_PUBLIC_STATS_URL || "http://localhost:8501";

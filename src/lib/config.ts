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

// Mercado Argentino de Tabaco: oculto a pedido del usuario (2026-08-31) — la
// idea es mudarlo a un sitio externo propio, como los dashboards Streamlit,
// en vez de vivir dentro del portal informativo de noticias. El código
// entero queda intacto (src/app/(public)/mercado, migraciones, etc.); este
// flag es lo único que lo apaga: gatea src/app/(public)/mercado/layout.tsx
// (devuelve notFound() para toda la sección) y el endpoint del asistente de
// IA en src/app/api/mercado/asistente/route.ts.
export const MERCADO_ENABLED = false;

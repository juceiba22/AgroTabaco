// Mercado Argentino de Tabaco: oculto a pedido del usuario (2026-08-31) — la
// idea es mudarlo a un sitio externo propio, como los dashboards Streamlit,
// en vez de vivir dentro del portal informativo de noticias. El código
// entero queda intacto (src/app/(public)/mercado, migraciones, etc.); este
// flag es lo único que lo apaga: gatea src/app/(public)/mercado/layout.tsx
// (devuelve notFound() para toda la sección) y el endpoint del asistente de
// IA en src/app/api/mercado/asistente/route.ts.
export const MERCADO_ENABLED = false;

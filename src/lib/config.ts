// AgroTabaco Data: producto de suscripción con los 4 paneles nativos
// (Laboratorio Estadístico, TabacoStats Argentina, Mercado Internacional,
// Observatorio del FET) — reemplaza a los dashboards Streamlit que este
// portal linkeaba antes. Vive en un proyecto de Vercel separado; acá sólo
// se configura la URL para no hardcodearla en el header. Cuando se cuelgue
// el subdominio data.agrotabaco.com, cambiar el valor por defecto (o
// setear NEXT_PUBLIC_AGROTABACO_DATA_URL en Vercel) sin tocar el código.
export const AGROTABACO_DATA_URL =
  process.env.NEXT_PUBLIC_AGROTABACO_DATA_URL || "https://agrotabaco-data.vercel.app";

// Mercado Argentino de Tabaco: oculto a pedido del usuario (2026-08-31) — la
// idea es mudarlo a un sitio externo propio, como los dashboards Streamlit,
// en vez de vivir dentro del portal informativo de noticias. El código
// entero queda intacto (src/app/(public)/mercado, migraciones, etc.); este
// flag es lo único que lo apaga: gatea src/app/(public)/mercado/layout.tsx
// (devuelve notFound() para toda la sección) y el endpoint del asistente de
// IA en src/app/api/mercado/asistente/route.ts.
export const MERCADO_ENABLED = false;

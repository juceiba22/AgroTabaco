// Cifras de referencia curadas a mano para el asistente de IA del Mercado
// Argentino de Tabaco. Se actualizan manualmente en base a lo que muestran
// los dashboards Estadísticas y Mercado Internacional (mercado-argentino-
// tabaco/app.py) — no hay pipeline en vivo desde esos CSV hacia esta app.
//
// IMPORTANTE: actualizar `lastUpdated` cada vez que se toquen los valores.
// Si pasan más de ~90 días sin actualizar, el asistente agrega una
// advertencia de posible desactualización (ver STALE_AFTER_DAYS abajo).

export const MARKET_CONTEXT = {
  lastUpdated: "2026-08-31",
  precioAcopio: {
    campana: "2024/2025",
    precioBaseArsPorKg: 2969.69,
    complementoFetArsPorKg: 880.99,
    precioTotalArsPorKg: 3850.67,
    participacionFetPct: 22.9,
    fuente: "Dashboard Estadísticas — Precios Acopio & Precio FET",
  },
  mercadoInternacionalEeuu: {
    anio: 2025,
    virginiaValorFobUsd: 520_100_000,
    burleyValorFobUsd: 61_500_000,
    participacionVirginiaPct: 89.4,
    fuente:
      "USDA GATS / Census Bureau — exportaciones de EE.UU. de tabaco trillado Virginia y Burley al mundo",
  },
} as const;

const STALE_AFTER_DAYS = 90;

export function buildMarketContextSummary(): string {
  const { precioAcopio, mercadoInternacionalEeuu, lastUpdated } = MARKET_CONTEXT;

  const daysSinceUpdate =
    (Date.now() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24);
  const staleWarning =
    daysSinceUpdate > STALE_AFTER_DAYS
      ? `\n\nADVERTENCIA: estas cifras no se actualizan desde ${lastUpdated} (hace más de ${STALE_AFTER_DAYS} días). Aclarale siempre al usuario que pueden estar desactualizadas y que confirme valores vigentes en la sección Estadísticas.`
      : "";

  return `
Precio de Acopio Argentina (campaña ${precioAcopio.campana}):
- Precio Acopio Base: $${precioAcopio.precioBaseArsPorKg.toFixed(2)}/kg (ARS)
- Complemento Fondo Especial del Tabaco (FET): $${precioAcopio.complementoFetArsPorKg.toFixed(2)}/kg (ARS)
- Precio Total Productor: $${precioAcopio.precioTotalArsPorKg.toFixed(2)}/kg (ARS)
- El FET representa el ${precioAcopio.participacionFetPct}% del precio total.
(Fuente: ${precioAcopio.fuente})

Comercio exterior de EE.UU. (año ${mercadoInternacionalEeuu.anio}), como referencia de mercado internacional:
- Virginia: valor FOB exportado por EE.UU. al mundo de US$ ${(mercadoInternacionalEeuu.virginiaValorFobUsd / 1e6).toFixed(1)} millones
- Burley: valor FOB exportado por EE.UU. al mundo de US$ ${(mercadoInternacionalEeuu.burleyValorFobUsd / 1e6).toFixed(1)} millones
- Virginia representa el ${mercadoInternacionalEeuu.participacionVirginiaPct}% del total Virginia+Burley
- OJO: esto es VALOR FOB en USD, no volumen ni precio en $/kg.
(Fuente: ${mercadoInternacionalEeuu.fuente})

Estas cifras están actualizadas al ${lastUpdated}.${staleWarning}
`.trim();
}

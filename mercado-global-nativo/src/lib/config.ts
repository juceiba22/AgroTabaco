// Port literal de COUNTRY_METADATA / REGIONAL_AGGREGATES_KNOWN /
// DEFAULT_PRESET_COUNTRIES en mercado-global-tabaco/data_loader.py. El
// nombre bilingüe + bandera ya viene resuelto en la columna entity_display
// de Supabase (calculado una sola vez al generar el seed) — esto queda acá
// sólo para los botones de preset de países y por si hace falta referencia
// en el futuro.
export const DEFAULT_PRESET_COUNTRIES = ["Argentina", "Brazil", "China", "India", "United States"];
export const PRESET_TOP5_GLOBAL = ["China", "India", "Brazil", "Indonesia", "United States"];
export const PRESET_SUDAMERICA = ["Argentina", "Brazil", "Paraguay", "Colombia", "Bolivia"];
export const SUDAMERICA_COMPARATIVO = ["Argentina", "Brazil", "Paraguay", "Colombia"];

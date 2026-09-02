import { MercadoPagoConfig } from "mercadopago";

export const PLAN_ANUAL_ARS = 99990;

let client: MercadoPagoConfig | null = null;

/**
 * Instancia el cliente de Mercado Pago una sola vez. Tira un error claro
 * si falta el access token en vez de un fallo genérico del SDK — se llama
 * únicamente desde las rutas de checkout/webhook, nunca desde el cliente.
 */
export function getMercadoPagoClient(): MercadoPagoConfig {
  if (client) return client;

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("[mercadopago] Falta MERCADOPAGO_ACCESS_TOKEN.");
  }

  client = new MercadoPagoConfig({ accessToken, options: { timeout: 8000 } });
  return client;
}

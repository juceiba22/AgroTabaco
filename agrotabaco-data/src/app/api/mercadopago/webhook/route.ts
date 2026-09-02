import { Payment } from "mercadopago";
import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getMercadoPagoClient } from "@/lib/mercadopago";

const UN_ANIO_MS = 365 * 24 * 60 * 60 * 1000;

/**
 * La notificación en sí NUNCA es la fuente de verdad — sólo trae un id de
 * pago. Acá se vuelve a consultar ese pago directamente a la API de
 * Mercado Pago con nuestro propio access token, y sólo si esa respuesta
 * (no el body de la notificación) dice "approved" se activa la
 * suscripción. Alguien mandando una notificación falsa como mucho logra
 * que preguntemos por un pago que no le pertenece.
 */
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  let paymentId: string | null = searchParams.get("data.id");
  let type: string | null = searchParams.get("type") ?? searchParams.get("topic");

  try {
    const body = await request.json();
    paymentId = body?.data?.id ? String(body.data.id) : paymentId;
    type = body?.type ?? type;
  } catch {
    // Algunas notificaciones llegan sin body (todo en query params) — está bien.
  }

  if (type !== "payment" || !paymentId) {
    return NextResponse.json({ received: true, skipped: true });
  }

  try {
    const payment = new Payment(getMercadoPagoClient());
    const result = await payment.get({ id: paymentId });

    if (result.status === "approved" && result.external_reference) {
      const admin = createAdminClient();
      const currentPeriodEnd = new Date(Date.now() + UN_ANIO_MS).toISOString();

      const { error } = await admin.from("data_subscriptions").upsert(
        {
          user_id: result.external_reference,
          status: "active",
          plan: "anual",
          current_period_end: currentPeriodEnd,
          // Reusa esta columna para el id del pago de Checkout Pro — en
          // este modelo no hay una suscripción recurrente real de MP.
          mercadopago_subscription_id: String(result.id ?? paymentId),
          mercadopago_payer_id: result.payer?.id != null ? String(result.payer.id) : null,
        },
        { onConflict: "user_id" }
      );

      if (error) {
        console.error("[agrotabaco-data] Error activando la suscripción:", error);
      }
    }
  } catch (error) {
    console.error("[agrotabaco-data] Error procesando el webhook de Mercado Pago:", error);
  }

  return NextResponse.json({ received: true });
}

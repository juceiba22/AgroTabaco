import { Preference } from "mercadopago";
import { NextResponse, type NextRequest } from "next/server";
import { getEntitlement } from "@/lib/entitlements";
import { PLAN_ANUAL_ARS, getMercadoPagoClient } from "@/lib/mercadopago";

function getRequestOrigin(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }
  const host = request.headers.get("host");
  if (host) {
    const proto = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
    return `${proto}://${host}`;
  }
  return new URL(request.url).origin;
}

export async function POST(request: NextRequest) {
  const origin = getRequestOrigin(request);
  const { user, plan } = await getEntitlement();

  if (!user) {
    return NextResponse.redirect(`${origin}/login?redirectTo=/planes`);
  }
  if (plan === "pro") {
    return NextResponse.redirect(`${origin}/planes`);
  }

  try {
    const preference = new Preference(getMercadoPagoClient());
    const response = await preference.create({
      body: {
        items: [
          {
            id: "agrotabaco-data-anual",
            title: "AgroTabaco Data — Suscripción anual",
            quantity: 1,
            unit_price: PLAN_ANUAL_ARS,
            currency_id: "ARS",
          },
        ],
        payer: user.email ? { email: user.email } : undefined,
        external_reference: user.id,
        notification_url: `${origin}/api/mercadopago/webhook`,
        back_urls: {
          success: `${origin}/planes?estado=exito`,
          failure: `${origin}/planes?estado=error`,
          pending: `${origin}/planes?estado=pendiente`,
        },
        auto_return: "approved",
      },
    });

    if (!response.init_point) {
      throw new Error("Mercado Pago no devolvió init_point.");
    }
    return NextResponse.redirect(response.init_point);
  } catch (error) {
    console.error("[agrotabaco-data] Error creando la preferencia de Mercado Pago:", error);
    return NextResponse.redirect(`${origin}/planes?estado=error`);
  }
}

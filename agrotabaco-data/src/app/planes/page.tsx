import Link from "next/link";
import { getEntitlement } from "@/lib/entitlements";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Planes | AgroTabaco Data",
};

const ESTADO_BANNER: Record<string, { text: string; tone: string }> = {
  exito: { text: "¡Pago recibido! Puede tardar unos segundos en activarse — recargá la página si todavía no ves el cambio.", tone: "bg-emerald-50 border-emerald-300 text-emerald-800" },
  error: { text: "El pago no se pudo completar. Podés volver a intentarlo cuando quieras.", tone: "bg-red-50 border-red-300 text-red-800" },
  pendiente: { text: "Tu pago está pendiente de confirmación por parte de Mercado Pago.", tone: "bg-amber-50 border-amber-300 text-amber-800" },
};

export default async function PlanesPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado } = await searchParams;
  const banner = estado ? ESTADO_BANNER[estado] : undefined;
  const { user, plan } = await getEntitlement();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="executive-header">
        <h1>Planes de AgroTabaco Data</h1>
        <p>Los 4 paneles del ecosistema, con el nivel de detalle que necesites.</p>
      </div>

      {banner && <div className={`mt-4 rounded-lg border px-4 py-3 text-sm font-medium ${banner.tone}`}>{banner.text}</div>}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Vista gratuita</p>
          <p className="mt-1 font-serif text-2xl font-bold text-brand-green-dark">Cuenta con Google</p>
          <ul className="mt-4 space-y-2 text-sm text-foreground">
            <li>– Las 4 secciones visibles de entrada, ninguna pestaña oculta</li>
            <li>– Datos del período o campaña más reciente</li>
            <li>– Gráficos interactivos, sin exportar</li>
          </ul>
        </div>

        <div className="rounded-xl border-2 border-amber-600 bg-card p-6 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Suscripción anual</p>
          <p className="mt-1 font-serif text-2xl font-bold text-brand-green-dark">AgroTabaco Data</p>
          <p className="mt-1 text-3xl font-extrabold text-foreground">
            $99.990 <span className="text-base font-medium text-muted-foreground">/ año</span>
          </p>
          <ul className="mt-4 space-y-2 text-sm text-foreground">
            <li>✓ Historial completo de cada dataset</li>
            <li>✓ Exportación a CSV en los cuatro paneles</li>
            <li>✓ Comparativos multi-campaña y multi-país</li>
            <li>✓ Buscador y consulta de registros del Observatorio del FET</li>
          </ul>

          {plan === "pro" ? (
            <p className="mt-5 rounded-md bg-brand-green-dark px-3 py-2 text-center text-sm font-semibold text-white">
              ✓ Ya sos suscriptor
            </p>
          ) : user ? (
            <form action="/api/mercadopago/checkout" method="post">
              <button
                type="submit"
                className="mt-5 w-full rounded-md bg-brand-green-dark px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-green-darker"
              >
                Suscribirme con Mercado Pago
              </button>
            </form>
          ) : (
            <Link
              href="/login?redirectTo=/planes"
              className="mt-5 block rounded-md bg-brand-green-dark px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-green-darker"
            >
              Iniciá sesión para suscribirte
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

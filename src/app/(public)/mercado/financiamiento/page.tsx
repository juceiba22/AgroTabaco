import type { Metadata } from "next";
import { Coins, ShieldCheck, Sprout } from "lucide-react";
import { FinancingForm } from "@/components/marketplace/financing-form";

export const metadata: Metadata = {
  title: "Financiamiento por tokenización | Mercado Argentino de Tabaco",
  description:
    "Sumate a la lista de espera del financiamiento por tokenización para la cadena tabacalera argentina.",
};

// NOTA PARA INTEGRACIÓN FUTURA: acá va a conectarse el smart contract / token
// (desarrollo externo, ya en curso) una vez esté listo. Por ahora esta
// página es sólo informativa + captura de interés (financing_interests);
// no hay wallet ni transacción on-chain todavía.

export default function FinanciamientoPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <span className="text-xs font-semibold uppercase tracking-widest text-brand-olive">
        Mercado Argentino de Tabaco
      </span>
      <h1 className="mt-1 font-serif text-3xl font-bold text-brand-green-dark sm:text-4xl">
        Financiamiento por tokenización
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Estamos preparando una vía de financiamiento para la cadena tabacalera basada en
        tokenización: una forma de fraccionar y respaldar digitalmente instrumentos de
        financiamiento ligados a la producción y comercialización de tabaco.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-5">
          <Sprout className="size-6 text-brand-green-dark" />
          <h3 className="mt-3 font-serif text-base font-bold text-foreground">
            Pensado para la cadena
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Productores, acopiadores y exportadores van a poder acceder a financiamiento respaldado
            en su propia actividad comercial.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <Coins className="size-6 text-brand-green-dark" />
          <h3 className="mt-3 font-serif text-base font-bold text-foreground">
            Tokenización
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            El instrumento se emite como token, permitiendo fraccionar montos y dar trazabilidad al
            financiamiento.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <ShieldCheck className="size-6 text-brand-green-dark" />
          <h3 className="mt-3 font-serif text-base font-bold text-foreground">
            En desarrollo
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            El contrato y el token están en construcción. Todavía no hay operaciones on-chain
            disponibles.
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="font-serif text-lg font-bold text-brand-green-dark">
          Sumate a la lista de espera
        </h2>
        <p className="mt-1 mb-6 text-sm text-muted-foreground">
          Dejanos tus datos y te avisamos apenas esté disponible.
        </p>
        <FinancingForm />
      </div>
    </div>
  );
}

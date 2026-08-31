import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/marketplace/auth-form";

export const metadata: Metadata = {
  title: "Crear cuenta | Mercado Argentino de Tabaco",
  description:
    "Registrate para publicar y responder ofertas de compra/venta de tabaco en el Mercado Argentino de Tabaco.",
};

export default function RegistroPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6 lg:px-8">
      <span className="text-xs font-semibold uppercase tracking-widest text-brand-olive">
        Mercado Argentino de Tabaco
      </span>
      <h1 className="mt-1 font-serif text-3xl font-bold text-brand-green-dark">
        Crear cuenta
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Con tu cuenta podés publicar ofertas de compra o venta y responder a
        las de otros productores, acopiadores y exportadores.
      </p>

      <div className="mt-6 rounded-xl border bg-card p-6 shadow-sm">
        <Suspense>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}

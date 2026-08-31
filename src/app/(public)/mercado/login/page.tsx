import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/marketplace/auth-form";

export const metadata: Metadata = {
  title: "Ingresar | Mercado Argentino de Tabaco",
};

export default function MercadoLoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6 lg:px-8">
      <span className="text-xs font-semibold uppercase tracking-widest text-brand-olive">
        Mercado Argentino de Tabaco
      </span>
      <h1 className="mt-1 font-serif text-3xl font-bold text-brand-green-dark">
        Ingresar
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Accedé para publicar ofertas o ver el interés recibido en las tuyas.
      </p>

      <div className="mt-6 rounded-xl border bg-card p-6 shadow-sm">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { DocumentationForm } from "@/components/documentation/documentation-form";

export const metadata: Metadata = {
  title: "Solicitud de documentación — Persona Jurídica | AgroTabaco",
  description:
    "Cargá la documentación de tu empresa para calificar al financiamiento de productores tabacaleros en el Mercado de Valores Argentino.",
  robots: { index: false, follow: false },
};

export default function DocumentacionPersonaJuridicaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <span className="text-xs font-semibold uppercase tracking-widest text-brand-olive">
        Asesoramiento &amp; data Hub para el Agro
      </span>
      <h1 className="mt-1 font-serif text-3xl font-bold text-brand-green-dark sm:text-4xl">
        Solicitud de documentación — Persona Jurídica
      </h1>
      <p className="mt-2 text-sm italic text-muted-foreground">
        Programa de Financiamiento para Productores Tabacaleros en el Mercado de Valores Argentino
      </p>

      <div className="mt-6 space-y-3 text-muted-foreground">
        <p className="font-semibold text-foreground">Estimado/a productor/a,</p>
        <p>
          AgroTabaco acompaña a los productores tabacaleros de las economías regionales del norte
          argentino en su acceso a instrumentos de financiamiento dentro del Mercado de Valores
          Argentino. Con el fin de evaluar y gestionar la calificación de su empresa como Persona
          Jurídica ante dicho mercado, solicitamos remitir la totalidad de la documentación detallada
          a continuación.
        </p>
        <p className="text-sm italic">
          Le pedimos completar la casilla correspondiente a medida que reúna cada documento y adjuntar
          la totalidad de la documentación en un único envío, a fin de agilizar el proceso de
          evaluación.
        </p>
      </div>

      <div className="mt-10">
        <DocumentationForm />
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        Ante cualquier consulta sobre los requisitos, nuestro equipo se encuentra a su disposición.
        <br />
        Atentamente, <strong className="text-foreground">el equipo de AgroTabaco</strong>.
      </p>
    </div>
  );
}

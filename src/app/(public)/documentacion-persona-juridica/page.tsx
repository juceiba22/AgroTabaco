import type { Metadata } from "next";
import { FinancingFlow } from "@/components/documentation/financing-flow";

export const metadata: Metadata = {
  title: "Conseguí financiamiento por medio del Mercado de Valores | AgroTabaco",
  description:
    "Si sos una empresa o cooperativa del Agro, podés solicitar financiamiento directamente en el mercado de valores, sin recurrir a los bancos comerciales.",
  robots: { index: false, follow: false },
};

export default function DocumentacionPersonaJuridicaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <span className="text-xs font-semibold uppercase tracking-widest text-brand-olive">
        Asesoramiento &amp; data Hub para el Agro
      </span>
      <h1 className="mt-1 font-serif text-3xl font-bold text-brand-green-dark sm:text-4xl">
        Conseguí financiamiento por medio del Mercado de Valores
      </h1>

      <div className="mt-6 space-y-3 text-muted-foreground">
        <p>
          Si sos una empresa o cooperativa del Agro, podés solicitar financiamiento directamente en
          el mercado de valores, sin recurrir a los bancos comerciales. Si querés evaluar y gestionar
          la calificación de tu empresa como Persona Jurídica ante dicho mercado, subí la
          documentación.
        </p>
        <p className="text-sm italic">
          Le pedimos completar la casilla correspondiente a medida que reúna cada documento y adjuntar
          la totalidad de la documentación en un único envío, a fin de agilizar el proceso de
          evaluación.
        </p>
      </div>

      <div className="mt-10">
        <FinancingFlow />
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        Ante cualquier consulta sobre los requisitos, nuestro equipo se encuentra a su disposición.
        <br />
        Atentamente, <strong className="text-foreground">el equipo de AgroTabaco</strong>.
      </p>
    </div>
  );
}

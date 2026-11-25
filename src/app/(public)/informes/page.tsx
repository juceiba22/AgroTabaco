import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileBarChart } from "lucide-react";
import { RESOLUCIONES, TOTAL, fmtMillones } from "@/lib/informes/poa-salta-2026";

export const metadata: Metadata = {
  title: "Informes",
  description:
    "Informes de AgroTabaco sobre el Fondo Especial del Tabaco, POA y la economía tabacalera argentina.",
  alternates: { canonical: "/informes" },
};

const INFORMES = [
  {
    href: "/informes/destino-fondos-poa-salta-2026",
    etiqueta: "FET · POA",
    fecha: "25/11/2026",
    titulo: "Destino de los fondos POA · Salta 2026",
    resumen:
      "Cómo se reparten los fondos de las resoluciones POA 2026 de la SAGyP para Salta entre COPROTAB, SUMICLI, AMPTS, Fertinorte, el CCE y el Gobierno provincial.",
    datos: [
      { label: "Total", value: fmtMillones(TOTAL) },
      { label: "Resoluciones", value: String(RESOLUCIONES.length) },
    ],
  },
];

export default function InformesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 border-b pb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-olive">
          Sección
        </span>
        <h1 className="mt-1 font-serif text-3xl font-bold text-brand-green-dark sm:text-4xl">
          Informes
        </h1>
        <p className="mt-2 text-muted-foreground">
          Análisis y seguimiento de fondos, resoluciones y datos del sector tabacalero.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {INFORMES.map((informe) => (
          <Link
            key={informe.href}
            href={informe.href}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between bg-gradient-to-br from-[#0d1f15] via-[#132a1e] to-[#1a3b2b] px-5 py-4">
              <FileBarChart className="h-7 w-7 text-brand-gold" />
              <span className="rounded-full bg-brand-gold px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#151D19]">
                {informe.etiqueta}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <span className="font-mono text-xs text-muted-foreground">{informe.fecha}</span>
              <h2 className="mt-1 font-serif text-xl font-bold text-brand-green-dark group-hover:text-brand-green-light">
                {informe.titulo}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{informe.resumen}</p>
              <div className="mt-4 flex gap-6 border-t border-border pt-3">
                {informe.datos.map((d) => (
                  <div key={d.label}>
                    <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">
                      {d.label}
                    </span>
                    <strong className="tabular-nums text-brand-green-dark">{d.value}</strong>
                  </div>
                ))}
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-gold">
                Ver informe
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

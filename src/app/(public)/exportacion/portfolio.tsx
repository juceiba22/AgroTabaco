"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Mail, MapPin, MessageSquare, Printer, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export type Lang = "en" | "es";

const WA_NUMBER = "5491166814208";
const WA_DISPLAY = "+54 9 11 6681-4208";
const EMAIL = "institucional@agrotabaco.com";

const PRODUCTS = [
  {
    key: "virginia",
    href: "/exportacion/virginia",
    image: "/images/exportacion/virginia-og.jpg",
    facts: [
      ["Salta, Argentina", "Salta, Argentina"],
      ["Virginia · B1F", "Virginia · B1F"],
      ["Crop 2026 · Lot 20/03/2026", "Cosecha 2026 · Lote 20/03/2026"],
    ],
    name: ["Premium Virginia", "Virginia premium"],
    text: [
      "Flue-cured Virginia leaf, the highest quality class on Argentina’s official scale.",
      "Hoja de Virginia curada en estufa, la clase de mayor calidad de la escala oficial argentina.",
    ],
    cta: ["View Virginia portfolio", "Ver portfolio de Virginia"],
  },
  {
    key: "burley",
    href: "/exportacion/burley",
    image: "/images/exportacion/burley-og.jpg",
    facts: [
      ["Tucumán, Argentina", "Tucumán, Argentina"],
      ["Burley · Grade C B12FLR", "Burley · Grado C B12FLR"],
      ["Crop 2024 · Lot 25-BUR-002", "Cosecha 2024 · Lote 25-BUR-002"],
    ],
    name: ["Premium Burley", "Burley premium"],
    text: [
      "Threshed Burley leaf, offered as a traceable 2 kg evaluation sample.",
      "Hoja de Burley despalillada, ofrecida como muestra de evaluación trazable de 2 kg.",
    ],
    cta: ["View Burley portfolio", "Ver portfolio de Burley"],
  },
] as const;

const TEXT = {
  en: {
    eyebrow: "AgroTabaco · Export Portfolio",
    title: "Argentine Tobacco for Export",
    lead: "Two origins, two traceable samples. Choose a product to see its full specifications, photos and how to request a sample.",
    print: "Print / PDF",
    why: [
      ["Argentine origin", "Grown and packed in Tucumán and Salta, Argentina."],
      ["Lot-level traceability", "Lot, carton number and date on every pack."],
      ["Samples on request", "Volumes, pricing and Incoterms provided on request."],
    ],
    contact: "Contact",
    contactTitle: "Request samples and commercial terms",
    contactText: "Write to us and we will reply with the full documentation.",
    mailSubject: "Export Portfolio — Argentine tobacco",
    waText: "Hello, I would like to request information about AgroTabaco’s export tobacco portfolio.",
    footer: "Specifications are taken from each sample pack label and are indicative. Final terms are subject to commercial agreement and the corresponding quality documentation.",
  },
  es: {
    eyebrow: "AgroTabaco · Portfolio de exportación",
    title: "Tabaco argentino para exportación",
    lead: "Dos orígenes, dos muestras trazables. Elija un producto para ver sus especificaciones completas, fotos y cómo solicitar una muestra.",
    print: "Imprimir / PDF",
    why: [
      ["Origen argentino", "Cultivado y empacado en Tucumán y Salta, Argentina."],
      ["Trazabilidad por lote", "Lote, número de cartón y fecha en cada paquete."],
      ["Muestras bajo consulta", "Volúmenes, precios e Incoterms se informan bajo consulta."],
    ],
    contact: "Contacto",
    contactTitle: "Solicite muestras y condiciones comerciales",
    contactText: "Escríbanos y le responderemos con la documentación completa.",
    mailSubject: "Portfolio de exportación — Tabaco argentino",
    waText: "Hola, quisiera solicitar información sobre el portfolio de tabaco de exportación de AgroTabaco.",
    footer: "Las especificaciones provienen de la etiqueta de cada paquete de muestra y son indicativas. Las condiciones finales quedan sujetas al acuerdo comercial y a la documentación de calidad correspondiente.",
  },
} as const;

export function ExportPortfolio({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const t = TEXT[lang];
  const i = lang === "en" ? 0 : 1;
  const langQuery = lang === "es" ? "?lang=es" : "";

  return (
    <div lang={lang}>
      {/* Barra de acciones (no se imprime) */}
      <div className="border-b bg-card print:hidden">
        <div className="container mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.eyebrow}</span>
          <div className="flex items-center gap-2">
            <div className="flex overflow-hidden rounded-md border text-xs font-semibold" role="group" aria-label="Language">
              {(["en", "es"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={lang === l}
                  onClick={() => setLang(l)}
                  className={cn(
                    "px-3 py-1.5 transition-colors",
                    lang === l ? "bg-brand-green-dark text-white" : "text-brand-green-dark hover:bg-muted"
                  )}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold text-brand-green-dark transition-colors hover:bg-muted"
            >
              <Printer className="size-3.5" />
              {t.print}
            </button>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-green-darker via-brand-green-dark to-brand-green-light/80 text-white">
        <div className="container mx-auto max-w-6xl space-y-5 px-4 py-14 sm:px-6 lg:px-8 lg:py-20 print:py-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-gold">
            <ShieldCheck className="size-4" />
            {t.eyebrow}
          </div>
          <h1 className="max-w-3xl text-balance font-serif text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {t.title}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-emerald-100/90 sm:text-lg">{t.lead}</p>
        </div>
      </section>

      {/* Productos */}
      <section className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {PRODUCTS.map((p) => (
            <article key={p.key} className="flex flex-col overflow-hidden rounded-2xl border bg-card shadow-md">
              <div className="relative aspect-[1200/630] w-full bg-muted">
                <Image
                  src={p.image}
                  alt={`${p.name[0]} sample`}
                  fill
                  sizes="(max-width: 768px) 100vw, 560px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="space-y-2">
                  <h2 className="font-serif text-2xl font-bold text-brand-green-dark">{p.name[i]}</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">{p.text[i]}</p>
                </div>
                <ul className="space-y-1.5 text-sm">
                  {p.facts.map((fact) => (
                    <li key={fact[0]} className="flex items-center gap-2 text-foreground/85">
                      <MapPin className="size-3.5 shrink-0 text-brand-gold" />
                      {fact[i]}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`${p.href}${langQuery}`}
                  className="mt-auto inline-flex items-center justify-center gap-2 rounded-md bg-brand-green-dark px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-green-darker"
                >
                  {p.cta[i]}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Por qué */}
      <section className="border-y bg-muted/40">
        <div className="container mx-auto grid max-w-6xl gap-5 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
          {t.why.map(([title, text]) => (
            <div key={title} className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-brand-green-dark">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contacto */}
      <section id="contact" className="container mx-auto max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid items-center gap-8 rounded-2xl bg-gradient-to-br from-brand-green-darker to-brand-green-dark p-6 text-white shadow-xl sm:p-10 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-7">
            <div className="text-xs font-bold uppercase tracking-widest text-brand-gold">{t.contact}</div>
            <h2 className="font-serif text-2xl font-bold sm:text-3xl">{t.contactTitle}</h2>
            <p className="text-emerald-100/90">{t.contactText}</p>
          </div>
          <div className="flex flex-col gap-3 lg:col-span-5">
            <a
              href={`mailto:${EMAIL}?subject=${encodeURIComponent(t.mailSubject)}`}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-gold px-5 py-3 text-sm font-semibold text-brand-green-darker shadow-md transition-opacity hover:opacity-90"
            >
              <Mail className="size-4" />
              {EMAIL}
            </a>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(t.waText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/30 px-5 py-3 text-sm font-semibold transition-colors hover:bg-white/10"
            >
              <MessageSquare className="size-4" />
              WhatsApp {WA_DISPLAY}
            </a>
          </div>
        </div>
        <p className="mt-6 max-w-4xl text-xs leading-relaxed text-muted-foreground">{t.footer}</p>
        <p className="mt-2 text-xs text-muted-foreground">© 2026 AgroTabaco</p>
      </section>
    </div>
  );
}

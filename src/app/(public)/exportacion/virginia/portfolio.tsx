"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ArrowRight,
  Award,
  CalendarDays,
  FlaskConical,
  Globe,
  Leaf,
  Mail,
  MapPin,
  MessageSquare,
  PackageCheck,
  Printer,
  QrCode,
  ShieldCheck,
  Factory,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type Lang = "en" | "es";

const WA_NUMBER = "5491166814208";
const WA_DISPLAY = "+54 9 11 6681-4208";
const EMAIL = "institucional@agrotabaco.com";

const MAGYP_URL =
  "https://www.magyp.gob.ar/sitio/areas/tabaco/produccion_mercados/interno/_archivos/000000_Acopio/000021_Campaña%202020-21/000019_Acopio%20-%20Anuario%202020-2021.pdf";
const LANACION_URL =
  "https://www.lanacion.com.ar/economia/comercio-exterior/tabaco-pese-a-las-restricciones-para-fumar-el-mercado-mundial-crece-pero-la-argentina-pierde-nid05012023/";

// La ficha técnica reproduce lo impreso en la etiqueta de la muestra. Las cifras
// del sector son públicas y llevan su fuente al pie.
const TEXT = {
  en: {
    eyebrow: "Export Portfolio · No. 02",
    title: "Premium Virginia Tobacco from Salta, Argentina",
    lead: "Flue-cured Virginia leaf, crop 2026, offered to importers, embassies and consulates as a traceable evaluation sample (Lot 20/03/2026).",
    variety: "Variety",
    crop: "Crop",
    grade: "Grade",
    nicotine: "Nicotine",
    requestSample: "Request a sample",
    viewSpecs: "View specifications",
    print: "Print / PDF",
    sheet: "Technical data sheet",
    specsTitle: "Lot 20/03/2026 specifications",
    specsLead: "Information as printed on the export label of the sample pack.",
    photoCaption: "Lot 20/03/2026 — 2 kg sample pack with export label.",
    labelTitle: "Labelled for traceability",
    labelText:
      "Every pack carries its origin, lot, carton number and label date, so each shipment can be traced back to its source.",
    glance: "At a glance",
    glanceTitle: "What importers should know",
    cards: [
      {
        title: "Argentine origin",
        text: "Grown and packed in Salta, Argentina — labelled “Producto de Salta – Argentina”.",
      },
      {
        title: "Top quality class",
        text: "Graded B1F, the highest class for Virginia on Argentina’s official quality scale.",
      },
      {
        title: "Sample for evaluation",
        text: "A 2 kg sample of flue-cured Virginia from the 2026 crop is available for your own assessment.",
      },
    ],
    sectorTag: "Argentine Virginia",
    sectorTitle: "A major, established origin",
    sectorNote: "Public figures, campaign 2020-21 unless stated otherwise.",
    stats: [
      { value: "37.5 M kg", text: "Virginia purchased in Salta — the first producing province in Argentina." },
      { value: "67.8 %", text: "of the national tobacco purchase was Virginia (66.4 M kg of 97.9 M kg)." },
      { value: "~80 %", text: "of Argentina’s tobacco output (about 100 M kg a year) is exported." },
    ],
    sourcesTitle: "Sources",
    sources: [
      ["Ministerio de Agricultura — Acopio, Anuario 2020-2021", MAGYP_URL],
      ["La Nación — Tabaco: el mercado mundial crece pero la Argentina pierde competitividad", LANACION_URL],
    ],
    contact: "Contact",
    contactTitle: "Request samples and commercial terms",
    contactText:
      "Volumes, pricing and Incoterms are provided on request. Write to us and we will reply with the full documentation.",
    mailSubject: "Export Portfolio No. 02 — Virginia, lot 20/03/2026",
    waText:
      "Hello, I would like to request information and a sample of Virginia tobacco, lot 20/03/2026 (Export Portfolio No. 02).",
    disclaimer:
      "Sample specifications are taken from the sample pack label and are indicative. Sector figures come from the public sources listed above. Final terms are subject to commercial agreement and the corresponding quality documentation.",
    footer: "Export Portfolio No. 02 · Virginia, Lot 20/03/2026",
    rows: [
      ["Product", "Premium Virginia (flue-cured) Tobacco Sample"],
      ["Origin", "Salta, Argentina"],
      ["Variety", "Virginia"],
      ["Grade", "B1F"],
      ["Form", "Flue-cured in heated barns"],
      ["Crop year", "2026"],
      ["Lot", "20/03/2026"],
      ["Carton No.", "160"],
      ["Nicotine", "2.8 %"],
      ["Sample weight", "2 kg"],
      ["Label date", "20/03/2026"],
    ],
  },
  es: {
    eyebrow: "Portfolio de exportación · N.º 02",
    title: "Tabaco Virginia premium de Salta, Argentina",
    lead: "Hoja de Virginia curada en estufa (flue-cured), cosecha 2026, ofrecida a importadores, embajadas y consulados como muestra de evaluación trazable (Lote 20/03/2026).",
    variety: "Variedad",
    crop: "Cosecha",
    grade: "Grado",
    nicotine: "Nicotina",
    requestSample: "Solicitar una muestra",
    viewSpecs: "Ver especificaciones",
    print: "Imprimir / PDF",
    sheet: "Ficha técnica",
    specsTitle: "Especificaciones del lote 20/03/2026",
    specsLead: "Información tal como figura en la etiqueta de exportación del paquete de muestra.",
    photoCaption: "Lote 20/03/2026 — paquete de muestra de 2 kg con etiqueta de exportación.",
    labelTitle: "Etiquetado para trazabilidad",
    labelText:
      "Cada paquete lleva su origen, lote, número de cartón y fecha de etiqueta, de modo que cada envío puede rastrearse hasta su origen.",
    glance: "En síntesis",
    glanceTitle: "Lo que deben saber los importadores",
    cards: [
      {
        title: "Origen argentino",
        text: "Cultivado y empacado en Salta, Argentina — etiquetado “Producto de Salta – Argentina”.",
      },
      {
        title: "Clase de máxima calidad",
        text: "Grado B1F, la clase más alta para Virginia en la escala oficial de calidad de Argentina.",
      },
      {
        title: "Muestra para evaluación",
        text: "Hay disponible una muestra de 2 kg de Virginia flue-cured de la cosecha 2026 para su propia evaluación.",
      },
    ],
    sectorTag: "Virginia argentino",
    sectorTitle: "Un origen importante y consolidado",
    sectorNote: "Cifras públicas, campaña 2020-21 salvo indicación contraria.",
    stats: [
      { value: "37,5 M kg", text: "de Virginia acopiado en Salta — la primera provincia productora de Argentina." },
      { value: "67,8 %", text: "del acopio nacional de tabaco fue Virginia (66,4 M kg de 97,9 M kg)." },
      { value: "~80 %", text: "de la producción tabacalera argentina (unos 100 M kg al año) se exporta." },
    ],
    sourcesTitle: "Fuentes",
    sources: [
      ["Ministerio de Agricultura — Acopio, Anuario 2020-2021", MAGYP_URL],
      ["La Nación — Tabaco: el mercado mundial crece pero la Argentina pierde competitividad", LANACION_URL],
    ],
    contact: "Contacto",
    contactTitle: "Solicite muestras y condiciones comerciales",
    contactText:
      "Volúmenes, precios e Incoterms se informan bajo consulta. Escríbanos y le responderemos con la documentación completa.",
    mailSubject: "Portfolio de exportación N.º 02 — Virginia, lote 20/03/2026",
    waText:
      "Hola, quisiera solicitar información y una muestra de tabaco Virginia, lote 20/03/2026 (Portfolio de exportación N.º 02).",
    disclaimer:
      "Las especificaciones de la muestra provienen de la etiqueta del paquete y son indicativas. Las cifras del sector provienen de las fuentes públicas indicadas. Las condiciones finales quedan sujetas al acuerdo comercial y a la documentación de calidad correspondiente.",
    footer: "Portfolio de exportación N.º 02 · Virginia, Lote 20/03/2026",
    rows: [
      ["Producto", "Muestra de tabaco Virginia (flue-cured) premium"],
      ["Origen", "Salta, Argentina"],
      ["Variedad", "Virginia"],
      ["Grado", "B1F"],
      ["Presentación", "Curado en estufa (flue-cured)"],
      ["Cosecha", "2026"],
      ["Lote", "20/03/2026"],
      ["N.º de cartón", "160"],
      ["Nicotina", "2,8 %"],
      ["Peso de la muestra", "2 kg"],
      ["Fecha de etiqueta", "20/03/2026"],
    ],
  },
} as const;

const CARD_ICONS = [MapPin, Award, PackageCheck];
const STAT_ICONS = [MapPin, Factory, Globe];

export function VirginiaPortfolio({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const t = TEXT[lang];

  const highlights = [
    { icon: Leaf, label: t.variety, value: "Virginia" },
    { icon: CalendarDays, label: t.crop, value: "2026" },
    { icon: Award, label: t.grade, value: "B1F" },
    { icon: FlaskConical, label: t.nicotine, value: lang === "en" ? "2.8 %" : "2,8 %" },
  ];

  return (
    <div lang={lang}>
      {/* Barra de acciones (no se imprime) */}
      <div className="border-b bg-card print:hidden">
        <div className="container mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t.eyebrow}
          </span>
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
                    lang === l
                      ? "bg-brand-green-dark text-white"
                      : "text-brand-green-dark hover:bg-muted"
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
      <section className="relative overflow-hidden text-white">
        <Image
          src="/images/exportacion/virginia-texture.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-green-darker/95 to-brand-green-dark/85" />
        <div className="relative container mx-auto max-w-6xl space-y-6 px-4 py-14 sm:px-6 lg:px-8 lg:py-20 print:py-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-gold">
            <ShieldCheck className="size-4" />
            {t.eyebrow}
          </div>
          <h1 className="max-w-3xl text-balance font-serif text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {t.title}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-emerald-100/90 sm:text-lg">{t.lead}</p>

          <div className="grid max-w-3xl grid-cols-2 gap-3 lg:grid-cols-4">
            {highlights.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/10 px-4 py-3">
                <Icon className="size-5 shrink-0 text-brand-gold" />
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-100/80">{label}</div>
                  <div className="font-semibold">{value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-1 print:hidden">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-md bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-green-darker shadow-md transition-opacity hover:opacity-90"
            >
              {t.requestSample}
              <ArrowRight className="size-4" />
            </a>
            <a
              href="#specs"
              className="inline-flex items-center rounded-md border border-white/30 px-6 py-3 text-sm font-semibold transition-colors hover:bg-white/10"
            >
              {t.viewSpecs}
            </a>
          </div>
        </div>
      </section>

      {/* Ficha técnica */}
      <section id="specs" className="container mx-auto max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid items-start gap-10 lg:grid-cols-12">
          <figure className="overflow-hidden rounded-xl border bg-card shadow-lg lg:col-span-5">
            <Image
              src="/images/exportacion/virginia-sample.jpg"
              alt="2 kg sample pack of Premium Virginia tobacco, crop 2026, with export label"
              width={1100}
              height={1476}
              sizes="(max-width: 1024px) 100vw, 480px"
              className="h-auto w-full"
            />
            <figcaption className="px-4 py-3 text-xs text-muted-foreground">{t.photoCaption}</figcaption>
          </figure>

          <div className="space-y-6 lg:col-span-7">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-gold">
                <ShieldCheck className="size-4" />
                {t.sheet}
              </div>
              <h2 className="font-serif text-2xl font-bold text-brand-green-dark sm:text-3xl">{t.specsTitle}</h2>
              <p className="text-sm text-muted-foreground">{t.specsLead}</p>
            </div>

            <dl className="divide-y overflow-hidden rounded-xl border bg-card shadow-sm">
              {t.rows.map(([label, value]) => (
                <div key={label} className="grid grid-cols-5 gap-3 px-4 py-3">
                  <dt className="col-span-2 self-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="col-span-3 font-semibold text-brand-green-dark">{value}</dd>
                </div>
              ))}
            </dl>

            <figure className="grid items-center gap-4 rounded-xl border bg-muted/40 p-4 sm:grid-cols-5">
              <Image
                src="/images/exportacion/virginia-sample-label.jpg"
                alt="Export label of the Virginia sample, lot 20/03/2026"
                width={800}
                height={992}
                sizes="(max-width: 640px) 100vw, 220px"
                className="h-auto w-full rounded-lg shadow-md sm:col-span-2"
              />
              <figcaption className="space-y-1 text-sm text-muted-foreground sm:col-span-3">
                <strong className="flex items-center gap-2 text-base text-brand-green-dark">
                  <QrCode className="size-4 text-brand-gold" />
                  {t.labelTitle}
                </strong>
                {t.labelText}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* En síntesis */}
      <section className="border-y bg-muted/40">
        <div className="container mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="space-y-1.5">
            <div className="text-xs font-bold uppercase tracking-wider text-brand-gold">{t.glance}</div>
            <h2 className="font-serif text-2xl font-bold text-brand-green-dark sm:text-3xl">{t.glanceTitle}</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {t.cards.map((card, i) => {
              const Icon = CARD_ICONS[i];
              return (
                <div key={card.title} className="space-y-3 rounded-xl border bg-card p-6 shadow-sm">
                  <div className="flex size-11 items-center justify-center rounded-lg bg-brand-green-dark text-brand-gold">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-brand-green-dark">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{card.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cifras del sector */}
      <section className="container mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="space-y-1.5">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-gold">{t.sectorTag}</div>
          <h2 className="font-serif text-2xl font-bold text-brand-green-dark sm:text-3xl">{t.sectorTitle}</h2>
          <p className="text-sm text-muted-foreground">{t.sectorNote}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {t.stats.map((stat, i) => {
            const Icon = STAT_ICONS[i];
            return (
              <div key={stat.value} className="space-y-3 rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex size-11 items-center justify-center rounded-lg bg-brand-green-dark text-brand-gold">
                  <Icon className="size-6" />
                </div>
                <div className="font-serif text-3xl font-extrabold text-brand-green-dark">{stat.value}</div>
                <p className="text-sm leading-relaxed text-muted-foreground">{stat.text}</p>
              </div>
            );
          })}
        </div>
        <div className="text-xs text-muted-foreground">
          <span className="font-semibold">{t.sourcesTitle}: </span>
          {t.sources.map(([label, href], i) => (
            <span key={href}>
              {i > 0 && " · "}
              <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-brand-green-dark">
                {label}
              </a>
            </span>
          ))}
        </div>
      </section>

      {/* Contacto */}
      <section id="contact" className="container mx-auto max-w-6xl scroll-mt-20 px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
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

        <p className="mt-6 max-w-4xl text-xs leading-relaxed text-muted-foreground">{t.disclaimer}</p>
        <p className="mt-2 text-xs text-muted-foreground">© 2026 AgroTabaco · {t.footer}</p>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  ArrowRight,
  Award,
  CalendarDays,
  Factory,
  Globe,
  Leaf,
  Mail,
  MapPin,
  MessageSquare,
  PackageCheck,
  Printer,
  ShieldCheck,
  Sprout,
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

// Nada de lo que figura acá es un dato de lote: el portfolio presenta el
// perfil del producto con cifras públicas citadas, y deja los datos
// específicos (grado, lote, análisis) para cuando haya una muestra real.
const TEXT = {
  en: {
    eyebrow: "Export Portfolio · No. 02",
    title: "Virginia Flue-Cured Tobacco from Salta, Argentina",
    lead: "Product profile for importers, embassies and consulates. New-crop samples with full lot data and analysis are available on request.",
    type: "Type",
    origin: "Origin",
    topClass: "Top class",
    sample: "Sample",
    onRequest: "On request",
    requestSample: "Request a sample",
    viewProfile: "View product profile",
    print: "Print / PDF",
    sheet: "Product profile",
    profileTitle: "Virginia from Salta",
    profileLead:
      "Lot-level data (crop, grade, form, lot, analysis) is issued together with each sample, so every figure matches the pack you receive.",
    profileRows: [
      ["Product", "Virginia (flue-cured) tobacco"],
      ["Origin", "Salta, Argentina"],
      ["Curing", "Flue-cured in heated barns"],
      ["Argentine quality scale", "Highest class for Virginia: B1F"],
      ["Salta buying season", "January – May (peak: February – March)"],
    ],
    pendingLabel: "With each sample",
    pendingRows: ["Crop year", "Grade", "Form / packing", "Lot and carton No.", "Nicotine and sugars", "Sample weight"],
    pendingValue: "Issued with the sample",
    glance: "Argentine Virginia at a glance",
    glanceTitle: "A major, established origin",
    glanceNote: "Public figures, campaign 2020-21 unless stated otherwise.",
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
    steps: [
      { title: "Request", text: "Tell us your market, volume and the grade you are looking for." },
      { title: "Sample", text: "We send a new-crop sample with its lot data and analysis." },
      { title: "Terms", text: "Volumes, pricing and Incoterms are provided on request." },
    ],
    stepsTitle: "How to proceed",
    contact: "Contact",
    contactTitle: "Request samples and commercial terms",
    contactText: "Write to us and we will reply with the available samples and documentation.",
    mailSubject: "Export Portfolio No. 02 — Virginia from Salta",
    waText: "Hello, I would like to request information and a sample of Virginia tobacco from Salta (Export Portfolio No. 02).",
    disclaimer:
      "This document is a product profile, not a quotation. Sector figures come from the public sources listed above. Specifications of a given lot are those issued with its sample; final terms are subject to commercial agreement and the corresponding quality documentation.",
    footer: "Export Portfolio No. 02 · Virginia, Salta",
  },
  es: {
    eyebrow: "Portfolio de exportación · N.º 02",
    title: "Tabaco Virginia flue-cured de Salta, Argentina",
    lead: "Perfil de producto para importadores, embajadas y consulados. Hay muestras de la nueva cosecha, con los datos del lote y su análisis, disponibles bajo consulta.",
    type: "Tipo",
    origin: "Origen",
    topClass: "Clase superior",
    sample: "Muestra",
    onRequest: "Bajo consulta",
    requestSample: "Solicitar una muestra",
    viewProfile: "Ver perfil del producto",
    print: "Imprimir / PDF",
    sheet: "Perfil del producto",
    profileTitle: "Virginia de Salta",
    profileLead:
      "Los datos de cada lote (cosecha, grado, presentación, lote, análisis) se entregan junto con cada muestra, de modo que cada cifra coincide con el paquete que usted recibe.",
    profileRows: [
      ["Producto", "Tabaco Virginia (flue-cured)"],
      ["Origen", "Salta, Argentina"],
      ["Curado", "Curado en estufas (flue-cured)"],
      ["Escala de calidad argentina", "Clase más alta para Virginia: B1F"],
      ["Temporada de acopio en Salta", "Enero – mayo (pico: febrero – marzo)"],
    ],
    pendingLabel: "Con cada muestra",
    pendingRows: ["Año de cosecha", "Grado", "Presentación / empaque", "N.º de lote y de cartón", "Nicotina y azúcares", "Peso de la muestra"],
    pendingValue: "Se entrega con la muestra",
    glance: "El Virginia argentino en síntesis",
    glanceTitle: "Un origen importante y consolidado",
    glanceNote: "Cifras públicas, campaña 2020-21 salvo indicación contraria.",
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
    steps: [
      { title: "Consulta", text: "Indíquenos su mercado, el volumen y el grado que busca." },
      { title: "Muestra", text: "Enviamos una muestra de la nueva cosecha con los datos de su lote y su análisis." },
      { title: "Condiciones", text: "Volúmenes, precios e Incoterms se informan bajo consulta." },
    ],
    stepsTitle: "Cómo avanzar",
    contact: "Contacto",
    contactTitle: "Solicite muestras y condiciones comerciales",
    contactText: "Escríbanos y le responderemos con las muestras y la documentación disponibles.",
    mailSubject: "Portfolio de exportación N.º 02 — Virginia de Salta",
    waText: "Hola, quisiera solicitar información y una muestra de tabaco Virginia de Salta (Portfolio de exportación N.º 02).",
    disclaimer:
      "Este documento es un perfil de producto, no una cotización. Las cifras del sector provienen de las fuentes públicas indicadas. Las especificaciones de cada lote son las que se entregan con su muestra; las condiciones finales quedan sujetas al acuerdo comercial y a la documentación de calidad correspondiente.",
    footer: "Portfolio de exportación N.º 02 · Virginia, Salta",
  },
} as const;

const STAT_ICONS = [MapPin, Factory, Globe];
const STEP_ICONS = [Sprout, PackageCheck, Award];

export function VirginiaPortfolio({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const t = TEXT[lang];

  const highlights = [
    { icon: Leaf, label: t.type, value: "Virginia" },
    { icon: MapPin, label: t.origin, value: "Salta, AR" },
    { icon: Award, label: t.topClass, value: "B1F" },
    { icon: CalendarDays, label: t.sample, value: t.onRequest },
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
      <section className="bg-gradient-to-br from-brand-green-darker via-brand-green-dark to-brand-green-light/80 text-white">
        <div className="container mx-auto max-w-6xl space-y-6 px-4 py-14 sm:px-6 lg:px-8 lg:py-20 print:py-8">
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
              href="#profile"
              className="inline-flex items-center rounded-md border border-white/30 px-6 py-3 text-sm font-semibold transition-colors hover:bg-white/10"
            >
              {t.viewProfile}
            </a>
          </div>
        </div>
      </section>

      {/* Perfil del producto */}
      <section id="profile" className="container mx-auto max-w-4xl scroll-mt-20 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="space-y-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-gold">
              <ShieldCheck className="size-4" />
              {t.sheet}
            </div>
            <h2 className="font-serif text-2xl font-bold text-brand-green-dark sm:text-3xl">{t.profileTitle}</h2>
            <p className="text-sm text-muted-foreground">{t.profileLead}</p>
          </div>

          <dl className="divide-y overflow-hidden rounded-xl border bg-card shadow-sm">
            {t.profileRows.map(([label, value]) => (
              <div key={label} className="grid grid-cols-5 gap-3 px-4 py-3">
                <dt className="col-span-2 self-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {label}
                </dt>
                <dd className="col-span-3 font-semibold text-brand-green-dark">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="rounded-xl border border-dashed bg-muted/40 p-4">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {t.pendingLabel}
            </div>
            <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {t.pendingRows.map((label) => (
                <div key={label} className="flex items-baseline justify-between gap-3 border-b border-border/60 py-1.5 text-sm">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="text-xs font-medium text-brand-green-dark">{t.pendingValue}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* En síntesis */}
      <section className="border-y bg-muted/40">
        <div className="container mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="space-y-1.5">
            <div className="text-xs font-bold uppercase tracking-wider text-brand-gold">{t.glance}</div>
            <h2 className="font-serif text-2xl font-bold text-brand-green-dark sm:text-3xl">{t.glanceTitle}</h2>
            <p className="text-sm text-muted-foreground">{t.glanceNote}</p>
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
        </div>
      </section>

      {/* Cómo avanzar */}
      <section className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <h2 className="mb-6 font-serif text-2xl font-bold text-brand-green-dark sm:text-3xl">{t.stepsTitle}</h2>
        <ol className="grid gap-5 md:grid-cols-3">
          {t.steps.map((step, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <li key={step.title} className="flex gap-4 rounded-xl border bg-card p-5 shadow-sm">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-green-dark text-brand-gold">
                  <Icon className="size-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">0{i + 1}</div>
                  <h3 className="font-serif text-lg font-bold text-brand-green-dark">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
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

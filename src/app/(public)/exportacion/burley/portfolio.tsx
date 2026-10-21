"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ArrowRight,
  Award,
  CalendarDays,
  FlaskConical,
  Leaf,
  Mail,
  MapPin,
  MessageSquare,
  PackageCheck,
  Printer,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type Lang = "en" | "es";

const WA_NUMBER = "5491166814208";
const WA_DISPLAY = "+54 9 11 6681-4208";
const EMAIL = "institucional@agrotabaco.com";

const TEXT = {
  en: {
    eyebrow: "Export Portfolio · No. 01",
    title: "Premium Burley Tobacco from Tucumán, Argentina",
    lead: "Threshed Burley leaf, crop 2024, offered to importers, embassies and consulates as a traceable evaluation sample (Lot 25-BUR-002).",
    variety: "Variety",
    crop: "Crop",
    grade: "Grade",
    nicotine: "Nicotine",
    requestSample: "Request a sample",
    viewSpecs: "View specifications",
    print: "Print / PDF",
    sheet: "Technical data sheet",
    specsTitle: "Lot 25-BUR-002 specifications",
    specsLead: "Information as printed on the export label of the sample pack.",
    photoCaption: "Lot 25-BUR-002 — sealed 2 kg sample pack with export label.",
    labelTitle: "Labelled for traceability",
    labelText:
      "Every pack carries its origin, lot, carton number and label date, so each shipment can be traced back to its source.",
    glance: "At a glance",
    glanceTitle: "What importers should know",
    cards: [
      {
        title: "Argentine origin",
        text: "Grown and packed in Tucumán, Argentina — labelled “Producto de Tucumán – Argentina”.",
      },
      {
        title: "Lot-level traceability",
        text: "Lot number, carton number and date are recorded on every pack.",
      },
      {
        title: "Sample for evaluation",
        text: "A 2 kg sealed sample of threshed Burley is available for your own assessment.",
      },
    ],
    contact: "Contact",
    contactTitle: "Request samples and commercial terms",
    contactText:
      "Volumes, pricing and Incoterms are provided on request. Write to us and we will reply with the full documentation.",
    mailSubject: "Export Portfolio No. 01 — Burley lot 25-BUR-002",
    waText:
      "Hello, I would like to request information and a sample of Burley lot 25-BUR-002 (Export Portfolio No. 01).",
    disclaimer:
      "Specifications are taken from the sample pack label and are indicative. Final terms are subject to commercial agreement and the corresponding quality documentation.",
    footer: "Export Portfolio No. 01 · Lot 25-BUR-002",
    rows: [
      ["Product", "Premium Burley Tobacco Sample"],
      ["Origin", "Argentina – Tucumán"],
      ["Variety", "Burley"],
      ["Grade", "C B12FLR"],
      ["Form", "Threshed – C4BR200kg"],
      ["Crop year", "2024"],
      ["Lot", "25-BUR-002"],
      ["Carton No.", "160"],
      ["Nicotine", "2.8 %"],
      ["Sample weight", "2 kg"],
      ["Label date", "13/08/2026"],
    ],
  },
  es: {
    eyebrow: "Portfolio de exportación · N.º 01",
    title: "Tabaco Burley premium de Tucumán, Argentina",
    lead: "Hoja de Burley despalillada, cosecha 2024, ofrecida a importadores, embajadas y consulados como muestra de evaluación trazable (Lote 25-BUR-002).",
    variety: "Variedad",
    crop: "Cosecha",
    grade: "Grado",
    nicotine: "Nicotina",
    requestSample: "Solicitar una muestra",
    viewSpecs: "Ver especificaciones",
    print: "Imprimir / PDF",
    sheet: "Ficha técnica",
    specsTitle: "Especificaciones del lote 25-BUR-002",
    specsLead: "Información tal como figura en la etiqueta de exportación del paquete de muestra.",
    photoCaption: "Lote 25-BUR-002 — paquete sellado de 2 kg con etiqueta de exportación.",
    labelTitle: "Etiquetado para trazabilidad",
    labelText:
      "Cada paquete lleva su origen, lote, número de cartón y fecha de etiqueta, de modo que cada envío puede rastrearse hasta su origen.",
    glance: "En síntesis",
    glanceTitle: "Lo que deben saber los importadores",
    cards: [
      {
        title: "Origen argentino",
        text: "Cultivado y empacado en Tucumán, Argentina — etiquetado “Producto de Tucumán – Argentina”.",
      },
      {
        title: "Trazabilidad por lote",
        text: "El número de lote, el de cartón y la fecha se registran en cada paquete.",
      },
      {
        title: "Muestra para evaluación",
        text: "Hay disponible una muestra sellada de 2 kg de Burley despalillado para su propia evaluación.",
      },
    ],
    contact: "Contacto",
    contactTitle: "Solicite muestras y condiciones comerciales",
    contactText:
      "Volúmenes, precios e Incoterms se informan bajo consulta. Escríbanos y le responderemos con la documentación completa.",
    mailSubject: "Portfolio de exportación N.º 01 — Burley lote 25-BUR-002",
    waText:
      "Hola, quisiera solicitar información y una muestra del Burley lote 25-BUR-002 (Portfolio de exportación N.º 01).",
    disclaimer:
      "Las especificaciones provienen de la etiqueta del paquete de muestra y son indicativas. Las condiciones finales quedan sujetas al acuerdo comercial y a la documentación de calidad correspondiente.",
    footer: "Portfolio de exportación N.º 01 · Lote 25-BUR-002",
    rows: [
      ["Producto", "Muestra de tabaco Burley premium"],
      ["Origen", "Argentina – Tucumán"],
      ["Variedad", "Burley"],
      ["Grado", "C B12FLR"],
      ["Presentación", "Despalillado (threshed) – C4BR200kg"],
      ["Cosecha", "2024"],
      ["Lote", "25-BUR-002"],
      ["N.º de cartón", "160"],
      ["Nicotina", "2,8 %"],
      ["Peso de la muestra", "2 kg"],
      ["Fecha de etiqueta", "13/08/2026"],
    ],
  },
} as const;

const CARD_ICONS = [MapPin, QrCode, PackageCheck];

export function BurleyPortfolio({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const t = TEXT[lang];

  const highlights = [
    { icon: Leaf, label: t.variety, value: "Burley" },
    { icon: CalendarDays, label: t.crop, value: "2024" },
    { icon: Award, label: t.grade, value: "C B12FLR" },
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
          src="/images/exportacion/burley-texture.jpg"
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
              src="/images/exportacion/burley-25-bur-002.jpg"
              alt="Sealed 2 kg pack of Premium Burley tobacco, lot 25-BUR-002"
              width={1100}
              height={1588}
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
                src="/images/exportacion/burley-25-bur-002-label.jpg"
                alt="Export label of lot 25-BUR-002"
                width={800}
                height={1100}
                sizes="(max-width: 640px) 100vw, 220px"
                className="h-auto w-full rounded-lg shadow-md sm:col-span-2"
              />
              <figcaption className="space-y-1 text-sm text-muted-foreground sm:col-span-3">
                <strong className="block text-base text-brand-green-dark">{t.labelTitle}</strong>
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

        <p className="mt-6 max-w-4xl text-xs leading-relaxed text-muted-foreground">{t.disclaimer}</p>
        <p className="mt-2 text-xs text-muted-foreground">© 2026 AgroTabaco · {t.footer}</p>
      </section>
    </div>
  );
}

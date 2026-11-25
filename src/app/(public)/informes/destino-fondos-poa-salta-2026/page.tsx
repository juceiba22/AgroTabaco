import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Download, FileText, Landmark } from "lucide-react";
import {
  DESTINATARIOS,
  RESOLUCIONES,
  RESOLUCION_POR_ID,
  RES_172_ACTIVIDADES,
  TOTAL,
  fmtMillones,
  fmtPct,
  fmtPesos,
  type Resolucion,
} from "@/lib/informes/poa-salta-2026";

const TITLE = "Destino de los fondos POA · Salta 2026";
const DESCRIPTION =
  "Cómo se distribuyen los $ 126.388 M de las 15 resoluciones POA 2026 de la SAGyP para la Provincia de Salta, por entidad receptora y por resolución.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/informes/destino-fondos-poa-salta-2026" },
  openGraph: {
    type: "article",
    title: `${TITLE} | AgroTabaco`,
    description: DESCRIPTION,
    url: "/informes/destino-fondos-poa-salta-2026",
    siteName: "AgroTabaco",
  },
};

export default function DestinoFondosPoaSalta2026Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/informes"
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-olive hover:text-brand-green-dark print:hidden"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Informes
      </Link>

      {/* Encabezado */}
      <header className="relative overflow-hidden rounded-2xl border border-brand-gold/30 bg-gradient-to-br from-[#0d1f15] via-[#132a1e] to-[#1a3b2b] p-6 text-white shadow-xl sm:p-9">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold uppercase tracking-wider text-brand-gold">
          <span>Informe · Fondo Especial del Tabaco</span>
          <span className="font-mono text-white/80">25/11/2026</span>
        </div>
        <h1 className="mt-3 font-serif text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
          {TITLE}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-emerald-100/90 sm:text-base">
          Resoluciones de la SAGyP del año 2026 para la Provincia de Salta. La{" "}
          <strong className="text-white">Cámara del Tabaco de Salta</strong> recibe la totalidad
          de los fondos, distribuidos según destino. No incluye el “precio FET”, que se paga
          directo a los productores.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/15 pt-4 text-xs sm:grid-cols-4 sm:gap-4 sm:text-sm">
          <HeaderStat label="Provincia" value="Salta" />
          <HeaderStat label="Resoluciones" value={`${RESOLUCIONES.length} POA 2026`} />
          <HeaderStat label="Receptor" value="Cámara del Tabaco" />
          <HeaderStat label="Fuente" value="SAGyP · magyp.gob.ar" />
        </div>
      </header>

      {/* KPIs */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs sm:col-span-2 lg:col-span-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Total de fondos · Cámara del Tabaco de Salta
              </span>
              <p className="mt-1 font-serif text-3xl font-bold tabular-nums text-brand-green-dark sm:text-4xl">
                {fmtMillones(TOTAL)}
              </p>
              <p className="text-xs text-muted-foreground tabular-nums">
                {fmtPesos(TOTAL)} · 100,00 %
              </p>
            </div>
          </div>
          {/* Barra de distribución */}
          <div
            className="mt-5 flex h-4 w-full overflow-hidden rounded-full bg-surface-container"
            role="img"
            aria-label="Distribución de fondos por entidad receptora"
          >
            {DESTINATARIOS.map((d) => (
              <div
                key={d.sigla}
                style={{ width: `${d.pct}%`, backgroundColor: d.color }}
                title={`${d.sigla}: ${fmtPct(d.pct)}`}
              />
            ))}
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
            {DESTINATARIOS.map((d) => (
              <li key={d.sigla} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: d.color }} />
                {d.sigla}
                <span className="font-semibold tabular-nums text-foreground">{fmtPct(d.pct)}</span>
              </li>
            ))}
          </ul>
        </div>

        {DESTINATARIOS.map((d) => (
          <div
            key={d.sigla}
            className="rounded-xl border border-border bg-card p-5 shadow-xs"
            style={{ borderTop: `3px solid ${d.color}` }}
          >
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {d.sigla}
            </span>
            <p className="mt-1 text-2xl font-bold tabular-nums text-brand-green-dark">
              {fmtMillones(d.monto)}
            </p>
            <p className="text-xs text-muted-foreground">{fmtPct(d.pct)} del total</p>
          </div>
        ))}
      </section>

      {/* Distribución por destino */}
      <Section
        icon={<Landmark className="h-5 w-5" />}
        title="Distribución por destino"
        subtitle="Hacé clic en el número de resolución para descargar el PDF."
      >
        <TableWrap>
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr>
                <Th>Destino según la resolución</Th>
                <Th>Resolución (PDF)</Th>
                <Th num>Monto</Th>
                <Th num>%</Th>
              </tr>
            </thead>
            <tbody>
              {DESTINATARIOS.map((d) => (
                <Grupo key={d.sigla} d={d} />
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-brand-green-dark text-white">
                <td className="px-4 py-3 font-bold">Total · Cámara del Tabaco de Salta</td>
                <td />
                <td className="px-4 py-3 text-right font-bold tabular-nums whitespace-nowrap">
                  {fmtPesos(TOTAL)}
                </td>
                <td className="px-4 py-3 text-right font-bold tabular-nums whitespace-nowrap">
                  100,00 %
                </td>
              </tr>
            </tfoot>
          </table>
        </TableWrap>
      </Section>

      {/* Detalle por resolución */}
      <Section
        icon={<FileText className="h-5 w-5" />}
        title="Detalle por resolución"
        subtitle="Las 15 resoluciones en orden cronológico."
      >
        <TableWrap>
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr>
                <Th>Resolución (PDF)</Th>
                <Th>Fecha</Th>
                <Th>Subcomponente</Th>
                <Th num>Monto</Th>
              </tr>
            </thead>
            <tbody>
              {RESOLUCIONES.map((r) => (
                <tr key={r.id} className="border-t border-border align-top hover:bg-brand-cream/60">
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <ResLink r={r} />
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap font-mono text-xs text-muted-foreground">
                    {r.fecha}
                  </td>
                  <td className="px-4 py-2.5">{r.subcomponente}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums whitespace-nowrap">
                    {fmtPesos(r.monto)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Section>

      {/* Insumos y fertilizantes */}
      <Section
        icon={<AlertTriangle className="h-5 w-5" />}
        title="Fondos para insumos y fertilizantes"
        subtitle="De las 15 resoluciones de Salta 2026, solo una menciona fertilizantes o insumos en su texto, y ninguna tiene una partida específica para eso."
      >
        <TableWrap>
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr>
                <Th>Resolución (PDF)</Th>
                <Th>Tipo</Th>
                <Th>Qué dice</Th>
                <Th num>Monto</Th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border align-top">
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <ResLink r={RESOLUCION_POR_ID["172-2026"]} />
                </td>
                <td className="px-4 py-2.5">Fertilizantes (sin partida propia)</td>
                <td className="px-4 py-2.5">
                  Compensación general de producción: mano de obra, labores,{" "}
                  <strong>adquisición de fertilizantes</strong> y acondicionamiento de suelos
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums whitespace-nowrap">
                  {fmtMillones(RESOLUCION_POR_ID["172-2026"].monto)}
                </td>
              </tr>
            </tbody>
          </table>
        </TableWrap>

        <div className="mt-8 rounded-xl border border-brand-gold/40 bg-[#F7F1E2] p-5 text-sm text-[#4a3a14]">
          <h3 className="flex flex-wrap items-center gap-2 font-serif text-lg font-bold text-brand-green-dark">
            Resolución <ResLink r={RESOLUCION_POR_ID["172-2026"]} />: cómo se reparten los{" "}
            {fmtMillones(RESOLUCION_POR_ID["172-2026"].monto)}
          </h3>
          <p className="mt-1.5">
            El Artículo 2 menciona la adquisición de fertilizantes entre los destinos, pero el
            Artículo 3 no tiene una partida propia para fertilizantes: el monto se reparte por
            etapa del cultivo.
          </p>
          <ul className="mt-4 space-y-3">
            {RES_172_ACTIVIDADES.map((a) => (
              <li key={a.actividad}>
                <div className="flex flex-wrap items-baseline justify-between gap-2 text-[13px]">
                  <span className="font-medium text-foreground">{a.actividad}</span>
                  <span className="tabular-nums text-foreground">
                    {fmtPesos(a.monto)}{" "}
                    <span className="ml-1 font-bold text-brand-green-dark">{fmtPct(a.pct, 1)}</span>
                  </span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-white/70">
                  <div
                    className="h-2 rounded-full bg-brand-green-light"
                    style={{ width: `${a.pct}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <p className="mt-12 border-t border-border pt-4 text-xs text-muted-foreground">
        Fuente: resoluciones de POA publicadas por la Secretaría de Agricultura, Ganadería y Pesca
        (magyp.gob.ar). Montos tomados del Artículo 1 de cada resolución. Generado el 25/11/2026.
      </p>
    </div>
  );
}

function HeaderStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block text-[11px] uppercase tracking-wide text-white/60">{label}</span>
      <strong className="font-semibold text-white">{value}</strong>
    </div>
  );
}

function Section({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <div className="mb-4 flex items-start gap-3 border-b border-border pb-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green-dark text-brand-gold">
          {icon}
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-brand-green-dark sm:text-2xl">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
      {children}
    </div>
  );
}

function Th({ children, num }: { children: React.ReactNode; num?: boolean }) {
  return (
    <th
      className={`bg-surface-container-low px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-brand-olive ${
        num ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function ResLink({ r }: { r: Resolucion }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <a
        href={r.pdf}
        target="_blank"
        rel="noopener"
        title={`Descargar PDF de la Resolución ${r.id}`}
        className="inline-flex items-center gap-1 font-semibold text-brand-green-light underline decoration-brand-green-light/30 underline-offset-2 hover:decoration-brand-green-light"
      >
        <Download className="h-3 w-3 print:hidden" />
        {r.id}
      </a>
      {r.anexo && (
        <a
          href={r.anexo}
          target="_blank"
          rel="noopener"
          title={`Anexo de la Resolución ${r.id}`}
          className="rounded bg-surface-container px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground hover:text-brand-green-dark"
        >
          anexo
        </a>
      )}
    </span>
  );
}

function Grupo({ d }: { d: (typeof DESTINATARIOS)[number] }) {
  return (
    <>
      <tr className="border-t border-border bg-brand-gray align-top">
        <th scope="row" className="px-4 py-3 text-left font-semibold text-brand-green-dark">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: d.color }} />
            {d.sigla}
            {d.nombre && <span className="font-normal text-muted-foreground">· {d.nombre}</span>}
          </span>
          <span className="mt-0.5 block pl-[18px] text-xs font-normal text-muted-foreground">
            {d.rol}
          </span>
        </th>
        <td />
        <td className="px-4 py-3 text-right font-semibold tabular-nums whitespace-nowrap text-brand-green-dark">
          {fmtPesos(d.monto)}
        </td>
        <td className="px-4 py-3 text-right font-semibold tabular-nums whitespace-nowrap text-brand-green-dark">
          {fmtPct(d.pct)}
        </td>
      </tr>
      {d.conceptos.map((c) => (
        <tr key={c.concepto} className="border-t border-border align-top hover:bg-brand-cream/60">
          <td className="py-2.5 pl-9 pr-4">{c.concepto}</td>
          <td className="px-4 py-2.5">
            <div className="flex flex-col gap-1">
              {c.resoluciones.map((id) => (
                <ResLink key={id} r={RESOLUCION_POR_ID[id]} />
              ))}
            </div>
          </td>
          <td className="px-4 py-2.5 text-right tabular-nums whitespace-nowrap">
            {fmtPesos(c.monto)}
          </td>
          <td className="px-4 py-2.5 text-right tabular-nums whitespace-nowrap">{fmtPct(c.pct)}</td>
        </tr>
      ))}
    </>
  );
}

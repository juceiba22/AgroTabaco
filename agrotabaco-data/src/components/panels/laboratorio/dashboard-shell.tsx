"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { KpiCard } from "@/components/kpi-card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Plan } from "@/lib/entitlements";
import type { ConsumoAnio, ParticipacionMes, VolumenPrecio } from "@/lib/panels/laboratorio/types";
import { cn } from "@/lib/utils";

const PriceLinesChart = dynamic(
  () => import("@/components/panels/laboratorio/charts/price-lines-chart").then((m) => m.PriceLinesChart),
  { ssr: false }
);
const QuartileAreaChart = dynamic(
  () => import("@/components/panels/laboratorio/charts/quartile-area-chart").then((m) => m.QuartileAreaChart),
  { ssr: false }
);
const ParticipationBarChart = dynamic(
  () =>
    import("@/components/panels/laboratorio/charts/participation-bar-chart").then(
      (m) => m.ParticipationBarChart
    ),
  { ssr: false }
);
const ShareAreaChart = dynamic(
  () => import("@/components/panels/laboratorio/charts/share-area-chart").then((m) => m.ShareAreaChart),
  { ssr: false }
);
const ConsumptionDualAxisChart = dynamic(
  () =>
    import("@/components/panels/laboratorio/charts/consumption-dual-axis-chart").then(
      (m) => m.ConsumptionDualAxisChart
    ),
  { ssr: false }
);

function formatMoney(value: number | null, prefix = "$") {
  if (value === null) return "S/D";
  return `${prefix}${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatInt(value: number | null) {
  if (value === null) return "S/D";
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function formatMonth(iso: string) {
  const d = new Date(iso);
  return `${String(d.getUTCMonth() + 1).padStart(2, "0")}/${d.getUTCFullYear()}`;
}

type Props = {
  volumenPrecios: VolumenPrecio[];
  participacion: ParticipacionMes[];
  consumoAparente: ConsumoAnio[];
  plan: Plan;
};

export function DashboardShell({ volumenPrecios, participacion, consumoAparente, plan }: Props) {
  const hasAnyData = volumenPrecios.length > 0 || participacion.length > 0 || consumoAparente.length > 0;

  const monthTimestamps = useMemo(() => {
    const all = [...volumenPrecios.map((d) => d.fecha), ...participacion.map((d) => d.fecha)];
    const times = all.map((f) => new Date(f).getTime());
    return times.length > 0 ? { min: Math.min(...times), max: Math.max(...times) } : { min: 0, max: 1 };
  }, [volumenPrecios, participacion]);

  const yearBounds = useMemo(() => {
    const years = consumoAparente.map((d) => d.anio);
    return years.length > 0
      ? { min: Math.min(...years), max: Math.max(...years) }
      : { min: 1910, max: 2026 };
  }, [consumoAparente]);

  const [rangoMensual, setRangoMensual] = useState<[number, number]>([
    monthTimestamps.min,
    monthTimestamps.max,
  ]);
  const [rangoAnual, setRangoAnual] = useState<[number, number]>([yearBounds.min, yearBounds.max]);

  const volFiltrado = useMemo(
    () =>
      volumenPrecios.filter((d) => {
        const t = new Date(d.fecha).getTime();
        return t >= rangoMensual[0] && t <= rangoMensual[1];
      }),
    [volumenPrecios, rangoMensual]
  );

  const partFiltrado = useMemo(
    () =>
      participacion.filter((d) => {
        const t = new Date(d.fecha).getTime();
        return t >= rangoMensual[0] && t <= rangoMensual[1];
      }),
    [participacion, rangoMensual]
  );

  const consFiltrado = useMemo(
    () => consumoAparente.filter((d) => d.anio >= rangoAnual[0] && d.anio <= rangoAnual[1]),
    [consumoAparente, rangoAnual]
  );

  if (!hasAnyData) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
        Todavía no hay datos cargados. Corré la migración y el seed de Supabase
        (<code>supabase/migrations/0006_fact_laboratorio_estadistico.sql</code> y{" "}
        <code>supabase/seed_laboratorio_estadistico.sql</code>) para ver el dashboard con datos reales.
      </div>
    );
  }

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] gap-6 items-start">
      {/* Botón para expandir/ocultar filtros en pantallas móviles */}
      <div className="w-full lg:hidden flex items-center justify-between p-3.5 bg-white rounded-xl border border-border shadow-xs">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#C59B27]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#132A1E]">Filtros y Rango</span>
        </div>
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="px-3 py-1.5 rounded-lg bg-[#EDF6EF] text-[#132A1E] text-xs font-bold uppercase tracking-wider hover:bg-[#E2EAE4] transition-colors"
        >
          {showMobileFilters ? "Ocultar Filtros ▲" : "Configurar Filtros ▼"}
        </button>
      </div>

      <aside className={cn(
        "w-full space-y-4 lg:sticky lg:top-6 lg:self-start",
        showMobileFilters ? "block" : "hidden lg:block"
      )}>
        <div className="rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#C59B27] animate-pulse" />
            <h2 className="font-serif text-sm font-bold text-[#132A1E]">Laboratorio Estadístico</h2>
          </div>
          <p className="mt-1.5 text-xs text-[#506859] leading-relaxed">
            Mercado interno de tabaco argentino — cigarrillos (paquetes eq. 20 unidades)
          </p>
        </div>

        {plan !== "pro" && (
          <div className="data-notice rounded-xl">
            Estás visualizando los últimos 12 meses (y 5 años en Consumo). El{" "}
            <Link href="/planes" className="font-bold underline text-[#C59B27]">
              historial completo (1910-2026)
            </Link>{" "}
            está disponible con licencia PRO.
          </div>
        )}

        <div className="rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-[#132A1E]">Período Mensual</p>
            <span className="text-[10px] font-mono font-bold text-[#C59B27] bg-[#EDF6EF] px-1.5 py-0.5 rounded">
              {formatMonth(new Date(rangoMensual[0]).toISOString())} — {formatMonth(new Date(rangoMensual[1]).toISOString())}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">Aplica a Precios, Cuartiles y Participación</p>
          <div className="mt-2 px-1">
            <Slider
              min={monthTimestamps.min}
              max={monthTimestamps.max}
              value={rangoMensual}
              onValueChange={(value) => setRangoMensual(value as [number, number])}
            />
          </div>
          <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>{formatMonth(new Date(rangoMensual[0]).toISOString())}</span>
            <span>{formatMonth(new Date(rangoMensual[1]).toISOString())}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-[#132A1E]">Rango Histórico</p>
            <span className="text-[10px] font-mono font-bold text-[#C59B27] bg-[#EDF6EF] px-1.5 py-0.5 rounded">
              {rangoAnual[0]} — {rangoAnual[1]}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">Aplica a Consumo Aparente Histórico</p>
          <div className="mt-2 px-1">
            <Slider
              min={yearBounds.min}
              max={yearBounds.max}
              step={1}
              value={rangoAnual}
              onValueChange={(value) => setRangoAnual(value as [number, number])}
            />
          </div>
          <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>{rangoAnual[0]}</span>
            <span>{rangoAnual[1]}</span>
          </div>
        </div>
      </aside>

      <main className="w-full min-w-0">
        <Tabs defaultValue="precios" className="w-full">
          <div className="w-full overflow-x-auto whitespace-nowrap scrollbar-none pb-1">
            <TabsList className="bg-[#EDF6EF] p-1 rounded-xl gap-1 inline-flex w-auto">
              <TabsTrigger
                value="precios"
                className="rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-[#132A1E] data-[state=active]:shadow-xs"
              >
                Evolución Precios &amp; Cuartiles
              </TabsTrigger>
              <TabsTrigger
                value="participacion"
                className="rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-[#132A1E] data-[state=active]:shadow-xs"
              >
                Participación de Mercado
              </TabsTrigger>
              <TabsTrigger
                value="consumo"
                className="rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-[#132A1E] data-[state=active]:shadow-xs"
              >
                Consumo Histórico
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="precios" className="mt-6 space-y-6">
            <ModuloPrecios data={volFiltrado} />
          </TabsContent>

          <TabsContent value="participacion" className="mt-6 space-y-6">
            <ModuloParticipacion data={partFiltrado} />
          </TabsContent>

          <TabsContent value="consumo" className="mt-6 space-y-6">
            <ModuloConsumo data={consFiltrado} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function ModuloPrecios({ data }: { data: VolumenPrecio[] }) {
  if (data.length === 0) {
    return <p className="text-muted-foreground">No hay datos para el rango de meses seleccionado.</p>;
  }

  const ultimo = data[data.length - 1];
  const anterior = data.length > 1 ? data[data.length - 2] : null;
  const deltaPrecio =
    anterior && anterior.precioPromedioPonderado && ultimo.precioPromedioPonderado
      ? ((ultimo.precioPromedioPonderado - anterior.precioPromedioPonderado) / anterior.precioPromedioPonderado) * 100
      : null;

  const devolucionesTotal = data.reduce((sum, d) => {
    const cuartiles = [d.primerQuartil, d.segundoQuartil, d.tercerQuartil, d.cuartoQuartil];
    return sum + cuartiles.reduce<number>((s, v) => s + Math.min(v ?? 0, 0), 0);
  }, 0);

  return (
    <>
      <div className="executive-header">
        <h1>Evolución de Precios y Cuartiles</h1>
        <p>Precio inferior, promedio ponderado y superior de paquetes vendidos, y su distribución por cuartiles de volumen.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          title="Precio Promedio Ponderado"
          value={formatMoney(ultimo.precioPromedioPonderado)}
          subtitle={`Último mes: ${formatMonth(ultimo.fecha)}`}
          delta={deltaPrecio}
          color="blue"
        />
        <KpiCard
          title="Total Paquetes"
          value={formatInt(ultimo.totalPaquetes)}
          subtitle={`Vendidos en ${formatMonth(ultimo.fecha)}`}
          color="emerald"
        />
        <KpiCard
          title="Devoluciones / Reingresos"
          value={formatInt(devolucionesTotal)}
          subtitle="Suma de valores negativos en cuartiles, período filtrado"
          color="amber"
        />
      </div>

      <div>
        <div className="section-header mb-3">
          <h3>📉 Precios: Inferior, Promedio Ponderado y Superior</h3>
        </div>
        <div className="rounded-xl border border-border bg-card p-2">
          <PriceLinesChart data={data} />
        </div>
      </div>

      <div>
        <div className="section-header mb-1">
          <h3>📊 Distribución de Volumen por Cuartiles</h3>
        </div>
        <p className="mb-3 text-sm text-muted-foreground">
          ⚠️ Los valores negativos (mayormente en el segundo cuartil) representan devoluciones o
          reingresos a fábrica, no ventas — el área se hunde por debajo de la línea de cero en esos
          meses en vez de desaparecer.
        </p>
        <div className="rounded-xl border border-border bg-card p-2">
          <QuartileAreaChart data={data} />
        </div>
      </div>
    </>
  );
}

function ModuloParticipacion({ data }: { data: ParticipacionMes[] }) {
  if (data.length === 0) {
    return <p className="text-muted-foreground">No hay datos para el rango de meses seleccionado.</p>;
  }

  const ultimo = data[data.length - 1];
  const primero = data[0];
  const deltaShare =
    ultimo.porcentajeParticipacionGrandes !== null && primero.porcentajeParticipacionGrandes !== null
      ? ultimo.porcentajeParticipacionGrandes - primero.porcentajeParticipacionGrandes
      : null;

  return (
    <>
      <div className="executive-header">
        <h1>Participación de Mercado: Empresas Grandes vs. PyMES</h1>
        <p>Evolución mensual del volumen y el share of market entre ambos tipos de empresa.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          title="Share Empresas Grandes"
          value={ultimo.porcentajeParticipacionGrandes !== null ? `${ultimo.porcentajeParticipacionGrandes.toFixed(1)}%` : "S/D"}
          subtitle={`Al ${formatMonth(ultimo.fecha)}`}
          delta={deltaShare}
          deltaText="pp vs inicio del rango"
          color="blue"
        />
        <KpiCard
          title="Share PyMES"
          value={ultimo.porcentajeParticipacionPymes !== null ? `${ultimo.porcentajeParticipacionPymes.toFixed(1)}%` : "S/D"}
          subtitle={`Al ${formatMonth(ultimo.fecha)}`}
          delta={deltaShare !== null ? -deltaShare : null}
          deltaText="pp vs inicio del rango"
          color="emerald"
        />
        <KpiCard
          title="Total Mercado"
          value={formatInt(ultimo.totalMercado)}
          subtitle={`Paquetes en ${formatMonth(ultimo.fecha)}`}
          color="amber"
        />
      </div>

      <div>
        <div className="section-header mb-3">
          <h3>📦 Volumen por Tipo de Empresa</h3>
        </div>
        <div className="rounded-xl border border-border bg-card p-2">
          <ParticipationBarChart data={data} />
        </div>
      </div>

      <div>
        <div className="section-header mb-3">
          <h3>📈 Share of Market (%)</h3>
        </div>
        <div className="rounded-xl border border-border bg-card p-2">
          <ShareAreaChart data={data} />
        </div>
      </div>
    </>
  );
}

function ModuloConsumo({ data }: { data: ConsumoAnio[] }) {
  if (data.length === 0) {
    return <p className="text-muted-foreground">No hay datos para el rango de años seleccionado.</p>;
  }

  const ultimo = data[data.length - 1];
  const primero = data[0];
  const deltaConsumo =
    primero.consumoAparente && ultimo.consumoAparente
      ? ((ultimo.consumoAparente - primero.consumoAparente) / primero.consumoAparente) * 100
      : null;

  return (
    <>
      <div className="executive-header">
        <h1>Consumo Aparente Histórico (1910-2026)</h1>
        <p>Serie secular de consumo nacional, población estimada (INDEC) y consumo aparente per cápita.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          title="Consumo Aparente"
          value={`${formatInt(ultimo.consumoAparente)} paq./hab./año`}
          subtitle={`Año ${ultimo.anio}`}
          delta={deltaConsumo}
          deltaText={`vs ${primero.anio}`}
          color="blue"
        />
        <KpiCard
          title="Población Estimada"
          value={formatInt(ultimo.poblacion)}
          subtitle={`Año ${ultimo.anio} (INDEC)`}
          color="emerald"
        />
        <KpiCard
          title="Total Paquetes"
          value={formatInt(ultimo.totalPaquetes)}
          subtitle={`Consumo nacional, año ${ultimo.anio}`}
          color="amber"
        />
      </div>

      <div>
        <div className="section-header mb-3">
          <h3>📈 Consumo Aparente per Cápita vs. Población</h3>
        </div>
        <div className="rounded-xl border border-border bg-card p-2">
          <ConsumptionDualAxisChart data={data} />
        </div>
      </div>

      <details className="rounded-xl border border-border bg-card p-4">
        <summary className="cursor-pointer text-sm font-semibold text-foreground">
          📋 Ver datos anuales
        </summary>
        <div className="mt-3 max-h-80 overflow-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-1 pr-4">Año</th>
                <th className="py-1 pr-4">Total Paquetes</th>
                <th className="py-1 pr-4">Población</th>
                <th className="py-1">Consumo Aparente (paq./hab./año)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.anio} className="border-b border-border/50">
                  <td className="py-1 pr-4">{row.anio}</td>
                  <td className="py-1 pr-4">{formatInt(row.totalPaquetes)}</td>
                  <td className="py-1 pr-4">{formatInt(row.poblacion)}</td>
                  <td className="py-1">{formatInt(row.consumoAparente)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </>
  );
}

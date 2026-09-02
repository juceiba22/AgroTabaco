"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { KpiCard } from "@/components/kpi-card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ConsumoAnio, ParticipacionMes, VolumenPrecio } from "@/lib/types";

const PriceLinesChart = dynamic(
  () => import("@/components/charts/price-lines-chart").then((m) => m.PriceLinesChart),
  { ssr: false }
);
const QuartileAreaChart = dynamic(
  () => import("@/components/charts/quartile-area-chart").then((m) => m.QuartileAreaChart),
  { ssr: false }
);
const ParticipationBarChart = dynamic(
  () => import("@/components/charts/participation-bar-chart").then((m) => m.ParticipationBarChart),
  { ssr: false }
);
const ShareAreaChart = dynamic(
  () => import("@/components/charts/share-area-chart").then((m) => m.ShareAreaChart),
  { ssr: false }
);
const ConsumptionDualAxisChart = dynamic(
  () => import("@/components/charts/consumption-dual-axis-chart").then((m) => m.ConsumptionDualAxisChart),
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
};

export function DashboardShell({ volumenPrecios, participacion, consumoAparente }: Props) {
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

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="font-serif text-sm font-bold text-brand-green-dark">🔬 Laboratorio Estadístico</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Mercado interno de tabaco — cigarrillos (paquetes eq. 20 un.)
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm font-semibold text-foreground">Período mensual</p>
          <p className="text-xs text-muted-foreground">Aplica a Precios/Cuartiles y Participación</p>
          <div className="mt-4 px-1">
            <Slider
              min={monthTimestamps.min}
              max={monthTimestamps.max}
              value={rangoMensual}
              onValueChange={(value) => setRangoMensual(value as [number, number])}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{formatMonth(new Date(rangoMensual[0]).toISOString())}</span>
            <span>{formatMonth(new Date(rangoMensual[1]).toISOString())}</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm font-semibold text-foreground">Rango histórico</p>
          <p className="text-xs text-muted-foreground">Aplica a Consumo Aparente (1910-2026)</p>
          <div className="mt-4 px-1">
            <Slider
              min={yearBounds.min}
              max={yearBounds.max}
              step={1}
              value={rangoAnual}
              onValueChange={(value) => setRangoAnual(value as [number, number])}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{rangoAnual[0]}</span>
            <span>{rangoAnual[1]}</span>
          </div>
        </div>
      </aside>

      <main>
        <Tabs defaultValue="precios">
          <TabsList>
            <TabsTrigger value="precios">💰 Evolución de Precios y Cuartiles</TabsTrigger>
            <TabsTrigger value="participacion">🏢 Participación de Mercado</TabsTrigger>
            <TabsTrigger value="consumo">📈 Consumo Aparente Histórico</TabsTrigger>
          </TabsList>

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

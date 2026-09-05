"use client";

import { useMemo, useState } from "react";
import { KpiCard } from "@/components/kpi-card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LockedTabContent } from "@/components/paywall/locked-tab-content";
import { PRESET_SUDAMERICA, PRESET_TOP5_GLOBAL } from "@/lib/panels/mercado-internacional/config";
import { ModuloArgentina } from "@/components/panels/mercado-internacional/modules/modulo-argentina";
import { ModuloDatos } from "@/components/panels/mercado-internacional/modules/modulo-datos";
import { ModuloEvolucionHistorica } from "@/components/panels/mercado-internacional/modules/modulo-evolucion-historica";
import { ModuloMapa } from "@/components/panels/mercado-internacional/modules/modulo-mapa";
import { ModuloRanking } from "@/components/panels/mercado-internacional/modules/modulo-ranking";
import type { Plan } from "@/lib/entitlements";
import type { TobaccoProduction } from "@/lib/panels/mercado-internacional/types";
import { cn } from "@/lib/utils";

const UNIT = "toneladas";
const DEFAULT_SELECTED = ["Argentina", "Brazil", "China", "India", "United States"];

type EntityFilterMode = "countries" | "countries_aggregates" | "all";

export function DashboardShell({ data, plan }: { data: TobaccoProduction[]; plan: Plan }) {
  const isPro = plan === "pro";
  const hasData = data.length > 0;
  const minYear = hasData ? Math.min(...data.map((d) => d.year)) : 0;
  const maxYear = hasData ? Math.max(...data.map((d) => d.year)) : 0;

  const [entityFilterMode, setEntityFilterMode] = useState<EntityFilterMode>("countries");
  const [selectedCountries, setSelectedCountries] = useState<string[]>(() =>
    DEFAULT_SELECTED.filter((c) => data.some((d) => d.entity === c))
  );
  const [yearRange, setYearRange] = useState<[number, number]>([minYear, maxYear]);
  const [evalYear, setEvalYear] = useState(maxYear);
  const [useLogScale, setUseLogScale] = useState(false);
  const [showDataPoints, setShowDataPoints] = useState(true);

  const [startYear, endYear] = yearRange;

  const availableEntities = useMemo(() => {
    let pool = data;
    if (entityFilterMode === "countries") pool = data.filter((d) => d.entityType === "Country");
    else if (entityFilterMode === "countries_aggregates") pool = data.filter((d) => d.entity !== "World");
    return Array.from(new Set(pool.map((d) => d.entity))).sort();
  }, [data, entityFilterMode]);

  const dataFiltrado = useMemo(() => data.filter((d) => d.year >= startYear && d.year <= endYear), [data, startYear, endYear]);

  if (!hasData) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
        Todavía no hay datos cargados. Corré la migración y el seed de Supabase (
        <code>supabase/migrations/0008_fact_tobacco_production.sql</code> y{" "}
        <code>supabase/seed_tobacco_production.sql</code>) para ver el dashboard con datos reales.
      </div>
    );
  }

  // --- KPIs ejecutivos (año focal, sobre el dataset completo, sin filtrar por rango de años) ---
  const yearEvalData = data.filter((d) => d.year === evalYear);
  const prevYearData = data.filter((d) => d.year === evalYear - 1);

  const worldCurr = yearEvalData.find((d) => d.entity === "World");
  const worldProd = worldCurr ? worldCurr.valueTonnes : yearEvalData.filter((d) => d.entityType === "Country").reduce((s, d) => s + d.valueTonnes, 0);
  const worldPrev = prevYearData.find((d) => d.entity === "World");
  const worldProdPrev = worldPrev ? worldPrev.valueTonnes : prevYearData.filter((d) => d.entityType === "Country").reduce((s, d) => s + d.valueTonnes, 0);
  const worldYoyPct = worldProdPrev > 0 ? ((worldProd - worldProdPrev) / worldProdPrev) * 100 : 0;

  const countriesEval = yearEvalData.filter((d) => d.entityType === "Country").sort((a, b) => b.valueTonnes - a.valueTonnes);
  const topCountry = countriesEval[0];
  const topCountryShare = topCountry && worldProd > 0 ? (topCountry.valueTonnes / worldProd) * 100 : 0;

  const argRow = yearEvalData.find((d) => d.entity === "Argentina");
  const argVal = argRow?.valueTonnes ?? 0;
  const argRank = argRow ? countriesEval.findIndex((d) => d.entity === "Argentina") + 1 : 0;
  const argShare = worldProd > 0 ? (argVal / worldProd) * 100 : 0;
  const argPrevVal = prevYearData.find((d) => d.entity === "Argentina")?.valueTonnes ?? 0;
  const argYoyPct = argPrevVal > 0 ? ((argVal - argPrevVal) / argPrevVal) * 100 : 0;

  const activeCountriesCount = countriesEval.filter((d) => d.valueTonnes > 0).length;

  function formatTonnes(v: number) {
    return v >= 1e6 ? `${(v / 1e6).toFixed(2)} M t` : `${v.toLocaleString("en-US", { maximumFractionDigits: 0 })} t`;
  }

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] gap-6 items-start">
      {/* Botón para expandir/ocultar filtros en pantallas móviles */}
      <div className="w-full lg:hidden flex items-center justify-between p-3.5 bg-white rounded-xl border border-border shadow-xs">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#C59B27]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#132A1E]">Filtros y Países</span>
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
          <h2 className="font-serif text-sm font-bold text-[#132A1E]">🍃 TABACO STATS</h2>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#C59B27]">Global Intelligence</p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-xs">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#132A1E]">Tipo de Entidad</p>
          <div className="flex flex-col gap-1.5 text-xs text-[#151D19]">
            {[
              { value: "countries", label: "Solo Países Soberanos" },
              { value: "countries_aggregates", label: "Países y Agregados Continentales" },
              { value: "all", label: "Todos" },
            ].map((opt) => (
              <label key={opt.value} className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="entityFilterMode"
                  checked={entityFilterMode === opt.value}
                  onChange={() => setEntityFilterMode(opt.value as EntityFilterMode)}
                  className="accent-[#C59B27]"
                />
                {opt.label}
              </label>
            ))}
          </div>

          <p className="mb-1.5 mt-3 text-xs font-bold text-muted-foreground">⚡ Presets de Países:</p>
          <div className="flex gap-2">
            <button
              className="flex-1 rounded-lg border border-border px-2 py-1.5 text-xs font-medium hover:bg-[#EDF6EF] transition-colors"
              onClick={() => setSelectedCountries(PRESET_TOP5_GLOBAL.filter((c) => availableEntities.includes(c)))}
            >
              🔥 Top 5 Global
            </button>
            <button
              className="flex-1 rounded-lg border border-border px-2 py-1.5 text-xs font-medium hover:bg-[#EDF6EF] transition-colors"
              onClick={() => setSelectedCountries(PRESET_SUDAMERICA.filter((c) => availableEntities.includes(c)))}
            >
              🌎 Sudamérica
            </button>
          </div>

          <p className="mb-1.5 mt-3 text-xs font-bold uppercase tracking-wider text-[#132A1E]">Seleccionar Países / Entidades</p>
          <select
            multiple
            className="h-32 w-full rounded-lg border border-input bg-background p-1.5 text-xs"
            value={selectedCountries}
            onChange={(e) => setSelectedCountries(Array.from(e.target.selectedOptions, (o) => o.value))}
          >
            {availableEntities.map((ent) => (
              <option key={ent} value={ent}>
                {data.find((d) => d.entity === ent)?.entityDisplay ?? ent}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-xs flex flex-col gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-bold uppercase tracking-wider text-[#132A1E]">Período de Análisis</p>
              <span className="text-[10px] font-mono font-bold text-[#C59B27] bg-[#EDF6EF] px-1.5 py-0.5 rounded">
                {startYear} — {endYear}
              </span>
            </div>
            <div className="px-1 mt-2">
              <Slider min={minYear} max={maxYear} value={yearRange} onValueChange={(v) => setYearRange(v as [number, number])} />
            </div>
          </div>

          <div className="pt-2 border-t border-border/60">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-bold uppercase tracking-wider text-[#132A1E]">Año Focal (Ranking &amp; Mapa)</p>
              <span className="text-[10px] font-mono font-bold text-[#C59B27] bg-[#EDF6EF] px-1.5 py-0.5 rounded">
                {evalYear}
              </span>
            </div>
            <div className="px-1 mt-2">
              <Slider min={minYear} max={maxYear} value={[evalYear]} onValueChange={(v) => setEvalYear((v as number[])[0])} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-xs">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#132A1E]">📊 Opciones de Gráfico</p>
          <label className="flex items-center gap-2 text-xs text-[#151D19]">
            <input type="checkbox" checked={useLogScale} onChange={(e) => setUseLogScale(e.target.checked)} className="accent-[#C59B27]" />
            Escala Logarítmica (Líneas)
          </label>
          <label className="mt-1.5 flex items-center gap-2 text-xs text-[#151D19]">
            <input type="checkbox" checked={showDataPoints} onChange={(e) => setShowDataPoints(e.target.checked)} className="accent-[#C59B27]" />
            Mostrar Puntos de Datos
          </label>
        </div>
      </aside>

      <main className="w-full min-w-0 space-y-6">
        <div className="executive-header">
          <h1>Mercado Internacional de Tabaco</h1>
          <p>
            Visualización analítica interactiva de producción y dinámicas globales ({startYear} – {endYear})
          </p>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            icon="🌍"
            title={`Producción Global (${evalYear})`}
            value={formatTonnes(worldProd)}
            subtitle={`vs año anterior (${evalYear - 1})`}
            delta={worldYoyPct}
            deltaText="YoY"
            color="emerald"
          />
          <KpiCard
            icon="🏆"
            title={`Líder Mundial (${evalYear})`}
            value={topCountry?.entityDisplay ?? "N/A"}
            subtitle={topCountry ? `Volumen: ${formatTonnes(topCountry.valueTonnes)} (${topCountryShare.toFixed(1)}% global)` : "S/D"}
            color="cyan"
          />
          <KpiCard
            icon="🇦🇷"
            title={`Argentina (${evalYear})`}
            value={`${argVal.toLocaleString("en-US", { maximumFractionDigits: 0 })} t`}
            subtitle={`Puesto #${argRank || "—"} global • ${argShare.toFixed(2)}% cuota`}
            delta={argYoyPct}
            deltaText="YoY"
            color="amber"
          />
          <KpiCard
            icon="🌐"
            title="Países Productores Activos"
            value={`${activeCountriesCount}`}
            subtitle={`Registros reportados en FAO (${evalYear})`}
            color="indigo"
          />
        </div>

        <Tabs defaultValue="evolucion" className="w-full">
          <div className="w-full overflow-x-auto whitespace-nowrap scrollbar-none pb-1">
            <TabsList className="bg-[#EDF6EF] p-1 rounded-xl gap-1 inline-flex w-auto">
              <TabsTrigger value="evolucion" className="rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-[#132A1E] data-[state=active]:shadow-xs">📈 Evolución Histórica</TabsTrigger>
              <TabsTrigger value="ranking" className="rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-[#132A1E] data-[state=active]:shadow-xs">🏆 Ranking &amp; Cuota de Mercado</TabsTrigger>
              <TabsTrigger value="argentina" className="rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-[#132A1E] data-[state=active]:shadow-xs">🇦🇷 Monitor Argentina</TabsTrigger>
              <TabsTrigger value="mapa" className="rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-[#132A1E] data-[state=active]:shadow-xs">🗺️ Mapa Global de Producción</TabsTrigger>
              <TabsTrigger value="datos" className="rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-[#132A1E] data-[state=active]:shadow-xs">📋 Tabla de Datos</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="evolucion" className="mt-6 space-y-6">
            {isPro ? (
              <ModuloEvolucionHistorica
                dataFiltrado={dataFiltrado}
                selectedEntities={selectedCountries}
                startYear={startYear}
                endYear={endYear}
                unit={UNIT}
                logScale={useLogScale}
                showMarkers={showDataPoints}
              />
            ) : (
              <LockedTabContent
                title="📈 Evolución Histórica"
                benefit="Accedé a la serie completa 1961-2024 de producción mundial de tabaco."
              />
            )}
          </TabsContent>
          <TabsContent value="ranking" className="mt-6 space-y-6">
            <ModuloRanking data={data} evalYear={evalYear} unit={UNIT} />
          </TabsContent>
          <TabsContent value="mapa" className="mt-6 space-y-6">
            {isPro ? (
              <ModuloMapa data={data} evalYear={evalYear} unit={UNIT} />
            ) : (
              <LockedTabContent title="🗺️ Mapa Global Interactivo" benefit="Explorá el mapa coroplético mundial año por año." />
            )}
          </TabsContent>
          <TabsContent value="argentina" className="mt-6 space-y-6">
            {isPro ? (
              <ModuloArgentina dataFiltrado={dataFiltrado} unit={UNIT} />
            ) : (
              <LockedTabContent
                title="🇦🇷 Foco Estratégico: Argentina"
                benefit="Comparativo histórico de Argentina contra sus vecinos sudamericanos."
              />
            )}
          </TabsContent>
          <TabsContent value="datos" className="mt-6 space-y-6">
            {isPro ? (
              <ModuloDatos dataFiltrado={dataFiltrado} unit={UNIT} startYear={startYear} endYear={endYear} />
            ) : (
              <LockedTabContent title="📊 Matriz de Datos & Descarga" benefit="Buscá, ordená y exportá el dataset completo en CSV." />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

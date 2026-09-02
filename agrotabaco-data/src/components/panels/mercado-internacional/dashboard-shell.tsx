"use client";

import { useMemo, useState } from "react";
import { KpiCard } from "@/components/kpi-card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PRESET_SUDAMERICA, PRESET_TOP5_GLOBAL } from "@/lib/panels/mercado-internacional/config";
import { ModuloArgentina } from "@/components/panels/mercado-internacional/modules/modulo-argentina";
import { ModuloDatos } from "@/components/panels/mercado-internacional/modules/modulo-datos";
import { ModuloEvolucionHistorica } from "@/components/panels/mercado-internacional/modules/modulo-evolucion-historica";
import { ModuloMapa } from "@/components/panels/mercado-internacional/modules/modulo-mapa";
import { ModuloRanking } from "@/components/panels/mercado-internacional/modules/modulo-ranking";
import type { TobaccoProduction } from "@/lib/panels/mercado-internacional/types";

const UNIT = "toneladas";
const DEFAULT_SELECTED = ["Argentina", "Brazil", "China", "India", "United States"];

type EntityFilterMode = "countries" | "countries_aggregates" | "all";

export function DashboardShell({ data }: { data: TobaccoProduction[] }) {
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

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="font-serif text-sm font-bold text-brand-green-dark">🍃 TABACO STATS</h2>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-olive">Global Intelligence</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 text-sm font-semibold text-foreground">Tipo de Entidad</p>
          <div className="flex flex-col gap-1.5 text-sm">
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
                />
                {opt.label}
              </label>
            ))}
          </div>

          <p className="mb-1 mt-3 text-xs text-muted-foreground">⚡ Presets de Países:</p>
          <div className="flex gap-2">
            <button
              className="flex-1 rounded-md border border-input px-2 py-1 text-xs hover:bg-muted"
              onClick={() => setSelectedCountries(PRESET_TOP5_GLOBAL.filter((c) => availableEntities.includes(c)))}
            >
              🔥 Top 5 Global
            </button>
            <button
              className="flex-1 rounded-md border border-input px-2 py-1 text-xs hover:bg-muted"
              onClick={() => setSelectedCountries(PRESET_SUDAMERICA.filter((c) => availableEntities.includes(c)))}
            >
              🌎 Sudamérica
            </button>
          </div>

          <p className="mb-1 mt-3 text-sm font-semibold text-foreground">Seleccionar Países / Entidades</p>
          <select
            multiple
            className="h-32 w-full rounded-md border border-input bg-background p-1.5 text-sm"
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

        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-1 text-sm font-semibold text-foreground">⏳ Período de Análisis</p>
          <div className="px-1">
            <Slider min={minYear} max={maxYear} value={yearRange} onValueChange={(v) => setYearRange(v as [number, number])} />
          </div>
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>{startYear}</span>
            <span>{endYear}</span>
          </div>

          <p className="mb-1 mt-4 text-sm font-semibold text-foreground">Año Focal (Ranking &amp; Mapa)</p>
          <div className="px-1">
            <Slider min={minYear} max={maxYear} value={[evalYear]} onValueChange={(v) => setEvalYear((v as number[])[0])} />
          </div>
          <div className="mt-1 text-right text-xs text-muted-foreground">{evalYear}</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 text-sm font-semibold text-foreground">📊 Opciones de Gráfico</p>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={useLogScale} onChange={(e) => setUseLogScale(e.target.checked)} />
            Escala Logarítmica (Líneas)
          </label>
          <label className="mt-1.5 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={showDataPoints} onChange={(e) => setShowDataPoints(e.target.checked)} />
            Mostrar Puntos de Datos
          </label>
        </div>
      </aside>

      <main className="space-y-6">
        <div className="executive-header">
          <h1>Mercado Internacional de Tabaco</h1>
          <p>
            Visualización analítica interactiva de producción y dinámicas globales ({startYear} – {endYear})
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

        <Tabs defaultValue="evolucion">
          <TabsList>
            <TabsTrigger value="evolucion">📈 Evolución Histórica</TabsTrigger>
            <TabsTrigger value="ranking">🏆 Ranking &amp; Cuota de Mercado</TabsTrigger>
            <TabsTrigger value="mapa">🗺️ Mapa Global Interactivo</TabsTrigger>
            <TabsTrigger value="argentina">🇦🇷 Foco Estratégico: Argentina</TabsTrigger>
            <TabsTrigger value="datos">📊 Matriz de Datos &amp; Descarga</TabsTrigger>
          </TabsList>

          <TabsContent value="evolucion" className="mt-6 space-y-6">
            <ModuloEvolucionHistorica
              dataFiltrado={dataFiltrado}
              selectedEntities={selectedCountries}
              startYear={startYear}
              endYear={endYear}
              unit={UNIT}
              logScale={useLogScale}
              showMarkers={showDataPoints}
            />
          </TabsContent>
          <TabsContent value="ranking" className="mt-6 space-y-6">
            <ModuloRanking data={data} evalYear={evalYear} unit={UNIT} />
          </TabsContent>
          <TabsContent value="mapa" className="mt-6 space-y-6">
            <ModuloMapa data={data} evalYear={evalYear} unit={UNIT} />
          </TabsContent>
          <TabsContent value="argentina" className="mt-6 space-y-6">
            <ModuloArgentina dataFiltrado={dataFiltrado} unit={UNIT} />
          </TabsContent>
          <TabsContent value="datos" className="mt-6 space-y-6">
            <ModuloDatos dataFiltrado={dataFiltrado} unit={UNIT} startYear={startYear} endYear={endYear} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

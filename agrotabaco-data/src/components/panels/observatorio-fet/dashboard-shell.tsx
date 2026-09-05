"use client";

import { useMemo, useState } from "react";
import { KpiCard } from "@/components/kpi-card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LockedTabContent } from "@/components/paywall/locked-tab-content";
import { breakdownByObjetoPrograma, totalArsNominal } from "@/lib/panels/observatorio-fet/filters";
import { OBJETOS_PROGRAMA } from "@/lib/panels/observatorio-fet/config";
import { ModuloAsistencia } from "@/components/panels/observatorio-fet/modules/modulo-asistencia";
import { ModuloCalidad } from "@/components/panels/observatorio-fet/modules/modulo-calidad";
import { ModuloEvolucion } from "@/components/panels/observatorio-fet/modules/modulo-evolucion";
import { ModuloProgramas } from "@/components/panels/observatorio-fet/modules/modulo-programas";
import { ModuloProvincias } from "@/components/panels/observatorio-fet/modules/modulo-provincias";
import { ModuloResumen } from "@/components/panels/observatorio-fet/modules/modulo-resumen";
import type { Plan } from "@/lib/entitlements";
import type { PoaTabaco } from "@/lib/panels/observatorio-fet/types";
import { cn } from "@/lib/utils";

type TipoAsistenciaFiltro = "TODOS" | "SUBSIDIO" | "CREDITO";

export function DashboardShell({ data, plan }: { data: PoaTabaco[]; plan: Plan }) {
  const isPro = plan === "pro";
  const hasData = data.length > 0;
  const anios = data.map((d) => d.anioResolucion).filter((a): a is number => a != null);
  const minYear = anios.length > 0 ? Math.min(...anios) : 0;
  const maxYear = anios.length > 0 ? Math.max(...anios) : 0;

  const provinciasDisponibles = useMemo(() => {
    const map = new Map<string, string>();
    for (const r of data) map.set(r.provincia, r.provinciaDisplay);
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [data]);

  const [selectedProvincias, setSelectedProvincias] = useState<string[]>(() => data.map((d) => d.provincia));
  const [selectedProgramas, setSelectedProgramas] = useState<string[]>(() => [...OBJETOS_PROGRAMA]);
  const [yearRange, setYearRange] = useState<[number, number]>([minYear, maxYear]);
  const [tipoAsistencia, setTipoAsistencia] = useState<TipoAsistenciaFiltro>("TODOS");

  const [startYear, endYear] = yearRange;
  const provinciasSet = useMemo(() => new Set(selectedProvincias), [selectedProvincias]);
  const programasSet = useMemo(() => new Set(selectedProgramas), [selectedProgramas]);

  const dataFiltrado = useMemo(() => {
    return data.filter((r) => {
      if (!provinciasSet.has(r.provincia)) return false;
      if (r.anioResolucion == null || r.anioResolucion < startYear || r.anioResolucion > endYear) return false;
      if (r.objetoPrograma && !programasSet.has(r.objetoPrograma)) return false;
      if (tipoAsistencia === "SUBSIDIO" && r.tipoAsistencia !== "Aporte No Reintegrable (Subsidio)") return false;
      if (tipoAsistencia === "CREDITO" && r.tipoAsistencia !== "Crédito / Fondo Rotatorio") return false;
      return true;
    });
  }, [data, provinciasSet, startYear, endYear, programasSet, tipoAsistencia]);

  if (!hasData) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
        Todavía no hay datos cargados. Corré la migración y el seed de Supabase (
        <code>supabase/migrations/0009_fact_poas_tabaco.sql</code> y <code>supabase/seed_poas_tabaco.sql</code>) para ver el
        Observatorio con datos reales.
      </div>
    );
  }

  const totalUsd = dataFiltrado.reduce((s, r) => s + (r.montoUsd ?? 0), 0);
  const conMontoUsd = dataFiltrado.filter((r) => r.montoUsd != null).length;
  const coberturaPct = dataFiltrado.length > 0 ? (conMontoUsd / dataFiltrado.length) * 100 : 0;
  const { total: totalArs } = totalArsNominal(dataFiltrado);
  const provinciasCubiertas = new Set(dataFiltrado.map((r) => r.provincia)).size;
  const programaTop = breakdownByObjetoPrograma(dataFiltrado)[0];
  const esRangoAmplio = endYear - startYear > 1;

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] gap-6 items-start">
      {/* Botón para expandir/ocultar filtros en pantallas móviles */}
      <div className="w-full lg:hidden flex items-center justify-between p-3.5 bg-white rounded-xl border border-border shadow-xs">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#C59B27]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#132A1E]">Filtros POAs FET</span>
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
          <h2 className="font-serif text-sm font-bold text-[#132A1E]">🏛️ OBSERVATORIO FET</h2>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#C59B27]">Ley Nº 19.800</p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-xs">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#132A1E]">Provincias</p>
          <select
            multiple
            className="h-32 w-full rounded-lg border border-input bg-background p-1.5 text-xs"
            value={selectedProvincias}
            onChange={(e) => setSelectedProvincias(Array.from(e.target.selectedOptions, (o) => o.value))}
          >
            {provinciasDisponibles.map(([code, display]) => (
              <option key={code} value={code}>
                {display}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold uppercase tracking-wider text-[#132A1E]">Rango de Años</p>
            <span className="text-[10px] font-mono font-bold text-[#C59B27] bg-[#EDF6EF] px-1.5 py-0.5 rounded">
              {startYear} — {endYear}
            </span>
          </div>
          <div className="px-1 mt-2">
            <Slider min={minYear} max={maxYear} value={yearRange} onValueChange={(v) => setYearRange(v as [number, number])} />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-xs">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#132A1E]">Programa (objeto_programa)</p>
          <select
            multiple
            className="h-32 w-full rounded-lg border border-input bg-background p-1.5 text-xs"
            value={selectedProgramas}
            onChange={(e) => setSelectedProgramas(Array.from(e.target.selectedOptions, (o) => o.value))}
          >
            {OBJETOS_PROGRAMA.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-xs">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#132A1E]">Tipo de Asistencia</p>
          <div className="flex flex-col gap-1.5 text-xs text-[#151D19]">
            {[
              { value: "TODOS", label: "Todos" },
              { value: "SUBSIDIO", label: "Aporte No Reintegrable (Subsidio)" },
              { value: "CREDITO", label: "Crédito / Fondo Rotatorio" },
            ].map((opt) => (
              <label key={opt.value} className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="tipoAsistencia"
                  checked={tipoAsistencia === opt.value}
                  onChange={() => setTipoAsistencia(opt.value as TipoAsistenciaFiltro)}
                  className="accent-[#C59B27]"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </aside>

      <main className="w-full min-w-0 space-y-6">
        <div className="executive-header">
          <h1>Observatorio del FET</h1>
          <p>
            Planes Operativos Anuales financiados con el Fondo Especial del Tabaco a favor de las provincias tabacaleras ({startYear} –{" "}
            {endYear})
          </p>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <KpiCard
            icon="💵"
            title={isPro ? "Total USD Histórico" : "Total USD (último año)"}
            value={`USD ${totalUsd.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
            subtitle={`Cobertura: ${coberturaPct.toFixed(1)}% de los POAs filtrados`}
            color="emerald"
          />
          <KpiCard
            icon="💰"
            title="Total ARS del Rango"
            value={`$ ${totalArs.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`}
            subtitle={esRangoAmplio ? "Nominal — no comparable por inflación" : "Nominal, año único"}
            color="amber"
          />
          <KpiCard icon="📄" title="Cantidad de POAs" value={dataFiltrado.length.toLocaleString("es-AR")} color="blue" />
          <KpiCard icon="🗺️" title="Provincias Cubiertas" value={`${provinciasCubiertas}`} color="cyan" />
          <KpiCard
            icon="🏆"
            title="Programa Principal"
            value={programaTop?.objetoPrograma ?? "N/A"}
            subtitle={programaTop ? `${programaTop.percentage.toFixed(1)}% del USD filtrado` : undefined}
            color="purple"
          />
        </div>

        <Tabs defaultValue="resumen" className="w-full">
          <div className="w-full overflow-x-auto whitespace-nowrap scrollbar-none pb-1">
            <TabsList className="bg-[#EDF6EF] p-1 rounded-xl gap-1 inline-flex w-auto">
              <TabsTrigger value="resumen" className="rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-[#132A1E] data-[state=active]:shadow-xs">📋 Resumen Ejecutivo</TabsTrigger>
              <TabsTrigger value="evolucion" className="rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-[#132A1E] data-[state=active]:shadow-xs">📈 Evolución Histórica</TabsTrigger>
              <TabsTrigger value="provincias" className="rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-[#132A1E] data-[state=active]:shadow-xs">🗺️ Por Provincia</TabsTrigger>
              <TabsTrigger value="programas" className="rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-[#132A1E] data-[state=active]:shadow-xs">🧭 Por Programa</TabsTrigger>
              <TabsTrigger value="asistencia" className="rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-[#132A1E] data-[state=active]:shadow-xs">🏦 Tipo de Asistencia</TabsTrigger>
              <TabsTrigger value="calidad" className="rounded-lg text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-[#132A1E] data-[state=active]:shadow-xs">🔍 Calidad de Datos</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="resumen" className="mt-6 space-y-6">
            <ModuloResumen dataFiltrado={dataFiltrado} rangoAnios={yearRange} />
          </TabsContent>
          <TabsContent value="evolucion" className="mt-6 space-y-6">
            {isPro ? (
              <ModuloEvolucion dataFiltrado={dataFiltrado} />
            ) : (
              <LockedTabContent title="📈 Evolución Histórica" benefit="Accedé a la serie completa del FET transferido, año por año." />
            )}
          </TabsContent>
          <TabsContent value="provincias" className="mt-6 space-y-6">
            {isPro ? (
              <ModuloProvincias dataFiltrado={dataFiltrado} />
            ) : (
              <LockedTabContent title="🗺️ Por Provincia" benefit="Comparativo histórico de FET recibido entre las provincias tabacaleras." />
            )}
          </TabsContent>
          <TabsContent value="programas" className="mt-6 space-y-6">
            {isPro ? (
              <ModuloProgramas dataFiltrado={dataFiltrado} />
            ) : (
              <LockedTabContent title="🧭 Por Programa" benefit="Desglose histórico del gasto por objeto_programa." />
            )}
          </TabsContent>
          <TabsContent value="asistencia" className="mt-6 space-y-6">
            {isPro ? (
              <ModuloAsistencia dataFiltrado={dataFiltrado} />
            ) : (
              <LockedTabContent title="🏦 Tipo de Asistencia" benefit="Evolución histórica entre subsidios y créditos." />
            )}
          </TabsContent>
          <TabsContent value="calidad" className="mt-6 space-y-6">
            {isPro ? (
              <ModuloCalidad dataFiltrado={dataFiltrado} />
            ) : (
              <LockedTabContent
                title="🔍 Calidad de Datos"
                benefit="Buscá y exportá el detalle completo de los 2.737 registros del Observatorio."
              />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

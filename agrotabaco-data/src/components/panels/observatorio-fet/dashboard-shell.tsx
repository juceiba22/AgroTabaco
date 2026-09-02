"use client";

import { useMemo, useState } from "react";
import { KpiCard } from "@/components/kpi-card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { breakdownByObjetoPrograma, totalArsNominal } from "@/lib/panels/observatorio-fet/filters";
import { OBJETOS_PROGRAMA } from "@/lib/panels/observatorio-fet/config";
import { ModuloAsistencia } from "@/components/panels/observatorio-fet/modules/modulo-asistencia";
import { ModuloCalidad } from "@/components/panels/observatorio-fet/modules/modulo-calidad";
import { ModuloEvolucion } from "@/components/panels/observatorio-fet/modules/modulo-evolucion";
import { ModuloProgramas } from "@/components/panels/observatorio-fet/modules/modulo-programas";
import { ModuloProvincias } from "@/components/panels/observatorio-fet/modules/modulo-provincias";
import { ModuloResumen } from "@/components/panels/observatorio-fet/modules/modulo-resumen";
import type { PoaTabaco } from "@/lib/panels/observatorio-fet/types";

type TipoAsistenciaFiltro = "TODOS" | "SUBSIDIO" | "CREDITO";

export function DashboardShell({ data }: { data: PoaTabaco[] }) {
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

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="font-serif text-sm font-bold text-brand-green-dark">🏛️ OBSERVATORIO FET</h2>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-olive">Ley Nº 19.800</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-1 text-sm font-semibold text-foreground">Provincias</p>
          <select
            multiple
            className="h-32 w-full rounded-md border border-input bg-background p-1.5 text-sm"
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

        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-1 text-sm font-semibold text-foreground">⏳ Rango de Años (fecha de resolución)</p>
          <div className="px-1">
            <Slider min={minYear} max={maxYear} value={yearRange} onValueChange={(v) => setYearRange(v as [number, number])} />
          </div>
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>{startYear}</span>
            <span>{endYear}</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-1 text-sm font-semibold text-foreground">Programa (objeto_programa)</p>
          <select
            multiple
            className="h-32 w-full rounded-md border border-input bg-background p-1.5 text-sm"
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

        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 text-sm font-semibold text-foreground">Tipo de Asistencia</p>
          <div className="flex flex-col gap-1.5 text-sm">
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
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </aside>

      <main className="space-y-6">
        <div className="executive-header">
          <h1>Observatorio del FET</h1>
          <p>
            Planes Operativos Anuales financiados con el Fondo Especial del Tabaco a favor de las provincias tabacaleras ({startYear} –{" "}
            {endYear})
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <KpiCard
            icon="💵"
            title="Total USD Histórico"
            value={`USD ${totalUsd.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
            subtitle={`Cobertura: ${coberturaPct.toFixed(1)}% de los POAs filtrados`}
            color="emerald"
          />
          <KpiCard
            icon="💰"
            title="Total ARS del Rango"
            value={`$ ${totalArs.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`}
            subtitle={esRangoAmplio ? "Nominal — no comparable entre años por inflación" : "Nominal, año único"}
            color="amber"
          />
          <KpiCard icon="📄" title="Cantidad de POAs" value={dataFiltrado.length.toLocaleString("es-AR")} color="blue" />
          <KpiCard icon="🗺️" title="Provincias Cubiertas" value={`${provinciasCubiertas}`} color="cyan" />
          <KpiCard
            icon="🏆"
            title="Programa Más Financiado"
            value={programaTop?.objetoPrograma ?? "N/A"}
            subtitle={programaTop ? `${programaTop.percentage.toFixed(1)}% del USD filtrado` : undefined}
            color="purple"
          />
        </div>

        <Tabs defaultValue="resumen">
          <TabsList>
            <TabsTrigger value="resumen">📋 Resumen Ejecutivo</TabsTrigger>
            <TabsTrigger value="evolucion">📈 Evolución Histórica</TabsTrigger>
            <TabsTrigger value="provincias">🗺️ Por Provincia</TabsTrigger>
            <TabsTrigger value="programas">🧭 Por Programa</TabsTrigger>
            <TabsTrigger value="asistencia">🏦 Tipo de Asistencia</TabsTrigger>
            <TabsTrigger value="calidad">🔍 Calidad de Datos</TabsTrigger>
          </TabsList>

          <TabsContent value="resumen" className="mt-6 space-y-6">
            <ModuloResumen dataFiltrado={dataFiltrado} rangoAnios={yearRange} />
          </TabsContent>
          <TabsContent value="evolucion" className="mt-6 space-y-6">
            <ModuloEvolucion dataFiltrado={dataFiltrado} />
          </TabsContent>
          <TabsContent value="provincias" className="mt-6 space-y-6">
            <ModuloProvincias dataFiltrado={dataFiltrado} />
          </TabsContent>
          <TabsContent value="programas" className="mt-6 space-y-6">
            <ModuloProgramas dataFiltrado={dataFiltrado} />
          </TabsContent>
          <TabsContent value="asistencia" className="mt-6 space-y-6">
            <ModuloAsistencia dataFiltrado={dataFiltrado} />
          </TabsContent>
          <TabsContent value="calidad" className="mt-6 space-y-6">
            <ModuloCalidad dataFiltrado={dataFiltrado} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

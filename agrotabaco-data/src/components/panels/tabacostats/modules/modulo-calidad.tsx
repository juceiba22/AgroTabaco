"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { KpiCard } from "@/components/kpi-card";
import { CampanaProvinciaVariedadFilter } from "@/components/panels/tabacostats/filters/campana-provincia-variedad-filter";
import { ClasesMultiselect } from "@/components/panels/tabacostats/filters/clases-multiselect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TODAS_LAS_PROVINCIAS,
  TODAS_LAS_VARIEDADES,
  campanaAnterior,
  deltaPct,
  filterAcopioClases,
  sortCampanasDesc,
  sum,
} from "@/lib/panels/tabacostats/filters";
import type { AcopioClase } from "@/lib/panels/tabacostats/types";

const ClassesGroupedBarChart = dynamic(
  () => import("@/components/panels/tabacostats/charts/classes-grouped-bar-chart").then((m) => m.ClassesGroupedBarChart),
  { ssr: false }
);

const TOP_N_OPTIONS = ["10", "15", "25", "Todas"] as const;

export function ModuloCalidad({ data }: { data: AcopioClase[] }) {
  const campanas = useMemo(() => sortCampanasDesc(data.map((d) => d.campana)), [data]);
  const provincias = useMemo(
    () => Array.from(new Set(data.map((d) => d.provincia).filter((p) => p !== "Total Nacional"))).sort(),
    [data]
  );
  const variedades = useMemo(
    () => Array.from(new Set(data.map((d) => d.tipoTabaco).filter((t) => t !== "Total"))).sort(),
    [data]
  );

  const [campana, setCampana] = useState(campanas[0] ?? "");
  const [provincia, setProvincia] = useState(TODAS_LAS_PROVINCIAS);
  const [tipo, setTipo] = useState(TODAS_LAS_VARIEDADES);
  const [selectedClases, setSelectedClases] = useState<string[]>([]);
  const [topN, setTopN] = useState<(typeof TOP_N_OPTIONS)[number]>("15");

  const availableClasses = useMemo(() => {
    let sub = data.filter((r) => r.campana === campana && !r.esTotalClase);
    if (provincia !== TODAS_LAS_PROVINCIAS) sub = sub.filter((r) => r.provincia === provincia);
    if (tipo !== TODAS_LAS_VARIEDADES) sub = sub.filter((r) => r.tipoTabaco === tipo);
    return Array.from(new Set(sub.map((r) => r.claseComercial))).sort();
  }, [data, campana, provincia, tipo]);

  const curr = useMemo(
    () => filterAcopioClases(data, campana, provincia, tipo, selectedClases),
    [data, campana, provincia, tipo, selectedClases]
  );
  const prevCampana = campanaAnterior(campanas, campana);
  const prev = useMemo(
    () => (prevCampana ? filterAcopioClases(data, prevCampana, provincia, tipo, selectedClases) : []),
    [data, prevCampana, provincia, tipo, selectedClases]
  );

  const volTotTn = sum(curr.map((r) => r.volumenTn));
  const numClases = new Set(curr.map((r) => r.claseComercial)).size;

  const claseTotales = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of curr) m.set(r.claseComercial, (m.get(r.claseComercial) ?? 0) + r.volumenTn);
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [curr]);
  const [top1ClaseName, top1ClaseVol] = claseTotales[0] ?? ["N/D", 0];
  const top1ClaseShare = volTotTn > 0 ? (top1ClaseVol / volTotTn) * 100 : 0;

  const varTotales = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of curr) m.set(r.tipoTabaco, (m.get(r.tipoTabaco) ?? 0) + r.volumenTn);
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [curr]);
  const [topVarName, topVarVol] = varTotales[0] ?? ["N/D", 0];
  const topVarShare = volTotTn > 0 ? (topVarVol / volTotTn) * 100 : 0;

  const prevVolTotTn = sum(prev.map((r) => r.volumenTn));
  const deltaVol = prev.length > 0 ? deltaPct(volTotTn, prevVolTotTn) : null;

  const chartData = useMemo(() => {
    const agg = new Map<string, { claseComercial: string; tipoTabaco: string; volumenTn: number; volumenKg: number }>();
    for (const r of curr) {
      const key = `${r.claseComercial}__${r.tipoTabaco}`;
      if (!agg.has(key)) agg.set(key, { claseComercial: r.claseComercial, tipoTabaco: r.tipoTabaco, volumenTn: 0, volumenKg: 0 });
      const g = agg.get(key)!;
      g.volumenTn += r.volumenTn;
      g.volumenKg += r.volumenKg;
    }
    const topOrder = topN === "Todas" ? claseTotales.map(([c]) => c) : claseTotales.slice(0, Number(topN)).map(([c]) => c);
    const topOrderSet = new Set(topOrder);
    const rows = Array.from(agg.values())
      .filter((r) => topOrderSet.has(r.claseComercial))
      .map((r) => ({ ...r, sharePct: volTotTn > 0 ? (r.volumenTn / volTotTn) * 100 : 0 }));
    return { rows, order: topOrder };
  }, [curr, claseTotales, topN, volTotTn]);

  return (
    <>
      <div className="executive-header">
        <h1>Producción tabacalera según clase y variedad</h1>
        <p>acopio clasificado por grados comerciales de calidad (B1F, C1F, X1F, T1L, etc.), provincia y variedad.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <CampanaProvinciaVariedadFilter
          campanaLabel="Campaña de Acopio:"
          campanas={campanas}
          provincias={provincias}
          variedades={variedades}
          campana={campana}
          provincia={provincia}
          variedad={tipo}
          onCampanaChange={setCampana}
          onProvinciaChange={setProvincia}
          onVariedadChange={setTipo}
          showVariedad={false}
        />
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">🍂 Variedad de Tabaco</label>
          <Select value={tipo} onValueChange={(v) => v && setTipo(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODAS_LAS_VARIEDADES}>{TODAS_LAS_VARIEDADES}</SelectItem>
              {variedades.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">🔍 Filtrar Clases Específicas</label>
          <ClasesMultiselect options={availableClasses} selected={selectedClases} onChange={setSelectedClases} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <KpiCard title="Volumen Clasificado" value={`${volTotTn.toLocaleString("en-US", { maximumFractionDigits: 0 })} tn`} subtitle={`Campaña ${campana}`} delta={deltaVol} color="blue" />
        <KpiCard title="Clases Comerciales" value={`${numClases}`} subtitle="Grados de calidad registrados" color="emerald" />
        <KpiCard title="Clase Líder" value={top1ClaseName} subtitle={`${top1ClaseVol.toFixed(1)} tn (${top1ClaseShare.toFixed(1)}%)`} color="purple" />
        <KpiCard title="Variedad Dominante" value={topVarName} subtitle={`${topVarVol.toFixed(1)} tn (${topVarShare.toFixed(1)}%)`} color="amber" />
      </div>

      <div className="section-header">
        <h3>📊 Distribución de Volumen por Clase Comercial (Mayor a Menor)</h3>
      </div>
      <div className="flex justify-end">
        <Select value={topN} onValueChange={(v) => v && setTopN(v as (typeof TOP_N_OPTIONS)[number])}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TOP_N_OPTIONS.map((n) => (
              <SelectItem key={n} value={n}>
                Top {n} Clases
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-xl border border-border bg-card p-2">
        <ClassesGroupedBarChart data={chartData.rows} order={chartData.order} />
      </div>
    </>
  );
}

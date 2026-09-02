"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { KpiCard } from "@/components/kpi-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TODAS_LAS_EMPRESAS,
  TODAS_LAS_PROVINCIAS,
  campanaAnterior,
  deltaPct,
  filterEmpresas,
  sortCampanasDesc,
  sum,
} from "@/lib/filters";
import type { AcopioEmpresa } from "@/lib/types";

const CompaniesHorizontalBarChart = dynamic(
  () => import("@/components/charts/companies-horizontal-bar-chart").then((m) => m.CompaniesHorizontalBarChart),
  { ssr: false }
);

export function ModuloEmpresas({ data }: { data: AcopioEmpresa[] }) {
  const campanas = useMemo(() => sortCampanasDesc(data.map((d) => d.campana)), [data]);
  const provincias = useMemo(
    () => Array.from(new Set(data.map((d) => d.provincia).filter((p) => p !== "Total Nacional"))).sort(),
    [data]
  );

  const [campana, setCampana] = useState(campanas[0] ?? "");
  const [provincia, setProvincia] = useState(TODAS_LAS_PROVINCIAS);
  const [empresa, setEmpresa] = useState(TODAS_LAS_EMPRESAS);

  const availableCompanies = useMemo(() => {
    let sub = data.filter((r) => r.campana === campana && !r.esSubtotalEmpresa);
    if (provincia !== TODAS_LAS_PROVINCIAS) sub = sub.filter((r) => r.provincia === provincia);
    return Array.from(new Set(sub.map((r) => r.razonSocial))).sort();
  }, [data, campana, provincia]);

  const curr = useMemo(() => filterEmpresas(data, campana, provincia, empresa), [data, campana, provincia, empresa]);
  const prevCampana = campanaAnterior(campanas, campana);
  const prev = useMemo(
    () => (prevCampana ? filterEmpresas(data, prevCampana, provincia, empresa) : []),
    [data, prevCampana, provincia, empresa]
  );

  const totalVolTn = sum(curr.map((r) => r.volumenTn));
  const totalVal = sum(curr.map((r) => r.valorAcopioPesos));
  const nActive = new Set(curr.map((r) => r.razonSocial)).size;

  const ranking = useMemo(() => {
    const m = new Map<string, { razonSocial: string; volumenTn: number; valorAcopioPesos: number }>();
    for (const r of curr) {
      if (!m.has(r.razonSocial)) m.set(r.razonSocial, { razonSocial: r.razonSocial, volumenTn: 0, valorAcopioPesos: 0 });
      const g = m.get(r.razonSocial)!;
      g.volumenTn += r.volumenTn;
      g.valorAcopioPesos += r.valorAcopioPesos;
    }
    return Array.from(m.values())
      .sort((a, b) => b.volumenTn - a.volumenTn)
      .map((r) => ({ ...r, marketSharePct: totalVolTn > 0 ? (r.volumenTn / totalVolTn) * 100 : 0 }));
  }, [curr, totalVolTn]);

  const top1 = ranking[0];
  const top3Share = ranking.slice(0, 3).reduce((acc, r) => acc + r.marketSharePct, 0);

  const prevVolTotTn = sum(prev.map((r) => r.volumenTn));
  const deltaVol = prev.length > 0 ? deltaPct(totalVolTn, prevVolTotTn) : null;

  const valStr = totalVal >= 1e9 ? `$${(totalVal / 1e9).toFixed(1)} B` : `$${(totalVal / 1e6).toFixed(1)} M`;
  const top1Disp = top1 ? (top1.razonSocial.length > 20 ? `${top1.razonSocial.slice(0, 20)}...` : top1.razonSocial) : "N/D";

  return (
    <>
      <div className="executive-header">
        <h1>Volúmenes acopiados por Empresa</h1>
        <p>cuotas de mercado (Market Share) y valor monetario por razón social y cooperativa.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">📅 Campaña de Análisis</label>
          <Select value={campana} onValueChange={(v) => v && setCampana(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {campanas.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">📍 Provincia</label>
          <Select value={provincia} onValueChange={(v) => v && setProvincia(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODAS_LAS_PROVINCIAS}>{TODAS_LAS_PROVINCIAS}</SelectItem>
              {provincias.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">🏢 Filtrar Empresa / Razón Social</label>
          <Select value={empresa} onValueChange={(v) => v && setEmpresa(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODAS_LAS_EMPRESAS}>{TODAS_LAS_EMPRESAS}</SelectItem>
              {availableCompanies.map((e) => (
                <SelectItem key={e} value={e}>
                  {e}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <KpiCard title="Empresas Activas" value={`${nActive}`} subtitle={`Campaña ${campana}`} color="blue" />
        <KpiCard
          title="Líder de Acopio"
          value={top1Disp}
          subtitle={top1 ? `${top1.volumenTn.toFixed(1)} tn (${top1.marketSharePct.toFixed(1)}% cuota)` : "S/D"}
          color="emerald"
        />
        <KpiCard title="Concentración Top 3" value={`${top3Share.toFixed(1)}%`} subtitle="Cuota conjunta del Top 3" color="purple" />
        <KpiCard title="Valor Total Generado" value={valStr} subtitle={`Volumen: ${totalVolTn.toLocaleString("en-US", { maximumFractionDigits: 0 })} tn`} delta={deltaVol} color="amber" />
      </div>

      <div className="section-header">
        <h3>📊 Participación de Mercado por Empresa (Market Share)</h3>
      </div>
      <div className="rounded-xl border border-border bg-card p-2">
        <CompaniesHorizontalBarChart data={ranking} />
      </div>
    </>
  );
}

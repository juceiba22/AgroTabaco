"use client";

import { useMemo, useState } from "react";
import { KpiCard } from "@/components/kpi-card";
import { CampanaProvinciaVariedadFilter } from "@/components/panels/tabacostats/filters/campana-provincia-variedad-filter";
import dynamic from "next/dynamic";
import {
  TODAS_LAS_PROVINCIAS,
  TODAS_LAS_VARIEDADES,
  campanaAnterior,
  deltaPct,
  filterProduccion,
  sortCampanasDesc,
  sum,
} from "@/lib/panels/tabacostats/filters";
import type { ProduccionPrimaria } from "@/lib/panels/tabacostats/types";

const ProductionComboChart = dynamic(
  () => import("@/components/panels/tabacostats/charts/production-combo-chart").then((m) => m.ProductionComboChart),
  { ssr: false }
);

function formatMoney(value: number) {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/kg`;
}

export function ModuloProduccion({ data }: { data: ProduccionPrimaria[] }) {
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

  const curr = useMemo(() => filterProduccion(data, campana, provincia, tipo), [data, campana, provincia, tipo]);
  const prevCampana = campanaAnterior(campanas, campana);
  const prev = useMemo(
    () => (prevCampana ? filterProduccion(data, prevCampana, provincia, tipo) : []),
    [data, prevCampana, provincia, tipo]
  );

  const prodTn = sum(curr.map((r) => r.produccionTn));
  const supCos = sum(curr.map((r) => r.supCosechadaHa));
  const supSem = sum(curr.map((r) => r.supSembradaHa));
  const rend = supCos > 0 ? sum(curr.map((r) => r.produccionKg)) / supCos : 0;
  const tasaPerdida = supSem > 0 ? ((supSem - supCos) / supSem) * 100 : 0;

  const validPrices = curr.filter((r) => r.precioTotalUnitario !== null && (r.produccionKg ?? 0) > 0);
  const precioStr =
    validPrices.length > 0
      ? formatMoney(sum(validPrices.map((r) => r.valorTotalEstimado)) / sum(validPrices.map((r) => r.produccionKg)))
      : "S/D";

  const prevProdTn = sum(prev.map((r) => r.produccionTn));
  const prevSupCos = sum(prev.map((r) => r.supCosechadaHa));
  const prevRend = prevSupCos > 0 ? sum(prev.map((r) => r.produccionKg)) / prevSupCos : 0;

  const deltaProd = prev.length > 0 ? deltaPct(prodTn, prevProdTn) : null;
  const deltaSup = prev.length > 0 ? deltaPct(supCos, prevSupCos) : null;
  const deltaRend = prev.length > 0 ? deltaPct(rend, prevRend) : null;

  const chartData = useMemo(() => {
    let base = data.filter((r) => !r.esTotal);
    base = provincia !== TODAS_LAS_PROVINCIAS ? base.filter((r) => r.provincia === provincia) : base.filter((r) => r.ambito === "PROVINCIAL");
    if (tipo !== TODAS_LAS_VARIEDADES) base = base.filter((r) => r.tipoTabaco === tipo);

    const grouped = new Map<string, { campana: string; anioInicio: number; produccionTn: number; supCosechadaHa: number }>();
    for (const row of base) {
      const key = row.campana;
      if (!grouped.has(key)) grouped.set(key, { campana: row.campana, anioInicio: row.anioInicio, produccionTn: 0, supCosechadaHa: 0 });
      const g = grouped.get(key)!;
      g.produccionTn += row.produccionTn ?? 0;
      g.supCosechadaHa += row.supCosechadaHa ?? 0;
    }
    return Array.from(grouped.values()).sort((a, b) => a.anioInicio - b.anioInicio);
  }, [data, provincia, tipo]);

  return (
    <>
      <div className="executive-header">
        <h1>Producción Primaria y Hectáreas</h1>
        <p>(Serie histórica 1991/1992 - 2022/2023).</p>
      </div>

      <CampanaProvinciaVariedadFilter
        campanaLabel="Campaña Agrícola:"
        campanas={campanas}
        provincias={provincias}
        variedades={variedades}
        campana={campana}
        provincia={provincia}
        variedad={tipo}
        onCampanaChange={setCampana}
        onProvinciaChange={setProvincia}
        onVariedadChange={setTipo}
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <KpiCard title="Producción Total" value={`${prodTn.toLocaleString("en-US", { maximumFractionDigits: 0 })} tn`} subtitle={`Campaña ${campana}`} delta={deltaProd} color="blue" />
        <KpiCard
          title="Superficie Cosechada"
          value={`${supCos.toLocaleString("en-US", { maximumFractionDigits: 0 })} ha`}
          subtitle={`Sembrada: ${supSem.toLocaleString("en-US", { maximumFractionDigits: 0 })} ha (${tasaPerdida.toFixed(1)}% pérdida)`}
          delta={deltaSup}
          color="emerald"
        />
        <KpiCard title="Rendimiento Ponderado" value={`${rend.toLocaleString("en-US", { maximumFractionDigits: 0 })} kg/ha`} subtitle="Productividad media" delta={deltaRend} color="purple" />
        <KpiCard title="Precio Promedio Total" value={precioStr} subtitle="Acopio + Retorno FET" color="amber" />
      </div>

      <div className="rounded-xl border border-border bg-card p-2">
        <ProductionComboChart data={chartData} />
      </div>
    </>
  );
}

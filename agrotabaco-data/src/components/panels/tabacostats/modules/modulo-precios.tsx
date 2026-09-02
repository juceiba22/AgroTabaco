"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { KpiCard } from "@/components/kpi-card";
import { CampanaProvinciaVariedadFilter } from "@/components/panels/tabacostats/filters/campana-provincia-variedad-filter";
import {
  TODAS_LAS_PROVINCIAS,
  TODAS_LAS_VARIEDADES,
  campanaAnterior,
  deltaPct,
  filterAcopioPrecios,
  sortCampanasDesc,
  sum,
} from "@/lib/panels/tabacostats/filters";
import type { AcopioPrecio } from "@/lib/panels/tabacostats/types";

const PriceCompositionChart = dynamic(
  () => import("@/components/panels/tabacostats/charts/price-composition-chart").then((m) => m.PriceCompositionChart),
  { ssr: false }
);

function fmtPrecio(v: number) {
  return `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/kg`;
}

export function ModuloPrecios({ data }: { data: AcopioPrecio[] }) {
  const campanas = useMemo(() => sortCampanasDesc(data.map((d) => d.campana)), [data]);
  const provincias = useMemo(
    () => Array.from(new Set(data.map((d) => d.provincia).filter((p) => p !== "Total Nacional"))).sort(),
    [data]
  );
  const variedades = useMemo(
    () =>
      Array.from(
        new Set(data.map((d) => d.tipoTabaco).filter((t) => t !== "Total Nacional" && t !== "Subtotal Provincial"))
      ).sort(),
    [data]
  );

  const [campana, setCampana] = useState(campanas[0] ?? "");
  const [provincia, setProvincia] = useState(TODAS_LAS_PROVINCIAS);
  const [tipo, setTipo] = useState(TODAS_LAS_VARIEDADES);

  const curr = useMemo(() => filterAcopioPrecios(data, campana, provincia, tipo), [data, campana, provincia, tipo]);
  const prevCampana = campanaAnterior(campanas, campana);
  const prev = useMemo(
    () => (prevCampana ? filterAcopioPrecios(data, prevCampana, provincia, tipo) : []),
    [data, prevCampana, provincia, tipo]
  );

  const volTotKg = sum(curr.map((r) => r.volumenKg));
  const valAcop = sum(curr.map((r) => r.valorAcopioPesos));
  const valFet = sum(curr.map((r) => r.valorFetPesos));
  const valTot = sum(curr.map((r) => r.valorTotalPesos));

  let precioAcopioPond = 0;
  let precioFetPond = 0;
  let precioTotalPond = 0;
  let pctFetPond = 0;
  let pctAcopPond = 0;
  if (volTotKg > 0) {
    precioAcopioPond = valAcop / volTotKg;
    precioFetPond = valFet / volTotKg;
    precioTotalPond = valTot / volTotKg;
    pctFetPond = valTot > 0 ? (valFet / valTot) * 100 : 0;
    pctAcopPond = valTot > 0 ? (valAcop / valTot) * 100 : 0;
  }

  const prevVolKg = sum(prev.map((r) => r.volumenKg));
  let deltaPrecioTot: number | null = null;
  if (prevVolKg > 0) {
    const prevPTot = sum(prev.map((r) => r.valorTotalPesos)) / prevVolKg;
    deltaPrecioTot = deltaPct(precioTotalPond, prevPTot);
  }

  const chartData = useMemo(() => {
    return data
      .filter((r) => r.esTotalNacional)
      .sort((a, b) => a.anioInicio - b.anioInicio)
      .map((r) => ({
        campana: r.campana,
        precioAcopioPromedio: r.precioAcopioPromedio,
        precioFetPromedio: r.precioFetPromedio,
        pctFet: r.pctFet,
      }));
  }, [data]);

  return (
    <>
      <div className="executive-header">
        <h1>Serie histórica de Precio Acopio Argentina</h1>
        <p>componente de Precio de Acopio base y complemento del Fondo Especial del Tabaco (Ley 19.800).</p>
      </div>

      <CampanaProvinciaVariedadFilter
        campanaLabel="Campaña de Precios:"
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
        <KpiCard title="Precio Acopio Base" value={fmtPrecio(precioAcopioPond)} subtitle={`${pctAcopPond.toFixed(1)}% del ingreso total`} color="blue" />
        <KpiCard title="Complemento FET" value={fmtPrecio(precioFetPond)} subtitle={`${pctFetPond.toFixed(1)}% del ingreso total`} color="emerald" />
        <KpiCard title="Precio Total Productor" value={fmtPrecio(precioTotalPond)} subtitle="Acopio + Retorno FET" delta={deltaPrecioTot} color="purple" />
        <KpiCard title="Participación del FET" value={`${pctFetPond.toFixed(1)}%`} subtitle="Peso sobre el total" color="amber" />
      </div>

      <div className="section-header">
        <h3>📊 Composición del Precio por Unidad: Acopio Base vs Complemento FET</h3>
      </div>
      <div className="rounded-xl border border-border bg-card p-2">
        <PriceCompositionChart data={chartData} />
      </div>
    </>
  );
}

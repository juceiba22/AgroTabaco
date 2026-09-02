"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { coberturaByYear, coberturaStats } from "@/lib/panels/observatorio-fet/filters";
import type { PoaTabaco } from "@/lib/panels/observatorio-fet/types";

const CoberturaChart = dynamic(() => import("@/components/panels/observatorio-fet/charts/cobertura-chart").then((m) => m.CoberturaChart), { ssr: false });

const SORT_OPTIONS = [
  { value: "usd_desc", label: "Mayor a Menor Monto USD" },
  { value: "recent", label: "Año Más Reciente" },
  { value: "sin_dato", label: "Registros Sin Monto Verificado Primero" },
] as const;

export function ModuloCalidad({ dataFiltrado }: { dataFiltrado: PoaTabaco[] }) {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<(typeof SORT_OPTIONS)[number]["value"]>("recent");

  const stats = useMemo(() => coberturaStats(dataFiltrado), [dataFiltrado]);
  const cobertura = useMemo(() => coberturaByYear(dataFiltrado), [dataFiltrado]);

  const rows = useMemo(() => {
    let filtered = dataFiltrado;
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.archivoOrigen.toLowerCase().includes(q) ||
          r.provinciaDisplay.toLowerCase().includes(q) ||
          (r.componente ?? "").toLowerCase().includes(q) ||
          (r.organismoEjecutor ?? "").toLowerCase().includes(q) ||
          (r.norma ?? "").toLowerCase().includes(q)
      );
    }
    const sorted = [...filtered];
    if (sortOrder === "usd_desc") sorted.sort((a, b) => (b.montoUsd ?? -1) - (a.montoUsd ?? -1));
    else if (sortOrder === "recent") sorted.sort((a, b) => (b.anioResolucion ?? 0) - (a.anioResolucion ?? 0));
    else sorted.sort((a, b) => (a.montoUsd == null ? -1 : 1) - (b.montoUsd == null ? -1 : 1));
    return sorted;
  }, [dataFiltrado, search, sortOrder]);

  function handleDownload() {
    const header = "archivo_origen,provincia,anio_resolucion,campana,objeto_programa,componente,monto_ars,monto_usd,es_anexo\n";
    const body = rows
      .map((r) =>
        [
          r.archivoOrigen,
          r.provinciaDisplay,
          r.anioResolucion ?? "",
          r.campanaDisplay ?? "",
          r.objetoPrograma ?? "",
          `"${(r.componente ?? "").replace(/"/g, '""')}"`,
          r.montoArs ?? "",
          r.montoUsd ?? "",
          r.esAnexo ? "SI" : "NO",
        ].join(",")
      )
      .join("\n");
    const blob = new Blob(["﻿" + header + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "observatorio_fet_registros.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div>
        <h3 className="font-serif text-lg font-bold text-brand-green-dark">🔍 Calidad de Datos y Consulta de Registros</h3>
        <p className="text-sm text-muted-foreground">
          La base se construyó con un pipeline de extracción automática sobre miles de PDFs de Resoluciones y Anexos. No todos los
          registros tienen todos los campos verificados — acá se muestra la cobertura real, y se puede buscar registro por registro.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <span className="coverage-badge">Con monto USD</span>
          <div className="mt-2 text-2xl font-bold text-foreground">{stats.pctMontoUsd.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.conMontoUsd.toLocaleString("es-AR")} de {stats.total.toLocaleString("es-AR")}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <span className="coverage-badge">Con monto ARS</span>
          <div className="mt-2 text-2xl font-bold text-foreground">{stats.pctMontoArs.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.conMontoArs.toLocaleString("es-AR")} de {stats.total.toLocaleString("es-AR")}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <span className="coverage-badge">Son Anexo</span>
          <div className="mt-2 text-2xl font-bold text-foreground">{stats.pctAnexos.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.anexos.toLocaleString("es-AR")} de {stats.total.toLocaleString("es-AR")}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <span className="coverage-badge">Provincia sin identificar</span>
          <div className="mt-2 text-2xl font-bold text-foreground">{stats.pctSinIdentificar.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.sinIdentificar.toLocaleString("es-AR")} de {stats.total.toLocaleString("es-AR")}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-2">
        <CoberturaChart data={cobertura} />
      </div>

      <div className="grid gap-4 sm:grid-cols-[3fr_1fr]">
        <Input
          placeholder="🔍 Buscar por archivo, provincia, componente, organismo o norma..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={sortOrder} onValueChange={(v) => v && setSortOrder(v as (typeof SORT_OPTIONS)[number]["value"])}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="max-h-[450px] overflow-auto rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-card">
            <tr className="border-b border-border text-muted-foreground">
              <th className="px-3 py-2">Archivo fuente</th>
              <th className="px-3 py-2">Provincia</th>
              <th className="px-3 py-2">Año</th>
              <th className="px-3 py-2">Programa</th>
              <th className="px-3 py-2">Monto USD</th>
              <th className="px-3 py-2">Anexo</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 500).map((r, i) => (
              <tr key={i} className="border-b border-border/50">
                <td className="max-w-[260px] truncate px-3 py-1.5" title={r.archivoOrigen}>
                  {r.archivoOrigen}
                </td>
                <td className="px-3 py-1.5">{r.provinciaDisplay}</td>
                <td className="px-3 py-1.5">{r.anioResolucion ?? "—"}</td>
                <td className="px-3 py-1.5">{r.objetoPrograma ?? "—"}</td>
                <td className="px-3 py-1.5">{r.montoUsd != null ? `USD ${r.montoUsd.toLocaleString("en-US")}` : "Sin dato"}</td>
                <td className="px-3 py-1.5">{r.esAnexo ? "Sí" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        Mostrando {Math.min(rows.length, 500).toLocaleString("es-AR")} de {rows.length.toLocaleString("es-AR")} registros en pantalla —
        la descarga incluye todos.
      </p>

      <button
        onClick={handleDownload}
        className="w-fit rounded-md bg-brand-green-dark px-4 py-2 text-sm font-medium text-white hover:bg-brand-green-darker"
      >
        📥 Descargar Registros Filtrados en CSV
      </button>
    </>
  );
}

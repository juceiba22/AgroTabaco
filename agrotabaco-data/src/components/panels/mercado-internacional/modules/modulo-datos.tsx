"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TobaccoProduction } from "@/lib/panels/mercado-internacional/types";

const SORT_OPTIONS = [
  { value: "desc", label: "Mayor a Menor Volumen" },
  { value: "asc", label: "Menor a Mayor Volumen" },
  { value: "recent", label: "Año Más Reciente" },
  { value: "alpha", label: "Alfabético" },
] as const;

export function ModuloDatos({ dataFiltrado, unit, startYear, endYear }: { dataFiltrado: TobaccoProduction[]; unit: string; startYear: number; endYear: number }) {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<(typeof SORT_OPTIONS)[number]["value"]>("desc");

  const rows = useMemo(() => {
    let filtered = dataFiltrado;
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (d) => d.entity.toLowerCase().includes(q) || (d.code ?? "").toLowerCase().includes(q) || d.entityDisplay.toLowerCase().includes(q)
      );
    }
    const sorted = [...filtered];
    if (sortOrder === "desc") sorted.sort((a, b) => b.valueTonnes - a.valueTonnes);
    else if (sortOrder === "asc") sorted.sort((a, b) => a.valueTonnes - b.valueTonnes);
    else if (sortOrder === "recent") sorted.sort((a, b) => b.year - a.year || b.valueTonnes - a.valueTonnes);
    else sorted.sort((a, b) => a.entity.localeCompare(b.entity) || a.year - b.year);
    return sorted;
  }, [dataFiltrado, search, sortOrder]);

  function handleDownload() {
    const header = "Entity,Code,Year,Entity_Type,Entity_Display,Value_Tonnes\n";
    const body = rows
      .map((r) => `${r.entity},${r.code ?? ""},${r.year},${r.entityType},"${r.entityDisplay}",${r.valueTonnes}`)
      .join("\n");
    const blob = new Blob(["﻿" + header + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `FAOstat_tabaco_${startYear}_${endYear}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div>
        <h3 className="font-serif text-lg font-bold text-brand-green-dark">📊 Matriz de Datos Oficiales y Exportación</h3>
        <p className="text-sm text-muted-foreground">Explorá los datos en formato tabular con filtros dinámicos y descargá la selección directamente en formato CSV.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-[3fr_1fr]">
        <Input placeholder="🔍 Buscar por País / Entidad / Código ISO..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
              <th className="px-3 py-2">País / Entidad</th>
              <th className="px-3 py-2">Código ISO</th>
              <th className="px-3 py-2">Año</th>
              <th className="px-3 py-2">Tipo</th>
              <th className="px-3 py-2">Volumen ({unit})</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 500).map((r, i) => (
              <tr key={i} className="border-b border-border/50">
                <td className="px-3 py-1.5">{r.entityDisplay}</td>
                <td className="px-3 py-1.5">{r.code ?? "—"}</td>
                <td className="px-3 py-1.5">{r.year}</td>
                <td className="px-3 py-1.5">{r.entityType}</td>
                <td className="px-3 py-1.5">{r.valueTonnes.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        Mostrando {Math.min(rows.length, 500).toLocaleString("en-US")} de {rows.length.toLocaleString("en-US")} registros en pantalla — la descarga incluye todos.
      </p>

      <button
        onClick={handleDownload}
        className="w-fit rounded-md bg-brand-green-dark px-4 py-2 text-sm font-medium text-white hover:bg-brand-green-darker"
      >
        📥 Descargar Datos Filtrados en CSV
      </button>
    </>
  );
}

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
import { cleanResolucionLabel, sortCampanasGuionDesc, sum } from "@/lib/filters";
import type { PrecioResolucion } from "@/lib/types";

const PrecioFetAreaChart = dynamic(
  () => import("@/components/charts/precio-fet-area-chart").then((m) => m.PrecioFetAreaChart),
  { ssr: false }
);
const PrecioFetComparativoChart = dynamic(
  () => import("@/components/charts/precio-fet-comparativo-chart").then((m) => m.PrecioFetComparativoChart),
  { ssr: false }
);

const PAGE_SIZE = 25;

export function ModuloPrecioFet({ data }: { data: PrecioResolucion[] }) {
  const variedades = useMemo(() => Array.from(new Set(data.map((d) => d.tabaco))).sort(), [data]);
  const [tipo, setTipo] = useState(variedades.includes("Virginia") ? "Virginia" : variedades[0] ?? "");

  const clasesPorCobertura = useMemo(() => {
    const porClase = new Map<string, Set<string>>();
    for (const r of data) {
      if (r.tabaco !== tipo || !r.clase) continue;
      if (!porClase.has(r.clase)) porClase.set(r.clase, new Set());
      porClase.get(r.clase)!.add(r.campana);
    }
    return Array.from(porClase.entries())
      .map(([clase, campanas]) => [clase, campanas.size] as const)
      .sort((a, b) => b[1] - a[1]);
  }, [data, tipo]);
  const [clase, setClase] = useState(clasesPorCobertura[0]?.[0] ?? "");

  const serie = useMemo(() => data.filter((r) => r.tabaco === tipo && r.clase === clase), [data, tipo, clase]);

  const precioPromArs = serie.length ? sum(serie.map((r) => r.precioTotalAcumulado)) / serie.length : null;
  const precioPromUsd = serie.length ? sum(serie.map((r) => r.precioTotalAcumuladoUsd)) / serie.length : null;
  const nResoluciones = new Set(serie.map((r) => r.archivoOrigen)).size;

  const campanasOrden = useMemo(() => sortCampanasGuionDesc(serie.map((r) => r.campana)).reverse(), [serie]);

  const aggCampana = useMemo(() => {
    const m = new Map<string, { n: number; a1ars: number; a2ars: number; incars: number; a1usd: number; a2usd: number; incusd: number }>();
    for (const r of serie) {
      if (!m.has(r.campana)) m.set(r.campana, { n: 0, a1ars: 0, a2ars: 0, incars: 0, a1usd: 0, a2usd: 0, incusd: 0 });
      const g = m.get(r.campana)!;
      g.n += 1;
      g.a1ars += r.adelanto1 ?? 0;
      g.a2ars += r.adelanto2 ?? 0;
      g.incars += r.incremento ?? 0;
      g.a1usd += r.adelanto1Usd ?? 0;
      g.a2usd += r.adelanto2Usd ?? 0;
      g.incusd += r.incrementoUsd ?? 0;
    }
    return campanasOrden.map((c) => {
      const g = m.get(c)!;
      return {
        campana: c,
        adelanto1: g.a1ars / g.n,
        adelanto2: g.a2ars / g.n,
        incremento: g.incars / g.n,
        adelanto1Usd: g.a1usd / g.n,
        adelanto2Usd: g.a2usd / g.n,
        incrementoUsd: g.incusd / g.n,
      };
    });
  }, [serie, campanasOrden]);

  // --- Comparativo de clases por campaña ---
  const campanasComp = useMemo(() => sortCampanasGuionDesc(data.map((d) => d.campana)), [data]);
  const [campanaComp, setCampanaComp] = useState(campanasComp[0] ?? "");
  const [tipoComp, setTipoComp] = useState(tipo);
  const [monedaComp, setMonedaComp] = useState<"ARS" | "USD">("ARS");

  const compData = useMemo(() => {
    const rows = data.filter((r) => r.campana === campanaComp && r.tabaco === tipoComp);
    const m = new Map<string, { n: number; total: number }>();
    for (const r of rows) {
      if (!r.clase) continue;
      const key = `${r.clase}__${cleanResolucionLabel(r.archivoOrigen)}`;
      if (!m.has(key)) m.set(key, { n: 0, total: 0 });
      const g = m.get(key)!;
      const valor = monedaComp === "ARS" ? r.precioTotalAcumulado : r.precioTotalAcumuladoUsd;
      g.total += valor ?? 0;
      g.n += 1;
    }
    return Array.from(m.entries()).map(([key, g]) => {
      const [clase, resolucion] = key.split("__");
      return { clase, resolucion, valor: g.total / g.n };
    });
  }, [data, campanaComp, tipoComp, monedaComp]);

  // --- Detalle de resoluciones ---
  const [campanaTabla, setCampanaTabla] = useState<string>("Todas las Campañas");
  const dfTablaBase = useMemo(
    () => (campanaTabla === "Todas las Campañas" ? data : data.filter((r) => r.campana === campanaTabla)),
    [data, campanaTabla]
  );
  const resolOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const r of dfTablaBase) {
      const label = `${cleanResolucionLabel(r.archivoOrigen)} (${r.campana})`;
      seen.set(label, r.archivoOrigen);
    }
    return Array.from(seen.entries());
  }, [dfTablaBase]);
  const [resolLabel, setResolLabel] = useState("Todas las Resoluciones");
  const resolMap = useMemo(() => new Map(resolOptions), [resolOptions]);

  const tablaFiltrada = useMemo(() => {
    if (resolLabel === "Todas las Resoluciones") return dfTablaBase;
    const archivo = resolMap.get(resolLabel);
    return dfTablaBase.filter((r) => r.archivoOrigen === archivo);
  }, [dfTablaBase, resolLabel, resolMap]);

  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(tablaFiltrada.length / PAGE_SIZE));
  const pageRows = tablaFiltrada.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div className="executive-header">
        <h1>Evolución del Precio FET 2004 - 2025 en pesos y en dólares</h1>
        <p>Adelantos, incrementos y total FET</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">🍂 Variedad de Tabaco</label>
          <Select
            value={tipo}
            onValueChange={(v) => {
              if (!v) return;
              setTipo(v);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {variedades.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">🏷️ Clase</label>
          <Select value={clase} onValueChange={(v) => v && setClase(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {clasesPorCobertura.map(([c]) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          title="Precio Promedio Acumulado"
          value={precioPromArs !== null ? `$${precioPromArs.toLocaleString("en-US", { maximumFractionDigits: 2 })}` : "S/D"}
          subtitle={`Pesos — ${tipo}, clase ${clase}`}
          color="blue"
        />
        <KpiCard
          title="Precio Promedio Acumulado"
          value={precioPromUsd !== null ? `US$ ${precioPromUsd.toLocaleString("en-US", { maximumFractionDigits: 2 })}` : "S/D"}
          subtitle={`Dólares — ${tipo}, clase ${clase}`}
          color="emerald"
        />
        <KpiCard title="Resoluciones Analizadas" value={`${nResoluciones}`} subtitle={`${serie.length} registros para esta variedad y clase`} color="amber" />
      </div>

      {serie.length === 0 ? (
        <p className="text-muted-foreground">No hay datos para la variedad y clase seleccionadas.</p>
      ) : (
        <>
          <div className="section-header">
            <h3>💵 Evolución del Precio FET en Dólares</h3>
          </div>
          <div className="rounded-xl border border-border bg-card p-2">
            <PrecioFetAreaChart
              data={aggCampana.map((d) => ({ campana: d.campana, adelanto1: d.adelanto1Usd, adelanto2: d.adelanto2Usd, incremento: d.incrementoUsd }))}
              campanasOrden={campanasOrden}
              titulo={`Total FET (USD) — ${tipo}, clase ${clase}`}
            />
          </div>

          <div className="section-header">
            <h3>💰 Evolución del Precio FET en Pesos</h3>
          </div>
          <div className="rounded-xl border border-border bg-card p-2">
            <PrecioFetAreaChart data={aggCampana} campanasOrden={campanasOrden} titulo={`Total FET ($) — ${tipo}, clase ${clase}`} />
          </div>
        </>
      )}

      <div className="section-header">
        <h3>📊 Comparativo de Clases por Campaña</h3>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">📅 Campaña</label>
          <Select value={campanaComp} onValueChange={(v) => v && setCampanaComp(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {campanasComp.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">🍂 Variedad de Tabaco</label>
          <Select value={tipoComp} onValueChange={(v) => v && setTipoComp(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {variedades.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Moneda</label>
          <Select value={monedaComp} onValueChange={(v) => v && setMonedaComp(v as "ARS" | "USD")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ARS">Pesos ($)</SelectItem>
              <SelectItem value="USD">Dólares (US$)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {compData.length === 0 ? (
        <p className="text-muted-foreground">No hay resoluciones para esta campaña y variedad.</p>
      ) : (
        <div className="rounded-xl border border-border bg-card p-2">
          <PrecioFetComparativoChart
            data={compData}
            titulo={`Precio por clase — ${tipoComp}, campaña ${campanaComp}`}
            moneda={monedaComp === "ARS" ? "Pesos ($)" : "Dólares (US$)"}
          />
        </div>
      )}

      <div className="section-header">
        <h3>📋 Detalle de Resoluciones</h3>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">📅 Campaña</label>
          <Select
            value={campanaTabla}
            onValueChange={(v) => {
              if (!v) return;
              setCampanaTabla(v);
              setResolLabel("Todas las Resoluciones");
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas las Campañas">Todas las Campañas</SelectItem>
              {campanasComp.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">📄 Resolución</label>
          <Select
            value={resolLabel}
            onValueChange={(v) => {
              if (!v) return;
              setResolLabel(v);
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              <SelectItem value="Todas las Resoluciones">Todas las Resoluciones</SelectItem>
              {resolOptions.map(([label]) => (
                <SelectItem key={label} value={label}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {tablaFiltrada.length === 0 ? (
        <p className="text-muted-foreground">No hay registros para esta selección.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="whitespace-nowrap px-3 py-2">Campaña</th>
                  <th className="whitespace-nowrap px-3 py-2">Fecha</th>
                  <th className="whitespace-nowrap px-3 py-2">Tabaco</th>
                  <th className="whitespace-nowrap px-3 py-2">Clase</th>
                  <th className="whitespace-nowrap px-3 py-2">Adelanto 1</th>
                  <th className="whitespace-nowrap px-3 py-2">Adelanto 2</th>
                  <th className="whitespace-nowrap px-3 py-2">Incremento</th>
                  <th className="whitespace-nowrap px-3 py-2">Total Acumulado</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((r, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="whitespace-nowrap px-3 py-1.5">{r.campana}</td>
                    <td className="whitespace-nowrap px-3 py-1.5">{r.fecha ?? "—"}</td>
                    <td className="whitespace-nowrap px-3 py-1.5">{r.tabaco}</td>
                    <td className="whitespace-nowrap px-3 py-1.5">{r.clase ?? "—"}</td>
                    <td className="whitespace-nowrap px-3 py-1.5">{r.adelanto1?.toFixed(2) ?? "—"}</td>
                    <td className="whitespace-nowrap px-3 py-1.5">{r.adelanto2?.toFixed(2) ?? "—"}</td>
                    <td className="whitespace-nowrap px-3 py-1.5">{r.incremento?.toFixed(2) ?? "—"}</td>
                    <td className="whitespace-nowrap px-3 py-1.5">{r.precioTotalAcumulado?.toFixed(2) ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Mostrando {pageRows.length} de {tablaFiltrada.length.toLocaleString("en-US")} registros — página {page} de {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                className="rounded-md border border-input px-3 py-1 disabled:opacity-40"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ← Anterior
              </button>
              <button
                className="rounded-md border border-input px-3 py-1 disabled:opacity-40"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Siguiente →
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

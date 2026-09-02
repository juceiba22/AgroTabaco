import { sum } from "@/lib/utils";
import type { PoaTabaco } from "@/lib/panels/observatorio-fet/types";

export type YearTotal = { anio: number; totalUsd: number; countConUsd: number; countTotal: number };

/** Serie anual de monto_usd (única métrica comparable entre décadas). */
export function usdSeriesByYear(data: PoaTabaco[]): YearTotal[] {
  const map = new Map<number, YearTotal>();
  for (const r of data) {
    if (r.anioResolucion == null) continue;
    if (!map.has(r.anioResolucion)) {
      map.set(r.anioResolucion, { anio: r.anioResolucion, totalUsd: 0, countConUsd: 0, countTotal: 0 });
    }
    const bucket = map.get(r.anioResolucion)!;
    bucket.countTotal += 1;
    if (r.montoUsd != null) {
      bucket.totalUsd += r.montoUsd;
      bucket.countConUsd += 1;
    }
  }
  return Array.from(map.values()).sort((a, b) => a.anio - b.anio);
}

export type ProvinciaRanking = {
  provincia: string;
  provinciaDisplay: string;
  totalUsd: number;
  countPoas: number;
  share: number;
};

/** Ranking de provincias por monto_usd histórico total (rango ya filtrado por el caller). */
export function rankingByProvincia(data: PoaTabaco[]): ProvinciaRanking[] {
  const map = new Map<string, ProvinciaRanking>();
  for (const r of data) {
    if (!map.has(r.provincia)) {
      map.set(r.provincia, { provincia: r.provincia, provinciaDisplay: r.provinciaDisplay, totalUsd: 0, countPoas: 0, share: 0 });
    }
    const bucket = map.get(r.provincia)!;
    bucket.countPoas += 1;
    if (r.montoUsd != null) bucket.totalUsd += r.montoUsd;
  }
  const rows = Array.from(map.values()).sort((a, b) => b.totalUsd - a.totalUsd);
  const totalUsd = sum(rows.map((r) => r.totalUsd));
  for (const r of rows) r.share = totalUsd > 0 ? (r.totalUsd / totalUsd) * 100 : 0;
  return rows;
}

export type ProgramaBreakdown = { objetoPrograma: string; totalUsd: number; countPoas: number; percentage: number };

/** Desglose por objeto_programa (única categoría limpia del dataset: 9 valores). */
export function breakdownByObjetoPrograma(data: PoaTabaco[]): ProgramaBreakdown[] {
  const map = new Map<string, ProgramaBreakdown>();
  for (const r of data) {
    const key = r.objetoPrograma ?? "Sin Clasificar";
    if (!map.has(key)) map.set(key, { objetoPrograma: key, totalUsd: 0, countPoas: 0, percentage: 0 });
    const bucket = map.get(key)!;
    bucket.countPoas += 1;
    if (r.montoUsd != null) bucket.totalUsd += r.montoUsd;
  }
  const rows = Array.from(map.values()).sort((a, b) => b.totalUsd - a.totalUsd);
  const totalUsd = sum(rows.map((r) => r.totalUsd));
  for (const r of rows) r.percentage = totalUsd > 0 ? (r.totalUsd / totalUsd) * 100 : 0;
  return rows;
}

export type AsistenciaBreakdown = {
  tipoAsistencia: string;
  modalidadDesembolso: string;
  totalUsd: number;
  countPoas: number;
};

/** Cruce tipo_asistencia x modalidad_desembolso (2 x 2 valores, ambos limpios). */
export function breakdownByAsistencia(data: PoaTabaco[]): AsistenciaBreakdown[] {
  const map = new Map<string, AsistenciaBreakdown>();
  for (const r of data) {
    const tipo = r.tipoAsistencia ?? "Sin Dato";
    const modalidad = r.modalidadDesembolso ?? "Sin Dato";
    const key = `${tipo}|${modalidad}`;
    if (!map.has(key)) map.set(key, { tipoAsistencia: tipo, modalidadDesembolso: modalidad, totalUsd: 0, countPoas: 0 });
    const bucket = map.get(key)!;
    bucket.countPoas += 1;
    if (r.montoUsd != null) bucket.totalUsd += r.montoUsd;
  }
  return Array.from(map.values()).sort((a, b) => b.countPoas - a.countPoas);
}

/**
 * Total en ARS nominal de los registros ya filtrados. No debe usarse sobre
 * un rango de años amplio (hiperinflación de por medio) — el caller es
 * responsable de acotar `data` a un año o campaña puntual antes de llamar.
 */
export function totalArsNominal(data: PoaTabaco[]): { total: number; count: number } {
  const withArs = data.filter((r) => r.montoArs != null);
  return { total: sum(withArs.map((r) => r.montoArs as number)), count: withArs.length };
}

export type ComponenteBreakdown = { label: string; totalUsd: number; countPoas: number };

/**
 * Top componentes dentro de un objeto_programa. Agrupa sobre una clave
 * normalizada (trim + upper) para no separar duplicados por variación de
 * mayúsculas, pero muestra el label original más frecuente del grupo (no se
 * intenta un clustering más avanzado).
 */
export function topComponentes(data: PoaTabaco[], limit = 10): ComponenteBreakdown[] {
  const groups = new Map<string, { totalUsd: number; countPoas: number; labelCounts: Map<string, number> }>();
  for (const r of data) {
    const raw = r.componente?.trim();
    if (!raw) continue;
    const key = raw.toUpperCase();
    if (!groups.has(key)) groups.set(key, { totalUsd: 0, countPoas: 0, labelCounts: new Map() });
    const bucket = groups.get(key)!;
    bucket.countPoas += 1;
    if (r.montoUsd != null) bucket.totalUsd += r.montoUsd;
    bucket.labelCounts.set(raw, (bucket.labelCounts.get(raw) ?? 0) + 1);
  }
  const rows: ComponenteBreakdown[] = Array.from(groups.values()).map((bucket) => {
    const label = Array.from(bucket.labelCounts.entries()).sort((a, b) => b[1] - a[1])[0][0];
    return { label, totalUsd: bucket.totalUsd, countPoas: bucket.countPoas };
  });
  return rows.sort((a, b) => b.countPoas - a.countPoas).slice(0, limit);
}

export type CoberturaStats = {
  total: number;
  conMontoUsd: number;
  pctMontoUsd: number;
  conMontoArs: number;
  pctMontoArs: number;
  anexos: number;
  pctAnexos: number;
  sinIdentificar: number;
  pctSinIdentificar: number;
};

/** Métricas de transparencia de cobertura de datos para la pestaña "Calidad de Datos". */
export function coberturaStats(data: PoaTabaco[]): CoberturaStats {
  const total = data.length;
  const conMontoUsd = data.filter((r) => r.montoUsd != null).length;
  const conMontoArs = data.filter((r) => r.montoArs != null).length;
  const anexos = data.filter((r) => r.esAnexo).length;
  const sinIdentificar = data.filter((r) => r.provincia === "S_PROVINCIA").length;
  const pct = (n: number) => (total > 0 ? (n / total) * 100 : 0);
  return {
    total,
    conMontoUsd,
    pctMontoUsd: pct(conMontoUsd),
    conMontoArs,
    pctMontoArs: pct(conMontoArs),
    anexos,
    pctAnexos: pct(anexos),
    sinIdentificar,
    pctSinIdentificar: pct(sinIdentificar),
  };
}

/** Cobertura de monto_usd por año, para el gráfico de la pestaña "Calidad de Datos". */
export function coberturaByYear(data: PoaTabaco[]): { anio: number; pctCobertura: number; countTotal: number }[] {
  const map = new Map<number, { total: number; conUsd: number }>();
  for (const r of data) {
    if (r.anioResolucion == null) continue;
    if (!map.has(r.anioResolucion)) map.set(r.anioResolucion, { total: 0, conUsd: 0 });
    const bucket = map.get(r.anioResolucion)!;
    bucket.total += 1;
    if (r.montoUsd != null) bucket.conUsd += 1;
  }
  return Array.from(map.entries())
    .map(([anio, b]) => ({ anio, pctCobertura: b.total > 0 ? (b.conUsd / b.total) * 100 : 0, countTotal: b.total }))
    .sort((a, b) => a.anio - b.anio);
}

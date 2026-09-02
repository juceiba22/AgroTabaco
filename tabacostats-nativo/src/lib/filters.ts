import type { AcopioClase, AcopioEmpresa, AcopioPrecio, ProduccionPrimaria } from "@/lib/types";

export const TODAS_LAS_PROVINCIAS = "Todas las Provincias";
export const TODAS_LAS_VARIEDADES = "Todas las Variedades";
export const TODAS_LAS_EMPRESAS = "Todas las Empresas";

/** Campañas tipo "2019/2020" ordenan bien como string, más reciente primero. */
export function sortCampanasDesc(campanas: Iterable<string>): string[] {
  return Array.from(new Set(campanas)).sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
}

/** Campaña inmediatamente anterior en la lista ya ordenada desc, para deltas. */
export function campanaAnterior(campanasDesc: string[], campana: string): string | null {
  const idx = campanasDesc.indexOf(campana);
  return idx >= 0 && idx + 1 < campanasDesc.length ? campanasDesc[idx + 1] : null;
}

export function deltaPct(actual: number, anterior: number | null | undefined): number | null {
  if (anterior === null || anterior === undefined || anterior === 0) return null;
  return ((actual - anterior) / anterior) * 100;
}

/**
 * Port literal de filter_prod_df() en mercado-argentino-tabaco/app.py
 * (líneas 674-686): cascada de fallback provincial → nacional cuando no
 * hay desglose provincial para una campaña/variedad.
 */
export function filterProduccion(
  rows: ProduccionPrimaria[],
  campana: string,
  provincia: string,
  tipo: string
): ProduccionPrimaria[] {
  const dff = rows.filter((r) => r.campana === campana);

  if (provincia === TODAS_LAS_PROVINCIAS && tipo === TODAS_LAS_VARIEDADES) {
    const res = dff.filter((r) => !r.esTotal && r.ambito === "PROVINCIAL");
    return res.length > 0 ? res : dff.filter((r) => r.provincia === "Total Nacional");
  }
  if (provincia === TODAS_LAS_PROVINCIAS && tipo !== TODAS_LAS_VARIEDADES) {
    const res = dff.filter((r) => !r.esTotal && r.tipoTabaco === tipo && r.ambito === "PROVINCIAL");
    return res.length > 0 ? res : dff.filter((r) => r.tipoTabaco === tipo && r.ambito === "NACIONAL");
  }
  if (provincia !== TODAS_LAS_PROVINCIAS && tipo === TODAS_LAS_VARIEDADES) {
    return dff.filter((r) => !r.esTotal && r.provincia === provincia);
  }
  return dff.filter((r) => !r.esTotal && r.provincia === provincia && r.tipoTabaco === tipo);
}

/** Port literal de filter_acopio_clases_df() (líneas 757-762). */
export function filterAcopioClases(
  rows: AcopioClase[],
  campana: string,
  provincia: string,
  tipo: string,
  clasesSeleccionadas: string[]
): AcopioClase[] {
  let dff = rows.filter((r) => r.campana === campana && !r.esTotalClase && r.provincia !== "Total Nacional");
  if (provincia !== TODAS_LAS_PROVINCIAS) dff = dff.filter((r) => r.provincia === provincia);
  if (tipo !== TODAS_LAS_VARIEDADES) dff = dff.filter((r) => r.tipoTabaco === tipo);
  if (clasesSeleccionadas.length > 0) dff = dff.filter((r) => clasesSeleccionadas.includes(r.claseComercial));
  return dff;
}

/** Port literal de filter_empresas_df() (líneas 836-840). */
export function filterEmpresas(
  rows: AcopioEmpresa[],
  campana: string,
  provincia: string,
  empresa: string
): AcopioEmpresa[] {
  let dff = rows.filter(
    (r) => r.campana === campana && !r.esSubtotalEmpresa && r.provincia !== "Total Nacional"
  );
  if (provincia !== TODAS_LAS_PROVINCIAS) dff = dff.filter((r) => r.provincia === provincia);
  if (empresa !== TODAS_LAS_EMPRESAS) dff = dff.filter((r) => r.razonSocial === empresa);
  return dff;
}

/** Port literal de filter_precios_df() (líneas 919-931). */
export function filterAcopioPrecios(
  rows: AcopioPrecio[],
  campana: string,
  provincia: string,
  tipo: string
): AcopioPrecio[] {
  const dff = rows.filter((r) => r.campana === campana);

  if (provincia === TODAS_LAS_PROVINCIAS && tipo === TODAS_LAS_VARIEDADES) {
    const res = dff.filter((r) => r.esTotalNacional);
    return res.length > 0 ? res : dff.filter((r) => !r.esSubtotalProvincial && !r.esTotalNacional);
  }
  if (provincia !== TODAS_LAS_PROVINCIAS && tipo === TODAS_LAS_VARIEDADES) {
    const res = dff.filter((r) => r.provincia === provincia && r.esSubtotalProvincial);
    return res.length > 0 ? res : dff.filter((r) => r.provincia === provincia && !r.esSubtotalProvincial);
  }
  if (provincia === TODAS_LAS_PROVINCIAS && tipo !== TODAS_LAS_VARIEDADES) {
    return dff.filter((r) => !r.esSubtotalProvincial && !r.esTotalNacional && r.tipoTabaco === tipo);
  }
  return dff.filter(
    (r) => !r.esSubtotalProvincial && !r.esTotalNacional && r.provincia === provincia && r.tipoTabaco === tipo
  );
}

export function sum(values: (number | null | undefined)[]): number {
  return values.reduce((acc: number, v) => acc + (v ?? 0), 0);
}

/** '000001-Resolución Nº 362-2007.pdf' -> 'Resolución Nº 362-2007'. */
export function cleanResolucionLabel(archivoOrigen: string): string {
  const label = archivoOrigen.replace(/^\d+-?/, "");
  return label.toLowerCase().endsWith(".pdf") ? label.slice(0, -4) : label;
}

/** Campañas tipo "2006-2007" (guion, no slash) ordenan bien como en el resto,
 * pero acá se ordena por año de inicio real por si el formato varía. */
export function sortCampanasGuionDesc(campanas: Iterable<string>): string[] {
  return Array.from(new Set(campanas)).sort((a, b) => {
    const ay = parseInt(a.split("-")[0], 10) || 0;
    const by = parseInt(b.split("-")[0], 10) || 0;
    return by - ay;
  });
}

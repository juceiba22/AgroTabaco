import { createClient } from "@/lib/supabase/server";
import type {
  AcopioClase,
  AcopioEmpresa,
  AcopioPrecio,
  MercadoInternacional,
  PrecioResolucion,
  ProduccionPrimaria,
} from "@/lib/types";

export async function getProduccionPrimaria(): Promise<ProduccionPrimaria[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fact_produccion_primaria")
    .select("*")
    .order("anio_inicio", { ascending: true });
  if (error) throw error;

  return (data ?? []).map((row) => ({
    campana: row.campana,
    anioInicio: row.anio_inicio,
    provincia: row.provincia,
    tipoTabaco: row.tipo_tabaco,
    ambito: row.ambito,
    esTotal: row.es_total,
    supSembradaHa: row.sup_sembrada_ha,
    supCosechadaHa: row.sup_cosechada_ha,
    produccionKg: row.produccion_kg,
    produccionTn: row.produccion_tn,
    rendimientoKgHa: row.rendimiento_kg_ha,
    precioAcopioUnitario: row.precio_acopio_unitario,
    precioFetUnitario: row.precio_fet_unitario,
    precioTotalUnitario: row.precio_total_unitario,
    valorTotalEstimado: row.valor_total_estimado,
  }));
}

export async function getAcopioClases(): Promise<AcopioClase[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fact_acopio_clases")
    .select("*")
    .order("anio_inicio", { ascending: true });
  if (error) throw error;

  return (data ?? []).map((row) => ({
    campana: row.campana,
    anioInicio: row.anio_inicio,
    provincia: row.provincia,
    tipoTabaco: row.tipo_tabaco,
    claseComercial: row.clase_comercial,
    esTotalClase: row.es_total_clase,
    volumenKg: row.volumen_kg,
    volumenTn: row.volumen_tn,
  }));
}

export async function getAcopioEmpresas(): Promise<AcopioEmpresa[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fact_acopio_empresas")
    .select("*")
    .order("anio_inicio", { ascending: true });
  if (error) throw error;

  return (data ?? []).map((row) => ({
    campana: row.campana,
    anioInicio: row.anio_inicio,
    provincia: row.provincia,
    tipoTabaco: row.tipo_tabaco,
    razonSocial: row.razon_social,
    esSubtotalEmpresa: row.es_subtotal_empresa,
    volumenAcopioKg: row.volumen_acopio_kg,
    volumenTn: row.volumen_tn,
    valorAcopioPesos: row.valor_acopio_pesos,
    precioPromedioEmpresa: row.precio_promedio_empresa,
  }));
}

export async function getAcopioPrecios(): Promise<AcopioPrecio[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fact_acopio_precios")
    .select("*")
    .order("anio_inicio", { ascending: true });
  if (error) throw error;

  return (data ?? []).map((row) => ({
    campana: row.campana,
    anioInicio: row.anio_inicio,
    provincia: row.provincia,
    tipoTabaco: row.tipo_tabaco,
    esSubtotalProvincial: row.es_subtotal_provincial,
    esTotalNacional: row.es_total_nacional,
    volumenKg: row.volumen_kg,
    volumenTn: row.volumen_tn,
    valorAcopioPesos: row.valor_acopio_pesos,
    precioAcopioPromedio: row.precio_acopio_promedio,
    valorFetPesos: row.valor_fet_pesos,
    precioFetPromedio: row.precio_fet_promedio,
    valorTotalPesos: row.valor_total_pesos,
    precioTotalPromedio: row.precio_total_promedio,
    pctFet: row.pct_fet,
    pctAcopio: row.pct_acopio,
  }));
}

export async function getMercadoInternacional(): Promise<MercadoInternacional[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fact_mercado_internacional")
    .select("*")
    .order("year", { ascending: true });
  if (error) throw error;

  return (data ?? []).map((row) => ({
    variety: row.variety,
    year: row.year,
    valueUsd: row.value_usd,
    isYtd: row.is_ytd,
  }));
}

export async function getPrecioResoluciones(): Promise<PrecioResolucion[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fact_precio_resoluciones")
    .select("*")
    .order("campana", { ascending: true });
  if (error) throw error;

  return (data ?? []).map((row) => ({
    campana: row.campana,
    etapaPago: row.etapa_pago,
    fecha: row.fecha,
    archivoOrigen: row.archivo_origen,
    tabaco: row.tabaco,
    clase: row.clase,
    porcentaje: row.porcentaje,
    adelanto1: row.adelanto_1,
    adelanto2: row.adelanto_2,
    incremento: row.incremento,
    precioTotalAcumulado: row.precio_total_acumulado,
    adelanto1Usd: row.adelanto_1_usd,
    adelanto2Usd: row.adelanto_2_usd,
    incrementoUsd: row.incremento_usd,
    precioTotalAcumuladoUsd: row.precio_total_acumulado_usd,
  }));
}

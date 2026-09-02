import { createClient } from "@/lib/supabase/server";
import type { ConsumoAnio, ParticipacionMes, VolumenPrecio } from "@/lib/panels/laboratorio/types";

export async function getVolumenPrecios(): Promise<VolumenPrecio[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fact_volumen_precios")
    .select("*")
    .order("fecha", { ascending: true });
  if (error) throw error;

  return (data ?? []).map((row) => ({
    fecha: row.fecha,
    precioInferior: row.precio_inferior,
    precioPromedioPonderado: row.precio_promedio_ponderado,
    precioSuperior: row.precio_superior,
    primerQuartil: row.primer_quartil,
    segundoQuartil: row.segundo_quartil,
    tercerQuartil: row.tercer_quartil,
    cuartoQuartil: row.cuarto_quartil,
    totalPaquetes: row.total_paquetes,
  }));
}

export async function getParticipacionMercado(): Promise<ParticipacionMes[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fact_participacion_mercado")
    .select("*")
    .order("fecha", { ascending: true });
  if (error) throw error;

  return (data ?? []).map((row) => ({
    fecha: row.fecha,
    empresasGrandes: row.empresas_grandes,
    porcentajeParticipacionGrandes: row.porcentaje_participacion_grandes,
    empresasPymes: row.empresas_pymes,
    porcentajeParticipacionPymes: row.porcentaje_participacion_pymes,
    totalMercado: row.total_mercado,
  }));
}

export async function getConsumoAparente(): Promise<ConsumoAnio[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fact_consumo_aparente")
    .select("*")
    .order("anio", { ascending: true });
  if (error) throw error;

  return (data ?? []).map((row) => ({
    anio: row.anio,
    totalPaquetes: row.total_paquetes,
    poblacion: row.poblacion,
    consumoAparente: row.consumo_aparente,
  }));
}

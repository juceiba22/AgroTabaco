/**
 * Tipos de la base de datos de Supabase (mismo proyecto que el portal
 * principal y laboratorio-nativo, sólo con las tablas que usa esta app).
 * Escrito a mano, mismo patrón que los demás proyectos del ecosistema.
 */
export type Database = {
  public: {
    Tables: {
      fact_produccion_primaria: {
        Row: {
          id: string;
          campana: string;
          anio_inicio: number;
          provincia: string;
          tipo_tabaco: string;
          ambito: "PROVINCIAL" | "NACIONAL";
          es_total: boolean;
          sup_sembrada_ha: number | null;
          sup_cosechada_ha: number | null;
          produccion_kg: number | null;
          produccion_tn: number | null;
          rendimiento_kg_ha: number | null;
          precio_acopio_unitario: number | null;
          precio_fet_unitario: number | null;
          precio_total_unitario: number | null;
          valor_total_estimado: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["fact_produccion_primaria"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["fact_produccion_primaria"]["Row"]>;
        Relationships: [];
      };
      fact_acopio_clases: {
        Row: {
          id: string;
          campana: string;
          anio_inicio: number;
          provincia: string;
          tipo_tabaco: string;
          clase_comercial: string;
          es_total_clase: boolean;
          volumen_kg: number;
          volumen_tn: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["fact_acopio_clases"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["fact_acopio_clases"]["Row"]>;
        Relationships: [];
      };
      fact_acopio_empresas: {
        Row: {
          id: string;
          campana: string;
          anio_inicio: number;
          provincia: string;
          tipo_tabaco: string;
          razon_social: string;
          es_subtotal_empresa: boolean;
          volumen_acopio_kg: number;
          volumen_tn: number;
          valor_acopio_pesos: number;
          precio_promedio_empresa: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["fact_acopio_empresas"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["fact_acopio_empresas"]["Row"]>;
        Relationships: [];
      };
      fact_acopio_precios: {
        Row: {
          id: string;
          campana: string;
          anio_inicio: number;
          provincia: string;
          tipo_tabaco: string;
          es_subtotal_provincial: boolean;
          es_total_nacional: boolean;
          volumen_kg: number;
          volumen_tn: number;
          valor_acopio_pesos: number;
          precio_acopio_promedio: number;
          valor_fet_pesos: number;
          precio_fet_promedio: number;
          valor_total_pesos: number;
          precio_total_promedio: number;
          pct_fet: number;
          pct_acopio: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["fact_acopio_precios"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["fact_acopio_precios"]["Row"]>;
        Relationships: [];
      };
      fact_mercado_internacional: {
        Row: {
          id: string;
          variety: "Virginia" | "Burley";
          year: number;
          value_usd: number;
          is_ytd: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["fact_mercado_internacional"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["fact_mercado_internacional"]["Row"]>;
        Relationships: [];
      };
      fact_precio_resoluciones: {
        Row: {
          id: string;
          campana: string;
          etapa_pago: string | null;
          fecha: string | null;
          archivo_origen: string;
          tabaco: string;
          clase: string | null;
          porcentaje: number | null;
          adelanto_1: number | null;
          adelanto_2: number | null;
          incremento: number | null;
          precio_total_acumulado: number | null;
          adelanto_1_usd: number | null;
          adelanto_2_usd: number | null;
          incremento_usd: number | null;
          precio_total_acumulado_usd: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["fact_precio_resoluciones"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["fact_precio_resoluciones"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

/**
 * Tipos de la base de datos de Supabase (mismo proyecto que el portal
 * principal). Escrito a mano — fusiona las tablas usadas por los 4 paneles
 * que antes eran proyectos separados (laboratorio-nativo, tabacostats-nativo,
 * mercado-global-nativo, observatorio-fet-nativo), mismo patrón que cada uno
 * usaba por su cuenta.
 */
export type Database = {
  public: {
    Tables: {
      // --- Laboratorio Estadístico ---
      fact_volumen_precios: {
        Row: {
          id: string;
          fecha: string;
          precio_inferior: number | null;
          precio_promedio_ponderado: number | null;
          precio_superior: number | null;
          primer_quartil: number | null;
          segundo_quartil: number | null;
          tercer_quartil: number | null;
          cuarto_quartil: number | null;
          total_paquetes: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["fact_volumen_precios"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["fact_volumen_precios"]["Row"]>;
        Relationships: [];
      };
      fact_participacion_mercado: {
        Row: {
          id: string;
          fecha: string;
          empresas_grandes: number | null;
          porcentaje_participacion_grandes: number | null;
          empresas_pymes: number | null;
          porcentaje_participacion_pymes: number | null;
          total_mercado: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["fact_participacion_mercado"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["fact_participacion_mercado"]["Row"]>;
        Relationships: [];
      };
      fact_consumo_aparente: {
        Row: {
          id: string;
          anio: number;
          total_paquetes: number | null;
          poblacion: number | null;
          consumo_aparente: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["fact_consumo_aparente"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["fact_consumo_aparente"]["Row"]>;
        Relationships: [];
      };

      // --- TabacoStats Argentina ---
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

      // --- Mercado Internacional de Tabaco ---
      fact_tobacco_production: {
        Row: {
          id: string;
          entity: string;
          code: string | null;
          year: number;
          value_tonnes: number;
          entity_type: "Country" | "Aggregate";
          entity_display: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["fact_tobacco_production"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["fact_tobacco_production"]["Row"]>;
        Relationships: [];
      };

      // --- Observatorio del FET ---
      fact_poas_tabaco: {
        Row: {
          id: string;
          archivo_origen: string;
          provincia: string;
          provincia_display: string;
          anio_resolucion: number | null;
          fecha: string | null;
          campana_display: string | null;
          norma: string | null;
          nro_expediente: string | null;
          componente: string | null;
          subcomponente: string | null;
          objeto_programa: string | null;
          tipo_asistencia: string | null;
          modalidad_desembolso: string | null;
          zona_o_departamento: string | null;
          monto_ars: number | null;
          cotizacion_usd: number | null;
          monto_usd: number | null;
          organismo_ejecutor: string | null;
          firmante_autoridad: string | null;
          cuenta_bancaria_debito: string | null;
          convenio_marco: string | null;
          es_anexo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["fact_poas_tabaco"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["fact_poas_tabaco"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

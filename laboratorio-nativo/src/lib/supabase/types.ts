/**
 * Tipos de la base de datos de Supabase (mismo proyecto que el portal
 * principal, sólo con las 3 tablas que usa esta app). Escrito a mano,
 * mismo patrón que src/lib/supabase/types.ts del portal principal.
 */
export type Database = {
  public: {
    Tables: {
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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

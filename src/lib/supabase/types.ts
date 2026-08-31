/**
 * Tipos de la base de datos de Supabase.
 *
 * Este archivo se puede regenerar automáticamente una vez creado el
 * proyecto y las tablas en Supabase, corriendo:
 *
 *   npx supabase gen types typescript --project-id <PROJECT_ID> > src/lib/supabase/types.ts
 *
 * Mientras tanto, se define a mano un esquema mínimo que coincide con el
 * modelo de datos usado en el resto de la app (ver src/lib/types.ts) para
 * que los clientes de Supabase queden tipados desde el día uno.
 */
export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          role: "admin" | "trader";
          full_name: string | null;
          company_name: string | null;
          phone: string | null;
          province: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: "admin" | "trader";
          full_name?: string | null;
          company_name?: string | null;
          phone?: string | null;
          province?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: "admin" | "trader";
          full_name?: string | null;
          company_name?: string | null;
          phone?: string | null;
          province?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          cover_image: string | null;
          category_id: string;
          author_id: string | null;
          author_name: string;
          status: "published" | "draft";
          featured: boolean;
          views: number;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          cover_image?: string | null;
          category_id: string;
          author_id?: string | null;
          author_name?: string;
          status?: "published" | "draft";
          featured?: boolean;
          views?: number;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string;
          content?: string;
          cover_image?: string | null;
          category_id?: string;
          author_id?: string | null;
          author_name?: string;
          status?: "published" | "draft";
          featured?: boolean;
          views?: number;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "posts_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      listings: {
        Row: {
          id: string;
          seller_id: string;
          listing_type: "venta" | "compra";
          product_type: "verde" | "procesado";
          title: string;
          variety: string;
          trading_class: string | null;
          hs_code: string | null;
          quantity: number;
          unit: "kg" | "ton";
          price: number | null;
          currency: string;
          price_unit: "por_kg" | "total" | null;
          province: string;
          description: string;
          cover_image: string | null;
          status: "activa" | "pausada" | "cerrada";
          admin_hidden: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          seller_id: string;
          listing_type: "venta" | "compra";
          product_type: "verde" | "procesado";
          title: string;
          variety: string;
          trading_class?: string | null;
          hs_code?: string | null;
          quantity: number;
          unit: "kg" | "ton";
          price?: number | null;
          currency?: string;
          price_unit?: "por_kg" | "total" | null;
          province: string;
          description?: string;
          cover_image?: string | null;
          status?: "activa" | "pausada" | "cerrada";
          admin_hidden?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          seller_id?: string;
          listing_type?: "venta" | "compra";
          product_type?: "verde" | "procesado";
          title?: string;
          variety?: string;
          trading_class?: string | null;
          hs_code?: string | null;
          quantity?: number;
          unit?: "kg" | "ton";
          price?: number | null;
          currency?: string;
          price_unit?: "por_kg" | "total" | null;
          province?: string;
          description?: string;
          cover_image?: string | null;
          status?: "activa" | "pausada" | "cerrada";
          admin_hidden?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      listing_interests: {
        Row: {
          id: string;
          listing_id: string;
          buyer_id: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          buyer_id: string;
          message?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          listing_id?: string;
          buyer_id?: string;
          message?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "listing_interests_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
            referencedColumns: ["id"];
          },
        ];
      };
      financing_interests: {
        Row: {
          id: string;
          user_id: string | null;
          full_name: string;
          email: string;
          company_name: string | null;
          phone: string | null;
          interest_amount: number | null;
          message: string | null;
          status: "nuevo" | "contactado" | "descartado";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          full_name: string;
          email: string;
          company_name?: string | null;
          phone?: string | null;
          interest_amount?: number | null;
          message?: string | null;
          status?: "nuevo" | "contactado" | "descartado";
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          full_name?: string;
          email?: string;
          company_name?: string | null;
          phone?: string | null;
          interest_amount?: number | null;
          message?: string | null;
          status?: "nuevo" | "contactado" | "descartado";
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MERCADO_INTERNACIONAL_ENABLED } from "@/lib/config";
import { ModuloCalidad } from "@/components/modules/modulo-calidad";
import { ModuloEmpresas } from "@/components/modules/modulo-empresas";
import { ModuloMercadoInternacional } from "@/components/modules/modulo-mercado-internacional";
import { ModuloPrecioFet } from "@/components/modules/modulo-precio-fet";
import { ModuloPrecios } from "@/components/modules/modulo-precios";
import { ModuloProduccion } from "@/components/modules/modulo-produccion";
import type {
  AcopioClase,
  AcopioEmpresa,
  AcopioPrecio,
  MercadoInternacional,
  PrecioResolucion,
  ProduccionPrimaria,
} from "@/lib/types";

type Props = {
  produccion: ProduccionPrimaria[];
  clases: AcopioClase[];
  empresas: AcopioEmpresa[];
  precios: AcopioPrecio[];
  precioFet: PrecioResolucion[];
  mercadoInternacional: MercadoInternacional[];
};

export function DashboardShell({ produccion, clases, empresas, precios, precioFet, mercadoInternacional }: Props) {
  const hasAnyData =
    produccion.length > 0 || clases.length > 0 || empresas.length > 0 || precios.length > 0 || precioFet.length > 0;

  if (!hasAnyData) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
        Todavía no hay datos cargados. Corré la migración y el seed de Supabase (
        <code>supabase/migrations/0007_fact_tabacostats.sql</code> y{" "}
        <code>supabase/seed_tabacostats.sql</code>) para ver el dashboard con datos reales.
      </div>
    );
  }

  return (
    <Tabs defaultValue="precios">
      <TabsList>
        <TabsTrigger value="precios">💰 Precios Acopio & Precio FET</TabsTrigger>
        <TabsTrigger value="calidad">🏷️ Calidad & Clases Comerciales</TabsTrigger>
        <TabsTrigger value="empresas">🏢 Acopio por Empresas</TabsTrigger>
        <TabsTrigger value="produccion">📊 Producción Primaria y Hectáreas</TabsTrigger>
        <TabsTrigger value="precio-fet">💵 Precio FET</TabsTrigger>
        {MERCADO_INTERNACIONAL_ENABLED && <TabsTrigger value="mercado-internacional">🌍 Mercado Internacional</TabsTrigger>}
      </TabsList>

      <TabsContent value="precios" className="mt-6 space-y-6">
        <ModuloPrecios data={precios} />
      </TabsContent>
      <TabsContent value="calidad" className="mt-6 space-y-6">
        <ModuloCalidad data={clases} />
      </TabsContent>
      <TabsContent value="empresas" className="mt-6 space-y-6">
        <ModuloEmpresas data={empresas} />
      </TabsContent>
      <TabsContent value="produccion" className="mt-6 space-y-6">
        <ModuloProduccion data={produccion} />
      </TabsContent>
      <TabsContent value="precio-fet" className="mt-6 space-y-6">
        <ModuloPrecioFet data={precioFet} />
      </TabsContent>
      {MERCADO_INTERNACIONAL_ENABLED && (
        <TabsContent value="mercado-internacional" className="mt-6 space-y-6">
          <ModuloMercadoInternacional data={mercadoInternacional} />
        </TabsContent>
      )}
    </Tabs>
  );
}

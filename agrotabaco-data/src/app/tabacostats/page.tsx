import { DashboardShell } from "@/components/panels/tabacostats/dashboard-shell";
import {
  getAcopioClases,
  getAcopioEmpresas,
  getAcopioPrecios,
  getMercadoInternacional,
  getPrecioResoluciones,
  getProduccionPrimaria,
} from "@/lib/panels/tabacostats/data";
import type {
  AcopioClase,
  AcopioEmpresa,
  AcopioPrecio,
  MercadoInternacional,
  PrecioResolucion,
  ProduccionPrimaria,
} from "@/lib/panels/tabacostats/types";

export const dynamic = "force-dynamic";

export default async function TabacostatsPage() {
  let produccion: ProduccionPrimaria[] = [];
  let clases: AcopioClase[] = [];
  let empresas: AcopioEmpresa[] = [];
  let precios: AcopioPrecio[] = [];
  let precioFet: PrecioResolucion[] = [];
  let mercadoInternacional: MercadoInternacional[] = [];

  try {
    [produccion, clases, empresas, precios, precioFet, mercadoInternacional] = await Promise.all([
      getProduccionPrimaria(),
      getAcopioClases(),
      getAcopioEmpresas(),
      getAcopioPrecios(),
      getPrecioResoluciones(),
      getMercadoInternacional(),
    ]);
  } catch (error) {
    console.error("[agrotabaco-data] Error cargando datos de TabacoStats Argentina:", error);
  }

  return (
    <DashboardShell
      produccion={produccion}
      clases={clases}
      empresas={empresas}
      precios={precios}
      precioFet={precioFet}
      mercadoInternacional={mercadoInternacional}
    />
  );
}

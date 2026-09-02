import { DashboardShell } from "@/components/panels/tabacostats/dashboard-shell";
import { getEntitlement } from "@/lib/entitlements";
import {
  getAcopioClases,
  getAcopioEmpresas,
  getAcopioPrecios,
  getMercadoInternacional,
  getPrecioResoluciones,
  getProduccionPrimaria,
} from "@/lib/panels/tabacostats/data";
import { sortCampanasDesc } from "@/lib/panels/tabacostats/filters";
import type {
  AcopioClase,
  AcopioEmpresa,
  AcopioPrecio,
  MercadoInternacional,
  PrecioResolucion,
  ProduccionPrimaria,
} from "@/lib/panels/tabacostats/types";

export const dynamic = "force-dynamic";

const FREE_CAMPANAS = 2;

export default async function TabacostatsPage() {
  let produccion: ProduccionPrimaria[] = [];
  let clases: AcopioClase[] = [];
  let empresas: AcopioEmpresa[] = [];
  let precios: AcopioPrecio[] = [];
  let precioFet: PrecioResolucion[] = [];
  let mercadoInternacional: MercadoInternacional[] = [];
  const { plan } = await getEntitlement();

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

  // Recorte de seguridad: sólo Producción Primaria (y sólo sus últimas 2
  // campañas) llega al cliente si no es "pro" — el resto de las pestañas
  // ni siquiera reciben su dataset.
  if (plan !== "pro") {
    const campanasRecientes = new Set(sortCampanasDesc(produccion.map((r) => r.campana)).slice(0, FREE_CAMPANAS));
    produccion = produccion.filter((r) => campanasRecientes.has(r.campana));
    clases = [];
    empresas = [];
    precios = [];
    precioFet = [];
  }

  return (
    <DashboardShell
      produccion={produccion}
      clases={clases}
      empresas={empresas}
      precios={precios}
      precioFet={precioFet}
      mercadoInternacional={mercadoInternacional}
      plan={plan}
    />
  );
}

import { DashboardShell } from "@/components/dashboard-shell";
import { Topbar } from "@/components/topbar";
import { getConsumoAparente, getParticipacionMercado, getVolumenPrecios } from "@/lib/data";

// Los datos se leen frescos de Supabase en cada request (cookies() en el
// cliente server-side lo obliga igual) — forzarlo evita que el build
// intente pre-renderizar esta ruta como estática.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Antes de correr la migración/seed de Supabase estas queries fallan
  // (las tablas todavía no existen) — en vez de romper la página con el
  // overlay de error de Next, mostramos el estado vacío que ya maneja
  // DashboardShell.
  let volumenPrecios: Awaited<ReturnType<typeof getVolumenPrecios>> = [];
  let participacion: Awaited<ReturnType<typeof getParticipacionMercado>> = [];
  let consumoAparente: Awaited<ReturnType<typeof getConsumoAparente>> = [];
  try {
    [volumenPrecios, participacion, consumoAparente] = await Promise.all([
      getVolumenPrecios(),
      getParticipacionMercado(),
      getConsumoAparente(),
    ]);
  } catch (error) {
    console.error("[laboratorio-nativo] Error cargando datos de Supabase:", error);
  }

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-6">
      <Topbar />
      <DashboardShell
        volumenPrecios={volumenPrecios}
        participacion={participacion}
        consumoAparente={consumoAparente}
      />
      <footer className="mt-10 border-t border-border py-6 text-center text-sm text-muted-foreground">
        Laboratorio Estadístico &copy; 2026 | Un desarrollo de AgroTabaco | Mercado interno de tabaco
        (cigarrillos) — SAGyP
      </footer>
    </div>
  );
}

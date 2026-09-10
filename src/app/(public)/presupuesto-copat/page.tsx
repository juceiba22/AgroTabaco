import { Metadata } from "next";
import Link from "next/link";
import {
  Globe,
  Bot,
  MessageSquare,
  TrendingUp,
  Landmark,
  Coins,
  Ship,
  Building2,
  Scale,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Propuesta Comercial COPAT | AgroTabaco",
  description:
    "Propuesta integral de servicios de comunicación, financiamiento y mercado internacional para COPAT.",
};

export default function PresupuestoCopatPage() {
  const currentDate = new Date().toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Barra superior de estado */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">
            <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
            Propuesta Exclusiva
          </span>
          <span className="text-xs text-muted-foreground">Documento Oficial · Confidencial</span>
        </div>
      </div>

      {/* Header Ejecutivo Membretado */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1f15] via-[#132a1e] to-[#1a3b2b] p-6 sm:p-9 text-white shadow-xl border border-[#c59b27]/30">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold uppercase tracking-wider text-[#c59b27]">
            <span>AgroTabaco · Servicios Corporativos</span>
            <span className="font-mono text-white/80">{currentDate}</span>
          </div>

          <h1 className="mt-3 font-serif text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
            Propuesta de Servicios Estratégicos
          </h1>
          <p className="mt-2 text-sm text-emerald-100/90 sm:text-base">
            Plan integral de Comunicación Digital, Financiamiento en Mercado de Capitales y Expansión
            Comercial Externa para <strong className="text-white">COPAT</strong>.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/15 pt-4 text-xs sm:grid-cols-4 sm:gap-4 sm:text-sm">
            <div>
              <span className="block text-[11px] uppercase tracking-wide text-white/60">Destinatario</span>
              <strong className="font-semibold text-white">Directorio COPAT</strong>
            </div>
            <div>
              <span className="block text-[11px] uppercase tracking-wide text-white/60">Emisor</span>
              <strong className="font-semibold text-white">AgroTabaco</strong>
            </div>
            <div>
              <span className="block text-[11px] uppercase tracking-wide text-white/60">Validez</span>
              <strong className="font-semibold text-white">30 Días</strong>
            </div>
            <div>
              <span className="block text-[11px] uppercase tracking-wide text-white/60">Modalidad</span>
              <strong className="font-semibold text-white">Abono Mensual</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje Introductorio */}
      <div className="mt-6 rounded-xl border border-border bg-card p-5 sm:p-7 shadow-xs">
        <h2 className="font-serif text-lg font-bold text-brand-green-dark sm:text-xl">
          Visión y Alianza Estratégica
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-foreground/90">
          AgroTabaco pone a disposición de <strong>COPAT</strong> un equipo interdisciplinario
          especializado en la cadena de valor tabacalera argentina. La presente propuesta articula tres
          dimensiones fundamentales para potenciar la competitividad de la cooperativa: modernización de su
          ecosistema de comunicación institucional y gremial, acceso a instrumentos modernos de
          financiamiento no bancario y apertura sistemática de canales de exportación para el tabaco Burley.
        </p>
      </div>

      {/* DETALLE DE LOS 3 PILARES */}
      <div className="mt-8 space-y-6">
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <span className="font-serif text-xl font-bold text-brand-green-dark">
            Alcance del Servicio Integral
          </span>
          <span className="rounded-full bg-brand-gold/15 px-2.5 py-0.5 text-xs font-semibold text-brand-gold">
            3 Módulos Incluidos
          </span>
        </div>

        {/* Pilar 1 */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs transition-shadow hover:shadow-md">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-green-dark text-brand-gold">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Módulo 01
                </span>
                <h3 className="font-serif text-lg font-bold text-brand-green-dark sm:text-xl">
                  Servicio Integral de Comunicación & Transformación Digital
                </h3>
              </div>
            </div>
          </div>

          <p className="mt-3 text-sm text-foreground/80">
            Reconversión de la imagen institucional externa y facilitación de los flujos de información
            interna entre la cooperativa y todos sus socios productores.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border/80 bg-muted/40 p-4">
              <div className="flex items-center gap-2 font-semibold text-brand-green-dark">
                <Globe className="h-4 w-4 text-brand-gold" />
                <h4 className="text-sm">Rediseño Web Total</h4>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Diseño y desarrollo desde cero de una nueva página web corporativa moderna, de carga ultra rápida,
                adaptable a celulares y orientada a posicionar a COPAT frente a clientes e instituciones.
              </p>
            </div>

            <div className="rounded-lg border border-border/80 bg-muted/40 p-4">
              <div className="flex items-center gap-2 font-semibold text-brand-green-dark">
                <MessageSquare className="h-4 w-4 text-brand-gold" />
                <h4 className="text-sm">Gestión de Redes</h4>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Manejo integral de canales oficiales (estrategia de contenidos, piezas visuales, novedades de
                campaña, comunicados sectoriales y visibilidad de los logros cooperativos).
              </p>
            </div>

            <div className="flex flex-col justify-between rounded-lg border border-border/80 bg-muted/40 p-4">
              <div>
                <div className="flex items-center gap-2 font-semibold text-brand-green-dark">
                  <Bot className="h-4 w-4 text-brand-gold" />
                  <h4 className="text-sm">Bot Interno para Socios</h4>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Creación de un bot interactivo para socios y miembros de la cooperativa: acceso inmediato a
                  cronogramas de acopio, liquidaciones FET, avisos operativos y trámites directos.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-border/60">
                <a
                  href="https://wa.me/5491178192165?text=Hola%20Federico,%20quiero%20probar%20el%20bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md bg-brand-green-dark px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-green-darker"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-brand-gold" />
                  <span>Probar demo en WhatsApp ↗</span>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-800">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Portal Web Institucional
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-800">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Contenido Audiovisual y Redes
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-800">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Asistente de Autogestión para Productores
            </span>
          </div>
        </div>

        {/* Pilar 2 */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs transition-shadow hover:shadow-md">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-green-dark text-brand-gold">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Módulo 02
                </span>
                <h3 className="font-serif text-lg font-bold text-brand-green-dark sm:text-xl">
                  Gestión de Financiamiento & Mercado de Capitales
                </h3>
              </div>
            </div>
          </div>

          <p className="mt-3 text-sm text-foreground/80">
            Estructuración y canalización de vehículos financieros para dotar a COPAT de liquidez para
            acopio, insumos e inversiones de infraestructura a costos eficientes.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border/80 bg-muted/40 p-4">
              <div className="flex items-center gap-2 font-semibold text-brand-green-dark">
                <Landmark className="h-4 w-4 text-brand-gold" />
                <h4 className="text-sm">Pagaré Bursátil</h4>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Estructuración y colocación de pagarés avalados y directos en el mercado bursátil (pesos o dollar-linked)
                para optimizar el capital de trabajo de la campaña.
              </p>
            </div>

            <div className="rounded-lg border border-border/80 bg-muted/40 p-4">
              <div className="flex items-center gap-2 font-semibold text-brand-green-dark">
                <Coins className="h-4 w-4 text-brand-gold" />
                <h4 className="text-sm">Emisión de Deuda en MAV</h4>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Apertura y gestión de líneas en el Mercado Argentino de Valores (MAV) dedicadas a cooperativas
                y economías regionales con instrumentos a medida.
              </p>
            </div>

            <div className="rounded-lg border border-border/80 bg-muted/40 p-4">
              <div className="flex items-center gap-2 font-semibold text-brand-green-dark">
                <Zap className="h-4 w-4 text-brand-gold" />
                <h4 className="text-sm">Tokenización & Activos</h4>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Diseño de esquemas de tokenización de activos o producción y anticipo de liquidaciones
                para diversificar fuentes de fondeo alternativas.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-800">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Acceso a Inversores Institucionales
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-800">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Optimización de Tasas y Plazos
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-800">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Asesoramiento Regulatorio y Bursátil
            </span>
          </div>
        </div>

        {/* Pilar 3 */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs transition-shadow hover:shadow-md">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-green-dark text-brand-gold">
                <Ship className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Módulo 03
                </span>
                <h3 className="font-serif text-lg font-bold text-brand-green-dark sm:text-xl">
                  Gestión de Nuevos Mercados Internacionales (Tabaco Burley)
                </h3>
              </div>
            </div>
          </div>

          <p className="mt-3 text-sm text-foreground/80">
            Apertura de demanda externa, generación de contactos comerciales y posicionamiento del tabaco
            Burley de COPAT en plazas internacionales clave.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border/80 bg-muted/40 p-4">
              <div className="flex items-center gap-2 font-semibold text-brand-green-dark">
                <Building2 className="h-4 w-4 text-brand-gold" />
                <h4 className="text-sm">Enlace con Cancillería</h4>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Articulación directa con la Cancillería Argentina, embajadas, agregadurías agrícolas y misiones
                comerciales oficiales en destinos estratégicos.
              </p>
            </div>

            <div className="rounded-lg border border-border/80 bg-muted/40 p-4">
              <div className="flex items-center gap-2 font-semibold text-brand-green-dark">
                <Ship className="h-4 w-4 text-brand-gold" />
                <h4 className="text-sm">Matching con Compradores</h4>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Vinculación y rondas de contacto con traders, brokers internacionales e industrias compradoras
                de tabaco Burley.
              </p>
            </div>

            <div className="rounded-lg border border-border/80 bg-muted/40 p-4">
              <div className="flex items-center gap-2 font-semibold text-brand-green-dark">
                <Scale className="h-4 w-4 text-brand-gold" />
                <h4 className="text-sm">Posición Arancelaria & Verde</h4>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Inteligencia de comercio exterior según posición arancelaria (NCM), tanto para colocación en
                verde como para tabaco con procesamiento primario.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-800">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Inteligencia Comercial Internacional
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-800">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Gestión Diplomática y Agencias de Promoción
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-800">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Foco Específico en Tabaco Burley
            </span>
          </div>
        </div>
      </div>

      {/* CUADRO DE INVERSIÓN Y HONORARIOS */}
      <div className="mt-10 overflow-hidden rounded-2xl border-2 border-brand-gold/60 bg-gradient-to-b from-card to-brand-gray p-6 sm:p-8 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <span className="inline-block rounded-md bg-brand-gold/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-gold">
              Inversión Mensual Integral
            </span>
            <h3 className="mt-1.5 font-serif text-2xl font-bold text-brand-green-dark sm:text-3xl">
              Honorarios del Servicio
            </h3>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Cobertura total y simultánea de los 3 módulos estratégicos de trabajo.
            </p>
          </div>

          <div className="text-right">
            <div className="font-serif text-3xl font-extrabold text-brand-green-dark sm:text-4xl">
              $ 3.000.000
            </div>
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              ARS / Mes
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2.5 text-xs text-foreground/80 sm:text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <span>
                <strong>Equipo multidisciplinario dedicado:</strong> Desarrolladores, comunicadores,
                especialistas en MAV y comercio exterior.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <span>
                <strong>Reuniones periódicas de seguimiento:</strong> Presentación de avances e
                informes de gestión al Consejo de Administración.
              </span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-foreground/80 sm:text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <span>
                <strong>Sin costos ocultos:</strong> El abono mensual comprende el mantenimiento y la
                operación continua de las iniciativas pactadas.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <span>
                <strong>Respaldo AgroTabaco:</strong> Acceso a toda la red de contactos e inteligencia
                sectorial de la plataforma.
              </span>
            </div>
          </div>
        </div>

        {/* Acciones de Contacto / Aceptación */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row print:hidden">
          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold text-foreground">
              ¿Desea avanzar con la puesta en marcha de la propuesta?
            </p>
            <p className="text-xs text-muted-foreground">
              Podemos coordinar una reunión técnica para iniciar el cronograma de trabajo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://wa.me/5491178192165?text=Hola%20AgroTabaco,%20quiero%20coordinar%20la%20puesta%20en%20marcha%20de%20la%20propuesta%20de%20servicios%20para%20COPAT."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-green-dark px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-green-darker"
            >
              <span>Aprobar / Coordinar por WhatsApp</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

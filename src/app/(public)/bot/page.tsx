import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  Clock,
  Database,
  ExternalLink,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Gavel,
  Landmark,
  MessageSquare,
  Paperclip,
  Phone,
  QrCode,
  Scale,
  ShieldCheck,
  Sparkles,
  Sprout,
  TrendingUp,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Federico — Bot de AgroTabaco | Asistente WhatsApp del Tabacalero",
  description:
    "Federico es un asistente de WhatsApp que responde con datos reales de producción, acopio, precios, POAs y normativa de la cadena tabacalera argentina.",
};

const WA_URL = "https://wa.me/5491178270751?text=Hola%20Federico";
const PHONE_DISPLAY = "+54 9 11 7827-0751";

export default function BotFedericoPage() {
  return (
    <div className="min-h-screen bg-[#F2FCF1] text-[#151E17] selection:bg-[#C0EEC9] selection:text-[#012D15]">
      {/* 1. Header Banner / Eyebrow */}
      <div className="bg-[#102B19] text-[#AFCEB3] border-b border-[#1A4329] py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#00A884] animate-pulse" />
            <span className="font-mono uppercase tracking-widest text-[#C0EEC9] font-bold text-[10px]">
              AGROTABACO LABS · ASISTENTE INTELIGENTE
            </span>
          </div>
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[#FFDEAC] hover:text-white transition-colors"
          >
            <span>WhatsApp Bot en línea: {PHONE_DISPLAY}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-12 pb-16 overflow-hidden">
        {/* Subtle Radial Glow Backdrop */}
        <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-gradient-to-br from-[#A4D1AE]/25 via-[#E6F1E5]/40 to-transparent rounded-full blur-3xl pointer-events-none -mr-32 -mt-24" />

        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Editorial Column */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                {/* Institutional Eyebrow */}
                <div className="inline-flex items-center gap-2 bg-[#E1EBE0] px-3 py-1 rounded-md shadow-xs border border-[#C1C8C0]">
                  <span className="w-2 h-2 rounded-full bg-[#012D15]" />
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#012D15] font-bold">
                    SAGyP · Fondo Especial del Tabaco
                  </span>
                </div>

                {/* Title */}
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-[52px] lg:leading-[58px] text-[#012D15] tracking-tight font-bold">
                  Los datos oficiales del tabaco, a un{" "}
                  <span className="italic font-normal text-[#7E5700] underline decoration-[#FDC668] decoration-4 underline-offset-8">
                    mensaje
                  </span>{" "}
                  de distancia.
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-[#414942] leading-relaxed max-w-2xl font-normal">
                  Federico es un asistente de WhatsApp que responde con datos reales de producción,
                  acopio, precios, POAs y normativa de la cadena tabacalera argentina — sin buscar en
                  anuarios, PDFs sueltos ni resoluciones dispersas.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#012D15] hover:bg-[#1A4329] text-white px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  <MessageSquare className="h-5 w-5 text-[#25D366]" />
                  <span>Escribirle ahora ↗</span>
                </a>
                <a
                  href="#capacidades"
                  className="bg-[#E6F1E5] hover:bg-[#DBE5DA] text-[#012D15] px-5 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-colors flex items-center gap-2 border border-[#C1C8C0]"
                >
                  <span>Ver qué puede responder</span>
                  <ArrowDown className="h-4 w-4" />
                </a>
              </div>

              {/* Official Stats Strip */}
              <div className="pt-2 grid grid-cols-3 gap-3 sm:gap-6 bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-[#C1C8C0]/60">
                <div className="flex flex-col">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[#012D15]">10</span>
                  <span className="text-[11px] sm:text-xs text-[#414942] font-semibold uppercase tracking-wider mt-1">
                    Fuentes oficiales SAGyP/FET
                  </span>
                </div>
                <div className="flex flex-col border-l border-[#E1EBE0] pl-3 sm:pl-6">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[#012D15]">7</span>
                  <span className="text-[11px] sm:text-xs text-[#414942] font-semibold uppercase tracking-wider mt-1">
                    Provincias tabacaleras
                  </span>
                </div>
                <div className="flex flex-col border-l border-[#E1EBE0] pl-3 sm:pl-6">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[#7E5700]">1991</span>
                  <span className="text-[11px] sm:text-xs text-[#414942] font-semibold uppercase tracking-wider mt-1">
                    Serie histórica desde
                  </span>
                </div>
              </div>
            </div>

            {/* Right Realistic WhatsApp Mockup Widget */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0 flex flex-col items-center">
              {/* Glowing ambient background */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#012D15]/10 via-[#FDC668]/15 to-[#A4D1AE]/20 rounded-[48px] blur-2xl pointer-events-none" />

              {/* Device Frame */}
              <div className="relative w-full max-w-[380px] bg-[#111B21] rounded-[44px] p-3 shadow-[0_25px_60px_-15px_rgba(1,45,21,0.35),0_0_0_1px_rgba(255,255,255,0.1)] border-[4px] border-[#222E35]">
                {/* Screen Container */}
                <div className="relative bg-[#EFEAE2] rounded-[36px] overflow-hidden flex flex-col h-[590px] text-left select-none shadow-inner">
                  {/* Phone Status Bar */}
                  <div className="bg-[#075E54] text-white px-6 pt-3 pb-1 flex items-center justify-between text-xs font-semibold tracking-tight">
                    <span>9:41</span>
                    <div className="w-20 h-3.5 bg-black/40 rounded-full mx-auto" />
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span>●●●</span>
                      <span>WiFi</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* WhatsApp Header */}
                  <div className="bg-[#075E54] text-white px-3 py-2.5 flex items-center justify-between shadow-md z-10">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-[#1A4329] text-white flex items-center justify-center font-bold text-sm border border-white/20 shadow-sm">
                          <Bot className="h-5 w-5 text-[#C0EEC9]" />
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#075E54] rounded-full" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-sm leading-tight text-white">
                            Federico Tabacalero
                          </span>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300 fill-emerald-300 text-[#075E54]" />
                        </div>
                        <span className="text-[11px] text-emerald-100 font-normal leading-tight">
                          en línea · SAGyP &amp; FET
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-white/90">
                      <Phone className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div
                    className="flex-1 p-3.5 space-y-3 overflow-y-auto text-[13px] bg-[#EFEAE2] relative"
                    style={{
                      backgroundImage: "radial-gradient(#d1c7b7 0.75px, transparent 0.75px)",
                      backgroundSize: "16px 16px",
                    }}
                  >
                    {/* Date Badge */}
                    <div className="flex justify-center">
                      <span className="bg-white/90 backdrop-blur shadow-xs text-gray-600 text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Hoy
                      </span>
                    </div>

                    {/* Security Pill */}
                    <div className="bg-[#FFF9C4]/90 text-[#5D4037] text-[10px] p-2 rounded-lg text-center shadow-2xs border border-amber-200/60 leading-tight">
                      🔒 Mensajes cifrados de extremo a extremo. Respuestas basadas exclusivamente en resoluciones oficiales.
                    </div>

                    {/* User Message 1 */}
                    <div className="flex justify-end">
                      <div className="bg-[#E7FFDB] text-gray-900 rounded-2xl rounded-tr-none px-3.5 py-2 max-w-[85%] shadow-xs border border-emerald-100/50">
                        <p className="leading-relaxed">
                          Hola Federico, ¿cuánto se pagó por kilo en Salta esta última campaña?
                        </p>
                        <div className="flex items-center justify-end gap-1 mt-0.5 text-[10px] text-gray-500">
                          <span>10:14</span>
                          <span className="text-blue-500 font-bold">✓✓</span>
                        </div>
                      </div>
                    </div>

                    {/* Bot Message 1 */}
                    <div className="flex justify-start">
                      <div className="bg-white text-gray-900 rounded-2xl rounded-tl-none px-3.5 py-2.5 max-w-[92%] shadow-xs border border-gray-100 space-y-1.5">
                        <div className="flex items-center gap-1 text-[#075E54] font-bold text-[11px]">
                          <Zap className="h-3 w-3 fill-[#075E54]" />
                          <span>Federico · SAGyP Oficial</span>
                        </div>
                        <p className="leading-relaxed text-xs">
                          💰 <strong>Precios Oficiales Salta 24/25:</strong>
                          <br />
                          • <strong>Boca de acopio:</strong> $3.114,26/kg{" "}
                          <span className="text-gray-500 text-[10px]">(77%)</span>
                          <br />
                          • <strong>Complemento FET:</strong> $923,73/kg{" "}
                          <span className="text-gray-500 text-[10px]">(23%)</span>
                          <br />• <strong>Total real productor:</strong>{" "}
                          <strong className="text-[#012d15] bg-emerald-50 px-1 rounded">
                            $4.037,98/kg
                          </strong>
                        </p>
                        <div className="flex items-center justify-end gap-1 text-[10px] text-gray-400">
                          <span>10:14</span>
                        </div>
                      </div>
                    </div>

                    {/* User Message 2 */}
                    <div className="flex justify-end">
                      <div className="bg-[#E7FFDB] text-gray-900 rounded-2xl rounded-tr-none px-3.5 py-2 max-w-[85%] shadow-xs border border-emerald-100/50">
                        <p className="leading-relaxed">¿Tenés la resolución del POA de fertilizantes?</p>
                        <div className="flex items-center justify-end gap-1 mt-0.5 text-[10px] text-gray-500">
                          <span>10:15</span>
                          <span className="text-blue-500 font-bold">✓✓</span>
                        </div>
                      </div>
                    </div>

                    {/* Bot Message 2 */}
                    <div className="flex justify-start">
                      <div className="bg-white text-gray-900 rounded-2xl rounded-tl-none px-3.5 py-2.5 max-w-[92%] shadow-xs border border-gray-100 space-y-2">
                        <p className="leading-relaxed text-xs">
                          📎 Encontré la <strong>Res. SAGyP Nº 137-2026</strong>. Te adjunto el PDF
                          homologado con el detalle del plan operativo de fertilizantes y sanidad:
                        </p>
                        {/* PDF Card */}
                        <div className="flex items-center gap-2.5 bg-[#F0F2F5] p-2 rounded-xl border border-gray-200/80">
                          <div className="w-9 h-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-[11px] text-gray-800 truncate">
                              POA_Salta_2025_Res137.pdf
                            </div>
                            <div className="text-[9px] text-gray-500 font-mono">1.4 MB · Documento Oficial</div>
                          </div>
                          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                            <ArrowDown className="h-3.5 w-3.5" />
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-1 text-[10px] text-gray-400">
                          <span>10:15</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input Bar */}
                  <div className="bg-[#F0F2F5] p-2 flex items-center gap-2 border-t border-gray-200">
                    <div className="flex-1 bg-white rounded-full px-3 py-1.5 flex items-center gap-2 text-gray-400 text-xs shadow-2xs">
                      <span className="flex-1 text-gray-400">Escribe un mensaje...</span>
                      <Paperclip className="h-3.5 w-3.5 text-gray-400" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#00A884] text-white flex items-center justify-center shadow-xs shrink-0">
                      <Zap className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button under mockup */}
              <div className="text-center mt-4">
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#012D15] hover:bg-[#1A4329] text-white font-semibold text-xs transition-all shadow-md hover:shadow-lg group"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Abrir conversación en vivo con Federico</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section: El problema */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#E6F1E5]/40 border-y border-[#C1C8C0]/40" id="el-problema">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12 space-y-2">
            <div className="inline-block font-mono text-xs uppercase tracking-widest text-[#7E5700] font-bold">
              El problema
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#012D15] font-bold tracking-tight">
              La información existe.
              <br />
              Encontrarla, no tanto.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Problem 01 */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-[#C1C8C0]/60 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-bold text-[#7E5700]">01</span>
                  <FileSpreadsheet className="h-6 w-6 text-[#727971]" />
                </div>
                <h3 className="font-serif text-lg sm:text-xl text-[#012D15] font-bold leading-snug">
                  Datos repartidos en anuarios, planillas y PDFs sueltos
                </h3>
                <p className="text-sm text-[#414942] leading-relaxed">
                  Producción, acopio, precios, POAs y normativa viven en fuentes separadas,
                  publicadas en formatos distintos y sin buscador común entre ellas.
                </p>
              </div>
              <div className="pt-6 font-mono text-[11px] uppercase tracking-wider text-[#727971] font-semibold border-t border-gray-100 mt-6">
                FORMATOS DISPERSOS // SIN INDEXAR
              </div>
            </div>

            {/* Problem 02 */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-[#C1C8C0]/60 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-bold text-[#7E5700]">02</span>
                  <Clock className="h-6 w-6 text-[#727971]" />
                </div>
                <h3 className="font-serif text-lg sm:text-xl text-[#012D15] font-bold leading-snug">
                  Una pregunta simple puede tomar horas
                </h3>
                <p className="text-sm text-[#414942] leading-relaxed">
                  &ldquo;¿Cuánto acopió tal empresa en mi provincia?&rdquo; implica cruzar el Anuario de Producción
                  con las estadísticas de Acopio a mano.
                </p>
              </div>
              <div className="pt-6 font-mono text-[11px] uppercase tracking-wider text-[#727971] font-semibold border-t border-gray-100 mt-6">
                CRUCE MANUAL // COSTO OPERATIVO
              </div>
            </div>

            {/* Problem 03 */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-[#C1C8C0]/60 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-bold text-[#7E5700]">03</span>
                  <Zap className="h-6 w-6 text-[#727971]" />
                </div>
                <h3 className="font-serif text-lg sm:text-xl text-[#012D15] font-bold leading-snug">
                  El productor no tiene tiempo para eso
                </h3>
                <p className="text-sm text-[#414942] leading-relaxed">
                  Necesita la respuesta en el momento, en el canal que ya usa todos los días — no un
                  informe para leer después.
                </p>
              </div>
              <div className="pt-6 font-mono text-[11px] uppercase tracking-wider text-[#727971] font-semibold border-t border-gray-100 mt-6">
                TIEMPO REAL // ACCESIBILIDAD MÓVIL
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section: Qué responde Federico (Capacidades) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white" id="capacidades">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mb-12 space-y-3">
            <div className="inline-block font-mono text-xs uppercase tracking-widest text-[#7E5700] font-bold">
              Qué responde Federico
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#012D15] font-bold tracking-tight">
              Una pregunta en lenguaje natural. Una respuesta con la cifra oficial exacta.
            </h2>
            <p className="text-base text-[#414942] leading-relaxed">
              Federico no adivina: cada cifra sale de una consulta en vivo contra las bases oficiales de
              SAGyP y el FET. Si el dato no existe, lo dice — no lo inventa.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Cap 01 */}
            <div className="bg-[#F2FCF1] p-6 sm:p-8 rounded-2xl shadow-xs border border-[#C1C8C0]/60 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold bg-[#E1EBE0] text-[#012D15] px-2 py-1 rounded">
                    01
                  </span>
                  <Sprout className="h-5 w-5 text-[#012D15]" />
                </div>
                <h3 className="font-serif text-xl text-[#012D15] font-bold">Producción primaria</h3>
                <div>
                  <span className="inline-block bg-[#1A4329] text-[#84B08E] font-mono text-[11px] px-2 py-1 rounded">
                    anuario_produccion_primaria
                  </span>
                </div>
                <p className="text-sm text-[#414942] leading-relaxed">
                  Hectáreas sembradas y cosechadas, kilos producidos y rendimiento por provincia,
                  variedad y campaña — serie histórica desde 1991/92.
                </p>
              </div>
              {/* Inline Sparkline */}
              <div className="pt-4 mt-4 bg-white p-3 rounded-xl border border-[#C1C8C0]/40">
                <div className="flex justify-between items-center text-[11px] font-mono text-[#414942] mb-1">
                  <span>SERIE HISTÓRICA RENDIMIENTO</span>
                  <span className="text-[#012D15] font-bold">+18.4%</span>
                </div>
                <svg className="w-full h-10 text-[#012D15]" fill="none" preserveAspectRatio="none" viewBox="0 0 200 40">
                  <path
                    d="M0 32 L30 28 L60 30 L90 22 L120 25 L150 15 L180 18 L200 8"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                  <path
                    d="M0 32 L30 28 L60 30 L90 22 L120 25 L150 15 L180 18 L200 8 V40 H0 Z"
                    fill="currentColor"
                    fillOpacity="0.08"
                  />
                </svg>
              </div>
            </div>

            {/* Cap 02 */}
            <div className="bg-[#F2FCF1] p-6 sm:p-8 rounded-2xl shadow-xs border border-[#C1C8C0]/60 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold bg-[#E1EBE0] text-[#012D15] px-2 py-1 rounded">
                    02
                  </span>
                  <TrendingUp className="h-5 w-5 text-[#012D15]" />
                </div>
                <h3 className="font-serif text-xl text-[#012D15] font-bold">Acopio y precios</h3>
                <div>
                  <span className="inline-block bg-[#1A4329] text-[#84B08E] font-mono text-[11px] px-2 py-1 rounded">
                    acopio_por_empresa · resumen_precios
                  </span>
                </div>
                <p className="text-sm text-[#414942] leading-relaxed">
                  Kilos acopiados por empresa y cooperativa, y el precio real del productor: boca de
                  acopio + complemento del Fondo Especial del Tabaco.
                </p>
              </div>
              {/* Mini Price Ratio Bar */}
              <div className="pt-4 mt-4 bg-white p-3 rounded-xl border border-[#C1C8C0]/40 space-y-1.5">
                <div className="flex justify-between font-mono text-[10px] text-[#414942]">
                  <span>BOCA ACOPIO (77%)</span>
                  <span>COMPL. FET (23%)</span>
                </div>
                <div className="w-full h-3 bg-[#E1EBE0] rounded-full overflow-hidden flex">
                  <div className="bg-[#012D15] h-full w-[77%]" />
                  <div className="bg-[#7E5700] h-full w-[23%]" />
                </div>
              </div>
            </div>

            {/* Cap 03 */}
            <div className="bg-[#F2FCF1] p-6 sm:p-8 rounded-2xl shadow-xs border border-[#C1C8C0]/60 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold bg-[#E1EBE0] text-[#012D15] px-2 py-1 rounded">
                    03
                  </span>
                  <FileText className="h-5 w-5 text-[#012D15]" />
                </div>
                <h3 className="font-serif text-xl text-[#012D15] font-bold">
                  POAs y resoluciones — con PDF original
                </h3>
                <div>
                  <span className="inline-block bg-[#1A4329] text-[#84B08E] font-mono text-[11px] px-2 py-1 rounded">
                    poas_proyectos
                  </span>
                </div>
                <p className="text-sm text-[#414942] leading-relaxed">
                  Montos, componentes y organismo ejecutor de cada resolución de Plan Operativo Anual.
                  Si el productor lo pide, Federico manda el PDF real por WhatsApp.
                </p>
              </div>
              <div className="pt-4 mt-4 flex items-center gap-2 text-[#7E5700] font-mono text-[11px] font-bold">
                <Paperclip className="h-4 w-4" />
                <span>ENTREGA DE DOCUMENTO BINARIO INTACTO</span>
              </div>
            </div>

            {/* Cap 04 */}
            <div className="bg-[#F2FCF1] p-6 sm:p-8 rounded-2xl shadow-xs border border-[#C1C8C0]/60 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold bg-[#E1EBE0] text-[#012D15] px-2 py-1 rounded">
                    04
                  </span>
                  <Gavel className="h-5 w-5 text-[#012D15]" />
                </div>
                <h3 className="font-serif text-xl text-[#012D15] font-bold">Marco normativo</h3>
                <div>
                  <span className="inline-block bg-[#1A4329] text-[#84B08E] font-mono text-[11px] px-2 py-1 rounded">
                    Leyes · Decretos · Resoluciones
                  </span>
                </div>
                <p className="text-sm text-[#414942] leading-relaxed">
                  Desde la Ley 19.800 (creación del FET) hasta la última resolución vigente — con cita
                  textual del artículo, no un resumen genérico.
                </p>
              </div>
              <div className="pt-4 mt-4 font-mono text-[11px] text-[#012D15] font-bold">
                CITA NORMATIVA LITERAL • SIN ALUCINACIONES
              </div>
            </div>

            {/* Cap 05 */}
            <div className="bg-[#F2FCF1] p-6 sm:p-8 rounded-2xl shadow-xs border border-[#C1C8C0]/60 flex flex-col justify-between hover:shadow-md transition-all lg:col-span-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold bg-[#E1EBE0] text-[#012D15] px-2 py-1 rounded">
                    05
                  </span>
                  <Landmark className="h-5 w-5 text-[#012D15]" />
                </div>
                <h3 className="font-serif text-xl text-[#012D15] font-bold">Balances del FET</h3>
                <div>
                  <span className="inline-block bg-[#1A4329] text-[#84B08E] font-mono text-[11px] px-2 py-1 rounded">
                    fet_ejecuciones_mensuales
                  </span>
                </div>
                <p className="text-sm text-[#414942] leading-relaxed">
                  Recaudación mensual, transferencias automáticas del 80% a las provincias productoras,
                  y ejecución presupuestaria del Fondo.
                </p>
              </div>
              {/* Telemetry Mini Grid */}
              <div className="pt-4 mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded-xl border border-[#C1C8C0]/40">
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] text-[#414942] uppercase">
                    Transferencias Ley 19.800
                  </span>
                  <span className="font-mono text-xs font-bold text-[#012D15]">80% AUTOMÁTICO</span>
                </div>
                <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-gray-100 pt-2 sm:pt-0 sm:pl-3">
                  <span className="font-mono text-[10px] text-[#414942] uppercase">
                    Frecuencia de Actualización
                  </span>
                  <span className="font-mono text-xs font-bold text-[#012D15]">MENSUAL VIGENTE</span>
                </div>
                <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-gray-100 pt-2 sm:pt-0 sm:pl-3">
                  <span className="font-mono text-[10px] text-[#414942] uppercase">
                    Nivel de Precisión
                  </span>
                  <span className="font-mono text-xs font-bold text-[#7E5700]">CÉNTIMOS OFICIALES</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section: De dónde salen los datos & Las 7 provincias */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#E6F1E5]/40 border-t border-[#C1C8C0]/40" id="fuentes">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: De dónde salen los datos */}
            <div className="lg:col-span-6 flex flex-col space-y-6">
              <div className="space-y-2">
                <div className="inline-block font-mono text-xs uppercase tracking-widest text-[#7E5700] font-bold">
                  De dónde salen los datos
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#012D15] font-bold tracking-tight">
                  Solo fuentes oficiales.
                </h2>
              </div>

              {/* Sources List */}
              <div className="space-y-2.5">
                {[
                  {
                    icon: Database,
                    title: "Anuario de Producción Primaria",
                    org: "SAGyP",
                    badge: "HISTÓRICO",
                  },
                  {
                    icon: FileCheck2,
                    title: "Registro de POAs y Resoluciones",
                    org: "SAGyP / FET",
                    badge: "PROYECTOS",
                  },
                  {
                    icon: TrendingUp,
                    title: "Estadísticas de Acopio y Precios",
                    org: "SAGyP",
                    badge: "BOCA/FET",
                  },
                  {
                    icon: Landmark,
                    title: "Ejecuciones Presupuestarias del FET",
                    org: "SAGyP",
                    badge: "MENSUAL",
                  },
                  {
                    icon: Scale,
                    title: "InfoLeg",
                    org: "Leyes y decretos nacionales",
                    badge: "LEGISLACIÓN",
                  },
                  {
                    icon: FileText,
                    title: "Boletín Oficial",
                    org: "Resoluciones y normativa marco",
                    badge: "DISPOSICIONES",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-white rounded-xl shadow-2xs border border-[#C1C8C0]/50 flex items-center justify-between hover:bg-[#F2FCF1] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-[#012D15] shrink-0" />
                      <span className="text-xs sm:text-sm text-[#151E17]">
                        <strong>{item.title}</strong> — {item.org}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-[#7E5700] font-bold bg-[#FFDEAC]/30 px-2 py-0.5 rounded">
                      {item.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Las siete provincias */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6" id="provincias">
              <div className="space-y-2">
                <div className="inline-block font-mono text-xs uppercase tracking-widest text-[#7E5700] font-bold">
                  Al servicio de
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#012D15] font-bold tracking-tight">
                  Las siete provincias tabacaleras.
                </h2>
              </div>

              {/* Territory Badges */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-[#C1C8C0]/60 space-y-6">
                <p className="text-sm text-[#414942] leading-relaxed">
                  Información discriminada por cuenca, tipo de tabaco (Virginia, Burley, Criollo,
                  Orientales) y cooperativas de cada jurisdicción:
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {["Salta", "Jujuy", "Tucumán", "Catamarca", "Corrientes", "Chaco", "Misiones"].map(
                    (prov) => (
                      <span
                        key={prov}
                        className="px-4 py-2 rounded-xl text-sm font-bold bg-[#012D15] text-white shadow-xs hover:bg-[#1A4329] cursor-default transition-colors"
                      >
                        {prov}
                      </span>
                    )
                  )}
                </div>
                <div className="font-mono text-[11px] text-[#414942] flex items-center gap-2 pt-2 border-t border-gray-100">
                  <span className="w-2 h-2 rounded-full bg-[#7E5700]" />
                  <span>COBERTURA TOTAL DE LA CUENCA TABACALERA DEL NORTE GRANDE ARGENTINO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Section: Lo que sigue (Roadmap) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white" id="lo-que-sigue">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12 space-y-2">
            <div className="inline-block font-mono text-xs uppercase tracking-widest text-[#7E5700] font-bold">
              Lo que sigue
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#012D15] font-bold tracking-tight">
              Recién estamos empezando la cosecha.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1: Hoy */}
            <div className="bg-[#F2FCF1] p-6 sm:p-8 rounded-2xl shadow-xs border border-[#C1C8C0]/60 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-white bg-[#012D15] px-3 py-1 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FDC668] animate-pulse" />
                  Hoy
                </span>
                <h3 className="font-serif text-xl text-[#012D15] font-bold">
                  Datos nacionales completos
                </h3>
                <p className="text-sm text-[#414942] leading-relaxed">
                  Producción, acopio, precios, POAs, FET y marco normativo nacional — operando en
                  producción sobre WhatsApp.
                </p>
              </div>
              <div className="pt-6 font-mono text-[11px] text-[#012D15] font-bold flex items-center gap-1.5 border-t border-[#C1C8C0]/30 mt-6">
                <CheckCircle2 className="h-4 w-4 text-[#00A884]" />
                <span>DESPLEGADO • EN LÍNEA</span>
              </div>
            </div>

            {/* Step 2: Próximo */}
            <div className="bg-[#F2FCF1] p-6 sm:p-8 rounded-2xl shadow-xs border border-[#C1C8C0]/60 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-4">
                <span className="inline-block font-mono text-xs font-bold text-[#7E5700] bg-[#FFDEAC]/50 px-3 py-1 rounded-md">
                  Próximo
                </span>
                <h3 className="font-serif text-xl text-[#012D15] font-bold">
                  Normativa provincial
                </h3>
                <p className="text-sm text-[#414942] leading-relaxed">
                  Sumar convenios y resoluciones propias de cada una de las 7 provincias, con el mismo
                  criterio de cita textual.
                </p>
              </div>
              <div className="pt-6 font-mono text-[11px] text-[#414942] flex items-center gap-1.5 border-t border-[#C1C8C0]/30 mt-6">
                <Clock className="h-4 w-4 text-[#7E5700]" />
                <span>EN CURACIÓN DOCUMENTAL</span>
              </div>
            </div>

            {/* Step 3: Después */}
            <div className="bg-[#F2FCF1] p-6 sm:p-8 rounded-2xl shadow-xs border border-[#C1C8C0]/60 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-4">
                <span className="inline-block font-mono text-xs font-bold text-[#414942] bg-[#E1EBE0] px-3 py-1 rounded-md">
                  Después
                </span>
                <h3 className="font-serif text-xl text-[#012D15] font-bold">
                  Datos por productor
                </h3>
                <p className="text-sm text-[#414942] leading-relaxed">
                  Consultas individuales de acopio y liquidación, si cada organismo provincial habilita el
                  cruce con su propio padrón.
                </p>
              </div>
              <div className="pt-6 font-mono text-[11px] text-[#414942] flex items-center gap-1.5 border-t border-[#C1C8C0]/30 mt-6">
                <ShieldCheck className="h-4 w-4 text-[#012D15]" />
                <span>INTEGRACIÓN MINISTERIAL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Section: Probalo ahora mismo (Final CTA + QR Box) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F2FCF1]">
        <div className="max-w-7xl mx-auto bg-[#012D15] text-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Side */}
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-3">
                <div className="inline-block font-mono text-xs uppercase tracking-widest text-[#FDC668] font-bold">
                  Probalo ahora mismo
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                  Escaneá el código y hacele
                  <br />
                  la primera pregunta.
                </h2>
                <p className="text-base sm:text-lg text-[#AFCEB3] leading-relaxed max-w-xl">
                  Sin instalar nada — es el WhatsApp que ya tenés en tu teléfono.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FDC668] hover:bg-[#FFDEAC] text-[#765100] font-bold px-7 py-4 rounded-xl text-base shadow-lg hover:shadow-xl transition-all flex items-center gap-2.5"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Escribirle a Federico ↗</span>
                </a>
                <div className="font-mono text-sm text-[#AFCEB3]">
                  wa.me/5491178270751
                </div>
              </div>
            </div>

            {/* Right Side: QR Card */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center">
              <div className="bg-white text-[#151E17] p-6 rounded-2xl shadow-2xl flex flex-col items-center text-center space-y-3 max-w-[280px] w-full">
                {/* SVG QR */}
                <div className="w-48 h-48 bg-[#E6F1E5] p-2 rounded-xl flex items-center justify-center relative shadow-inner">
                  <svg className="w-full h-full text-[#012D15]" fill="currentColor" viewBox="0 0 100 100">
                    <rect fill="currentColor" height="26" rx="2" width="26" x="10" y="10" />
                    <rect fill="#ffffff" height="18" rx="1" width="18" x="14" y="14" />
                    <rect fill="currentColor" height="10" width="10" x="18" y="18" />
                    <rect fill="currentColor" height="26" rx="2" width="26" x="64" y="10" />
                    <rect fill="#ffffff" height="18" rx="1" width="18" x="68" y="14" />
                    <rect fill="currentColor" height="10" width="10" x="72" y="18" />
                    <rect fill="currentColor" height="26" rx="2" width="26" x="10" y="64" />
                    <rect fill="#ffffff" height="18" rx="1" width="18" x="14" y="68" />
                    <rect fill="currentColor" height="10" width="10" x="18" y="72" />
                    <rect height="6" width="6" x="42" y="12" />
                    <rect height="6" width="6" x="52" y="12" />
                    <rect height="12" width="6" x="42" y="24" />
                    <rect height="8" width="6" x="52" y="28" />
                    <rect height="6" width="8" x="12" y="44" />
                    <rect height="6" width="10" x="26" y="44" />
                    <rect fill="#1A4329" height="16" width="16" x="42" y="42" />
                    <rect height="6" width="12" x="64" y="44" />
                    <rect height="6" width="10" x="80" y="44" />
                    <rect height="8" width="8" x="44" y="64" />
                    <rect height="14" width="6" x="56" y="64" />
                    <rect height="12" width="6" x="44" y="78" />
                    <rect height="8" width="8" x="68" y="64" />
                    <rect height="6" width="10" x="80" y="64" />
                    <rect height="6" width="14" x="68" y="78" />
                    <rect height="14" width="6" x="86" y="76" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white text-[#012D15] flex items-center justify-center shadow-md">
                      <QrCode className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <span className="font-mono text-[10px] text-[#414942] uppercase tracking-wider block">
                    Escaneo directo
                  </span>
                  <span className="font-mono text-xs font-bold text-[#012D15] block">
                    wa.me/5491178270751
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Institutional Watermark Background Badge */}
          <div className="absolute -bottom-10 -right-10 text-white opacity-5 pointer-events-none select-none font-serif text-[180px] font-bold">
            FET
          </div>
        </div>
      </section>

      {/* 8. Endorsement Strip */}
      <section className="bg-[#E1EBE0] py-6 px-4 sm:px-6 lg:px-8 border-t border-[#C1C8C0]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#414942]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#012D15]" />
            <span>Federico Tabacalero — Inteligencia Artificial de AgroTabaco Labs</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[#012D15] font-bold">
            <Phone className="h-4 w-4" />
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

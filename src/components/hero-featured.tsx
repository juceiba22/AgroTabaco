import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, LineChart } from "lucide-react";
import { CategoryBadge } from "@/components/category-badge";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function HeroFeatured({ post }: { post: Post }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border/80 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Columna Izquierda: Imagen de Gran Formato con Overlay & Badges */}
        <div className="relative min-h-[320px] sm:min-h-[400px] lg:col-span-7 lg:min-h-[480px] overflow-hidden">
          <Link href={`/post/${post.slug}`} className="block h-full w-full">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            {/* Scrim degradado sutil */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#132A1E]/90 via-[#132A1E]/30 to-transparent" />
          </Link>

          {/* Badges superiores sobre la imagen */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#C59B27] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#151D19] shadow-sm">
                Destacada
              </span>
              <div className="backdrop-blur-md bg-[#132A1E]/80 rounded-full px-2 py-0.5">
                <CategoryBadge category={post.category} asLink={false} />
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-[#132A1E]/75 px-3 py-1 text-xs font-mono text-white/90 backdrop-blur-md">
              <Clock className="h-3.5 w-3.5 text-[#FFDF98]" />
              <span>4 min lectura</span>
            </div>
          </div>

          {/* Metadata inferior sobre la imagen */}
          <div className="absolute bottom-4 left-4 right-4 z-10 hidden sm:flex flex-col gap-1 text-white/80 text-xs font-mono">
            <span className="text-white/95 font-semibold">AgroTabaco Reporte Especial</span>
            <span className="text-white/60">Monitoreo Regional &amp; Comercio Exterior</span>
          </div>
        </div>

        {/* Columna Derecha: Contenido Editorial & AgroTabaco Data Snapshot */}
        <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5 bg-white">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span className="text-[#C59B27] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C59B27]" />
                Edición Principal
              </span>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold leading-tight text-[#151D19] group-hover:text-[#132A1E] transition-colors">
              <Link href={`/post/${post.slug}`} className="hover:underline decoration-[#C59B27]">
                {post.title}
              </Link>
            </h1>

            <p className="line-clamp-4 text-sm leading-relaxed text-[#4E4635] sm:text-base">
              {post.excerpt}
            </p>

            {/* Módulo Integrado AgroTabaco Data Snapshot */}
            <div className="mt-2 rounded-xl bg-[#EDF6EF] p-4 border border-[#E2E8E0]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <LineChart className="h-4 w-4 text-[#132A1E]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#132A1E]">
                    AgroTabaco Data Snapshot
                  </span>
                </div>
                <span className="font-mono text-[11px] font-semibold text-[#506859]">
                  Exportaciones H1
                </span>
              </div>

              {/* Barra de distribución */}
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white flex my-1.5">
                <div className="h-full bg-[#C59B27]" style={{ width: "57%" }} title="Agroindustria: 57%" />
                <div className="h-full bg-[#132A1E]" style={{ width: "22%" }} title="Industria: 22%" />
                <div className="h-full bg-[#446553]" style={{ width: "13%" }} title="Energía: 13%" />
                <div className="h-full bg-[#85A994]" style={{ width: "8%" }} title="Otros: 8%" />
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[10px] text-[#4E4635] mt-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#C59B27]" />
                  <span>Agroindustria: <strong>57%</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#132A1E]" />
                  <span>Industria: <strong>22%</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#446553]" />
                  <span>Energía: <strong>13%</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#85A994]" />
                  <span>Otros: <strong>8%</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de Acción Inferior */}
          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground">
              {post.author ? `Por ${post.author}` : "Redacción AgroTabaco"}
            </span>
            <Link
              href={`/post/${post.slug}`}
              className="inline-flex items-center gap-2 rounded-lg bg-[#132A1E] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1A3B2B] transition-colors shadow-sm"
            >
              <span>Leer artículo completo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

import Link from "next/link";
import { Download, ExternalLink, Sparkles } from "lucide-react";
import { AdBanner } from "@/components/ad-banner";
import { HeroFeatured } from "@/components/hero-featured";
import { MostRead } from "@/components/most-read";
import { NewsCard } from "@/components/news-card";
import { AGROTABACO_DATA_URL } from "@/lib/config";
import { getFeaturedPost, getLatestPosts, getMostReadPosts } from "@/lib/data";

const ROMAN_NUMERALS = ["I", "II", "III"];

export default async function HomePage() {
  const featuredPost = await getFeaturedPost();
  const [latestPosts, mostReadPosts] = await Promise.all([
    getLatestPosts(featuredPost?.id, 8),
    getMostReadPosts(5),
  ]);

  const highlights = latestPosts.slice(0, 3);
  const feedPosts = latestPosts.slice(3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-10">
      {/* 1. Hero Destacado Asimétrico */}
      {featuredPost && <HeroFeatured post={featuredPost} />}

      {/* 2. Barra de Destacados Secundarios (I, II, III) */}
      {highlights.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {highlights.map((post, idx) => (
            <div
              key={post.id}
              className="group flex items-start gap-4 rounded-xl border border-border/80 bg-white p-4 shadow-xs transition-all hover:shadow-md hover:border-[#C59B27]/40"
            >
              <span className="font-serif text-3xl font-bold leading-none text-[#C59B27] shrink-0 group-hover:scale-105 transition-transform">
                {ROMAN_NUMERALS[idx]}
              </span>
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#446553]">
                  {post.category?.name || "Coyuntura"}
                </span>
                <h3 className="font-serif text-sm font-bold text-[#151D19] group-hover:text-[#132A1E] transition-colors line-clamp-2">
                  <Link href={`/post/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="line-clamp-2 text-xs leading-relaxed text-[#4E4635]">
                  {post.excerpt}
                </p>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 3. Feed Principal (8 cols) + Sidebar (4 cols) */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Columna Principal de Noticias */}
        <main className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center gap-2.5">
              <span className="h-3 w-3 rounded-full bg-[#C59B27]" />
              <h2 className="font-serif text-2xl font-bold text-[#132A1E] tracking-tight">
                Últimas Noticias
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <span className="rounded-lg bg-[#EDF6EF] px-2.5 py-1 text-[#132A1E]">
                Todas
              </span>
              <Link href="/categoria/tabaco" className="rounded-lg px-2.5 py-1 hover:bg-[#EDF6EF] transition-colors">
                Tabaco
              </Link>
              <Link href="/categoria/economias-regionales" className="rounded-lg px-2.5 py-1 hover:bg-[#EDF6EF] transition-colors">
                Regiones
              </Link>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {(feedPosts.length > 0 ? feedPosts : latestPosts).map((post, index) => (
              <NewsCard key={post.id} post={post} priority={index < 2} />
            ))}
          </div>

          {/* Banner In-Stream de Análisis Especial & Terminal */}
          <div className="mt-4 rounded-2xl bg-[#132A1E] p-6 text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 border border-[#1A3B2B]">
            <div className="flex flex-col gap-2 max-w-lg">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#C59B27]" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFDF98]">
                  Análisis Especial AgroTabaco
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold leading-tight">
                ¿Hacia dónde va la paridad del tabaco Virginia para la campaña 2026/2027?
              </h3>
              <p className="text-xs leading-relaxed text-[#EAF3EC]/80">
                Acceda a las series cuantitativas de precios, recaudación FET histórica y modelos econométricos en la terminal de datos.
              </p>
            </div>

            <a
              href={`${AGROTABACO_DATA_URL}/laboratorio`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C59B27] text-[#151D19] text-xs font-extrabold uppercase tracking-wider hover:bg-[#EEC14B] transition-colors shadow-sm"
            >
              <span>Explorar Terminal Data</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </main>

        {/* Barra Lateral / Sidebar */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          <MostRead posts={mostReadPosts} />

          {/* Widget de Acceso a Terminal Cuantitativo */}
          <div className="rounded-xl border border-border/80 bg-white p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C59B27]">
                Terminal Cuantitativa
              </span>
              <span className="h-2 w-2 rounded-full bg-[#1A3B2B] animate-pulse" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#132A1E]">
              Observatorio FET &amp; TabacoStats
            </h3>
            <p className="text-xs text-[#4E4635] leading-relaxed">
              Consulte despachos, evolución de cuartiles y series históricas desde 1910 con datos auditados.
            </p>
            <a
              href={AGROTABACO_DATA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#EDF6EF] py-2.5 text-xs font-bold uppercase tracking-wider text-[#132A1E] hover:bg-[#E2EAE4] transition-colors"
            >
              <span>Abrir AgroTabaco Data</span>
              <ExternalLink className="h-3.5 w-3.5 text-[#C59B27]" />
            </a>
          </div>

          <AdBanner />
        </aside>
      </div>
    </div>
  );
}

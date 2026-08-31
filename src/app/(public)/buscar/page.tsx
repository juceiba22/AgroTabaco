import type { Metadata } from "next";
import { NewsCard } from "@/components/news-card";
import { searchPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Buscar",
};

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams;
  const results = await searchPosts(q);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 border-b pb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-olive">
          Búsqueda
        </span>
        <h1 className="mt-1 font-serif text-3xl font-bold text-brand-green-dark sm:text-4xl">
          {q ? `Resultados para "${q}"` : "Buscar noticias"}
        </h1>
        {q && (
          <p className="mt-2 text-muted-foreground">
            {results.length}{" "}
            {results.length === 1 ? "resultado encontrado" : "resultados encontrados"}
          </p>
        )}
      </div>

      {q && results.length === 0 && (
        <p className="text-muted-foreground">
          No encontramos noticias que coincidan con tu búsqueda.
        </p>
      )}

      {results.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((post) => (
            <NewsCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

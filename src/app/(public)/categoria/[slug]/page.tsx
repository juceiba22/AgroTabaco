import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsCard } from "@/components/news-card";
import { getCategoryBySlug, getPostsByCategory } from "@/lib/data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  return {
    title: category.name,
    description: `Últimas noticias de ${category.name} en AgroTabaco.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categoryPosts = await getPostsByCategory(slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 border-b pb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-olive">
          Categoría
        </span>
        <h1 className="mt-1 font-serif text-3xl font-bold text-brand-green-dark sm:text-4xl">
          {category.name}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {categoryPosts.length}{" "}
          {categoryPosts.length === 1 ? "noticia encontrada" : "noticias encontradas"}
        </p>
      </div>

      {categoryPosts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categoryPosts.map((post) => (
            <NewsCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          Todavía no hay noticias publicadas en esta categoría.
        </p>
      )}
    </div>
  );
}

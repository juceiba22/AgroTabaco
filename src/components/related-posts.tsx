import { NewsCard } from "@/components/news-card";
import type { Post } from "@/lib/types";

export function RelatedPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-14 border-t pt-10">
      <h2 className="mb-6 font-serif text-2xl font-bold text-brand-green-dark">
        Noticias relacionadas
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <NewsCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

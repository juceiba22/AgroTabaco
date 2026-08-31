import { AdBanner } from "@/components/ad-banner";
import { HeroFeatured } from "@/components/hero-featured";
import { MostRead } from "@/components/most-read";
import { NewsCard } from "@/components/news-card";
import { getFeaturedPost, getLatestPosts, getMostReadPosts } from "@/lib/data";

export default async function HomePage() {
  const featuredPost = await getFeaturedPost();
  const [latestPosts, mostReadPosts] = await Promise.all([
    getLatestPosts(featuredPost?.id, 6),
    getMostReadPosts(5),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {featuredPost && <HeroFeatured post={featuredPost} />}

      <div className="mt-12 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-brand-green-dark">
              Últimas noticias
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {latestPosts.map((post, index) => (
              <NewsCard key={post.id} post={post} priority={index < 2} />
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-8">
          <MostRead posts={mostReadPosts} />
          <AdBanner />
        </aside>
      </div>
    </div>
  );
}

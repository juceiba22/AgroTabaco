import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock3, User } from "lucide-react";
import { ArticleContent } from "@/components/article-content";
import { CategoryBadge } from "@/components/category-badge";
import { RelatedPosts } from "@/components/related-posts";
import { getPostBySlug, getRelatedPosts } from "@/lib/data";
import { estimateReadingTime, formatDate } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || post.status !== "published") {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post);
  const readingTime = estimateReadingTime(post.content);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-4">
        <CategoryBadge category={post.category} />
      </div>

      <h1 className="text-balance font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
        {post.title}
      </h1>

      <p className="mt-4 text-balance text-lg leading-relaxed text-muted-foreground">
        {post.excerpt}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-y py-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <User className="size-4" />
          {post.author}
        </span>
        <time dateTime={post.publishedAt} className="flex items-center gap-1.5">
          {formatDate(post.publishedAt)}
        </time>
        <span className="flex items-center gap-1.5">
          <Clock3 className="size-4" />
          {readingTime} min de lectura
        </span>
      </div>

      <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-xl bg-muted">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
      </div>

      <div className="mt-8">
        <ArticleContent html={post.content} />
      </div>

      <RelatedPosts posts={relatedPosts} />
    </article>
  );
}

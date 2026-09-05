import Link from "next/link";
import { TrendingUp } from "lucide-react";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function MostRead({ posts }: { posts: Post[] }) {
  return (
    <div className="rounded-xl border border-border/80 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#C59B27]" />
          <h2 className="font-serif text-lg font-bold text-[#132A1E]">
            Más Leídas
          </h2>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-[#EDF6EF] px-2 py-0.5 rounded">
          24 Horas
        </span>
      </div>

      <ol className="flex flex-col gap-4">
        {posts.map((post, index) => (
          <li key={post.id} className="group flex items-start gap-3.5">
            <span className="font-serif text-2xl font-black leading-none text-[#C59B27] shrink-0 group-hover:scale-105 transition-transform">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-col gap-1 min-w-0">
              <Link
                href={`/post/${post.slug}`}
                className="text-sm font-semibold leading-snug text-[#151D19] transition-colors group-hover:text-[#132A1E] line-clamp-2"
              >
                {post.title}
              </Link>
              <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                <span>•</span>
                <span>{post.category?.name || "Agro"}</span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

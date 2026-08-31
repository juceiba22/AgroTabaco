import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import type { Category, Post } from "@/lib/types";

type PostRow = Database["public"]["Tables"]["posts"]["Row"];
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
type PostRowWithCategory = PostRow & { categories: CategoryRow | null };

const POST_SELECT = "*, categories(*)";
const FALLBACK_COVER_IMAGE = "/images/posts/agrotabaco-1.svg";

// Jerarquía editorial pedida para la barra de secciones y el mix de la Home.
const CATEGORY_PRIORITY = ["tabaco", "economias-regionales", "bioeconomia", "novedades"];

function sortByCategoryPriority(categories: Category[]): Category[] {
  return [...categories].sort((a, b) => {
    const rank = (slug: string) => {
      const index = CATEGORY_PRIORITY.indexOf(slug);
      return index === -1 ? CATEGORY_PRIORITY.length : index;
    };
    return rank(a.slug) - rank(b.slug);
  });
}

// Intercala posts por categoría respetando la jerarquía (1 de Tabaco, 1 de
// Economías Regionales, 1 de Bioeconomía, 1 de Novedades, y repite), en vez
// de agruparlos en bloques separados por categoría.
function interleaveByCategoryPriority(posts: Post[]): Post[] {
  const buckets = new Map<string, Post[]>();
  for (const post of posts) {
    const key = post.category.slug;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(post);
  }

  const orderedSlugs = [
    ...CATEGORY_PRIORITY.filter((slug) => buckets.has(slug)),
    ...[...buckets.keys()].filter((slug) => !CATEGORY_PRIORITY.includes(slug)),
  ];

  const result: Post[] = [];
  let addedAny = true;
  while (addedAny) {
    addedAny = false;
    for (const slug of orderedSlugs) {
      const bucket = buckets.get(slug)!;
      const next = bucket.shift();
      if (next) {
        result.push(next);
        addedAny = true;
      }
    }
  }
  return result;
}

function mapCategory(row: CategoryRow): Category {
  return { id: row.id, name: row.name, slug: row.slug };
}

function mapPost(row: PostRowWithCategory): Post {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.cover_image || FALLBACK_COVER_IMAGE,
    category: row.categories
      ? mapCategory(row.categories)
      : { id: "", name: "Sin categoría", slug: "sin-categoria" },
    author: row.author_name,
    publishedAt: row.published_at ?? row.created_at,
    status: row.status,
    featured: row.featured,
    views: row.views,
  };
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error) throw error;
  return sortByCategoryPriority((data ?? []).map(mapCategory));
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").eq("slug", slug).maybeSingle();
  return data ? mapCategory(data) : undefined;
}

export async function getFeaturedPost(): Promise<Post | undefined> {
  const supabase = await createClient();

  const { data: featured } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("status", "published")
    .eq("featured", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (featured) return mapPost(featured as unknown as PostRowWithCategory);

  const { data: latest } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return latest ? mapPost(latest as unknown as PostRowWithCategory) : undefined;
}

export async function getLatestPosts(excludeId?: string, limit = 6): Promise<Post[]> {
  const supabase = await createClient();
  const poolSize = Math.max(limit * 4, 24);
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(poolSize);
  if (error) throw error;

  const posts = ((data ?? []) as unknown as PostRowWithCategory[])
    .map(mapPost)
    .filter((post) => post.id !== excludeId);

  return interleaveByCategoryPriority(posts).slice(0, limit);
}

export async function getMostReadPosts(limit = 5): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("status", "published")
    .order("views", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return ((data ?? []) as unknown as PostRowWithCategory[]).map(mapPost);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select(POST_SELECT).eq("slug", slug).maybeSingle();
  return data ? mapPost(data as unknown as PostRowWithCategory) : undefined;
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("status", "published")
    .eq("category_id", category.id)
    .order("published_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as unknown as PostRowWithCategory[]).map(mapPost);
}

export async function getRelatedPosts(post: Post, limit = 3): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("status", "published")
    .eq("category_id", post.category.id)
    .neq("id", post.id)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return ((data ?? []) as unknown as PostRowWithCategory[]).map(mapPost);
}

export async function searchPosts(query: string): Promise<Post[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const escaped = trimmed.replace(/[%,]/g, "");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("status", "published")
    .or(`title.ilike.%${escaped}%,excerpt.ilike.%${escaped}%`)
    .order("published_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as unknown as PostRowWithCategory[]).map(mapPost);
}

// --- Admin (ve también borradores; RLS exige usuario autenticado) ---

export async function getAllPostsForAdmin(): Promise<Post[]> {
  const supabase = await createClient();
  // Por creación, no por publicación: así un borrador recién guardado
  // siempre aparece arriba en vez de perderse al final de la tabla.
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as unknown as PostRowWithCategory[]).map(mapPost);
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select(POST_SELECT).eq("id", id).maybeSingle();
  return data ? mapPost(data as unknown as PostRowWithCategory) : undefined;
}

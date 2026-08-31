export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type PostStatus = "published" | "draft";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** HTML generado por el editor enriquecido (Tiptap) */
  content: string;
  coverImage: string;
  category: Category;
  author: string;
  publishedAt: string;
  status: PostStatus;
  featured: boolean;
  views: number;
};

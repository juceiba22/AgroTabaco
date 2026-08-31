import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/post-form";
import { getCategories, getPostById } from "@/lib/data";

export const metadata: Metadata = {
  title: "Editar noticia",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;
  const [post, categories] = await Promise.all([getPostById(id), getCategories()]);

  if (!post) {
    notFound();
  }

  return <PostForm mode="edit" categories={categories} post={post} />;
}

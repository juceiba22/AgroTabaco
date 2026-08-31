import type { Metadata } from "next";
import { PostForm } from "@/components/admin/post-form";
import { getCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nueva noticia",
};

export default async function NewPostPage() {
  const categories = await getCategories();

  return <PostForm mode="create" categories={categories} />;
}

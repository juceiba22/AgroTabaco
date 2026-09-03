import type { Metadata } from "next";
import { BulletinImport } from "@/components/admin/bulletin-import";
import { getCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Importar boletín semanal",
};

export default async function ImportBulletinPage() {
  const categories = await getCategories();

  return <BulletinImport categories={categories} />;
}

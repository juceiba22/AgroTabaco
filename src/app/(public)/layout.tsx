import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getCategories } from "@/lib/data";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();

  return (
    <>
      <Header categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} />
    </>
  );
}

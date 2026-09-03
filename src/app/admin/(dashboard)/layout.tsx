import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut, Newspaper, Plus, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/admin/actions";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-brand-gray">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-serif text-lg font-bold text-brand-green-dark">
              <span className="flex size-8 items-center justify-center rounded-full bg-brand-green-dark text-white">
                <Sprout className="size-4" />
              </span>
              Agro<span className="text-brand-olive">Tabaco</span>
              <span className="ml-1 rounded bg-brand-gray px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                admin
              </span>
            </Link>
            <nav className="hidden items-center gap-1 sm:flex">
              <Link
                href="/admin"
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-foreground hover:bg-brand-gray"
              >
                <Newspaper className="size-4" />
                Noticias
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="bg-brand-green-dark text-white hover:bg-brand-green-darker"
              nativeButton={false}
              render={<Link href="/admin/posts/new" />}
            >
              <Plus className="size-4" />
              Nueva noticia
            </Button>
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user.email}
            </span>
            <form action={signOut}>
              <Button variant="ghost" size="icon" type="submit" aria-label="Cerrar sesión">
                <LogOut className="size-4" />
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

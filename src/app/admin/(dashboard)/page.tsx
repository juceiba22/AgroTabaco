import type { Metadata } from "next";
import { Star } from "lucide-react";
import { PostRowActions } from "@/components/admin/post-row-actions";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllPostsForAdmin } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Panel de administración",
};

export default async function AdminDashboardPage() {
  const sortedPosts = await getAllPostsForAdmin();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-brand-green-dark">
            Noticias
          </h1>
          <p className="text-sm text-muted-foreground">
            {sortedPosts.length}{" "}
            {sortedPosts.length === 1 ? "noticia" : "noticias"} en la base.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Destacada</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="max-w-xs truncate font-medium">
                  {post.title}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{post.category.name}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      post.status === "published"
                        ? "border-transparent bg-brand-green-dark text-white"
                        : ""
                    }
                    variant={post.status === "published" ? "default" : "outline"}
                  >
                    {post.status === "published" ? "Publicado" : "Borrador"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {post.featured ? (
                    <Star className="size-4 fill-brand-olive text-brand-olive" />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(post.publishedAt)}
                </TableCell>
                <TableCell className="text-right">
                  <PostRowActions postId={post.id} slug={post.slug} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

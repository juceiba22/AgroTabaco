"use client";

import Link from "next/link";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function PostRowActions({
  postId,
  slug,
}: {
  postId: string;
  slug: string;
}) {
  function handleDelete() {
    toast("Conectá la base de datos para habilitar la eliminación", {
      description: `Noticia: ${postId}`,
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon" aria-label="Acciones" />}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem render={<Link href={`/post/${slug}`} target="_blank" />}>
          <Eye className="size-4" />
          Ver
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href={`/admin/posts/${postId}/edit`} />}>
          <Pencil className="size-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={handleDelete}>
          <Trash2 className="size-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

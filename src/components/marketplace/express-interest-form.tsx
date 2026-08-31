"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";

export function ExpressInterestForm({ listingId }: { listingId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("listing_interests")
      .insert({ listing_id: listingId, buyer_id: user.id, message });

    setLoading(false);

    if (error) {
      toast.error("No se pudo enviar el interés. Probá de nuevo.");
      return;
    }

    toast.success("Le avisamos al vendedor que estás interesado.");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Contále al vendedor cuánto necesitás, para cuándo, o cualquier detalle (opcional)."
        rows={3}
      />
      <Button
        type="submit"
        disabled={loading}
        className="w-fit bg-brand-green-dark text-white hover:bg-brand-green-darker"
      >
        {loading ? "Enviando..." : "Estoy interesado"}
      </Button>
    </form>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LISTING_STATUS_LABELS } from "@/lib/marketplace/constants";
import { createClient } from "@/lib/supabase/client";
import type { ListingStatus } from "@/lib/types";

export function ListingStatusSelect({
  listingId,
  status,
}: {
  listingId: string;
  status: ListingStatus;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleChange(value: string | null) {
    if (!value || value === status) return;
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("listings")
      .update({ status: value as ListingStatus })
      .eq("id", listingId);

    setLoading(false);

    if (error) {
      toast.error("No se pudo actualizar el estado.");
      return;
    }

    router.refresh();
  }

  return (
    <Select value={status} onValueChange={handleChange} disabled={loading}>
      <SelectTrigger className="w-36">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(LISTING_STATUS_LABELS) as ListingStatus[]).map((key) => (
          <SelectItem key={key} value={key}>
            {LISTING_STATUS_LABELS[key]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

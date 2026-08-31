"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROVINCES, VARIETIES } from "@/lib/marketplace/constants";

const ALL_VALUE = "todas";

export function ListingFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === ALL_VALUE) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Select
        value={searchParams.get("variety") ?? ALL_VALUE}
        onValueChange={(value) => updateParam("variety", value)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Variedad" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>Todas las variedades</SelectItem>
          {VARIETIES.map((variety) => (
            <SelectItem key={variety} value={variety}>
              {variety}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("province") ?? ALL_VALUE}
        onValueChange={(value) => updateParam("province", value)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Provincia" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>Todas las provincias</SelectItem>
          {PROVINCES.map((province) => (
            <SelectItem key={province} value={province}>
              {province}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

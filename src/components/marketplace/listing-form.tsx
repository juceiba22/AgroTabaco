"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CURRENCIES,
  HS_CODES,
  LISTING_TYPE_LABELS,
  PRODUCT_TYPE_LABELS,
  PROVINCES,
  TRADING_CLASSES,
  VARIETIES,
} from "@/lib/marketplace/constants";
import { createClient } from "@/lib/supabase/client";
import type { ListingType, ProductType } from "@/lib/types";

export function ListingForm() {
  const router = useRouter();

  const [listingType, setListingType] = useState<ListingType>("venta");
  const [productType, setProductType] = useState<ProductType>("verde");
  const [title, setTitle] = useState("");
  const [variety, setVariety] = useState<string>("");
  const [tradingClass, setTradingClass] = useState<string>("");
  const [hsCode, setHsCode] = useState<string>("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState<"kg" | "ton">("kg");
  const [price, setPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState<"por_kg" | "total">("por_kg");
  const [currency, setCurrency] = useState<string>("USD");
  const [province, setProvince] = useState<string>("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function handleImageSelect(file: File | null) {
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  }

  async function uploadCoverImage(userId: string, file: File): Promise<string> {
    const supabase = createClient();
    const extension = file.name.split(".").pop() || "jpg";
    const filePath = `listings/${userId}/${Date.now()}.${extension}`;

    const { error } = await supabase.storage.from("media").upload(filePath, file, { upsert: true });
    if (error) throw error;

    const { data } = supabase.storage.from("media").getPublicUrl(filePath);
    return data.publicUrl;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!title.trim()) return toast.error("El título es obligatorio.");
    if (!variety) return toast.error("Elegí una variedad.");
    if (productType === "verde" && !tradingClass) return toast.error("Elegí una clase comercial.");
    if (productType === "procesado" && !hsCode) return toast.error("Elegí una posición arancelaria.");
    if (!quantity || Number(quantity) <= 0) return toast.error("Ingresá una cantidad válida.");
    if (!province) return toast.error("Elegí una provincia.");

    setIsSaving(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Tu sesión expiró. Volvé a ingresar.");
        router.push("/mercado/login");
        return;
      }

      let coverImage: string | null = null;
      if (imageFile) {
        coverImage = await uploadCoverImage(user.id, imageFile);
      }

      const { data: inserted, error } = await supabase
        .from("listings")
        .insert({
          seller_id: user.id,
          listing_type: listingType,
          product_type: productType,
          title: title.trim(),
          variety,
          trading_class: productType === "verde" ? tradingClass : null,
          hs_code: productType === "procesado" ? hsCode : null,
          quantity: Number(quantity),
          unit,
          price: price ? Number(price) : null,
          currency,
          price_unit: price ? priceUnit : null,
          province,
          description: description.trim(),
          cover_image: coverImage,
        })
        .select("id")
        .single();

      if (error) throw error;

      toast.success("Oferta publicada.");
      router.push(`/mercado/${inserted.id}`);
      router.refresh();
    } catch {
      toast.error("No se pudo publicar la oferta. Probá de nuevo.");
    } finally {
      setIsSaving(false);
    }
  }

  const hsOptions = HS_CODES.filter((entry) => !variety || entry.variety === variety);

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-4 lg:col-span-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label>Tipo de operación</Label>
            <Select value={listingType} onValueChange={(v) => v && setListingType(v as ListingType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(LISTING_TYPE_LABELS) as ListingType[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {LISTING_TYPE_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Producto</Label>
            <Select
              value={productType}
              onValueChange={(v) => {
                if (!v) return;
                setProductType(v as ProductType);
                setTradingClass("");
                setHsCode("");
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(PRODUCT_TYPE_LABELS) as ProductType[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {PRODUCT_TYPE_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ej: Virginia clase C1F, 5000 kg, cosecha 2026"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label>Variedad</Label>
            <Select
              value={variety}
              onValueChange={(v) => {
                setVariety(v ?? "");
                setHsCode("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Elegir" />
              </SelectTrigger>
              <SelectContent>
                {VARIETIES.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Provincia</Label>
            <Select value={province} onValueChange={(v) => setProvince(v ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="Elegir" />
              </SelectTrigger>
              <SelectContent>
                {PROVINCES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {productType === "verde" ? (
          <div className="flex flex-col gap-2">
            <Label>Clase comercial</Label>
            <Select value={tradingClass} onValueChange={(v) => setTradingClass(v ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="Elegir" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {TRADING_CLASSES.map((tc) => (
                  <SelectItem key={tc} value={tc}>
                    {tc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Label>Posición arancelaria (HS)</Label>
            <Select value={hsCode} onValueChange={(v) => setHsCode(v ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder={variety ? "Elegir" : "Elegí primero la variedad"} />
              </SelectTrigger>
              <SelectContent>
                {hsOptions.map((entry) => (
                  <SelectItem key={entry.code} value={entry.code}>
                    {entry.code} — {entry.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="quantity">Cantidad</Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              step="0.01"
              required
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Unidad</Label>
            <Select value={unit} onValueChange={(v) => v && setUnit(v as "kg" | "ton")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">Kilogramos</SelectItem>
                <SelectItem value="ton">Toneladas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="price">Precio (opcional)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="A consultar"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Moneda</Label>
            <Select value={currency} onValueChange={(v) => v && setCurrency(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Por</Label>
            <Select
              value={priceUnit}
              onValueChange={(v) => v && setPriceUnit(v as "por_kg" | "total")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="por_kg">Por kg</SelectItem>
                <SelectItem value="total">Total del lote</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            rows={5}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Detalles del lote, condiciones de entrega, forma de pago preferida, etc."
          />
        </div>

        <Button
          type="submit"
          disabled={isSaving}
          className="w-fit bg-brand-green-dark text-white hover:bg-brand-green-darker"
        >
          {isSaving ? "Publicando..." : "Publicar oferta"}
        </Button>
      </div>

      <div className="space-y-3 rounded-xl border bg-card p-5">
        <h3 className="font-serif text-sm font-bold text-brand-green-dark">Foto (opcional)</h3>
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-brand-gray p-4 transition-colors hover:border-brand-olive">
          {imagePreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imagePreview} alt="Vista previa" className="h-32 w-full rounded-lg object-cover" />
          ) : (
            <div className="flex flex-col items-center text-muted-foreground">
              <UploadCloud className="size-8" />
              <span className="mt-2 text-xs font-medium">Subir foto del lote</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => handleImageSelect(event.target.files?.[0] ?? null)}
          />
        </label>
      </div>
    </form>
  );
}

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type PostStatus = "published" | "draft";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** HTML generado por el editor enriquecido (Tiptap) */
  content: string;
  coverImage: string;
  category: Category;
  author: string;
  publishedAt: string;
  status: PostStatus;
  featured: boolean;
  views: number;
};

// --- Mercado Argentino de Tabaco -------------------------------------------

export type UserRole = "admin" | "trader";

export type Profile = {
  id: string;
  role: UserRole;
  fullName: string | null;
  companyName: string | null;
  phone: string | null;
  province: string | null;
};

export type ListingType = "venta" | "compra";
export type ProductType = "verde" | "procesado";
export type ListingUnit = "kg" | "ton";
export type PriceUnit = "por_kg" | "total";
export type ListingStatus = "activa" | "pausada" | "cerrada";

export type Listing = {
  id: string;
  sellerId: string;
  listingType: ListingType;
  productType: ProductType;
  title: string;
  variety: string;
  tradingClass: string | null;
  hsCode: string | null;
  quantity: number;
  unit: ListingUnit;
  price: number | null;
  currency: string;
  priceUnit: PriceUnit | null;
  province: string;
  description: string;
  coverImage: string | null;
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
  /** Presente cuando la fila viene con el perfil del vendedor embebido. */
  seller?: Pick<Profile, "fullName" | "companyName" | "phone">;
};

export type ListingInterest = {
  id: string;
  listingId: string;
  buyerId: string;
  message: string;
  createdAt: string;
  buyer?: Pick<Profile, "fullName" | "companyName" | "phone">;
};

export type MarketplaceStats = {
  activeCount: number;
  byProductType: Record<ProductType, number>;
  byVariety: Record<string, number>;
};

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import type { Listing, ListingInterest, MarketplaceStats, ProductType } from "@/lib/types";

type ListingRow = Database["public"]["Tables"]["listings"]["Row"];
type ListingInterestRow = Database["public"]["Tables"]["listing_interests"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

type SellerProfile = Pick<ProfileRow, "full_name" | "company_name" | "phone">;
type ListingRowWithSeller = ListingRow & { profiles: SellerProfile | null };
type ListingInterestRowWithBuyer = ListingInterestRow & { profiles: SellerProfile | null };

const LISTING_SELECT = "*, profiles!listings_seller_id_fkey(full_name, company_name, phone)";

function mapListing(row: ListingRowWithSeller): Listing {
  return {
    id: row.id,
    sellerId: row.seller_id,
    listingType: row.listing_type,
    productType: row.product_type,
    title: row.title,
    variety: row.variety,
    tradingClass: row.trading_class,
    hsCode: row.hs_code,
    quantity: row.quantity,
    unit: row.unit,
    price: row.price,
    currency: row.currency,
    priceUnit: row.price_unit,
    province: row.province,
    description: row.description,
    coverImage: row.cover_image,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    seller: row.profiles
      ? {
          fullName: row.profiles.full_name,
          companyName: row.profiles.company_name,
          phone: row.profiles.phone,
        }
      : undefined,
  };
}

function mapListingInterest(row: ListingInterestRowWithBuyer): ListingInterest {
  return {
    id: row.id,
    listingId: row.listing_id,
    buyerId: row.buyer_id,
    message: row.message,
    createdAt: row.created_at,
    buyer: row.profiles
      ? {
          fullName: row.profiles.full_name,
          companyName: row.profiles.company_name,
          phone: row.profiles.phone,
        }
      : undefined,
  };
}

export type ListingFilters = {
  productType?: ProductType;
  variety?: string;
  province?: string;
};

export async function getActiveListings(filters: ListingFilters = {}): Promise<Listing[]> {
  const supabase = await createClient();
  let query = supabase
    .from("listings")
    .select(LISTING_SELECT)
    .eq("status", "activa")
    .eq("admin_hidden", false)
    .order("created_at", { ascending: false });

  if (filters.productType) query = query.eq("product_type", filters.productType);
  if (filters.variety) query = query.eq("variety", filters.variety);
  if (filters.province) query = query.eq("province", filters.province);

  const { data, error } = await query;
  if (error) throw error;
  return ((data ?? []) as unknown as ListingRowWithSeller[]).map(mapListing);
}

export async function getListingById(id: string): Promise<Listing | undefined> {
  const supabase = await createClient();
  const { data } = await supabase.from("listings").select(LISTING_SELECT).eq("id", id).maybeSingle();
  return data ? mapListing(data as unknown as ListingRowWithSeller) : undefined;
}

export async function getMyListings(): Promise<Listing[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_SELECT)
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as unknown as ListingRowWithSeller[]).map(mapListing);
}

export async function getMyInterestForListing(listingId: string): Promise<ListingInterest | undefined> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return undefined;

  const { data } = await supabase
    .from("listing_interests")
    .select("*")
    .eq("listing_id", listingId)
    .eq("buyer_id", user.id)
    .maybeSingle();

  return data
    ? {
        id: data.id,
        listingId: data.listing_id,
        buyerId: data.buyer_id,
        message: data.message,
        createdAt: data.created_at,
      }
    : undefined;
}

export async function getInterestsForListing(listingId: string): Promise<ListingInterest[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listing_interests")
    .select("*, profiles!listing_interests_buyer_id_fkey(full_name, company_name, phone)")
    .eq("listing_id", listingId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as unknown as ListingInterestRowWithBuyer[]).map(mapListingInterest);
}

export async function getMarketplaceStats(): Promise<MarketplaceStats> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select("product_type, variety")
    .eq("status", "activa")
    .eq("admin_hidden", false);
  if (error) throw error;

  const rows = data ?? [];
  const byProductType: Record<ProductType, number> = { verde: 0, procesado: 0 };
  const byVariety: Record<string, number> = {};

  for (const row of rows) {
    byProductType[row.product_type as ProductType] += 1;
    byVariety[row.variety] = (byVariety[row.variety] ?? 0) + 1;
  }

  return { activeCount: rows.length, byProductType, byVariety };
}

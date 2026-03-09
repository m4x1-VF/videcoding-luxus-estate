import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DbProperty {
  id: string;
  title: string;
  location: string;
  price: string;
  price_numeric: number | null;
  status: string | null;
  beds: number;
  baths: number;
  area: string;
  image_url: string;
  images: string[] | null;
  slug: string | null;
  is_rental: boolean;
  is_featured: boolean;
  created_at: string;
}

const PAGE_SIZE = 8;

export async function getFeaturedProperties(): Promise<DbProperty[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: true })
    .limit(4);

  if (error) {
    console.error("Error fetching featured properties:", error);
    return [];
  }
  return data ?? [];
}

export interface PropertyFilters {
  query?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  status?: string;
  amenities?: string[];
}

export async function getPaginatedProperties(page: number, filters?: PropertyFilters): Promise<{
  properties: DbProperty[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}> {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("properties")
    .select("*", { count: "exact" })
    .eq("is_featured", false)
    .order("created_at", { ascending: true })
    .range(from, to);

  if (filters?.query) {
    query = query.or(`title.ilike.%${filters.query}%,location.ilike.%${filters.query}%`);
  }
  if (filters?.type && filters.type !== "All" && filters.type !== "Any Type") {
    query = query.ilike("title", `%${filters.type}%`);
  }
  if (filters?.minPrice) {
    query = query.gte("price_numeric", filters.minPrice);
  }
  if (filters?.maxPrice) {
    query = query.lte("price_numeric", filters.maxPrice);
  }
  if (filters?.beds) {
    query = query.gte("beds", filters.beds);
  }
  if (filters?.baths) {
    query = query.gte("baths", filters.baths);
  }
  if (filters?.status && filters.status !== "All") {
    if (filters.status === "Buy") query = query.eq("is_rental", false);
    if (filters.status === "Rent") query = query.eq("is_rental", true);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching paginated properties:", error);
    return { properties: [], totalCount: 0, totalPages: 0, currentPage: page };
  }

  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return {
    properties: data ?? [],
    totalCount,
    totalPages,
    currentPage: page,
  };
}

// UUID regex pattern
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getPropertyBySlugOrId(slugOrId: string): Promise<DbProperty | null> {
  // If it looks like a UUID, do a direct id lookup (no slug query — prevents type cast errors)
  if (UUID_REGEX.test(slugOrId)) {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", slugOrId)
      .maybeSingle();
    if (error) console.error(`Error fetching property by id (${slugOrId}):`, error);
    return data;
  }

  // Otherwise treat it as a slug — query only the slug column (TEXT)
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slugOrId)
    .maybeSingle();
  if (error) console.error(`Error fetching property by slug (${slugOrId}):`, error);
  return data;
}

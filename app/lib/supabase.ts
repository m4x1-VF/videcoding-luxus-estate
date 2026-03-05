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
  is_rental: boolean;
  is_featured: boolean;
  created_at: string;
}

const PAGE_SIZE = 4;

export async function getFeaturedProperties(): Promise<DbProperty[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching featured properties:", error);
    return [];
  }
  return data ?? [];
}

export async function getPaginatedProperties(page: number): Promise<{
  properties: DbProperty[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}> {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error, count } = await supabase
    .from("properties")
    .select("*", { count: "exact" })
    .eq("is_featured", false)
    .order("created_at", { ascending: true })
    .range(from, to);

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

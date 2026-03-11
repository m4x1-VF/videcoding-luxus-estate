import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  let query = supabase
    .from("properties")
    .select("*")
    .or("is_active.eq.true,is_active.is.null")
    .eq("is_featured", false)
    .range(0, 7);

  query = query.or("title.ilike.%test%,location.ilike.%test%");

  const res2 = await query;
  console.log("Paginated with 2 ORs length:", res2.data?.length, res2.error);
}

test();

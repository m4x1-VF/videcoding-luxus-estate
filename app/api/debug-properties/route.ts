import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

/**
 * GET /api/debug-properties
 * Returns the first 3 properties with id and slug to diagnose data state.
 */
export async function GET() {
  const { data, error } = await supabase
    .from("properties")
    .select("id, title, slug")
    .limit(3);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ properties: data });
}

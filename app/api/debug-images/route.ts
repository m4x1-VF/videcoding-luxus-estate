import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

export async function GET() {
  // Query a property to see if images column exists and what types it has
  const { data, error } = await supabase
    .from("properties")
    .select("id, title, images")
    .limit(1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ property: data[0] });
}

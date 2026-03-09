import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * GET /api/migrate-slugs
 * Auto-generates and saves slugs for all properties that don't have one.
 * Call this once from the browser to populate the slug column.
 */
export async function GET() {
  // 1. Fetch all properties without a slug
  const { data: properties, error: fetchError } = await supabase
    .from("properties")
    .select("id, title, slug");

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const toUpdate = properties?.filter((p) => !p.slug) ?? [];

  if (toUpdate.length === 0) {
    return NextResponse.json({ message: "All properties already have slugs.", updated: 0 });
  }

  // 2. Build unique slugs: if a slug already exists for another property, append a counter
  const existingSlugs = new Set(
    properties?.filter((p) => p.slug).map((p) => p.slug as string) ?? []
  );

  const results: { id: string; slug: string; status: string }[] = [];

  for (const property of toUpdate) {
    let baseSlug = slugify(property.title);
    let candidate = baseSlug;
    let counter = 2;

    // Ensure uniqueness within this batch + DB
    while (existingSlugs.has(candidate)) {
      candidate = `${baseSlug}-${counter++}`;
    }
    existingSlugs.add(candidate);

    const { error: updateError } = await supabase
      .from("properties")
      .update({ slug: candidate })
      .eq("id", property.id);

    results.push({
      id: property.id,
      slug: candidate,
      status: updateError ? `error: ${updateError.message}` : "ok",
    });
  }

  return NextResponse.json({
    message: `Slugs generated for ${results.length} properties.`,
    updated: results.length,
    results,
  });
}

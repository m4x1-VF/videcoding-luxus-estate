import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://odduuojhgftgmjpqwbsx.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kZHV1b2poZ2Z0Z21qcHF3YnN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MDUxNTEsImV4cCI6MjA4ODI4MTE1MX0.R4vH-eKt6dwDkrYEh4DxfDvNV8qkGKYgtI9VvdBB2WA";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// High-quality real estate placeholder images from Unsplash (stable URLs)
const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
];

async function run() {
  // Fetch all properties
  const { data: properties, error } = await supabase
    .from("properties")
    .select("id, title, image_url, images");

  if (error) {
    console.error("Error fetching properties:", error);
    process.exit(1);
  }

  console.log(`Found ${properties.length} properties to update.\n`);

  for (const prop of properties) {
    // Build a definitive images array:
    // 1. Start with existing images (if any)
    let existing = Array.isArray(prop.images) ? [...prop.images] : [];

    // 2. Make sure image_url is the first element (avoid duplicates)
    if (prop.image_url && !existing.includes(prop.image_url)) {
      existing = [prop.image_url, ...existing];
    }

    // 3. Fill with placeholders until we have at least 4
    let placeholderIdx = 0;
    while (existing.length < 4 && placeholderIdx < PLACEHOLDER_IMAGES.length) {
      const candidate = PLACEHOLDER_IMAGES[placeholderIdx];
      if (!existing.includes(candidate)) {
        existing.push(candidate);
      }
      placeholderIdx++;
    }

    const { error: updateError } = await supabase
      .from("properties")
      .update({ images: existing })
      .eq("id", prop.id);

    if (updateError) {
      console.error(`  ✗ Error updating "${prop.title}":`, updateError.message);
    } else {
      console.log(`  ✓ "${prop.title}" → ${existing.length} images`);
    }
  }

  console.log("\nDone!");
}

run();

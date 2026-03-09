/**
 * Utility functions for generating and parsing SEO-friendly property URL slugs.
 * 
 * URL format: /properties/[title-slug]-[8-char-id]
 * Example:   /properties/the-glass-pavilion-6c52bfa8
 */

/**
 * Converts a string to a URL-friendly slug.
 * e.g. "The Glass Pavilion!" -> "the-glass-pavilion"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]+/g, "-")    // non-alphanumerics -> dash
    .replace(/^-|-$/g, "");          // trim leading/trailing dashes
}

/**
 * Builds an SEO-friendly URL for a given property.
 * Uses the DB slug when available: /properties/the-glass-pavilion
 * Falls back to the UUID if slug is not yet populated.
 */
export function buildPropertyUrl(property: { title: string; id: string; slug: string | null }): string {
  if (property.slug) {
    return `/properties/${property.slug}`;
  }
  // Fallback until slugs are populated via /api/migrate-slugs
  return `/properties/${property.id}`;
}

/**
 * Extracts the full UUID from a friendly slug.
 * Returns the original string if no separator is found.
 */
export function extractIdFromSlug(slug: string): string {
  const separatorIndex = slug.indexOf("--");
  if (separatorIndex !== -1) {
    return slug.substring(separatorIndex + 2);
  }
  return slug;
}

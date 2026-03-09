// ── Supported locales ────────────────────────────────────────────────────────
export type Locale = "en" | "es" | "fr";

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "https://flagcdn.com/w40/gb.png" },
  { code: "es", label: "Español", flag: "https://flagcdn.com/w40/es.png" },
  { code: "fr", label: "Français", flag: "https://flagcdn.com/w40/fr.png" },
];

export const COOKIE_NAME = "luxe-locale";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

// ── Server-side and Shared Utilities ──────────────────────────────────────────
export function getLocaleFromCookieHeader(cookieHeader: string | null): Locale {
  if (!cookieHeader) return "en";
  
  // regex to find cookie value
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`)
  );
  const value = match?.[1];
  
  if (value === "en" || value === "es" || value === "fr") {
    return value as Locale;
  }
  
  return "en";
}

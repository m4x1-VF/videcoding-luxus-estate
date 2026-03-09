"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import en, { Translations } from "./locales/en";
import es from "./locales/es";
import fr from "./locales/fr";
import { Locale, COOKIE_NAME, COOKIE_MAX_AGE } from "./config";

export * from "./config";

const translations: Record<Locale, Translations> = { en, es, fr };

// ── Cookie helpers ────────────────────────────────────────────────────────────
function getLocaleCookie(): Locale | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`)
  );
  const value = match?.[1];
  if (value === "en" || value === "es" || value === "fr") return value as Locale;
  return null;
}

function setLocaleCookie(locale: Locale) {
  document.cookie = `${COOKIE_NAME}=${locale}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

// ── Context ───────────────────────────────────────────────────────────────────
interface LanguageContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "en",
  t: en,
  setLocale: () => {},
});

// ── Provider ──────────────────────────────────────────────────────────────────
export function LanguageProvider({
  children,
  initialLocale = "en",
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // Synchronize state with initialLocale if it changes on the server/parent
  useEffect(() => {
    setLocaleState(initialLocale);
  }, [initialLocale]);

  // On mount, check the cookie to override the SSR-detected locale
  useEffect(() => {
    const cookieLocale = getLocaleCookie();
    if (cookieLocale && cookieLocale !== locale) {
      setLocaleState(cookieLocale);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    setLocaleCookie(newLocale);
  }, []);

  const value = React.useMemo(() => ({
    locale,
    t: translations[locale],
    setLocale
  }), [locale, setLocale]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useTranslations() {
  return useContext(LanguageContext);
}


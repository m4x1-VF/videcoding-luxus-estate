import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { LanguageProvider } from "./i18n";
import { getLocaleFromCookieHeader, Locale } from "./i18n/config";

export const metadata: Metadata = {
  title: "Luxe Estate - Premium Real Estate",
  description: "Find your sanctuary.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read the user's saved locale from the cookie on the server side
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get("luxe-locale")?.value ?? null;
  const initialLocale = getLocaleFromCookieHeader(
    rawLocale ? `luxe-locale=${rawLocale}` : null
  ) as Locale;

  const langAttr = initialLocale; // e.g. "en", "es", "fr"

  return (
    <html lang={langAttr}>
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`font-sans antialiased bg-background-light text-nordic-dark selection:bg-mosque selection:text-white`}
      >
        <LanguageProvider initialLocale={initialLocale}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

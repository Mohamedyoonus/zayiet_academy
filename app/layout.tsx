import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { SettingsProvider } from "@/hooks/use-settings";
import { I18nProvider } from "@/hooks/use-i18n";
import { settingsBootScript } from "@/lib/settings";
import { loadDictionary } from "@/lib/i18n";
import { DEFAULT_LOCALE, LOCALE_COOKIE, getLanguage, isLocale, scriptFontHref } from "@/lib/i18n/config";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import FloatingActions from "@/components/layout/floating-actions";

/**
 * NOTE: This project is designed to use "Fraunces" (display) and
 * "Plus Jakarta Sans" (body) via next/font/google. In this build
 * sandbox, outbound requests to fonts.googleapis.com are blocked,
 * so next/font is swapped for a CSS @font-face import in globals.css
 * that pulls the same two families. On Vercel / any normal host with
 * open internet access, you can freely switch back to next/font/google:
 *
 *   import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
 *   const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
 *   const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
 *   // then add `${fraunces.variable} ${jakarta.variable}` to the body className below.
 */

export const metadata: Metadata = {
  title: "Zayith Academy — Learn • Create • Inspire",
  description:
    "Zayith Academy is a premium art academy offering foundation to professional art training, workshops, an art store and community events for every age and skill level.",
  keywords: ["art academy", "art classes", "drawing classes", "painting classes", "Zayith Academy", "art workshop"],
  openGraph: {
    title: "Zayith Academy — Learn • Create • Inspire",
    description: "Professional art training for every age and skill level.",
    type: "website",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // The visitor's language (chosen on /settings) is kept in a cookie, so pages
  // render in it on the server instead of flashing English first
  const cookieLocale = (await cookies()).get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;
  const language = getLanguage(locale);
  const dictionary = await loadDictionary(locale);

  return (
    <html lang={locale} dir={language.dir} suppressHydrationWarning>
      <head>
        {/* Applies saved theme / text size before first paint (no flash of the default) */}
        <script dangerouslySetInnerHTML={{ __html: settingsBootScript }} />
        {language.font && (
          <link id={`font-script-${locale}`} rel="stylesheet" href={scriptFontHref(language.font)} />
        )}
      </head>
      <body className="font-body overflow-x-hidden">
        <SettingsProvider>
          <I18nProvider initialLocale={locale} initialDictionary={dictionary}>
            <Navbar />
            <main className="overflow-x-hidden">{children}</main>
            <Footer />
            <FloatingActions />
          </I18nProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
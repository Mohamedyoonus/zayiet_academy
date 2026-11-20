import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/hooks/use-settings";
import { I18nProvider } from "@/hooks/use-i18n";
import { settingsBootScript } from "@/lib/settings";
import { loadDictionary } from "@/lib/i18n";
import { DEFAULT_LOCALE, LOCALE_COOKIE, getLanguage, isLocale, scriptFontHref } from "@/lib/i18n/config";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import FloatingActions from "@/components/layout/floating-actions";

// Self-hosted and preloaded by Next, so text doesn't wait on a chain of Google
// Fonts requests. globals.css builds --font-fraunces / --font-jakarta on top of
// these (adding the per-language script fallback), so the classes go on <html>.
const fraunces = Fraunces({ subsets: ["latin"], axes: ["opsz"], variable: "--font-fraunces-face" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta-face" });

export const metadata: Metadata = {
  title: "Zayit Academy — Beyond Art. Towards a Better You",
  description:
    "Zayit Academy is a premium art academy offering foundation to professional art training, workshops, an art store and community events for every age and skill level. Beyond Art. Towards a Better You.",
  keywords: ["art academy", "art classes", "drawing classes", "painting classes", "Zayit Academy", "art workshop"],
  openGraph: {
    title: "Zayit Academy — Beyond Art. Towards a Better You",
    description: "Beyond Art. Towards a Better You. Professional art training for every age and skill level.",
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
    <html
      lang={locale}
      dir={language.dir}
      className={`${fraunces.variable} ${jakarta.variable}`}
      suppressHydrationWarning
    >
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
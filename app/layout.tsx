import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/hooks/use-settings";
import { I18nProvider } from "@/hooks/use-i18n";
import { settingsBootScript } from "@/lib/settings";
import { loadDictionary } from "@/lib/i18n";
import { DEFAULT_LOCALE, LOCALE_COOKIE, getLanguage, isLocale, scriptFontHref } from "@/lib/i18n/config";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import { getSiteContent } from "@/lib/content";
import { ContentProvider } from "@/hooks/use-content";
import SiteChrome from "@/components/layout/site-chrome";
import { ToastProvider } from "@/components/admin/toast";

// Self-hosted and preloaded by Next, so text doesn't wait on a chain of Google
// Fonts requests. globals.css builds --font-fraunces / --font-jakarta on top of
// these (adding the per-language script fallback), so the classes go on <html>.
const fraunces = Fraunces({ subsets: ["latin"], axes: ["opsz"], variable: "--font-fraunces-face" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta-face" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Pages set a short title ("About") and get " — Zayit Academy" added
  title: { default: `${SITE_NAME} — ${SITE_TAGLINE}`, template: `%s — ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  keywords: ["art academy", "art classes", "drawing classes", "painting classes", "Zayit Academy", "art workshop", "Bangalore"],
  openGraph: {
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    locale: "en_IN",
    type: "website",
  },
};

// Tells Google who the academy is, so searches for the name can show it as an organisation
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/assets/logo_only.png`,
  slogan: SITE_TAGLINE,
  description: SITE_DESCRIPTION,
  founder: { "@type": "Person", name: "Chalz Simon" },
  address: { "@type": "PostalAddress", addressLocality: "Bangalore", addressRegion: "Karnataka", addressCountry: "IN" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // The visitor's language (chosen on /settings) is kept in a cookie, so pages
  // render in it on the server instead of flashing English first
  const cookieLocale = (await cookies()).get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;
  const language = getLanguage(locale);
  const [dictionary, content] = await Promise.all([loadDictionary(locale), getSiteContent()]);

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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        {language.font && (
          <link id={`font-script-${locale}`} rel="stylesheet" href={scriptFontHref(language.font)} />
        )}
      </head>
      <body className="font-body overflow-x-hidden">
        <SettingsProvider>
          <I18nProvider initialLocale={locale} initialDictionary={dictionary}>
            <ContentProvider content={content}>
              {/* Snackbars for the whole site: form results on the website and everything in the admin */}
              <ToastProvider>
                <SiteChrome>{children}</SiteChrome>
              </ToastProvider>
            </ContentProvider>
          </I18nProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
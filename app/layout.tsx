import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/hooks/use-settings";
import { I18nProvider } from "@/hooks/use-i18n";
import { settingsBootScript } from "@/lib/settings";
import { loadDictionary } from "@/lib/i18n";
import { DEFAULT_LOCALE, LOCALE_COOKIE, getLanguage, isLocale, scriptFontHref } from "@/lib/i18n/config";
import { SITE_ALTERNATE_NAMES, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_TITLE, SITE_URL } from "@/lib/site";
import { getSiteContent, type SiteContent } from "@/lib/content";
import { phoneDigits, webLink } from "@/lib/contact";
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
  title: { default: SITE_TITLE, template: `%s — ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Zayit Academy",
    "ZayitAcademy",
    "zayitacademy",
    "art academy Bangalore",
    "art classes for kids",
    "drawing classes",
    "painting classes",
    "art workshop",
    "Bangalore",
    "Bengaluru",
  ],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    locale: "en_IN",
    type: "website",
  },
  // Search Console's "HTML tag" check: set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in Vercel to its code
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

/**
 * Tells Google who the academy is: its name and the other ways it's written
 * (so "zayitacademy" finds it too), the site's name for search results, the
 * logo, and the contact details and social pages saved in Admin → Contact details.
 */
function siteJsonLd(contact: SiteContent["contact"]) {
  const phone = phoneDigits(contact?.phoneValue);
  const email = contact?.emailValue && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.emailValue) ? contact.emailValue : undefined;
  // Profile addresses without tracking bits (e.g. Instagram's "?utm_source=qr"), as Google expects
  const socials = [contact?.instagram, contact?.facebook, contact?.youtube]
    .map((link) => webLink(link)?.split(/[?#]/)[0])
    .filter(Boolean);
  const home = `${SITE_URL}/`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": `${home}#organization`,
        name: SITE_NAME,
        alternateName: SITE_ALTERNATE_NAMES,
        url: home,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/assets/logo_only.png`, width: 472, height: 472 },
        image: `${SITE_URL}/opengraph-image.jpg`,
        slogan: SITE_TAGLINE,
        description: SITE_DESCRIPTION,
        founder: { "@type": "Person", name: "Chalz Simon" },
        address: {
          "@type": "PostalAddress",
          ...(contact?.addressValue ? { streetAddress: contact.addressValue } : {}),
          addressLocality: "Bengaluru",
          addressRegion: "Karnataka",
          addressCountry: "IN",
        },
        areaServed: { "@type": "City", name: "Bengaluru" },
        ...(phone ? { telephone: `+${phone}` } : {}),
        ...(email ? { email } : {}),
        ...(socials.length ? { sameAs: socials } : {}),
      },
      {
        // The name Google shows above results, instead of "zayitacademy.com"
        "@type": "WebSite",
        "@id": `${home}#website`,
        name: SITE_NAME,
        alternateName: SITE_ALTERNATE_NAMES,
        url: home,
        inLanguage: "en-IN",
        publisher: { "@id": `${home}#organization` },
      },
    ],
  };
}

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
        <script
          type="application/ld+json"
          // "<" escaped so text saved in the admin can never close the script tag
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd(content.contact)).replace(/</g, "\\u003c") }}
        />
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
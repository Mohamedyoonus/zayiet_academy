// Languages the site is translated into. The chosen language is kept in a
// cookie so the server can render pages in it straight away (no English flash).

export const LOCALES = ["en", "kn", "ta", "te", "ml", "hi", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "zayit-lang";

export type Language = {
  code: Locale;
  /** Name written in the language itself */
  native: string;
  /** Name in English, shown as a hint */
  english: string;
  dir: "ltr" | "rtl";
  /** Extra Google font that carries this script (Latin scripts use the site fonts) */
  font?: string;
};

export const LANGUAGES: Language[] = [
  { code: "en", native: "English", english: "English", dir: "ltr" },
  { code: "kn", native: "ಕನ್ನಡ", english: "Kannada", dir: "ltr", font: "Noto Sans Kannada" },
  { code: "ta", native: "தமிழ்", english: "Tamil", dir: "ltr", font: "Noto Sans Tamil" },
  { code: "te", native: "తెలుగు", english: "Telugu", dir: "ltr", font: "Noto Sans Telugu" },
  { code: "ml", native: "മലയാളം", english: "Malayalam", dir: "ltr", font: "Noto Sans Malayalam" },
  { code: "hi", native: "हिन्दी", english: "Hindi", dir: "ltr", font: "Noto Sans Devanagari" },
  { code: "ar", native: "العربية", english: "Arabic", dir: "rtl", font: "Noto Sans Arabic" },
];

export const isLocale = (value: unknown): value is Locale => LOCALES.includes(value as Locale);

export const getLanguage = (code: Locale) => LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];

export const scriptFontHref = (family: string) =>
  `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@400;500;600;700&display=swap`;

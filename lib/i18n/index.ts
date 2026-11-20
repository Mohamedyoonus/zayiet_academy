import type { Locale } from "./config";
import type en from "./dictionaries/en";
import type { Translation } from "./dictionaries/en";

/** Every text on the site in one language. Keys a language hasn't translated yet hold the English text. */
export type Dictionary = typeof en;

// Each language is its own chunk, so visitors only download the one they use
// (plus English, which fills any gaps)
const loadEnglish = () => import("./dictionaries/en");
const loaders: Record<Exclude<Locale, "en">, () => Promise<{ default: Translation }>> = {
  kn: () => import("./dictionaries/kn"),
  ta: () => import("./dictionaries/ta"),
  te: () => import("./dictionaries/te"),
  ml: () => import("./dictionaries/ml"),
  hi: () => import("./dictionaries/hi"),
  ar: () => import("./dictionaries/ar"),
};

export async function loadDictionary(locale: Locale): Promise<Dictionary> {
  if (locale === "en") return (await loadEnglish()).default;
  const [{ default: english }, { default: translation }] = await Promise.all([loadEnglish(), loaders[locale]()]);
  const merged: Record<string, unknown> = { ...english };
  for (const [section, text] of Object.entries(translation)) {
    merged[section] = { ...english[section as keyof Dictionary], ...text };
  }
  return merged as Dictionary;
}

/** Fills {placeholders}: fmt("Only {count} seats left", { count: 3 }) */
export function fmt(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match
  );
}

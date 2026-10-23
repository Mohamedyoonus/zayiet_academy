import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/en";

export type { Dictionary };

// Each language is its own chunk, so visitors only download the one they use
const loaders: Record<Locale, () => Promise<{ default: Dictionary }>> = {
  en: () => import("./dictionaries/en"),
  kn: () => import("./dictionaries/kn"),
  ta: () => import("./dictionaries/ta"),
  te: () => import("./dictionaries/te"),
  ml: () => import("./dictionaries/ml"),
  hi: () => import("./dictionaries/hi"),
  ar: () => import("./dictionaries/ar"),
};

export async function loadDictionary(locale: Locale): Promise<Dictionary> {
  return (await loaders[locale]()).default;
}

/** Fills {placeholders}: fmt("Only {count} seats left", { count: 3 }) */
export function fmt(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match
  );
}

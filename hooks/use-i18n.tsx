"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { LOCALE_COOKIE, getLanguage, scriptFontHref, type Locale } from "@/lib/i18n/config";
import { loadDictionary, type Dictionary } from "@/lib/i18n";
import {
  accessories,
  admissionNote,
  counters,
  courses,
  deliveryModes,
  eventClients,
  faqs,
  galleryItems,
  materialsKit,
  nav,
  otherServices,
  products,
  testimonials,
  workshops,
} from "@/lib/data";
import type { EventClient, GalleryItem, Testimonial } from "@/types";

type I18nContextValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: Dictionary;
  setLocale: (locale: Locale) => void;
  /** True while a newly chosen language is still downloading */
  switching: boolean;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

function applyLocaleToDocument(locale: Locale) {
  const language = getLanguage(locale);
  const root = document.documentElement;
  root.lang = locale;
  root.dir = language.dir;

  // Load the font for this script once (the server already adds it on first load)
  if (language.font) {
    const id = `font-script-${locale}`;
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = scriptFontHref(language.font);
      document.head.appendChild(link);
    }
  }

  // The server reads this cookie to render every later page in the same language
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

export function I18nProvider({
  initialLocale,
  initialDictionary,
  children,
}: {
  initialLocale: Locale;
  initialDictionary: Dictionary;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState(initialLocale);
  const [t, setT] = useState(initialDictionary);
  const [switching, setSwitching] = useState(false);
  const latestRequest = useRef(0);

  const setLocale = useCallback((next: Locale) => {
    const request = ++latestRequest.current;
    setSwitching(true);
    loadDictionary(next)
      .then((dictionary) => {
        if (request !== latestRequest.current) return; // a newer choice already won
        setT(dictionary);
        setLocaleState(next);
        applyLocaleToDocument(next);
      })
      .finally(() => {
        if (request === latestRequest.current) setSwitching(false);
      });
  }, []);

  const value = useMemo(
    () => ({ locale, dir: getLanguage(locale).dir, t, setLocale, switching }),
    [locale, t, setLocale, switching]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

/** The current language's text: t.hero.exploreClasses */
export function useT() {
  return useI18n().t;
}

/** The site content from lib/data.ts in the current language (English fills any gaps) */
export function useData() {
  const t = useT();

  return useMemo(() => {
    const tr = t.data;
    const galleryCategory = (c: GalleryItem["category"]) => tr.galleryCategories?.[c] ?? c;
    const eventCategory = (c: EventClient["category"]) => tr.eventCategories?.[c] ?? c;
    const role = (r: Testimonial["role"]) => tr.roles?.[r] ?? r;

    return {
      nav: nav.map((item) => ({ ...item, label: t.nav[item.key] })),
      courses: courses.map((c) => {
        const x = tr.courses?.[c.id] ?? {};
        return {
          ...c,
          tierLabel: x.tier ?? c.tier,
          title: x.title ?? c.title,
          description: x.description ?? c.description,
          duration: x.duration ?? c.duration,
          schedule: x.schedule ?? c.schedule,
          batchSize: x.batchSize ?? c.batchSize,
          highlights: x.highlights ?? c.highlights,
        };
      }),
      deliveryModes: deliveryModes.map((m) => {
        const x = tr.deliveryModes?.[m.id] ?? {};
        return { ...m, title: x.title ?? m.title, points: x.points ?? m.points };
      }),
      workshops: workshops.map((w) => {
        const x = tr.workshops?.[w.id] ?? {};
        return { ...w, title: x.title ?? w.title, venue: x.venue ?? w.venue, date: x.date ?? w.date };
      }),
      products: products.map((p) => ({ ...p, name: tr.products?.[p.id] ?? p.name })),
      materialsKit: materialsKit.map((item, i) => tr.materialsKit?.[i] ?? item),
      accessories: accessories.map((a) => ({ ...a, name: tr.accessories?.[a.id] ?? a.name })),
      eventClients: eventClients.map((e) => {
        const x = tr.eventClients?.[e.id] ?? {};
        return {
          ...e,
          name: x.name ?? e.name,
          description: x.description ?? e.description,
          categoryLabel: eventCategory(e.category),
        };
      }),
      otherServices: otherServices.map((s) => {
        const x = tr.otherServices?.[s.id] ?? {};
        return { ...s, title: x.title ?? s.title, description: x.description ?? s.description };
      }),
      galleryItems: galleryItems.map((g) => ({
        ...g,
        title: tr.galleryItems?.[g.id] ?? g.title,
        categoryLabel: galleryCategory(g.category),
      })),
      testimonials: testimonials.map((r) => ({
        ...r,
        quote: tr.testimonials?.[r.id] ?? r.quote,
        roleLabel: role(r.role),
      })),
      faqs: faqs.map((f) => {
        const x = tr.faqs?.[f.id] ?? {};
        return { ...f, question: x.question ?? f.question, answer: x.answer ?? f.answer };
      }),
      counters: counters.map((c) => ({ ...c, label: tr.counters?.[c.label] ?? c.label })),
      admissionNote: tr.admissionNote ?? admissionNote,
      galleryCategory,
    };
  }, [t]);
}

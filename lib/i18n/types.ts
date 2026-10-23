import type { EventClient, GalleryItem, Testimonial } from "@/types";

/**
 * Translations for the content in lib/data.ts, keyed by each item's id.
 * English needs none — lib/data.ts already holds it — and any missing entry
 * simply falls back to English.
 */
export type DataTranslations = {
  courses?: Record<
    string,
    Partial<{
      tier: string;
      title: string;
      description: string;
      duration: string;
      schedule: string;
      batchSize: string;
      highlights: string[];
    }>
  >;
  deliveryModes?: Record<string, Partial<{ title: string; points: string[] }>>;
  workshops?: Record<string, Partial<{ title: string; venue: string; date: string }>>;
  /** Product names by id */
  products?: Record<string, string>;
  /** Same order as materialsKit in lib/data.ts */
  materialsKit?: string[];
  /** Accessory category names by id */
  accessories?: Record<string, string>;
  eventClients?: Record<string, Partial<{ name: string; description: string }>>;
  eventCategories?: Partial<Record<EventClient["category"], string>>;
  otherServices?: Record<string, Partial<{ title: string; description: string }>>;
  /** Artwork titles by id */
  galleryItems?: Record<string, string>;
  galleryCategories?: Partial<Record<GalleryItem["category"], string>>;
  /** Quotes by id (names stay as they are) */
  testimonials?: Record<string, string>;
  roles?: Partial<Record<Testimonial["role"], string>>;
  faqs?: Record<string, Partial<{ question: string; answer: string }>>;
  /** About-page counters, keyed by their English label */
  counters?: Record<string, string>;
  admissionNote?: string;
};

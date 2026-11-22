import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";
import { DEFAULT_LAYOUT, normalizeLayout, type LayoutContent, type PageId } from "@/lib/site-layout";
import { normalizeStore, type StoreContent } from "@/lib/store";
import type { Course, GalleryItem } from "@/types";

// Website content that the admin edits (English only). Every page reads it
// through getSiteContent(), which is cached and refreshed whenever the admin saves.

export type HeroStat = { value: string; label: string };

export type HeroContent = {
  eyebrow: string;
  titleBefore: string;
  titleHighlight: string;
  titleAfter: string;
  description: string;
  image: string;
  stats: HeroStat[];
};

/** About page text and the founders' photos. Keys match the `about` dictionary section, so saved values override it. */
export type AboutContent = {
  /** Founder's photo */
  photo: string;
  /** Under the founder's highlighted quote, e.g. "— Chalz Simon, Founder" */
  quoteBy: string;
  /** Label above the founder's story, e.g. "The Founder's Story" */
  eyebrow: string;
  /** Founder's name */
  title: string;
  /** Line under the founder's name */
  highlight: string;
  /** Paragraphs separated by an empty line; the last one is shown as a quote */
  story: string;
  founderRole: string;
  coFounderPhoto: string;
  coFounderName: string;
  coFounderRole: string;
  /** Paragraphs separated by an empty line */
  coFounderBio: string;
  aboutZayitTitle: string;
  aboutZayitText: string;
  aboutZayitTagline: string;
  missionTitle: string;
  missionTagline: string;
  mission: string;
  visionTitle: string;
  visionTagline: string;
  vision: string;
  closingTitle: string;
  closingText: string;
  closingSignature: string;
};

/** Contact page and the academy's contact details used across the site (call/WhatsApp buttons, social icons) */
export type ContactContent = {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  phoneValue: string;
  /** WhatsApp number; empty means use the phone number */
  whatsapp: string;
  emailValue: string;
  hoursValue: string;
  addressValue: string;
  /** What the map shows, e.g. "Zayit Academy, Indiranagar, Bengaluru" */
  mapQuery: string;
  instagram: string;
  facebook: string;
  youtube: string;
};

/** null means "not in the database", so the site falls back to the defaults in code */
export type SiteContent = {
  hero: HeroContent | null;
  about: Partial<AboutContent> | null;
  contact: Partial<ContactContent> | null;
  courses: Course[] | null;
  gallery: GalleryItem[] | null;
  /** Which pages and home sections are shown (always filled in; defaults show everything) */
  layout: LayoutContent;
  /** Store products and settings (null: show the starting products) */
  store: StoreContent | null;
};

/** The keys stored in the site_content table */
export type ContentKey = "hero" | "about" | "contact" | "layout" | "store";

export const CONTENT_TAG = "site-content";

export type CourseRow = {
  id: string;
  sort: number;
  tier: string;
  title: string;
  description: string;
  duration: string;
  schedule: string;
  batch_size: string;
  fee_offline: number;
  fee_online: number;
  highlights: string[];
  image: string;
  certificate: boolean;
  published: boolean;
};

export type GalleryRow = {
  id: string;
  sort: number;
  title: string;
  category: string;
  image: string;
};

export function courseFromRow(row: CourseRow): Course {
  return {
    id: row.id,
    tier: row.tier,
    title: row.title,
    description: row.description,
    duration: row.duration,
    schedule: row.schedule,
    batchSize: row.batch_size,
    certificate: row.certificate,
    feeOffline: row.fee_offline,
    feeOnline: row.fee_online,
    highlights: row.highlights,
    image: row.image,
  };
}

export const EMPTY_CONTENT: SiteContent = {
  hero: null,
  about: null,
  contact: null,
  courses: null,
  gallery: null,
  layout: DEFAULT_LAYOUT,
  store: null,
};

const loadContent = unstable_cache(
  async (): Promise<SiteContent> => {
    const supabase = createPublicClient();
    const [pages, courses, gallery] = await Promise.all([
      supabase.from("site_content").select("key, data"),
      supabase.from("courses").select("*").eq("published", true).order("sort").order("title"),
      supabase.from("gallery_items").select("id, sort, title, category, image").order("sort").order("created_at", { ascending: false }),
    ]);
    const error = pages.error ?? courses.error ?? gallery.error;
    // Thrown errors aren't cached, so the next request tries again
    if (error) throw new Error(error.message);

    const page = (key: ContentKey) => ((pages.data ?? []) as { key: string; data: unknown }[]).find((row) => row.key === key)?.data ?? null;
    const courseRows = (courses.data ?? []) as CourseRow[];
    return {
      hero: page("hero") as HeroContent | null,
      about: page("about") as Partial<AboutContent> | null,
      contact: page("contact") as Partial<ContactContent> | null,
      // The enroll form and class finder need at least one course, so an empty list keeps the defaults
      courses: courseRows.length ? courseRows.map(courseFromRow) : null,
      gallery: (gallery.data ?? []) as GalleryRow[],
      layout: normalizeLayout(page("layout")),
      store: normalizeStore(page("store")),
    };
  },
  ["site-content"],
  // Also refresh every few minutes, in case something is changed straight in Supabase
  { tags: [CONTENT_TAG], revalidate: 300 }
);

export async function getSiteContent(): Promise<SiteContent> {
  if (!supabaseConfigured) return EMPTY_CONTENT;
  try {
    const content = await loadContent();
    // A copy cached before page visibility existed has no layout: show everything
    return { ...content, layout: content.layout ?? DEFAULT_LAYOUT, store: content.store ?? null };
  } catch (error) {
    console.error("Could not load content from Supabase, showing the defaults:", error);
    return EMPTY_CONTENT;
  }
}

/** For a page the admin can hide: visitors who open it while it's hidden go to the home page */
export async function redirectIfHidden(page: PageId) {
  const { layout } = await getSiteContent();
  if (layout.hiddenPages.includes(page)) redirect("/");
}

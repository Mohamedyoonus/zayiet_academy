import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";
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

/** null means "not in the database", so the site falls back to the defaults in code */
export type SiteContent = {
  hero: HeroContent | null;
  courses: Course[] | null;
  gallery: GalleryItem[] | null;
};

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

const EMPTY: SiteContent = { hero: null, courses: null, gallery: null };

const loadContent = unstable_cache(
  async (): Promise<SiteContent> => {
    const supabase = createPublicClient();
    const [hero, courses, gallery] = await Promise.all([
      supabase.from("site_content").select("data").eq("key", "hero").maybeSingle(),
      supabase.from("courses").select("*").eq("published", true).order("sort").order("title"),
      supabase.from("gallery_items").select("id, sort, title, category, image").order("sort").order("created_at", { ascending: false }),
    ]);
    const error = hero.error ?? courses.error ?? gallery.error;
    // Thrown errors aren't cached, so the next request tries again
    if (error) throw new Error(error.message);

    const courseRows = (courses.data ?? []) as CourseRow[];
    return {
      hero: (hero.data?.data as HeroContent | undefined) ?? null,
      // The enroll form and class finder need at least one course, so an empty list keeps the defaults
      courses: courseRows.length ? courseRows.map(courseFromRow) : null,
      gallery: (gallery.data ?? []) as GalleryRow[],
    };
  },
  ["site-content"],
  // Also refresh every few minutes, in case something is changed straight in Supabase
  { tags: [CONTENT_TAG], revalidate: 300 }
);

export async function getSiteContent(): Promise<SiteContent> {
  if (!supabaseConfigured) return EMPTY;
  try {
    return await loadContent();
  } catch (error) {
    console.error("Could not load content from Supabase, showing the defaults:", error);
    return EMPTY;
  }
}

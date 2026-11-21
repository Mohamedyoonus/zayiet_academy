import type { Metadata } from "next";
import { getAdminClient } from "@/lib/admin";
import type { HeroContent } from "@/lib/content";
import en from "@/lib/i18n/dictionaries/en";
import { PageHeader } from "@/components/admin/ui";
import HeroForm from "@/components/admin/hero-form";

export const metadata: Metadata = { title: "Hero section" };

// What the home page shows before anything is saved here
const DEFAULT_HERO: HeroContent = {
  eyebrow: en.hero.eyebrow,
  titleBefore: en.hero.titleBefore,
  titleHighlight: en.hero.titleHighlight,
  titleAfter: en.hero.titleAfter,
  description: en.hero.description,
  image: "/assets/hero.webp",
  stats: [
    { value: "1200+", label: en.hero.statStudents },
    { value: "9+", label: en.hero.statYears },
    { value: "18", label: en.hero.statAwards },
  ],
};

export default async function HeroAdminPage() {
  const supabase = await getAdminClient();
  if (!supabase) return null;
  const { data } = await supabase.from("site_content").select("data").eq("key", "hero").maybeSingle();

  return (
    <>
      <PageHeader title="Hero section" description="The first thing visitors see on the home page." />
      <HeroForm initial={(data?.data as HeroContent | undefined) ?? DEFAULT_HERO} />
    </>
  );
}

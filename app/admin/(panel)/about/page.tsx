import type { Metadata } from "next";
import { getAdminClient } from "@/lib/admin";
import type { AboutContent } from "@/lib/content";
import { withSaved } from "@/lib/with-saved";
import en from "@/lib/i18n/dictionaries/en";
import { PageHeader } from "@/components/admin/ui";
import AboutForm from "@/components/admin/about-form";

export const metadata: Metadata = { title: "About page" };

// What the About page shows before anything is saved here
const DEFAULT_ABOUT: AboutContent = {
  photo: "/assets/chalz-simon.webp",
  quoteBy: en.about.quoteBy,
  eyebrow: en.about.eyebrow,
  title: en.about.title,
  highlight: en.about.highlight,
  story: en.about.story,
  founderRole: en.about.founderRole,
  coFounderPhoto: "",
  coFounderName: en.about.coFounderName,
  coFounderRole: en.about.coFounderRole,
  coFounderBio: en.about.coFounderBio,
  aboutZayitTitle: en.about.aboutZayitTitle,
  aboutZayitText: en.about.aboutZayitText,
  aboutZayitTagline: en.about.aboutZayitTagline,
  missionTitle: en.about.missionTitle,
  missionTagline: en.about.missionTagline,
  mission: en.about.mission,
  visionTitle: en.about.visionTitle,
  visionTagline: en.about.visionTagline,
  vision: en.about.vision,
  closingTitle: en.about.closingTitle,
  closingText: en.about.closingText,
  closingSignature: en.about.closingSignature,
};

export default async function AboutAdminPage() {
  const supabase = await getAdminClient();
  if (!supabase) return null;
  const { data } = await supabase.from("site_content").select("data").eq("key", "about").maybeSingle();

  return (
    <>
      <PageHeader
        title="About page"
        description="About Zayit Academy, Mission, Vision, the founder and co-founder, and the closing words."
      />
      <AboutForm initial={withSaved(DEFAULT_ABOUT, data?.data as Partial<AboutContent> | undefined)} />
    </>
  );
}

import { Fragment, type ReactNode } from "react";
import type { Metadata } from "next";
import Hero from "@/components/sections/hero";
import VisionValues from "@/components/sections/vision-values";
import LittleArtists from "@/components/sections/little-artists";
import ClassFinder from "@/components/sections/class-finder";
import Workshop from "@/components/sections/workshop";
import Gallery from "@/components/sections/gallery";
import { getSiteContent } from "@/lib/content";
import type { HomeSectionId } from "@/lib/site-layout";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const SECTIONS: Record<HomeSectionId, ReactNode> = {
  hero: <Hero />,
  littleArtists: <LittleArtists />,
  vision: <VisionValues />,
  classFinder: <ClassFinder />,
  workshop: <Workshop />,
  gallery: <Gallery preview />,
};

export default async function Home() {
  // Order and on/off come from the admin (Pages & sections)
  const { layout } = await getSiteContent();
  const shown = layout.homeSections.filter((s) => s.visible);

  return (
    // Without the hero, keep the first section clear of the fixed menu bar
    <div className={shown[0]?.id === "hero" ? undefined : "pt-[76px]"}>
      {shown.map((s) => (
        <Fragment key={s.id}>{SECTIONS[s.id]}</Fragment>
      ))}
    </div>
  );
}

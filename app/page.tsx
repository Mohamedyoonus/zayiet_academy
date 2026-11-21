import type { Metadata } from "next";
import Hero from "@/components/sections/hero";
import VisionValues from "@/components/sections/vision-values";
import LittleArtists from "@/components/sections/little-artists";
import ClassFinder from "@/components/sections/class-finder";
import Workshop from "@/components/sections/workshop";
import Gallery from "@/components/sections/gallery";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <VisionValues />
      <LittleArtists />
      <ClassFinder />
      <Workshop />
      <Gallery preview />
    </>
  );
}

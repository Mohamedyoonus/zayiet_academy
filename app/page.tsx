import Hero from "@/components/sections/hero";
import VisionValues from "@/components/sections/vision-values";
import LittleArtists from "@/components/sections/little-artists";
import ArtClasses from "@/components/sections/art-classes";
import ClassFinder from "@/components/sections/class-finder";
import Workshop from "@/components/sections/workshop";
import Gallery from "@/components/sections/gallery";

export default function Home() {
  return (
    <>
      <Hero />
      <VisionValues />
      <LittleArtists />
      <ArtClasses />
      <ClassFinder />
      <Workshop />
      <Gallery />
    </>
  );
}

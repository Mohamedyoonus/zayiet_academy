import Hero from "@/components/sections/hero";
import ArtClasses from "@/components/sections/art-classes";
import ClassFinder from "@/components/sections/class-finder";
import Workshop from "@/components/sections/workshop";
import Gallery from "@/components/sections/gallery";
import LittleArtists from "@/components/sections/little-artists";
import ScrollPaintStroke from "@/components/ui/scroll-paint-stroke";

export default function Home() {
  return (
    <ScrollPaintStroke>
      <Hero />
      <LittleArtists />
      <ArtClasses />
      <ClassFinder />
      <Workshop />
      <Gallery />
    </ScrollPaintStroke>
  );
}

import Hero from "@/components/sections/hero";
import ArtClasses from "@/components/sections/art-classes";
import Workshop from "@/components/sections/workshop";
import Gallery from "@/components/sections/gallery";
import LittleArtists from "@/components/sections/little-artists";

export default function Home() {
  return (
    <>
      <Hero />
      <LittleArtists />
      <ArtClasses />
      <Workshop />
      <Gallery />
    </>
  );
}

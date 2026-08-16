import Hero from "@/components/sections/hero";
import ArtClasses from "@/components/sections/art-classes";
import Workshop from "@/components/sections/workshop";
import ArtStore from "@/components/sections/art-store";
import Accessories from "@/components/sections/accessories";
import CommunityEvents from "@/components/sections/community-events";
import Collaboration from "@/components/sections/collaboration";
import OtherServices from "@/components/sections/other-services";
import About from "@/components/sections/about";
import Gallery from "@/components/sections/gallery";
import Testimonials from "@/components/sections/testimonials";
import FAQ from "@/components/sections/faq";
import Contact from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Hero />
      <ArtClasses />
      <Workshop />
      <ArtStore />
      <Accessories />
      <CommunityEvents />
      <Collaboration />
      <OtherServices />
      <About />
      <Gallery />
      <Testimonials />
      <FAQ />
      <Contact />
    </>
  );
}

import type { Metadata } from "next";
import Gallery from "@/components/sections/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A Gallery of Creativity and Growth — student artwork, drawing and sketching, painting and mixed media, creative workshops and community art from Zayit Academy.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return <Gallery />;
}

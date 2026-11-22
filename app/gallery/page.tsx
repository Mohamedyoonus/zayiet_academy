import type { Metadata } from "next";
import { redirectIfHidden } from "@/lib/content";
import Gallery from "@/components/sections/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A Gallery of Creativity and Growth — student artwork, drawing and sketching, painting and mixed media, creative workshops and community art from Zayit Academy.",
  alternates: { canonical: "/gallery" },
};

// Visitors are sent to the home page while the admin has this page hidden
export default async function GalleryPage() {
  await redirectIfHidden("gallery");
  return <Gallery />;
}

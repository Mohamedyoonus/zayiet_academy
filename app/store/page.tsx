import type { Metadata } from "next";
import { redirectIfHidden } from "@/lib/content";
import ArtStore from "@/components/sections/art-store";

export const metadata: Metadata = {
  title: "Art Store",
  description:
    "Original framed pieces from Zayit Academy students and instructors, plus art materials and a complete beginner’s kit.",
  alternates: { canonical: "/store" },
};

// Visitors are sent to the home page while the admin has this page hidden
export default async function StorePage() {
  await redirectIfHidden("store");
  return <ArtStore />;
}

import type { Metadata } from "next";
import ArtStore from "@/components/sections/art-store";

export const metadata: Metadata = {
  title: "Art Store",
  description:
    "Original framed pieces from Zayit Academy students and instructors, plus art materials and a complete beginner’s kit.",
  alternates: { canonical: "/store" },
};

export default function StorePage() {
  return <ArtStore />;
}

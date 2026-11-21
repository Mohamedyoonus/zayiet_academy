import type { Metadata } from "next";
import ArtClasses from "@/components/sections/art-classes";

export const metadata: Metadata = {
  title: "Art Classes",
  description:
    "Basic, Advanced and Pro drawing and painting courses for ages 5–16 — offline in our Bangalore studio or live online. 6 months, 2 classes a week, small batches and a certificate.",
  alternates: { canonical: "/classes" },
};

export default function ClassesPage() {
  return <ArtClasses />;
}

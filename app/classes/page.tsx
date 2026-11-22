import type { Metadata } from "next";
import { redirectIfHidden } from "@/lib/content";
import ArtClasses from "@/components/sections/art-classes";

export const metadata: Metadata = {
  title: "Art Classes",
  description:
    "Basic, Advanced and Pro drawing and painting courses for ages 5–16 — offline in our Bangalore studio or live online. 6 months, 2 classes a week, small batches and a certificate.",
  alternates: { canonical: "/classes" },
};

// Visitors are sent to the home page while the admin has this page hidden
export default async function ClassesPage() {
  await redirectIfHidden("classes");
  return <ArtClasses />;
}

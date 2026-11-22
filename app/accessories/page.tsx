import type { Metadata } from "next";
import { redirectIfHidden } from "@/lib/content";
import Accessories from "@/components/sections/accessories";

export const metadata: Metadata = {
  title: "Art Supplies & Accessories",
  description: "Papers, pencils, brushes, canvas and colour kits — quality art supplies curated by Zayit Academy.",
  alternates: { canonical: "/accessories" },
};

// Visitors are sent to the home page while the admin has this page hidden
export default async function AccessoriesPage() {
  await redirectIfHidden("accessories");
  return <Accessories />;
}

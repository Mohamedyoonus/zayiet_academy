import type { Metadata } from "next";
import { redirectIfHidden } from "@/lib/content";
import FunZone from "@/components/sections/fun-zone";

export const metadata: Metadata = {
  title: "Kids’ Colouring & Drawing Fun Zone",
  description:
    "Free online colouring pages and a drawing board for kids. Pick a picture, fill it with colour or draw anything, then save it and show your family.",
  alternates: { canonical: "/fun-zone" },
};

// Visitors are sent to the home page while the admin has this page hidden
export default async function FunZonePage() {
  await redirectIfHidden("fun-zone");
  return <FunZone />;
}

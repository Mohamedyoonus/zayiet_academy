import type { Metadata } from "next";
import Accessories from "@/components/sections/accessories";

export const metadata: Metadata = {
  title: "Art Supplies & Accessories",
  description: "Papers, pencils, brushes, canvas and colour kits — quality art supplies curated by Zayit Academy.",
  alternates: { canonical: "/accessories" },
};

export default function AccessoriesPage() {
  return <Accessories />;
}

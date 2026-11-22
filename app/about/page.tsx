import type { Metadata } from "next";
import { redirectIfHidden } from "@/lib/content";
import About from "@/components/sections/about";

export const metadata: Metadata = {
  title: "About & Founder’s Story",
  description:
    "Zayit Academy believes art is more than a skill—it is a journey of self-discovery, confidence and personal growth. Read founder Chalz Simon’s story and our vision: Spreading Peace Through Art.",
  alternates: { canonical: "/about" },
};

// Visitors are sent to the home page while the admin has this page hidden
export default async function AboutPage() {
  await redirectIfHidden("about");
  return <About />;
}

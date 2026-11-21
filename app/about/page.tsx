import type { Metadata } from "next";
import About from "@/components/sections/about";

export const metadata: Metadata = {
  title: "About & Founder’s Story",
  description:
    "Zayit Academy believes art is more than a skill—it is a journey of self-discovery, confidence and personal growth. Read founder Chalz Simon’s story and our vision: Spreading Peace Through Art.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <About />;
}

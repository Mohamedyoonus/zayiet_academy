import type { Metadata } from "next";
import FAQ from "@/components/sections/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Ages, course levels, online and offline classes, batch sizes, fees, certificates and workshops — answers to common questions about Zayit Academy.",
  alternates: { canonical: "/faq" },
};

export default function FAQPage() {
  return <FAQ />;
}

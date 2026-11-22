import type { Metadata } from "next";
import { redirectIfHidden } from "@/lib/content";
import FAQ from "@/components/sections/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Ages, course levels, online and offline classes, batch sizes, fees, certificates and workshops — answers to common questions about Zayit Academy.",
  alternates: { canonical: "/faq" },
};

// Visitors are sent to the home page while the admin has this page hidden
export default async function FAQPage() {
  await redirectIfHidden("faq");
  return <FAQ />;
}

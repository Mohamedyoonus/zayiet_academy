import type { Metadata } from "next";
import { redirectIfHidden } from "@/lib/content";
import Testimonials from "@/components/sections/testimonials";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Real stories from Zayit Academy students and parents.",
  alternates: { canonical: "/testimonials" },
};

// Visitors are sent to the home page while the admin has this page hidden
export default async function TestimonialsPage() {
  await redirectIfHidden("testimonials");
  return <Testimonials />;
}

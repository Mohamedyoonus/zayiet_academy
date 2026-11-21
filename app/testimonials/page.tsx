import type { Metadata } from "next";
import Testimonials from "@/components/sections/testimonials";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Real stories from Zayit Academy students and parents.",
  alternates: { canonical: "/testimonials" },
};

export default function TestimonialsPage() {
  return <Testimonials />;
}

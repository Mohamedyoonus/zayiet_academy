import type { Metadata } from "next";
import Contact from "@/components/sections/contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Zayit Academy in Bangalore. Have a question before you enroll? We’re happy to help you pick the right course.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <Contact />;
}

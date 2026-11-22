import type { Metadata } from "next";
import { redirectIfHidden } from "@/lib/content";
import Contact from "@/components/sections/contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Zayit Academy in Bangalore. Have a question before you enroll? We’re happy to help you pick the right course.",
  alternates: { canonical: "/contact" },
};

// Visitors are sent to the home page while the admin has this page hidden
export default async function ContactPage() {
  await redirectIfHidden("contact");
  return <Contact />;
}

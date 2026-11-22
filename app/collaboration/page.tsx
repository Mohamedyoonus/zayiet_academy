import type { Metadata } from "next";
import { redirectIfHidden } from "@/lib/content";
import Collaboration from "@/components/sections/collaboration";

export const metadata: Metadata = {
  title: "Collaborate With Us",
  description:
    "Art That Connects Us. School art programmes, community art workshops, apartment and residential events, collaborative murals and custom creative projects with Zayit Academy.",
  alternates: { canonical: "/collaboration" },
};

// Visitors are sent to the home page while the admin has this page hidden
export default async function CollaborationPage() {
  await redirectIfHidden("collaboration");
  return <Collaboration />;
}

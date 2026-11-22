import type { Metadata } from "next";
import { redirectIfHidden } from "@/lib/content";
import CommunityEvents from "@/components/sections/community-events";

export const metadata: Metadata = {
  title: "Community Events",
  description:
    "From school campuses to corporate parks, Zayit Academy travels to bring hands-on creative experiences to your community.",
  alternates: { canonical: "/events" },
};

// Visitors are sent to the home page while the admin has this page hidden
export default async function EventsPage() {
  await redirectIfHidden("events");
  return <CommunityEvents />;
}

import type { Metadata } from "next";
import CommunityEvents from "@/components/sections/community-events";

export const metadata: Metadata = {
  title: "Community Events",
  description:
    "From school campuses to corporate parks, Zayit Academy travels to bring hands-on creative experiences to your community.",
  alternates: { canonical: "/events" },
};

export default function EventsPage() {
  return <CommunityEvents />;
}

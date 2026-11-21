import type { Metadata } from "next";
import Collaboration from "@/components/sections/collaboration";

export const metadata: Metadata = {
  title: "Collaborate With Us",
  description:
    "Art That Connects Us. School art programmes, community art workshops, apartment and residential events, collaborative murals and custom creative projects with Zayit Academy.",
  alternates: { canonical: "/collaboration" },
};

export default function CollaborationPage() {
  return <Collaboration />;
}

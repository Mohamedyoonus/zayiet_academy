import type { Metadata } from "next";
import { Suspense } from "react";
import Enroll from "@/components/sections/enroll";

export const metadata: Metadata = {
  title: "Enroll",
  description:
    "Choose a Basic, Advanced or Pro art course for ages 5–16, offline in our Bangalore studio or live online, and reserve your seat at Zayit Academy.",
  alternates: { canonical: "/enroll" },
};

export default function EnrollPage() {
  return (
    <Suspense>
      <Enroll />
    </Suspense>
  );
}

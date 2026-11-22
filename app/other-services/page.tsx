import type { Metadata } from "next";
import { redirectIfHidden } from "@/lib/content";
import OtherServices from "@/components/sections/other-services";

export const metadata: Metadata = {
  title: "Murals, Wall Art & Custom Art",
  description:
    "Wall painting, murals, custom commissions, corporate decoration and private art sessions at your place, by Zayit Academy.",
  alternates: { canonical: "/other-services" },
};

// Visitors are sent to the home page while the admin has this page hidden
export default async function OtherServicesPage() {
  await redirectIfHidden("other-services");
  return <OtherServices />;
}

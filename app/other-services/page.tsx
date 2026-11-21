import type { Metadata } from "next";
import OtherServices from "@/components/sections/other-services";

export const metadata: Metadata = {
  title: "Murals, Wall Art & Custom Art",
  description:
    "Wall painting, murals, custom commissions, corporate decoration and private art sessions at your place, by Zayit Academy.",
  alternates: { canonical: "/other-services" },
};

export default function OtherServicesPage() {
  return <OtherServices />;
}

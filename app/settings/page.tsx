import type { Metadata } from "next";
import SettingsPanel from "@/components/sections/settings";

export const metadata: Metadata = {
  title: "Settings",
  description: "Choose a color theme, text size, heading style and which animations play.",
  robots: { index: false },
};

export default function SettingsPage() {
  return <SettingsPanel />;
}

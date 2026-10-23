import type { Metadata } from "next";
import SettingsPanel from "@/components/sections/settings";

export const metadata: Metadata = {
  title: "Settings — Zayith Academy",
  description: "Choose a color theme, text size, heading style and which animations play.",
};

export default function SettingsPage() {
  return <SettingsPanel />;
}

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { scrollToHash } from "@/lib/utils";

// Smoothly scrolls to the section named by the URL hash once the home page
// is mounted — covers navigating in from another page and landing directly
// on a link like "/#gallery".
export function useHashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;
    const hash = window.location.hash;
    if (!hash) return;
    const frame = requestAnimationFrame(() => scrollToHash(hash));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);
}

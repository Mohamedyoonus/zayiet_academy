"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const START_EVENT = "admin:navigation-start";

/** Call before router.push() so the bar shows while the next page loads */
export const startNavigationProgress = () => window.dispatchEvent(new Event(START_EVENT));

/** Is this click a normal same-site link to another page or filter? */
function isNavigationClick(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  const link = (event.target as Element | null)?.closest?.("a");
  if (!link || link.target === "_blank" || link.hasAttribute("download")) return false;
  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin || url.pathname.startsWith("/admin/export")) return false;
  return url.pathname !== window.location.pathname || url.search !== window.location.search;
}

function Bar() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const safety = useRef(0);

  // The URL changes once the new page has arrived: finish the bar
  useEffect(() => {
    setState((s) => (s === "loading" ? "done" : s));
  }, [pathname, search]);

  useEffect(() => {
    if (state !== "done") return;
    const t = window.setTimeout(() => setState("idle"), 350);
    return () => window.clearTimeout(t);
  }, [state]);

  useEffect(() => {
    const start = () => {
      setState("loading");
      window.clearTimeout(safety.current);
      safety.current = window.setTimeout(() => setState("done"), 15000);
    };
    const onClick = (e: MouseEvent) => isNavigationClick(e) && start();
    const onSubmit = (e: SubmitEvent) => (e.target as HTMLFormElement).method.toLowerCase() === "get" && start();
    document.addEventListener("click", onClick);
    document.addEventListener("submit", onSubmit);
    window.addEventListener(START_EVENT, start);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("submit", onSubmit);
      window.removeEventListener(START_EVENT, start);
      window.clearTimeout(safety.current);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px]">
      <div
        className={cn(
          "h-full rounded-r-full bg-gradient-to-r from-sage-400 via-sage-600 to-brand shadow-[0_0_10px_rgb(var(--c-sage-500)/0.7)]",
          state === "idle" && "w-0 opacity-0",
          // Races ahead at first, then slows while it waits for the server
          state === "loading" && "w-[88%] opacity-100 transition-[width] duration-[6000ms] ease-[cubic-bezier(0.1,0.8,0.2,1)]",
          state === "done" && "w-full opacity-0 transition-[width,opacity] duration-300 ease-out"
        )}
      />
    </div>
  );
}

/** A thin bar across the top of the admin while a page or filter is loading */
export default function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <Bar />
    </Suspense>
  );
}

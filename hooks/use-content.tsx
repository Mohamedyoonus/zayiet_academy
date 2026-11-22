"use client";

import { createContext, useCallback, useContext, type ReactNode } from "react";
import type { SiteContent } from "@/lib/content";
import { DEFAULT_LAYOUT, isLinkHidden } from "@/lib/site-layout";

const ContentContext = createContext<SiteContent>({
  hero: null,
  about: null,
  contact: null,
  courses: null,
  gallery: null,
  layout: DEFAULT_LAYOUT,
  store: null,
});

/** Hands the admin-edited content (loaded once per page on the server) to every section */
export function ContentProvider({ content, children }: { content: SiteContent; children: ReactNode }) {
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}

/**
 * `shown("/store")` is false when the admin has hidden that page (or "/#workshop"
 * when the Workshop section is hidden) — for leaving out links and buttons to it.
 */
export function useShownLink() {
  const { layout } = useContent();
  return useCallback((href: string) => !isLinkHidden(layout, href), [layout]);
}

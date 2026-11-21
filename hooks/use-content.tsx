"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SiteContent } from "@/lib/content";

const ContentContext = createContext<SiteContent>({ hero: null, about: null, contact: null, courses: null, gallery: null });

/** Hands the admin-edited content (loaded once per page on the server) to every section */
export function ContentProvider({ content, children }: { content: SiteContent; children: ReactNode }) {
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}

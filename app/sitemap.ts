import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getSiteContent } from "@/lib/content";
import { isLinkHidden } from "@/lib/site-layout";

// Every page Google should list (Settings is left out on purpose)
const PAGES = [
  "/",
  "/classes",
  "/gallery",
  "/about",
  "/collaboration",
  "/enroll",
  "/events",
  "/store",
  "/accessories",
  "/other-services",
  "/fun-zone",
  "/testimonials",
  "/faq",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pages the admin has hidden aren't listed
  const { layout } = await getSiteContent();
  return PAGES.filter((path) => !isLinkHidden(layout, path)).map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}

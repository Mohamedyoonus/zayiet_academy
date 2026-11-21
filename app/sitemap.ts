import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

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

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}

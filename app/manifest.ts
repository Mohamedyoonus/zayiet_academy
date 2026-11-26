import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

// The site's name and icons for browsers, phones ("Add to Home screen") and search engines
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Zayit",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#FDFBF5",
    theme_color: "#7C8B6F",
    icons: [
      { src: "/icon.png", sizes: "192x192", type: "image/png" },
      { src: "/assets/logo_only.png", sizes: "472x472", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}

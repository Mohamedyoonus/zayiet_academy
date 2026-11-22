// Which pages and home-page sections the website shows, as chosen in the admin
// (Pages & sections). Shared by the admin, the server pages and the menus.

/** Home page sections, in their default order. The hero always stays at the top. */
export const HOME_SECTIONS = [
  { id: "hero", label: "Hero", description: "The big welcome at the top of the page", anchor: "" },
  { id: "littleArtists", label: "Little Artists", description: "The kids who draw when you hover or tap", anchor: "little-artists" },
  { id: "vision", label: "Our Vision", description: "Where Art Inspires Inner Peace, with four value cards", anchor: "vision" },
  { id: "classFinder", label: "Class Finder", description: "Three questions that suggest a course", anchor: "class-finder" },
  { id: "workshop", label: "Workshop", description: "Upcoming workshops (also the Workshop menu link)", anchor: "workshop" },
  { id: "gallery", label: "Gallery preview", description: "A row of photos with a View Gallery button", anchor: "gallery" },
] as const;
export type HomeSectionId = (typeof HOME_SECTIONS)[number]["id"];

/** Pages that can be hidden. Home, Enroll and Settings always stay. */
export const PAGES = [
  { id: "classes", label: "Art Classes", href: "/classes" },
  { id: "gallery", label: "Gallery", href: "/gallery" },
  { id: "fun-zone", label: "Fun Zone", href: "/fun-zone" },
  { id: "store", label: "Store", href: "/store" },
  { id: "events", label: "Events", href: "/events" },
  { id: "collaboration", label: "Collaboration", href: "/collaboration" },
  { id: "about", label: "About", href: "/about" },
  { id: "contact", label: "Contact", href: "/contact" },
  { id: "faq", label: "FAQ", href: "/faq" },
  { id: "accessories", label: "Accessories", href: "/accessories" },
  { id: "other-services", label: "Other Services", href: "/other-services" },
  { id: "testimonials", label: "Testimonials", href: "/testimonials" },
] as const;
export type PageId = (typeof PAGES)[number]["id"];

export type LayoutContent = {
  /** Every home section, in display order */
  homeSections: { id: HomeSectionId; visible: boolean }[];
  hiddenPages: PageId[];
};

export const DEFAULT_LAYOUT: LayoutContent = {
  homeSections: HOME_SECTIONS.map((s) => ({ id: s.id, visible: true })),
  hiddenPages: [],
};

const isSectionId = (id: unknown): id is HomeSectionId => HOME_SECTIONS.some((s) => s.id === id);
const isPageId = (id: unknown): id is PageId => PAGES.some((p) => p.id === id);

/**
 * A saved layout made safe to use: unknown names dropped, each section once,
 * the hero first, and sections added to the site later appended (shown).
 */
export function normalizeLayout(saved: unknown): LayoutContent {
  const data = (saved ?? {}) as Partial<Record<keyof LayoutContent, unknown>>;
  const savedSections = Array.isArray(data.homeSections) ? data.homeSections : [];

  const sections: LayoutContent["homeSections"] = [];
  for (const entry of savedSections) {
    const id = (entry as { id?: unknown })?.id;
    if (isSectionId(id) && !sections.some((s) => s.id === id)) {
      sections.push({ id, visible: (entry as { visible?: unknown }).visible !== false });
    }
  }
  for (const s of HOME_SECTIONS) {
    if (!sections.some((x) => x.id === s.id)) sections.push({ id: s.id, visible: true });
  }
  const hero = sections.find((s) => s.id === "hero")!;

  return {
    homeSections: [hero, ...sections.filter((s) => s.id !== "hero")],
    hiddenPages: Array.isArray(data.hiddenPages) ? [...new Set(data.hiddenPages.filter(isPageId))] : [],
  };
}

/**
 * Whether a link points somewhere the admin has hidden: a hidden page, or a
 * hidden home section ("/#workshop"). Links that can't be hidden never are.
 */
export function isLinkHidden(layout: LayoutContent, href: string) {
  const [path, hash] = href.split("#");
  if ((path === "/" || path === "") && hash) {
    const section = HOME_SECTIONS.find((s) => s.anchor === hash);
    return section ? layout.homeSections.some((s) => s.id === section.id && !s.visible) : false;
  }
  const page = PAGES.find((p) => p.href === path);
  return page ? layout.hiddenPages.includes(page.id) : false;
}

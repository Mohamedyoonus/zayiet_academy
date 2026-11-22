// The Art Store: products and settings the admin edits (Admin → Store), shared
// by the admin, the server and the Store page. Saved as one entry ("store") in
// the site_content table, so no extra database setup is needed.

import { materialsKit, products as startingProducts } from "@/lib/data";

export const PRODUCT_CATEGORIES = [
  { id: "framed-art", label: "Framed Art" },
  { id: "kit", label: "Kits" },
  { id: "materials", label: "Art Materials" },
  { id: "accessory", label: "Accessories" },
] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]["id"];

export const STOCK_OPTIONS = [
  { id: "in-stock", label: "In stock" },
  { id: "made-to-order", label: "Made to order" },
  { id: "sold-out", label: "Sold out" },
] as const;
export type StockStatus = (typeof STOCK_OPTIONS)[number]["id"];

export type StoreProduct = {
  id: string;
  name: string;
  category: ProductCategory;
  /** Rupees */
  price: number;
  /** The earlier price, shown struck through with the discount; null for none */
  oldPrice: number | null;
  image: string;
  /** One line on the product card */
  summary: string;
  /** The full description in the product view; paragraphs separated by an empty line */
  details: string;
  /** "What's included", one item per line */
  includes: string[];
  stock: StockStatus;
  /** Badge on the card, and first when sorting by "Featured" */
  featured: boolean;
  /** Hidden products aren't on the website */
  visible: boolean;
};

export type StoreContent = {
  products: StoreProduct[];
  /** Shown above the products, e.g. pickup or delivery details */
  note: string;
  /** The Materials Kit section below the products */
  kit: {
    show: boolean;
    title: string;
    description: string;
    items: string[];
    /** The product "Add the kit to your bag" adds */
    productId: string;
  };
};

export const LIMITS = { name: 120, summary: 160, details: 3000, include: 120, includes: 20, note: 300, price: 1_000_000 };

/** What the store shows before anything is saved in the admin: the original six products */
const STARTING_TEXT: Record<string, Pick<StoreProduct, "summary" | "details" | "includes">> = {
  p1: {
    summary: "An original sunset painting, framed.",
    details: "A one-of-a-kind sunset study from the Zayit Academy studio. Originals are unique, so the piece you receive is the one in the photo.",
    includes: ["Original artwork", "Frame"],
  },
  p2: {
    summary: "A framed original portrait sketch.",
    details: "A hand-drawn portrait sketch, framed. Each sketch is an original.",
    includes: ["Original sketch", "Frame"],
  },
  p3: {
    summary: "A framed original botanical watercolour.",
    details: "A botanical study in watercolour, framed. Each painting is an original.",
    includes: ["Original watercolour", "Frame"],
  },
  p4: {
    summary: "Everything a beginner needs, in one box.",
    details: "The materials our beginners use in class, sourced and packed by us — a simple way to start drawing at home.",
    includes: [...materialsKit],
  },
  p5: {
    summary: "Charcoal pencils for sketching and shading.",
    details: "A set of charcoal pencils for sketching, shading and portraits.",
    includes: ["Charcoal pencils"],
  },
  p6: {
    summary: "A set of brushes for painting.",
    details: "A brush set for watercolour, acrylic and mixed-media work.",
    includes: ["Brushes"],
  },
};

export const STARTING_STORE: StoreContent = {
  products: startingProducts.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    oldPrice: p.oldPrice ?? null,
    image: p.image,
    ...(STARTING_TEXT[p.id] ?? { summary: "", details: "", includes: [] }),
    stock: "in-stock",
    featured: p.id === "p1" || p.id === "p4",
    visible: true,
  })),
  note: "",
  kit: {
    show: true,
    title: "Everything Included Materials Kit",
    description: "Everything a beginner needs in one box — sourced and packed by us.",
    items: [...materialsKit],
    productId: "p4",
  },
};

/* ------------------------------ Tidying saved data ------------------------------ */

const text = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max);
const lines = (value: unknown, max: number, count: number) =>
  (Array.isArray(value) ? value : String(value ?? "").split("\n"))
    .map((line) => text(line, max))
    .filter(Boolean)
    .slice(0, count);
const rupees = (value: unknown) => {
  const n = Math.round(Number(value));
  return Number.isFinite(n) && n > 0 ? Math.min(n, LIMITS.price) : 0;
};

/** Saved store data made safe to use (unknown values dropped); null when nothing is saved */
export function normalizeStore(saved: unknown): StoreContent | null {
  if (!saved || typeof saved !== "object") return null;
  const data = saved as Partial<Record<keyof StoreContent, unknown>>;
  const seen = new Set<string>();

  const products = (Array.isArray(data.products) ? data.products : []).flatMap((raw): StoreProduct[] => {
    const p = (raw ?? {}) as Record<string, unknown>;
    const id = text(p.id, 60);
    if (!id || seen.has(id)) return [];
    seen.add(id);
    const price = rupees(p.price);
    const oldPrice = rupees(p.oldPrice);
    return [
      {
        id,
        name: text(p.name, LIMITS.name),
        category: PRODUCT_CATEGORIES.some((c) => c.id === p.category) ? (p.category as ProductCategory) : "materials",
        price,
        oldPrice: oldPrice > price ? oldPrice : null,
        image: text(p.image, 1000),
        summary: text(p.summary, LIMITS.summary),
        details: text(p.details, LIMITS.details),
        includes: lines(p.includes, LIMITS.include, LIMITS.includes),
        stock: STOCK_OPTIONS.some((s) => s.id === p.stock) ? (p.stock as StockStatus) : "in-stock",
        featured: p.featured === true,
        visible: p.visible !== false,
      },
    ];
  });

  const kit = (data.kit ?? {}) as Record<string, unknown>;
  return {
    products,
    note: text(data.note, LIMITS.note),
    kit: {
      show: kit.show !== false,
      title: text(kit.title, LIMITS.name),
      description: text(kit.description, LIMITS.summary * 2),
      items: lines(kit.items, LIMITS.include, LIMITS.includes),
      productId: text(kit.productId, 60),
    },
  };
}

/** What's missing or wrong before the store can be saved (null when it's fine) */
export function storeProblem(store: StoreContent): { index: number | null; message: string } | null {
  for (const [index, p] of store.products.entries()) {
    const name = p.name.trim();
    const label = name ? `“${name}”` : `Product ${index + 1}`;
    if (!name) return { index, message: `${label}: add a name.` };
    if (!p.image.trim()) return { index, message: `${label}: add a photo.` };
    if (!Number.isInteger(p.price) || p.price < 1) return { index, message: `${label}: add a price (whole rupees).` };
    if (p.price > LIMITS.price) return { index, message: `${label}: the price is too high.` };
    if (p.oldPrice !== null && p.oldPrice <= p.price)
      return { index, message: `${label}: the old price must be higher than the price (or leave it empty).` };
  }
  if (store.kit.show && store.kit.productId && !store.products.some((p) => p.id === store.kit.productId)) {
    return { index: null, message: "Materials Kit: choose which product it adds to the bag." };
  }
  return null;
}

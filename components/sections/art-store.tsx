"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Info, MessageCircle, Minus, Package, Plus, ShoppingBag, Sparkles, Trash2, X } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { Button, buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/admin/toast";
import { useData, useT } from "@/hooks/use-i18n";
import { useContent } from "@/hooks/use-content";
import { MAX_QTY, canOrder, useBag } from "@/hooks/use-bag";
import { whatsappLink } from "@/lib/contact";
import { fmt, type Dictionary } from "@/lib/i18n";
import { setScrollLock } from "@/lib/scroll-lock";
import { PRODUCT_CATEGORIES, type ProductCategory, type StockStatus, type StoreProduct } from "@/lib/store";
import { cn, formatINR } from "@/lib/utils";

type StoreText = Dictionary["store"];
type Bag = ReturnType<typeof useBag>;
type Sort = "featured" | "price-low" | "price-high" | "name";

const CATEGORY_TEXT: Record<ProductCategory, keyof StoreText> = {
  "framed-art": "catFramedArt",
  kit: "catKit",
  materials: "catMaterials",
  accessory: "catAccessory",
};
const STOCK_TEXT: Record<StockStatus, keyof StoreText> = {
  "in-stock": "inStock",
  "made-to-order": "madeToOrder",
  "sold-out": "soldOut",
};

const percentOff = (p: StoreProduct) => (p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0);
const paragraphs = (text: string) => text.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);

/**
 * The order as a WhatsApp message to the academy. Always English, since it's
 * the academy who reads it.
 */
function orderMessage(items: { product: StoreProduct; qty: number }[], name = "", note = "") {
  const total = items.reduce((sum, i) => sum + i.qty * i.product.price, 0);
  return [
    "Hi Zayit Academy! I'd like to order:",
    ...items.map(
      (i) =>
        `• ${i.qty} × ${i.product.name}${i.product.stock === "made-to-order" ? " (made to order)" : ""} — ${formatINR(i.qty * i.product.price)}`
    ),
    `Total: ${formatINR(total)}`,
    ...(name.trim() ? [`Name: ${name.trim()}`] : []),
    ...(note.trim() ? [`Note: ${note.trim()}`] : []),
  ].join("\n");
}

/** Esc closes, and the page behind stays still, while an overlay is open */
function useOverlay(open: boolean, onClose: () => void, owner: string) {
  // The latest onClose, without restarting the effect on every render
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    if (!open) return;
    setScrollLock(owner, true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close.current();
    window.addEventListener("keydown", onKey);
    return () => {
      setScrollLock(owner, false);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, owner]);
}

/* ------------------------------------ Pieces ------------------------------------ */

/** A product photo filling its box; a package icon when there's no photo or it won't load */
function ProductImage({
  src,
  alt,
  sizes,
  className,
  small = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  small?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (!src || failed) {
    return (
      <span className="absolute inset-0 grid place-items-center bg-sage-100 text-sage-400" role={alt ? "img" : undefined} aria-label={alt || undefined}>
        <Package className={small ? "h-5 w-5" : "h-10 w-10"} strokeWidth={1.5} />
      </span>
    );
  }
  return <Image src={src} alt={alt} fill sizes={sizes} onError={() => setFailed(true)} className={cn("object-cover", className)} />;
}

function Price({ product, large = false }: { product: StoreProduct; large?: boolean }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <span className={cn("font-display font-semibold text-charcoal-900", large ? "text-3xl" : "text-base sm:text-xl")}>
        {formatINR(product.price)}
      </span>
      {product.oldPrice && (
        <span className={cn("text-charcoal-400 line-through", large ? "text-base" : "text-xs sm:text-sm")}>{formatINR(product.oldPrice)}</span>
      )}
    </div>
  );
}

function QtyStepper({ value, onChange, s }: { value: number; onChange: (qty: number) => void; s: StoreText }) {
  return (
    <div className="inline-flex items-center rounded-full border border-sage-200 bg-white">
      <button
        type="button"
        aria-label={s.decrease}
        onClick={() => onChange(value - 1)}
        className="grid h-9 w-9 place-items-center rounded-full text-charcoal-600 transition-colors hover:bg-sage-50 disabled:opacity-30"
        disabled={value <= 1}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums text-charcoal-900" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label={s.increase}
        onClick={() => onChange(value + 1)}
        className="grid h-9 w-9 place-items-center rounded-full text-charcoal-600 transition-colors hover:bg-sage-50 disabled:opacity-30"
        disabled={value >= MAX_QTY}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function ProductCard({
  product,
  index,
  s,
  inBag,
  onOpen,
  onAdd,
}: {
  product: StoreProduct;
  index: number;
  s: StoreText;
  inBag: number;
  onOpen: () => void;
  onAdd: () => void;
}) {
  const off = percentOff(product);
  const orderable = canOrder(product);
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.05 }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-sage-200/50 bg-white/80 shadow-sm backdrop-blur-sm transition-shadow duration-300 hover:shadow-lg"
    >
      <button type="button" onClick={onOpen} className="relative block aspect-[4/5] overflow-hidden bg-sage-100" aria-label={product.name}>
        <ProductImage
          src={product.image}
          alt=""
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
          className={cn("transition-transform duration-700 group-hover:scale-105", !orderable && "opacity-60 grayscale")}
        />
        <div className="absolute left-2 top-2 flex flex-col items-start gap-1 sm:left-3 sm:top-3">
          {product.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-sage-800 shadow-sm sm:text-xs">
              <Sparkles className="h-3 w-3" /> {s.featured}
            </span>
          )}
          {off > 0 && orderable && (
            <span className="rounded-full bg-[#D9695F] px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm sm:text-xs">
              {fmt(s.off, { percent: off })}
            </span>
          )}
        </div>
        {product.stock !== "in-stock" && (
          <span
            className={cn(
              "absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-semibold shadow-sm sm:bottom-3 sm:left-3 sm:text-xs",
              product.stock === "sold-out" ? "bg-charcoal-900 text-white" : "bg-white/95 text-charcoal-800"
            )}
          >
            {s[STOCK_TEXT[product.stock]]}
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-sage-600 sm:text-[11px]">{s[CATEGORY_TEXT[product.category]]}</p>
        <h3 className="mt-1 line-clamp-2 font-display text-sm font-medium leading-snug text-charcoal-900 sm:text-lg">
          <button type="button" onClick={onOpen} className="text-left hover:text-sage-700">
            {product.name}
          </button>
        </h3>
        {product.summary && <p className="mt-1 line-clamp-2 hidden text-sm text-charcoal-500 sm:block">{product.summary}</p>}
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <Price product={product} />
          <button
            type="button"
            onClick={onAdd}
            disabled={!orderable}
            aria-label={`${s.addToBag}: ${product.name}`}
            className="relative inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-sage-600 px-3 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-sage-700 disabled:bg-charcoal-200 disabled:text-charcoal-500 sm:h-10 sm:px-4 sm:text-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{s.add}</span>
            {inBag > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-charcoal-900 px-1 text-[10px] tabular-nums text-white ring-2 ring-white">
                {inBag}
              </span>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function ProductView({
  product,
  s,
  whatsapp,
  onClose,
  onAdd,
}: {
  product: StoreProduct | null;
  s: StoreText;
  whatsapp: string | null;
  onClose: () => void;
  onAdd: (product: StoreProduct, qty: number) => void;
}) {
  const [qty, setQty] = useState(1);
  useEffect(() => setQty(1), [product?.id]);
  useOverlay(product !== null, onClose, "store-product");

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          key="product"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={product.name}
          className="fixed inset-0 z-[90] flex items-end justify-center bg-charcoal-900/50 backdrop-blur-sm sm:items-center sm:p-6"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92dvh] w-full overflow-y-auto overscroll-contain rounded-t-[2rem] bg-cream shadow-2xl sm:max-w-4xl sm:rounded-[2rem]"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={s.close}
              className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-charcoal-800 shadow-md transition-colors hover:bg-white"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="grid sm:grid-cols-2">
              <div className="relative aspect-[4/5] bg-sage-100 sm:aspect-auto sm:min-h-[30rem]">
                <ProductImage src={product.image} alt={product.name} sizes="(min-width: 640px) 28rem, 100vw" />
              </div>
              <div className="flex flex-col p-5 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-sage-600">{s[CATEGORY_TEXT[product.category]]}</p>
                <h2 className="mt-2 pr-8 font-display text-2xl font-medium leading-tight text-charcoal-900 sm:text-3xl">{product.name}</h2>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Price product={product} large />
                  {percentOff(product) > 0 && (
                    <span className="rounded-full bg-[#D9695F] px-2 py-0.5 text-xs font-semibold text-white">{fmt(s.off, { percent: percentOff(product) })}</span>
                  )}
                </div>
                <p
                  className={cn(
                    "mt-3 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                    product.stock === "in-stock" && "bg-emerald-50 text-emerald-700",
                    product.stock === "made-to-order" && "bg-amber-50 text-amber-800",
                    product.stock === "sold-out" && "bg-charcoal-100 text-charcoal-600"
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" /> {s[STOCK_TEXT[product.stock]]}
                </p>

                {product.summary && <p className="mt-5 font-display text-lg leading-snug text-charcoal-900">{product.summary}</p>}
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-charcoal-600 sm:text-[0.95rem]">
                  {paragraphs(product.details).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                {product.includes.length > 0 && (
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-sage-600">{s.includes}</p>
                    <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                      {product.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-charcoal-700">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage-600" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {canOrder(product) && (
                  <div className="mt-auto space-y-3 pt-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-charcoal-700">{s.quantity}</span>
                      <QtyStepper value={qty} onChange={(n) => setQty(Math.min(MAX_QTY, Math.max(1, n)))} s={s} />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Button className="w-full justify-center" onClick={() => onAdd(product, qty)}>
                        <ShoppingBag className="h-4 w-4" /> {s.addToBag}
                      </Button>
                      {whatsapp && (
                        <a
                          href={`${whatsapp}?text=${encodeURIComponent(orderMessage([{ product, qty }]))}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center")}
                        >
                          <MessageCircle className="h-4 w-4" /> {s.orderOnWhatsApp}
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BagPanel({ open, bag, s, whatsapp, onClose }: { open: boolean; bag: Bag; s: StoreText; whatsapp: string | null; onClose: () => void }) {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  useOverlay(open, onClose, "store-bag");

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="bag"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[90] bg-charcoal-900/40 backdrop-blur-sm"
        >
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={s.bag}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-y-0 right-0 flex h-[100dvh] w-full max-w-md flex-col bg-cream shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-sage-200/60 px-5 py-4">
              <h2 className="flex items-center gap-2 font-display text-xl text-charcoal-900">
                <ShoppingBag className="h-5 w-5 text-sage-600" /> {s.bag}
                {bag.count > 0 && <span className="rounded-full bg-sage-100 px-2 py-0.5 text-xs font-semibold text-sage-800">{bag.count}</span>}
              </h2>
              <button type="button" onClick={onClose} aria-label={s.close} className="grid h-10 w-10 place-items-center rounded-full text-charcoal-700 hover:bg-sage-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
              {bag.items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-sage-100">
                    <ShoppingBag className="h-7 w-7 text-sage-600" />
                  </span>
                  <p className="mt-4 font-display text-lg text-charcoal-900">{s.bagEmpty}</p>
                  <p className="mt-1 max-w-xs text-sm text-charcoal-500">{s.bagEmptyHint}</p>
                  <Button variant="outline" className="mt-5" onClick={onClose}>
                    {s.keepShopping}
                  </Button>
                </div>
              ) : (
                <ul className="divide-y divide-sage-200/60">
                  {bag.items.map(({ product, qty }) => (
                    <li key={product.id} className="flex gap-3 py-4">
                      <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-sage-100">
                        <ProductImage src={product.image} alt="" sizes="4rem" small />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-medium text-charcoal-900">{product.name}</p>
                        <p className="mt-0.5 text-xs text-charcoal-500">
                          {formatINR(product.price)}
                          {product.stock === "made-to-order" && ` · ${s.madeToOrder}`}
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <QtyStepper value={qty} onChange={(n) => bag.setQty(product.id, Math.max(1, n))} s={s} />
                          <span className="font-semibold tabular-nums text-charcoal-900">{formatINR(qty * product.price)}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => bag.remove(product.id)}
                        aria-label={`${s.remove}: ${product.name}`}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-charcoal-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {bag.items.length > 0 && (
              <div className="space-y-3 border-t border-sage-200/60 bg-white/70 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-charcoal-600">{s.subtotal}</span>
                  <span className="font-display text-2xl font-semibold text-charcoal-900">{formatINR(bag.total)}</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-charcoal-600">{s.yourName}</span>
                    <input
                      value={name}
                      maxLength={80}
                      autoComplete="name"
                      onChange={(e) => setName(e.target.value)}
                      placeholder={s.yourNamePlaceholder}
                      className="w-full rounded-xl border border-sage-200 bg-white px-3 py-2 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-sage-400 focus:outline-none focus:ring-1 focus:ring-sage-400/50"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-charcoal-600">{s.deliveryNote}</span>
                    <input
                      value={note}
                      maxLength={200}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder={s.deliveryNotePlaceholder}
                      className="w-full rounded-xl border border-sage-200 bg-white px-3 py-2 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-sage-400 focus:outline-none focus:ring-1 focus:ring-sage-400/50"
                    />
                  </label>
                </div>
                {whatsapp ? (
                  <a
                    href={`${whatsapp}?text=${encodeURIComponent(orderMessage(bag.items, name, note))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants(), "w-full justify-center bg-[#1f9d55] hover:bg-[#188a49]")}
                  >
                    <MessageCircle className="h-4 w-4" /> {s.sendOrder}
                  </a>
                ) : (
                  <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
                    {s.noWhatsApp}{" "}
                    <Link href="/contact" className="font-semibold underline">
                      {s.contactUs}
                    </Link>
                  </p>
                )}
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[11px] leading-relaxed text-charcoal-500">{s.howToOrderText}</p>
                  <button type="button" onClick={bag.clear} className="shrink-0 text-xs font-medium text-charcoal-500 underline-offset-2 hover:text-red-600 hover:underline">
                    {s.clearBag}
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------- Page ------------------------------------- */

export default function ArtStore() {
  const t = useT();
  const s = t.store;
  const { store } = useData();
  const contact = useContent().contact;
  const whatsapp = whatsappLink(contact?.whatsapp || contact?.phoneValue);
  const toast = useToast();

  const visible = useMemo(() => store.products.filter((p) => p.visible), [store.products]);
  const bag = useBag(store.products);
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [sort, setSort] = useState<Sort>("featured");
  const [openId, setOpenId] = useState<string | null>(null);
  const [bagOpen, setBagOpen] = useState(false);

  const categories = PRODUCT_CATEGORIES.map((c) => ({ ...c, count: visible.filter((p) => p.category === c.id).length })).filter(
    (c) => c.count > 0
  );
  const shown = useMemo(() => {
    const list = category === "all" ? visible : visible.filter((p) => p.category === category);
    const sorted = [...list];
    if (sort === "featured") sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    if (sort === "price-low") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-high") sorted.sort((a, b) => b.price - a.price);
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [visible, category, sort]);

  const openProduct = visible.find((p) => p.id === openId) ?? null;
  const kitProduct = visible.find((p) => p.id === store.kit.productId && canOrder(p));

  const add = (product: StoreProduct, qty = 1) => {
    bag.add(product.id, qty);
    toast.success(`${s.addedToBag}: ${product.name}`);
  };

  return (
    <section id="store" className="relative overflow-hidden bg-sage-50/40 pb-24 pt-28">
      <div className="pointer-events-none absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full bg-sage-200/50 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-sage-100/70 blur-[130px]" />

      <div className="container-academy relative z-10">
        <SectionHeading align="center" eyebrow={s.eyebrow} title={s.title} highlight={s.highlight} description={s.description} />

        {/* How ordering works, and the academy's delivery / pickup note */}
        <div className="mx-auto mt-8 flex max-w-3xl items-start gap-3 rounded-2xl border border-sage-200/60 bg-white/70 p-4 text-sm text-charcoal-600 shadow-sm backdrop-blur-sm">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-sage-600" />
          <div className="space-y-1">
            <p>
              <span className="font-semibold text-charcoal-800">{s.howToOrder}: </span>
              {s.howToOrderText}
            </p>
            {store.note && <p className="text-charcoal-800">{store.note}</p>}
          </div>
        </div>

        {/* Categories (a swipeable row on phones), sort, and the bag */}
        <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {[{ id: "all" as const, label: s.all, count: visible.length }, ...categories.map((c) => ({ id: c.id, label: s[CATEGORY_TEXT[c.id]], count: c.count }))].map(
              (c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  aria-pressed={category === c.id}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    category === c.id ? "bg-sage-600 text-white shadow-md" : "bg-white/80 text-charcoal-700 hover:bg-sage-100"
                  )}
                >
                  {c.label}
                  <span className={cn("text-xs tabular-nums", category === c.id ? "text-white/75" : "text-charcoal-400")}>{c.count}</span>
                </button>
              )
            )}
          </div>
          <div className="flex items-center justify-between gap-3 lg:justify-end">
            <label className="flex items-center gap-2 text-sm text-charcoal-600">
              <span className="shrink-0">{s.sortLabel}</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="rounded-full border border-sage-200 bg-white px-3 py-2 text-sm text-charcoal-800 focus:border-sage-400 focus:outline-none"
              >
                <option value="featured">{s.sortFeatured}</option>
                <option value="price-low">{s.sortPriceLow}</option>
                <option value="price-high">{s.sortPriceHigh}</option>
                <option value="name">{s.sortName}</option>
              </select>
            </label>
            <button
              type="button"
              onClick={() => setBagOpen(true)}
              className="relative inline-flex items-center gap-2 rounded-full bg-charcoal-900 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-charcoal-800"
            >
              <ShoppingBag className="h-4 w-4" /> {s.bag}
              <span className="rounded-full bg-white/20 px-1.5 text-xs tabular-nums">{bag.count}</span>
            </button>
          </div>
        </div>

        {/* Products: 2 per row on phones */}
        {shown.length === 0 ? (
          <p className="mt-10 rounded-3xl border border-dashed border-sage-300 bg-white/50 px-6 py-14 text-center text-charcoal-500">{s.noProducts}</p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
            {shown.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} s={s} inBag={bag.qtyOf(p.id)} onOpen={() => setOpenId(p.id)} onAdd={() => add(p)} />
            ))}
          </div>
        )}

        {/* Materials kit */}
        {store.kit.show && (store.kit.title || store.kit.items.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="relative mt-16 overflow-hidden rounded-5xl bg-gradient-to-br from-sage-800 to-sage-950 p-6 text-white shadow-2xl shadow-sage-200/20 sm:p-12"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sage-400/30 blur-[100px]" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_1.2fr]">
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-sage-400 to-sage-600 text-white shadow-lg shadow-sage-400/30">
                  <Package className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-2xl font-medium text-white sm:text-3xl">{store.kit.title}</h3>
                {store.kit.description && <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">{store.kit.description}</p>}
                {kitProduct && (
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Button className="bg-white font-semibold text-sage-800 hover:bg-sage-100" onClick={() => add(kitProduct)}>
                      <ShoppingBag className="h-4 w-4" /> {s.addKit} · {formatINR(kitProduct.price)}
                    </Button>
                    <button type="button" onClick={() => setOpenId(kitProduct.id)} className="text-sm font-medium text-white/80 underline-offset-4 hover:text-white hover:underline">
                      {kitProduct.name}
                    </button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:gap-3">
                {store.kit.items.map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/10 px-3 py-2.5 text-sm font-medium text-white/90 backdrop-blur-sm sm:px-4 sm:py-3">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-sage-300" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bag shortcut, bottom-left (the call / WhatsApp buttons are on the right) */}
      <AnimatePresence>
        {bag.count > 0 && !bagOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => setBagOpen(true)}
            aria-label={s.openBag}
            className="fixed bottom-5 left-4 z-40 inline-flex items-center gap-2 rounded-full bg-charcoal-900 py-2.5 pl-3 pr-4 text-sm font-semibold text-white shadow-xl ring-1 ring-white/10 sm:bottom-6 sm:left-6"
          >
            <span className="relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-[#D9695F] px-1 text-[10px] tabular-nums">{bag.count}</span>
            </span>
            <span className="tabular-nums">{formatINR(bag.total)}</span>
          </motion.button>
        )}
      </AnimatePresence>

      <ProductView
        product={openProduct}
        s={s}
        whatsapp={whatsapp}
        onClose={() => setOpenId(null)}
        onAdd={(product, qty) => {
          add(product, qty);
          setOpenId(null);
        }}
      />
      <BagPanel open={bagOpen} bag={bag} s={s} whatsapp={whatsapp} onClose={() => setBagOpen(false)} />
    </section>
  );
}

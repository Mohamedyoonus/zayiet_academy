"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useData, useT } from "@/hooks/use-i18n";
import { galleryCategories } from "@/lib/data";

const filters = ["All", ...galleryCategories] as const;
/** How many photos the home page shows: one row */
const PREVIEW_COUNT = 4;

/**
 * Phones, full Gallery page: a 2-column grid where every 5th photo spans the
 * full width, and a photo that would sit alone on the last row does too.
 */
function widePhotos(count: number) {
  let halves = 0; // half-width photos since the last wide one
  return Array.from({ length: count }, (_, i) => {
    const wide = i % 5 === 0 || (i === count - 1 && halves % 2 === 0);
    halves = wide ? 0 : halves + 1;
    return wide;
  });
}

// The viewer slides the next photo in from the side it was swiped towards
const viewerSlide = {
  enter: (dir: number) => ({ x: dir > 0 ? "55%" : dir < 0 ? "-55%" : 0, opacity: 0, scale: dir === 0 ? 0.94 : 1 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-55%" : dir < 0 ? "55%" : 0, opacity: 0 }),
};

/**
 * The gallery. `preview` (home page): one row of photos and a button to the
 * full Gallery page. Otherwise (the /gallery page): every photo, with filters.
 */
export default function Gallery({ preview = false }: { preview?: boolean }) {
  const t = useT();
  const { galleryItems, galleryCategory } = useData();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const filtered = filter === "All" ? galleryItems : galleryItems.filter((g) => g.category === filter);
  const items = preview ? galleryItems.slice(0, PREVIEW_COUNT) : filtered;
  const wide = preview ? [] : widePhotos(items.length);

  // The photo viewer: which photo is open, and which way we last moved
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const selected = openIndex === null ? null : items[openIndex];
  const isOpen = selected !== null;

  const open = (i: number) => {
    setDirection(0);
    setOpenIndex(i);
  };
  const close = useCallback(() => setOpenIndex(null), []);
  const go = useCallback(
    (dir: 1 | -1) => {
      setDirection(dir);
      setOpenIndex((i) => (i === null ? i : (i + dir + items.length) % items.length));
    },
    [items.length]
  );

  // While the viewer is open: keyboard arrows / Esc, and the page behind doesn't scroll
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close, go]);

  return (
    <section
      id="gallery"
      className={cn(
        "relative overflow-hidden bg-charcoal-50 dark:bg-ink-950",
        preview ? "py-12 sm:py-14 lg:py-16" : "pb-16 pt-28 sm:pb-20 lg:pt-32"
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(36rem_26rem_at_5%_10%,rgb(var(--c-sage-200)/0.5),transparent_70%),radial-gradient(32rem_22rem_at_95%_95%,rgb(var(--c-sage-100)/0.7),transparent_70%)]"
      />

      <div className="container-academy relative z-10">
        <SectionHeading
          eyebrow={t.gallery.eyebrow}
          title={t.gallery.title}
          highlight={t.gallery.highlight}
          align="center"
          description={t.gallery.description}
        />
        {/* Category filters, on the full Gallery page only. Phones: one swipeable line. */}
        {!preview && (
          <div className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:mt-8 sm:flex-wrap sm:justify-center sm:gap-3 sm:overflow-visible sm:px-0 sm:pb-0">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                  filter === f
                    ? "bg-gradient-to-r from-sage-500 to-sage-600 text-white shadow-lg shadow-sage-200/50"
                    : "bg-white/60 text-charcoal-600 backdrop-blur-sm hover:bg-sage-100/50 dark:bg-ink-900/60 dark:text-charcoal-300 dark:hover:bg-white/10"
                )}
              >
                {f === "All" ? t.gallery.all : galleryCategory(f)}
              </button>
            ))}
          </div>
        )}

        <motion.div
          layout
          className={cn(
            preview
              ? // Home: a swipeable row on phones, one row of four from sm up
                "-mx-4 mt-8 flex snap-x snap-mandatory scroll-pl-8 gap-4 overflow-x-auto overflow-y-hidden no-scrollbar px-8 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-5 sm:overflow-visible sm:snap-none sm:scroll-pl-0 sm:px-0 sm:pb-0 lg:mt-10"
              : // Gallery page: 2 columns on phones, more on bigger screens
                "mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 md:grid-cols-3 lg:grid-cols-4"
          )}
        >
          <AnimatePresence>
            {items.map((item, i) => {
              const isWide = wide[i];
              return (
                <motion.button
                  layout
                  key={item.id}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 22 } }}
                  onClick={() => open(i)}
                  className={cn(
                    "group relative block overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-xl",
                    preview
                      ? "aspect-[4/5] w-[70%] shrink-0 snap-start rounded-3xl sm:w-full sm:shrink sm:snap-none"
                      : cn(
                          "w-full rounded-2xl sm:col-span-1 sm:aspect-[4/5] sm:rounded-3xl",
                          isWide ? "col-span-2 aspect-[16/10]" : "aspect-[4/5]"
                        )
                  )}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes={
                      preview
                        ? "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 70vw"
                        : `(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, ${isWide ? "100vw" : "50vw"}`
                    }
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Title: always shown on touch screens; revealed on hover where there's a mouse */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent p-3 pt-10 text-left transition-opacity duration-300 sm:p-4 sm:pt-12 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100">
                    <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                      <span className="truncate text-sm font-medium text-white">{item.title}</span>
                      <span
                        className={cn(
                          "shrink-0 rounded-full bg-white/15 px-2 py-0.5 text-[10px] text-white/80 sm:text-xs",
                          // Phones: only on full-width tiles; elsewhere it squeezes the title
                          !isWide && "hidden sm:inline"
                        )}
                      >
                        {item.categoryLabel}
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {preview && (
          <div className="mt-8 flex justify-center lg:mt-10">
            <Link href="/gallery" className={cn(buttonVariants({ variant: "outline" }), "h-11 sm:h-12")}>
              {t.hero.viewGallery} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Photo viewer: the whole artwork, swipe or arrows to move between photos */}
      <AnimatePresence>
        {selected && openIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={selected.title}
            className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between p-4 sm:p-6">
              <span className="text-sm tabular-nums text-white/60">
                {openIndex + 1} / {items.length}
              </span>
              <button
                aria-label={t.common.close}
                className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500"
                onClick={close}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative mx-auto min-h-0 w-full max-w-3xl flex-1 px-4 sm:px-6">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={selected.id}
                  custom={direction}
                  variants={viewerSlide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  drag={items.length > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.7}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -60 || info.velocity.x < -400) go(1);
                    else if (info.offset.x > 60 || info.velocity.x > 400) go(-1);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute inset-y-0 left-4 right-4 cursor-grab active:cursor-grabbing sm:left-6 sm:right-6"
                >
                  <Image
                    src={selected.image}
                    alt={selected.title}
                    fill
                    sizes="(min-width: 768px) 48rem, 100vw"
                    draggable={false}
                    className="pointer-events-none select-none object-contain"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div
              onClick={(e) => e.stopPropagation()}
              className="mx-auto flex w-full max-w-3xl items-center gap-3 p-4 pb-6 sm:p-6"
            >
              {items.length > 1 && (
                <button
                  aria-label={t.gallery.previous}
                  onClick={() => go(-1)}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}
              <div className="min-w-0 flex-1 text-center">
                <p className="truncate text-base font-medium text-white sm:text-lg">{selected.title}</p>
                <span className="mt-1 inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/70">
                  {selected.categoryLabel}
                </span>
              </div>
              {items.length > 1 && (
                <button
                  aria-label={t.gallery.next}
                  onClick={() => go(1)}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRight, X } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useData, useT } from "@/hooks/use-i18n";
import { galleryCategories } from "@/lib/data";

const filters = ["All", ...galleryCategories] as const;
/** How many photos the home page shows: one row */
const PREVIEW_COUNT = 4;

/**
 * The gallery. `preview` (home page): one row of photos and a button to the
 * full Gallery page. Otherwise (the /gallery page): every photo, with filters.
 */
export default function Gallery({ preview = false }: { preview?: boolean }) {
  const t = useT();
  const { galleryItems, galleryCategory } = useData();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [selected, setSelected] = useState<(typeof galleryItems)[number] | null>(null);

  const filtered = filter === "All" ? galleryItems : galleryItems.filter((g) => g.category === filter);
  const items = preview ? galleryItems.slice(0, PREVIEW_COUNT) : filtered;

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
        {/* Category filters, on the full Gallery page only */}
        {!preview && (
          <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
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
            "flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden no-scrollbar scroll-pl-8 -mx-4 px-8 pb-2 sm:mx-0 sm:grid sm:gap-5 sm:overflow-visible sm:snap-none sm:scroll-pl-0 sm:px-0 sm:pb-0",
            preview ? "mt-8 sm:grid-cols-4 lg:mt-10" : "mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          )}
        >
          <AnimatePresence>
            {items.map((item, i) => (
              <motion.button
                layout
                key={item.id}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 22 } }}
                onClick={() => setSelected(item)}
                className="group relative block aspect-[4/5] w-[70%] shrink-0 snap-start overflow-hidden rounded-3xl shadow-md transition-shadow duration-300 hover:shadow-xl sm:w-full sm:shrink sm:snap-none"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 70vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-white">{item.title}</span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">{item.categoryLabel}</span>
                  </div>
                </div>
              </motion.button>
            ))}
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

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-6"
          >
            <button
              aria-label={t.common.close}
              className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 sm:right-6 sm:top-6"
              onClick={() => setSelected(null)}
            >
              <X className="h-5 w-5" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative aspect-[4/5] w-full max-w-2xl overflow-hidden rounded-3xl shadow-2xl"
            >
              <Image src={selected.image} alt={selected.title} fill sizes="42rem" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 sm:p-6">
                <span className="text-base font-medium text-white sm:text-lg">{selected.title}</span>
                <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60 sm:ml-3 sm:px-3 sm:text-sm">{selected.categoryLabel}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

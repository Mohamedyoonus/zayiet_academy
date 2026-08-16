"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { galleryItems } from "@/lib/data";
import { cn } from "@/lib/utils";
import { GalleryItem } from "@/types";

const filters = ["All", "Portrait", "Landscape", "Sketch", "Painting", "Workshop", "Students"] as const;

export default function Gallery() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  const items = filter === "All" ? galleryItems : galleryItems.filter((g) => g.category === filter);

  return (
    <section id="gallery" className="relative overflow-hidden bg-sage-50/40 py-28 dark:bg-ink-950">
      {/* Soft botanical wash - matching all sections */}
      <div className="pointer-events-none absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full bg-sage-200/50 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-sage-100/70 blur-[130px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-50/30 blur-[140px]" />
      
      {/* Subtle gradient overlay for depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-sage-200/10" />

      <div className="container-academy relative z-10">
        <SectionHeading 
          eyebrow="Gallery" 
          title="A wall of" 
          highlight="student work" 
          align="center" 
          description="Each piece tells a story of growth, creativity, and the unique voice of every artist."
        />

        <div className="mt-10 flex flex-wrap justify-center gap-2 sm:gap-3">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                filter === f
                  ? "bg-gradient-to-r from-sage-500 to-sage-600 text-white shadow-lg shadow-sage-200/50"
                  : "bg-white/60 text-ink-600 backdrop-blur-sm hover:bg-sage-100/50 dark:bg-ink-900/60 dark:text-ink-300 dark:hover:bg-white/10"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-12 columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4 sm:gap-5">
          <AnimatePresence>
            {items.map((item) => (
              <motion.button
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                onClick={() => setSelected(item)}
                className="group relative mb-4 block w-full overflow-hidden rounded-3xl shadow-md transition-all duration-300 hover:shadow-xl"
                style={{ height: item.height }}
              >
                <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-white">{item.title}</span>
                    <span className="text-xs text-white/60 bg-white/10 px-2 py-0.5 rounded-full">{item.category}</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-6 backdrop-blur-sm"
          >
            <button
              aria-label="Close"
              className="absolute right-4 top-4 sm:right-6 sm:top-6 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500"
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
              <Image src={selected.image} alt={selected.title} fill className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 sm:p-6">
                <span className="text-base sm:text-lg font-medium text-white">{selected.title}</span>
                <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-white/60 bg-white/10 px-2 sm:px-3 py-0.5 rounded-full">{selected.category}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
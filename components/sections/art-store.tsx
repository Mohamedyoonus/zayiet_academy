"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, ShoppingBag, Star, Package } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { products, materialsKit } from "@/lib/data";
import { formatINR } from "@/lib/utils";

export default function ArtStore() {
  return (
    <section id="store" className="relative overflow-hidden bg-sage-50/40 py-28 dark:bg-ink-950">
      {/* Soft botanical wash - matching all sections */}
      <div className="pointer-events-none absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full bg-sage-200/50 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-sage-100/70 blur-[130px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-50/30 blur-[140px]" />
      
      {/* Subtle gradient overlay for depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-sage-200/10" />

      <div className="container-academy relative z-10">
        <SectionHeading
          eyebrow="Art Store"
          title="Framed artwork &"
          highlight="materials"
          description="Original framed pieces from our students and instructors, plus everything you need to start creating today."
        />

        <div className="mt-12 grid gap-5 sm:gap-6 lg:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="card-hover group relative overflow-hidden rounded-4xl border border-sage-200/40 bg-white/60 shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-lg dark:border-white/10 dark:bg-ink-900/60"
            >
              <div className="relative h-48 sm:h-56 overflow-hidden bg-ink-50 dark:bg-ink-800">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <button
                  aria-label="Add to wishlist"
                  className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-charcoal-700 opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100 hover:text-ember-500 dark:bg-ink-800/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500"
                >
                  <Heart className="h-4 w-4" />
                </button>
                {p.oldPrice && (
                  <Badge className="absolute left-4 top-4 bg-ember-500 text-white">
                    -{Math.round((1 - p.price / p.oldPrice) * 100)}%
                  </Badge>
                )}
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-1 text-xs text-gold-500">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="h-3 w-3" fill={idx < Math.round(p.rating) ? "currentColor" : "none"} />
                  ))}
                  <span className="ml-1 text-charcoal-400 dark:text-charcoal-400">{p.rating.toFixed(1)}</span>
                </div>
                <h3 className="mt-2 font-display text-lg font-medium text-charcoal-900">{p.name}</h3>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    {p.oldPrice && <span className="mr-2 text-sm text-charcoal-400 line-through">{formatINR(p.oldPrice)}</span>}
                    <span className="font-display text-xl font-semibold text-charcoal-900">{formatINR(p.price)}</span>
                  </div>
                  <Button size="sm" className="!h-10 !w-10 !p-0 bg-sage-600 hover:bg-sage-700 dark:bg-sage-500 dark:hover:bg-sage-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500" aria-label="Buy now">
                    <ShoppingBag className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Materials kit callout - FIXED VISIBILITY */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="relative mt-16 overflow-hidden rounded-5xl bg-gradient-to-br from-sage-800 to-sage-950 p-8 text-white shadow-2xl shadow-sage-200/20 sm:p-12"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sage-400/30 blur-[100px]" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-ember-500/20 blur-[100px]" />
          
          <div className="relative grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            {/* Left side - Title and description */}
            <div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-sage-400 to-sage-600 text-white shadow-lg shadow-sage-400/30">
                <Package className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-2xl sm:text-3xl font-medium text-white">
                Everything Included <br className="hidden sm:block" />Materials Kit
              </h3>
              <p className="mt-3 text-white/80 text-sm sm:text-base leading-relaxed">
                Everything a beginner needs in one box — sourced and packed by us.
              </p>
              <Button className="mt-6 bg-white text-sage-800 hover:bg-sage-100 dark:bg-white dark:text-sage-800 dark:hover:bg-sage-100 font-semibold">
                Shop the Kit →
              </Button>
            </div>

            {/* Right side - Materials list with better visibility */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {materialsKit.map((item) => (
                <div 
                  key={item} 
                  className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm px-3 py-2.5 sm:px-4 sm:py-3 text-white/90 text-sm font-medium transition-all hover:bg-white/20 border border-white/5"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-sage-300" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
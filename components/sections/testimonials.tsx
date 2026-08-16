"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import Badge from "@/components/ui/badge";
import { testimonials } from "@/lib/data";

export default function Testimonials() {
  const avg = (testimonials.reduce((a, t) => a + t.rating, 0) / testimonials.length).toFixed(1);

  return (
    <section className="relative overflow-hidden bg-sage-50/40 py-28 dark:bg-ink-950">
      {/* Soft botanical wash - matching all sections */}
      <div className="pointer-events-none absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full bg-sage-200/50 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-sage-100/70 blur-[130px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-50/30 blur-[140px]" />
      
      {/* Subtle gradient overlay for depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-sage-200/10" />

      <div className="container-academy relative z-10">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading 
            eyebrow="Testimonials" 
            title="Loved by students" 
            highlight="& parents" 
            description="Real stories from our community of artists, creators, and dreamers."
          />
          <div className="flex items-center gap-3 rounded-3xl border border-sage-200/40 bg-white/60 px-5 sm:px-6 py-3 sm:py-4 backdrop-blur-sm shadow-sm dark:border-white/10 dark:bg-ink-900/60">
            <div className="flex text-gold-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 sm:h-5 w-4 sm:w-5" fill={i < Math.round(Number(avg)) ? "currentColor" : "none"} />
              ))}
            </div>
            <div>
              <div className="font-display text-lg sm:text-xl font-semibold text-charcoal-900">{avg} / 5.0</div>
              <div className="text-xs text-charcoal-500 dark:text-charcoal-400">Average Rating</div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:gap-6 lg:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-hover flex flex-col rounded-4xl border border-sage-200/40 bg-white/60 p-5 sm:p-6 lg:p-7 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-lg dark:border-white/10 dark:bg-ink-900/60"
            >
              <Quote className="h-6 sm:h-7 w-6 sm:w-7 text-sage-400 dark:text-sage-500" />
              <p className="mt-3 sm:mt-4 flex-1 text-sm leading-relaxed text-charcoal-700 dark:text-charcoal-300">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-5 sm:mt-6 flex items-center gap-3">
                <div className="relative h-10 sm:h-11 w-10 sm:w-11 overflow-hidden rounded-full ring-2 ring-sage-200/50 dark:ring-sage-500/30 flex-shrink-0">
                  <Image src={t.image} alt={t.name} fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-charcoal-900 truncate">{t.name}</div>
                  <Badge variant="outline" className="mt-0.5 border-sage-300/50 text-sage-700 dark:border-white/20 text-xs">
                    {t.role}
                  </Badge>
                </div>
              </div>
              <div className="mt-4 flex text-gold-500">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="h-3.5 w-3.5" fill={idx < t.rating ? "currentColor" : "none"} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
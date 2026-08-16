"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, CalendarDays, Bell } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { workshops } from "@/lib/data";

export default function Workshop() {
  return (
    <section id="workshop" className="relative overflow-hidden bg-sage-50/40 py-28 dark:bg-ink-950">
      {/* Soft botanical wash - matching Hero and ArtClasses */}
      <div className="pointer-events-none absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full bg-sage-200/50 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-sage-100/70 blur-[130px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-50/30 blur-[140px]" />
      
      {/* Subtle gradient overlay for depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-sage-200/10" />

      <div className="container-academy relative z-10">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Workshops"
            title="Creative"
            highlight="Workshops"
            description="Hands-on, practical sessions designed to get your hands dirty — literally. Limited seats, real materials, real feedback."
          />
          <Button size="md" variant="outline" className="shrink-0 border-sage-300/50 text-sage-700 hover:bg-sage-100/50 dark:border-white/20 dark:text-white dark:hover:bg-white/10 h-11 sm:h-12">
            <Bell className="h-4 w-4" /> Register Now
          </Button>
        </div>

        <div className="mt-12 grid gap-5 sm:gap-6 lg:mt-14 lg:grid-cols-3">
          {workshops.map((w, i) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="card-hover group relative overflow-hidden rounded-4xl border border-sage-200/40 bg-white/60 shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-lg dark:border-white/10 dark:bg-ink-900/60"
            >
              <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                <Image src={w.image} alt={w.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                {w.seatsLeft <= 6 && (
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1.6 }}
                    className="absolute right-4 top-4 rounded-full bg-ember-500 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-ember-500/30"
                  >
                    Only {w.seatsLeft} seats left
                  </motion.div>
                )}
                <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 right-4 sm:right-5 text-white">
                  <h3 className="font-display text-lg sm:text-xl font-medium leading-snug">{w.title}</h3>
                </div>
              </div>
              <div className="space-y-2 p-5 sm:p-6">
                <div className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-300">
                  <MapPin className="h-4 w-4 text-sage-600 shrink-0" /> {w.venue}
                </div>
                <div className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-300">
                  <CalendarDays className="h-4 w-4 text-sage-600 shrink-0" /> {w.date}
                </div>
                <Button variant="dark" size="sm" className="mt-4 w-full justify-center h-11 bg-ink-900 hover:bg-ink-800 dark:bg-white dark:text-ink-900 dark:hover:bg-white/90">
                  Register Now
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gallery slider marquee */}
        <div className="relative mt-12 sm:mt-16 lg:mt-20 hidden sm:block overflow-hidden">
          <motion.div
            className="flex gap-4 sm:gap-5"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          >
            {[...workshops, ...workshops, ...workshops].map((w, i) => (
              <div key={i} className="relative h-40 w-56 sm:w-60 lg:w-64 shrink-0 overflow-hidden rounded-3xl shadow-md">
                <Image src={w.image} alt="" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
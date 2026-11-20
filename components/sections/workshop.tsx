"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, CalendarDays, Bell, Users, Clock, Tag } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { useData, useT } from "@/hooks/use-i18n";
import { fmt } from "@/lib/i18n";

export default function Workshop() {
  const router = useRouter();
  const t = useT();
  const { workshops } = useData();

  return (
    <section id="workshop" className="relative overflow-hidden bg-ivory-200 py-10 sm:py-16 lg:py-28 dark:bg-ink-950">
      {/* Soft botanical wash - matching Hero and ArtClasses */}
      <div className="pointer-events-none absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full bg-sage-200/50 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-sage-100/70 blur-[130px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-50/30 blur-[140px]" />
      
      {/* Subtle gradient overlay for depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-sage-200/10" />

      <div className="container-academy relative z-10">
        <div className="flex flex-col items-center gap-6">
          <SectionHeading
            align="center"
            eyebrow={t.workshop.eyebrow}
            title={t.workshop.title}
            highlight={t.workshop.highlight}
            description={t.workshop.description}
          />
          <Button
            size="md"
            variant="outline"
            onClick={() => router.push("/collaboration")}
            className="shrink-0 border-sage-300/50 text-sage-700 hover:bg-sage-100/50 dark:border-white/20 dark:hover:bg-white/10 h-11 sm:h-12"
          >
            <Bell className="h-4 w-4" /> {t.common.registerNow}
          </Button>
        </div>

        <div className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden no-scrollbar scroll-pl-8 -mx-4 px-8 pb-2 sm:-mx-5 sm:px-9 sm:scroll-pl-9 sm:gap-6 md:-mx-6 md:px-10 md:scroll-pl-10 lg:mx-0 lg:mt-14 lg:grid lg:grid-cols-3 lg:overflow-visible lg:snap-none lg:px-0 lg:pb-0">
          {workshops.map((w, i) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="card-hover group relative w-[85%] shrink-0 snap-start overflow-hidden rounded-4xl border border-sage-200/40 bg-white/60 shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-lg dark:border-white/10 dark:bg-ink-900/60 sm:w-[55%] md:w-[42%] lg:w-auto"
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
                    {fmt(t.workshop.seatsLeft, { count: w.seatsLeft })}
                  </motion.div>
                )}
                <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 right-4 sm:right-5 text-white">
                  <h3 className="font-display text-lg sm:text-xl font-medium leading-snug">{w.title}</h3>
                </div>
              </div>
              <div className="space-y-2.5 p-5 sm:p-6">
                {w.ageGroup && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-charcoal-700 dark:text-charcoal-200 font-medium">
                    <Users className="h-4 w-4 text-sage-600 shrink-0" /> {w.ageGroup}
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-300">
                  <MapPin className="h-4 w-4 text-sage-600 shrink-0" /> {w.venue}
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-300">
                  <CalendarDays className="h-4 w-4 text-sage-600 shrink-0" /> {w.date}
                </div>
                {w.duration && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-300">
                    <Clock className="h-4 w-4 text-sage-600 shrink-0" /> {w.duration}
                  </div>
                )}
                {w.fee && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-sage-700 dark:text-sage-300 font-semibold pt-1">
                    <Tag className="h-4 w-4 text-sage-600 shrink-0" /> {w.fee}
                  </div>
                )}
                <Button
                  variant="dark"
                  size="sm"
                  onClick={() => router.push("/collaboration")}
                  className="mt-4 w-full justify-center h-11 bg-ink-900 hover:bg-ink-800 dark:bg-white dark:text-charcoal-900 dark:hover:bg-white/90"
                >
                  {t.common.registerNow}
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
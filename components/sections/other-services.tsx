"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { otherServices } from "@/lib/data";

export default function OtherServices() {
  return (
    <section className="relative overflow-hidden bg-sage-50/40 py-28 dark:bg-ink-950">
      {/* Soft botanical wash - matching all sections */}
      <div className="pointer-events-none absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full bg-sage-200/50 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-sage-100/70 blur-[130px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-50/30 blur-[140px]" />
      
      {/* Subtle gradient overlay for depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-sage-200/10" />

      <div className="container-academy relative z-10">
        <SectionHeading 
          eyebrow="Other Services" 
          title="Beyond the" 
          highlight="classroom" 
          align="center" 
          description="Murals, wall art and custom commissions — we bring the studio to you." 
        />

        <div className="mt-12 grid gap-5 sm:gap-6 lg:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {otherServices.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-hover group relative aspect-[4/5] overflow-hidden rounded-4xl shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <Image src={s.image} alt={s.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Decorative sage accent overlay */}
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-sage-400/10 backdrop-blur-sm" />
              
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:p-6">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-lg sm:text-xl font-medium text-white leading-tight">{s.title}</h3>
                  <span className="grid h-8 w-8 sm:h-9 sm:w-9 shrink-0 place-items-center rounded-full bg-sage-500/20 text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-sage-500/40 group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-2 max-h-0 overflow-hidden text-xs sm:text-sm text-white/70 opacity-0 transition-all duration-300 group-hover:max-h-20 group-hover:opacity-100">
                  {s.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
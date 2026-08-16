"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { accessories } from "@/lib/data";

export default function Accessories() {
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
            eyebrow="Accessories" 
            title="Stock up on the" 
            highlight="essentials" 
            description="Quality art supplies and tools curated for every creative journey."
          />
          <Button variant="outline" className="border-sage-300/50 text-sage-700 hover:bg-sage-100/50 dark:border-white/20 dark:text-white dark:hover:bg-white/10 h-11 sm:h-12">
            View All <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:mt-14 lg:grid-cols-4 lg:gap-5">
          {accessories.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="card-hover group relative aspect-[4/5] overflow-hidden rounded-3xl shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <Image src={a.image} alt={a.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
              
              {/* Decorative sage accent */}
              <div className="absolute top-3 left-3 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-sage-400/20 backdrop-blur-sm" />
              
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <h3 className="font-display text-base sm:text-lg font-medium text-white">{a.name}</h3>
                <p className="text-xs text-white/60">{a.itemCount} items</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
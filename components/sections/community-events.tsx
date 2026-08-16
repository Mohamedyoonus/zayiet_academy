"use client";

import { motion } from "framer-motion";
import { School, Building2, GraduationCap, Users } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { eventClients } from "@/lib/data";

const categoryIcons = { Schools: School, "IT Parks": Building2, Colleges: GraduationCap, Community: Users };

export default function CommunityEvents() {
  return (
    <section id="events" className="relative overflow-hidden bg-sage-50/40 py-28 dark:bg-ink-950">
      {/* Soft botanical wash - matching all sections */}
      <div className="pointer-events-none absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full bg-sage-200/50 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-sage-100/70 blur-[130px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-50/30 blur-[140px]" />
      
      {/* Subtle gradient overlay for depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-sage-200/10" />

      <div className="container-academy relative z-10">
        <SectionHeading
          eyebrow="Community Events"
          title="Where we've brought"
          highlight="art to life"
          description="From school campuses to corporate parks, Zayith Academy travels to bring hands-on creative experiences to your community."
          align="center"
        />

        <div className="relative mx-auto mt-16 max-w-3xl sm:mt-20 lg:mt-24">
          <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-sage-400 via-sage-300 to-sage-200/20 sm:left-1/2" />
          <div className="space-y-12 sm:space-y-14">
            {eventClients.map((e, i) => {
              const Icon = categoryIcons[e.category];
              const isRight = i % 2 === 0;
              return (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, x: isRight ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6 }}
                  className={`relative flex flex-col gap-3 sm:gap-4 pl-16 sm:w-1/2 sm:pl-0 ${
                    isRight ? "sm:ml-auto sm:pl-12" : "sm:pr-12 sm:text-right"
                  }`}
                >
                  <div
                    className={`absolute left-0 top-0 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-sage-500 to-sage-600 text-white shadow-lg shadow-sage-200/50 sm:top-0 ${
                      isRight ? "sm:left-auto sm:right-full sm:translate-x-6" : "sm:left-full sm:-translate-x-6"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="rounded-3xl border border-sage-200/40 bg-white/60 p-5 sm:p-6 shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-lg dark:border-white/10 dark:bg-ink-900/40">
                    <Badge variant="outline" className="border-sage-300/50 text-sage-700 dark:border-white/20 dark:text-white">
                      {e.category}
                    </Badge>
                    <h3 className="mt-3 font-display text-lg sm:text-xl font-medium text-ink-900 dark:text-white leading-tight">{e.name}</h3>
                    <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">{e.description}</p>
                    <span className="mt-3 inline-block text-xs font-semibold text-sage-600 dark:text-sage-400">{e.year}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 flex justify-center sm:mt-20 lg:mt-24">
          <Button size="lg" className="bg-sage-600 hover:bg-sage-700 dark:bg-sage-500 dark:hover:bg-sage-600 h-12 sm:h-13">
            Book an Event
          </Button>
        </div>
      </div>
    </section>
  );
}
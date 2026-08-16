"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { faqs } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function FAQ() {
  const [open, setOpen] = useState<string | null>(faqs[0].id);

  return (
    <section id="faq" className="relative overflow-hidden bg-sage-50/40 py-28 dark:bg-ink-950">
      {/* Soft botanical wash - matching all sections */}
      <div className="pointer-events-none absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full bg-sage-200/50 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-sage-100/70 blur-[130px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-50/30 blur-[140px]" />
      
      {/* Subtle gradient overlay for depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-sage-200/10" />

      <div className="container-academy relative z-10 max-w-3xl">
        <SectionHeading 
          eyebrow="FAQ" 
          title="Questions," 
          highlight="answered" 
          align="center" 
          description="Everything you need to know about our classes, workshops, and more."
        />

        <div className="mt-14 space-y-3">
          {faqs.map((f) => {
            const isOpen = open === f.id;
            return (
              <motion.div 
                key={f.id} 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden rounded-3xl border border-sage-200/40 bg-white/60 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md dark:border-white/10 dark:bg-ink-900/60"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : f.id)}
                  className="flex w-full items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 lg:px-7 py-4 sm:py-5 text-left transition-colors duration-200 hover:bg-sage-50/30 dark:hover:bg-white/5"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-base sm:text-lg font-medium text-ink-900 dark:text-white">{f.question}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-full transition-all duration-300",
                      isOpen 
                        ? "bg-gradient-to-br from-sage-500 to-sage-600 text-white shadow-lg shadow-sage-200/50" 
                        : "bg-sage-100/50 text-sage-700 dark:bg-white/10 dark:text-white"
                    )}
                  >
                    <Plus className="h-4 w-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-6 lg:px-7 pb-4 sm:pb-6 pt-1">
                        <div className="h-px w-full bg-sage-200/30 dark:bg-white/5" />
                        <p className="mt-4 text-sm leading-relaxed text-ink-600 dark:text-ink-300">{f.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
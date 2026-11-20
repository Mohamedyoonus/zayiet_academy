"use client";

import { motion } from "framer-motion";
import { Sparkles, Palette, Compass, Heart } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { useT } from "@/hooks/use-i18n";

export default function VisionValues() {
  const t = useT().visionValues;
  const valueCards = [
    { icon: Sparkles, title: t.card1Title, description: t.card1Desc },
    { icon: Palette, title: t.card2Title, description: t.card2Desc },
    { icon: Compass, title: t.card3Title, description: t.card3Desc },
    { icon: Heart, title: t.card4Title, description: t.card4Desc },
  ];

  return (
    <section id="vision" className="relative overflow-hidden bg-sage-50/60 py-12 sm:py-16 lg:py-24 dark:bg-ink-950">
      {/* Soft botanical wash matching all sections */}
      <div className="pointer-events-none absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full bg-sage-200/50 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-sage-100/70 blur-[130px]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-sage-200/10" />

      <div className="container-academy relative z-10">
        {/* Short Vision Section */}
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading
            align="center"
            eyebrow={t.eyebrow}
            title={t.title}
            highlight={t.highlight}
            description={t.description}
          />
        </div>

        {/* Four Value Cards */}
        <div className="mt-10 sm:mt-12 lg:mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {valueCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative flex flex-col justify-between rounded-3xl border border-sage-200/50 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-ink-900/50 sm:p-7"
              >
                <div>
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-sage-500 to-sage-600 text-white shadow-md shadow-sage-200/40 transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-lg sm:text-xl font-medium text-charcoal-900 dark:text-white leading-snug">
                    {card.title}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <div className="mt-5 h-1 w-10 rounded-full bg-sage-300/60 transition-all duration-300 group-hover:w-16 group-hover:bg-sage-500" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

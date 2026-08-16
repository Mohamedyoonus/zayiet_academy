"use client";

import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Target, Eye } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { counters } from "@/lib/data";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1600;
    const startTime = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(value);
    }
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-ink-900 dark:text-white">
      {count}
      {suffix}
    </span>
  );
}

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-sage-50/40 py-28 dark:bg-ink-950">
      {/* Soft botanical wash - matching all sections */}
      <div className="pointer-events-none absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full bg-sage-200/50 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-sage-100/70 blur-[130px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-50/30 blur-[140px]" />
      
      {/* Subtle gradient overlay for depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-sage-200/10" />

      <div className="container-academy relative z-10 grid gap-16 lg:grid-cols-2 lg:items-center">
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-5xl shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1200&auto=format&fit=crop"
              alt="Founder mentoring a student at the easel"
              fill
              className="object-cover"
            />
            {/* Sage accent overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-sage-500/10 via-transparent to-transparent" />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute -bottom-6 -right-4 hidden w-48 sm:w-56 rounded-3xl bg-gradient-to-br from-sage-500 to-sage-600 p-4 sm:p-6 text-white shadow-2xl shadow-sage-200/50 sm:block"
          >
            <p className="font-display text-base sm:text-lg leading-snug">
              &ldquo;Every child who walks in unsure leaves knowing they can create.&rdquo;
            </p>
            <p className="mt-2 sm:mt-3 text-xs font-semibold text-white/80">— Founder, Zayith Academy</p>
          </motion.div>
        </div>

        <div>
          <SectionHeading eyebrow="About Zayith Academy" title="Built on a" highlight="simple belief" />
          <p className="mt-4 text-sm sm:text-base text-ink-600 dark:text-ink-300 leading-relaxed">
            Zayith Academy began with one instructor, a small room and a conviction that art training should feel personal — not mass-produced. Nearly a decade later, that belief still shapes every batch we run.
          </p>

          <div className="mt-8 sm:mt-10 grid gap-4 sm:gap-5 sm:grid-cols-2">
            <div className="rounded-3xl border border-sage-200/40 bg-white/60 p-4 sm:p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md dark:border-white/10 dark:bg-ink-900/40">
              <Target className="h-5 sm:h-6 w-5 sm:w-6 text-sage-600" />
              <h4 className="mt-3 font-display text-base sm:text-lg font-medium text-ink-900 dark:text-white">Our Mission</h4>
              <p className="mt-2 text-xs sm:text-sm text-ink-600 dark:text-ink-300">Make quality art education accessible to every age and skill level, without diluting the craft.</p>
            </div>
            <div className="rounded-3xl border border-sage-200/40 bg-white/60 p-4 sm:p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md dark:border-white/10 dark:bg-ink-900/40">
              <Eye className="h-5 sm:h-6 w-5 sm:w-6 text-sage-600" />
              <h4 className="mt-3 font-display text-base sm:text-lg font-medium text-ink-900 dark:text-white">Our Vision</h4>
              <p className="mt-2 text-xs sm:text-sm text-ink-600 dark:text-ink-300">A community where every student sees themselves as a working artist, not just a hobbyist.</p>
            </div>
          </div>

          <div className="mt-10 sm:mt-12 grid grid-cols-2 gap-6 sm:gap-8 border-t border-sage-200/30 pt-8 sm:pt-10 dark:border-white/10 sm:grid-cols-4">
            {counters.map((c) => (
              <div key={c.label}>
                <Counter value={c.value} suffix={c.suffix} />
                <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
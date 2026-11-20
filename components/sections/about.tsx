"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Target, Eye } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { useT } from "@/hooks/use-i18n";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
} as const;

const paragraphs = (text: string) => text.split("\n\n");

export default function About() {
  const t = useT().about;
  const story = paragraphs(t.story);

  const pillars = [
    { icon: Target, title: t.missionTitle, tagline: t.missionTagline, text: t.mission },
    { icon: Eye, title: t.visionTitle, tagline: t.visionTagline, text: t.vision },
  ];

  return (
    <section id="about" className="relative overflow-hidden bg-sage-50/40 py-20 sm:py-24 lg:py-28 dark:bg-ink-950">
      {/* Soft botanical wash - matching all sections */}
      <div className="pointer-events-none absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full bg-sage-200/50 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-sage-100/70 blur-[130px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-50/30 blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-sage-200/10" />

      <div className="container-academy relative z-10">
        {/* The Founder's Story: photo beside the story */}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16">
          <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
            <div className="relative aspect-[4/5] overflow-hidden rounded-5xl shadow-xl">
              {/* Portrait is taller than the frame, so crop from the bottom to keep the face in view */}
              <Image
                src="/assets/chalz-simon.webp"
                alt={t.imageAlt}
                fill
                sizes="(min-width: 1024px) 28rem, 24rem"
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sage-500/10 via-transparent to-transparent" />
            </div>
          </div>

          <div>
            <SectionHeading eyebrow={t.eyebrow} title={t.title} highlight={t.highlight} />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-charcoal-600 dark:text-charcoal-300 sm:text-lg">
              {story.map((p, i) => (
                <p key={i} className={i === story.length - 1 ? "font-medium text-charcoal-900 dark:text-white" : undefined}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* About Zayit Academy */}
        <motion.div {...reveal} className="mx-auto mt-20 max-w-3xl text-center sm:mt-24 lg:mt-28">
          <h2 className="font-display text-[clamp(1.6rem,1.1rem+1.6vw,2.6rem)] font-medium leading-tight tracking-tight text-charcoal-900 dark:text-white">
            {t.aboutZayitTitle}
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-charcoal-600 dark:text-charcoal-300 sm:text-lg">
            {paragraphs(t.aboutZayitText).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <p className="mt-6 font-display text-lg italic text-sage-700 dark:text-sage-300 sm:text-xl">{t.aboutZayitTagline}</p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:mt-16 sm:grid-cols-2 sm:gap-6">
          {pillars.map(({ icon: Icon, title, tagline, text }, i) => (
            <motion.div
              key={title}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.1 }}
              className="rounded-4xl border border-sage-200/40 bg-white/60 p-6 shadow-sm backdrop-blur-sm sm:p-8 dark:border-white/10 dark:bg-ink-900/40"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-sage-500 to-sage-600 text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-xl font-medium text-charcoal-900 dark:text-white">{title}</h3>
              </div>
              <p className="mt-4 font-display text-lg font-medium leading-snug text-sage-700 dark:text-sage-300">{tagline}</p>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-600 dark:text-charcoal-300 sm:text-base">{text}</p>
            </motion.div>
          ))}
        </div>

        {/* Closing statement */}
        <motion.div {...reveal} className="mx-auto mt-20 max-w-2xl text-center sm:mt-24">
          <h2 className="font-display text-[clamp(1.6rem,1.1rem+1.6vw,2.6rem)] font-medium leading-tight tracking-tight text-charcoal-900 dark:text-white">
            {t.closingTitle}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-charcoal-600 dark:text-charcoal-300 sm:text-lg">{t.closingText}</p>
          <p className="mt-6 font-display text-lg italic text-sage-700 dark:text-sage-300 sm:text-xl">{t.closingSignature}</p>
        </motion.div>
      </div>
    </section>
  );
}

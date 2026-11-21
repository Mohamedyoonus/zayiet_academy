"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Eye, Quote, Target, type LucideIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { useContent } from "@/hooks/use-content";
import { withSaved } from "@/lib/with-saved";
import { cn } from "@/lib/utils";

// Compact layout: each section fits on one screen, so the page needs little scrolling.

const ease = [0.16, 1, 0.3, 1] as const;
const reveal = (delay = 0) =>
  ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.6, delay, ease },
  }) as const;

const paragraphs = (text: string) => text.split("\n\n").filter(Boolean);
/** "Create with Purpose. Grow with Confidence. …" → one line per sentence */
const sentences = (text: string) => text.split(/(?<=[.!?।])\s+/).filter(Boolean);

function BrushUnderline() {
  return (
    <svg viewBox="0 0 200 20" preserveAspectRatio="none" fill="none" aria-hidden>
      <path d="M2 14C40 6 90 4 100 9C110 14 150 17 198 8" className="stroke-sage-300" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

function Pillar({
  icon: Icon,
  title,
  tagline,
  text,
  dark = false,
  delay = 0,
}: {
  icon: LucideIcon;
  title: string;
  tagline: string;
  text: string;
  dark?: boolean;
  delay?: number;
}) {
  return (
    <motion.article
      {...reveal(delay)}
      className={cn("relative overflow-hidden rounded-[1.75rem] p-6 sm:p-8", dark ? "bg-charcoal-900 text-cream" : "bg-sage-100 text-charcoal-900")}
    >
      {/* Large faint icon as a watermark */}
      <Icon aria-hidden strokeWidth={1} className={cn("absolute -right-6 -top-6 h-32 w-32", dark ? "text-white/[0.06]" : "text-sage-700/10")} />
      <div className="relative flex items-center gap-3">
        <span className={cn("grid h-10 w-10 place-items-center rounded-xl", dark ? "bg-sage-500 text-white" : "bg-white text-sage-700 shadow-sm")}>
          <Icon className="h-5 w-5" />
        </span>
        <h2 className={cn("text-xs font-semibold uppercase tracking-widest2", dark ? "text-sage-300" : "text-sage-700")}>{title}</h2>
      </div>
      <p className="relative mt-5 font-display text-[clamp(1.4rem,1.1rem+0.9vw,1.9rem)] font-medium leading-[1.12] tracking-tight">{tagline}</p>
      <p className={cn("relative mt-3 text-[0.95rem] leading-relaxed sm:text-base", dark ? "text-cream/70" : "text-charcoal-600")}>{text}</p>
    </motion.article>
  );
}

export default function About() {
  const { t: dictionary, locale } = useI18n();
  // Text and photo edited in the admin (English only) replace the built-in text
  const t = withSaved(dictionary.about, useContent().about);
  const photo = t.photo || "/assets/chalz-simon.webp";

  const story = paragraphs(t.story);
  // The story's last line becomes a highlighted quote (when there's more than one paragraph)
  const quote = story.length > 1 ? story[story.length - 1] : null;
  const body = quote ? story.slice(0, -1) : story;
  const founder = t.quoteBy.replace(/^[—–-]\s*/, "");
  // A decorative first letter suits Latin text; other scripts keep their normal first character
  const dropCap = locale === "en";

  return (
    <div id="about">
      {/* ------------------------------ The Founder's Story ------------------------------ */}
      <section className="relative overflow-hidden bg-cream pb-12 pt-24 sm:pb-14 lg:pb-10 lg:pt-[6.5rem]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(40rem_28rem_at_6%_20%,rgb(var(--c-sage-200)/0.45),transparent_70%),radial-gradient(34rem_24rem_at_96%_90%,rgb(var(--c-sage-100)/0.8),transparent_70%)]"
        />
        <div className="container-academy relative grid items-center gap-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-16 xl:gap-20">
          {/* Arched portrait, like a framed piece in a gallery. On desktop its size follows the
              screen height, so the whole section fits on one screen, even when zoomed in. */}
          <motion.div
            {...reveal()}
            className="relative mx-auto w-full max-w-[15rem] sm:max-w-[18rem] lg:mx-0 lg:w-[calc((100svh-9.5rem)*0.75)] lg:min-w-[15rem] lg:max-w-[26rem]"
          >
            <div aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 rounded-b-[1.75rem] rounded-t-[12rem] bg-sage-200/70" />
            <div className="relative aspect-[3/4] overflow-hidden rounded-b-[1.75rem] rounded-t-[12rem] bg-sage-100 shadow-xl ring-1 ring-black/5">
              <Image
                src={photo}
                alt={t.imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 26rem, 18rem"
                className="object-cover object-top"
              />
            </div>
            <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-medium text-charcoal-800 shadow-lg ring-1 ring-black/5">
              <span className="h-2 w-2 rounded-full bg-sage-500" />
              {founder}
            </div>
          </motion.div>

          <div>
            <motion.span {...reveal()} className="eyebrow">
              <span className="h-1 w-1 rounded-full bg-sage-500" />
              {t.eyebrow}
            </motion.span>
            <motion.h1
              {...reveal(0.05)}
              className="mt-3 text-balance font-display text-[clamp(2.25rem,1.4rem+2.6vw,3.75rem)] font-medium leading-[0.98] tracking-tight text-charcoal-900"
            >
              {t.title}
            </motion.h1>
            <motion.p {...reveal(0.1)} className="mt-3 font-display text-[clamp(1.1rem,0.95rem+0.7vw,1.5rem)] italic text-sage-700">
              <span className="brush-underline">
                {t.highlight}
                <BrushUnderline />
              </span>
            </motion.p>

            <div className="mt-6 space-y-3 text-[0.95rem] leading-relaxed text-charcoal-600 sm:text-base">
              {body.map((paragraph, i) => (
                <motion.p
                  key={i}
                  {...reveal(0.12 + i * 0.05)}
                  className={cn(
                    i === 0 &&
                      dropCap &&
                      "first-letter:float-left first-letter:mr-2.5 first-letter:mt-0.5 first-letter:font-display first-letter:text-[3.4rem] first-letter:font-medium first-letter:leading-[0.8] first-letter:text-sage-700"
                  )}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {quote && (
              <motion.blockquote
                {...reveal(0.2)}
                className="relative mt-7 rounded-2xl bg-white/80 p-5 pt-6 shadow-sm ring-1 ring-sage-200/70 sm:p-6 sm:pt-7"
              >
                <span className="absolute -top-4 left-5 grid h-8 w-8 place-items-center rounded-full bg-sage-600 text-white shadow-md sm:left-6">
                  <Quote className="h-3.5 w-3.5" />
                </span>
                <p className="font-display text-base leading-snug text-charcoal-900 sm:text-lg">{quote}</p>
              </motion.blockquote>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------- About Zayit Academy ------------------------------- */}
      <section className="bg-ivory-200/70 py-14 sm:py-16 lg:py-20">
        <div className="container-academy grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16">
          <div>
            <motion.h2
              {...reveal()}
              className="text-balance font-display text-[clamp(1.9rem,1.3rem+1.8vw,2.75rem)] font-medium leading-[1.08] tracking-tight text-charcoal-900"
            >
              {t.aboutZayitTitle}
            </motion.h2>
            <ol className="mt-6">
              {sentences(t.aboutZayitTagline).map((line, i) => (
                <motion.li key={i} {...reveal(0.05 + i * 0.06)} className="flex items-baseline gap-4 border-t border-charcoal-900/10 py-3 last:border-b">
                  <span className="font-display text-sm tabular-nums text-sage-500">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-lg italic text-sage-800 sm:text-xl">{line}</span>
                </motion.li>
              ))}
            </ol>
          </div>

          <div className="space-y-4 text-[0.95rem] leading-relaxed text-charcoal-600 sm:text-base">
            {paragraphs(t.aboutZayitText).map((paragraph, i) => (
              <motion.p
                key={i}
                {...reveal(0.05 + i * 0.05)}
                className={i === 0 ? "font-display text-[clamp(1.2rem,1rem+0.6vw,1.5rem)] leading-snug text-charcoal-900" : undefined}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------- Mission & Vision -------------------------------- */}
      <section className="bg-cream pb-6 pt-14 sm:pt-16 lg:pt-20">
        <div className="container-academy grid gap-4 md:grid-cols-2 lg:gap-5">
          <Pillar dark icon={Target} title={t.missionTitle} tagline={t.missionTagline} text={t.mission} />
          <Pillar icon={Eye} title={t.visionTitle} tagline={t.visionTagline} text={t.vision} delay={0.08} />
        </div>
      </section>

      {/* ------------------------------------ Closing ------------------------------------ */}
      <section className="relative overflow-hidden bg-cream pb-16 pt-12 sm:pb-20 lg:pt-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(46rem_24rem_at_50%_100%,rgb(var(--c-sage-100)),transparent_70%)]"
        />
        <motion.div {...reveal()} className="container-academy relative mx-auto max-w-3xl text-center">
          <Image src="/assets/logo_only.png" alt="" width={48} height={48} className="mx-auto h-10 w-10 opacity-90" />
          <h2 className="mt-4 text-balance font-display text-[clamp(2rem,1.3rem+2.2vw,3.25rem)] font-medium leading-[1.05] tracking-tight text-charcoal-900">
            {t.closingTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-charcoal-600 sm:text-lg">{t.closingText}</p>
          <p className="mt-5 font-display text-lg italic text-sage-700 sm:text-xl">
            <span className="brush-underline">
              {t.closingSignature}
              <BrushUnderline />
            </span>
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/classes" className={cn(buttonVariants(), "w-full max-w-xs sm:w-auto")}>
              {dictionary.hero.exploreClasses} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className={cn(buttonVariants({ variant: "outline" }), "w-full max-w-xs sm:w-auto")}>
              {dictionary.nav.contact}
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

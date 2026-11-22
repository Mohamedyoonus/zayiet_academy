"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Eye, Quote, Target, User, type LucideIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { useContent, useShownLink } from "@/hooks/use-content";
import { withSaved } from "@/lib/with-saved";
import { cn } from "@/lib/utils";

// Zayit Academy leads the page; the founders follow with small photos.

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
/** Text still waiting to be filled in from the admin, like "[Co-founder's name]" */
const isPlaceholder = (text: string) => /^\[.*\]$/.test(text.trim());

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

/** Small arched portrait; without a photo, the person's initials (or a person icon) */
function Portrait({ photo, name, alt }: { photo?: string; name: string; alt: string }) {
  const initials = isPlaceholder(name)
    ? ""
    : name
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
  return (
    <div className="relative w-24 shrink-0 sm:w-28">
      <div aria-hidden className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-b-2xl rounded-t-[5rem] bg-sage-200/70" />
      <div className="relative grid aspect-[3/4] place-items-center overflow-hidden rounded-b-2xl rounded-t-[5rem] bg-sage-100 shadow-md ring-1 ring-black/5">
        {photo ? (
          <Image src={photo} alt={alt} fill sizes="7rem" className="object-cover object-top" />
        ) : initials ? (
          <span aria-hidden className="font-display text-3xl font-medium text-sage-700">
            {initials}
          </span>
        ) : (
          <User aria-hidden className="h-10 w-10 text-sage-500" />
        )}
      </div>
    </div>
  );
}

function PersonCard({
  photo,
  name,
  role,
  alt,
  tagline,
  delay = 0,
  children,
}: {
  photo?: string;
  name: string;
  role: string;
  alt: string;
  tagline?: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <motion.article
      {...reveal(delay)}
      className="rounded-[1.75rem] bg-white/80 p-6 shadow-sm ring-1 ring-sage-200/70 backdrop-blur-sm sm:p-8"
    >
      <div className="flex items-center gap-5">
        <Portrait photo={photo} name={name} alt={alt} />
        <div className="min-w-0">
          <span className="inline-flex rounded-full bg-sage-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-sage-700">
            {role}
          </span>
          <h3 className="mt-2 font-display text-2xl font-medium leading-tight text-charcoal-900 sm:text-[1.75rem]">{name}</h3>
          {tagline && <p className="mt-1 font-display text-base italic leading-snug text-sage-700 sm:text-lg">{tagline}</p>}
        </div>
      </div>
      <div className="mt-6 text-[0.95rem] leading-relaxed text-charcoal-600 sm:text-base">{children}</div>
    </motion.article>
  );
}

export default function About() {
  const { t: dictionary } = useI18n();
  // Text and photos edited in the admin (English only) replace the built-in text
  const t = withSaved(dictionary.about, useContent().about);
  // The closing buttons only for pages the admin shows
  const shown = useShownLink();
  const founderPhoto = t.photo || "/assets/chalz-simon.webp";

  const story = paragraphs(t.story);
  // The story's last paragraph becomes a highlighted quote (when there's more than one)
  const quote = story.length > 1 ? story[story.length - 1] : null;
  const body = quote ? story.slice(0, -1) : story;
  const [storyOpen, setStoryOpen] = useState(false);
  // Closed: just the first paragraph, so the two founder cards stay a similar size
  const hasMore = body.length > 1 || quote !== null;

  const [lead, ...academyText] = paragraphs(t.aboutZayitText);

  return (
    <div id="about">
      {/* ------------------------------ About Zayit Academy ------------------------------ */}
      <section className="relative overflow-hidden bg-cream pb-10 pt-24 sm:pb-12 lg:pt-[6.5rem]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(40rem_28rem_at_6%_20%,rgb(var(--c-sage-200)/0.45),transparent_70%),radial-gradient(34rem_24rem_at_96%_90%,rgb(var(--c-sage-100)/0.8),transparent_70%)]"
        />
        <div className="container-academy relative grid items-center gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14 xl:gap-20">
          <div>
            <motion.span {...reveal()} className="eyebrow">
              <span className="h-1 w-1 rounded-full bg-sage-500" />
              {t.academyEyebrow}
            </motion.span>
            <motion.h1
              {...reveal(0.05)}
              className="mt-3 text-balance font-display text-[clamp(2.25rem,1.4rem+2.6vw,3.75rem)] font-medium leading-[1.02] tracking-tight text-charcoal-900"
            >
              {t.aboutZayitTitle}
            </motion.h1>
            {lead && (
              <motion.p
                {...reveal(0.1)}
                className="mt-5 font-display text-[clamp(1.2rem,1rem+0.6vw,1.5rem)] leading-snug text-charcoal-900"
              >
                {lead}
              </motion.p>
            )}
            <div className="mt-4 space-y-3 text-[0.95rem] leading-relaxed text-charcoal-600 sm:text-base">
              {academyText.map((paragraph, i) => (
                <motion.p key={i} {...reveal(0.12 + i * 0.05)}>
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </div>

          {/* The academy's three promises */}
          <motion.div
            {...reveal(0.1)}
            className="rounded-[1.75rem] bg-white/80 p-6 shadow-sm ring-1 ring-sage-200/70 backdrop-blur-sm sm:p-8"
          >
            <Image src="/assets/logo_only.png" alt="" width={48} height={48} className="h-11 w-11" />
            <ol className="mt-5">
              {sentences(t.aboutZayitTagline).map((line, i) => (
                <li key={i} className="flex items-baseline gap-4 border-t border-charcoal-900/10 py-3.5 last:border-b">
                  <span className="font-display text-sm tabular-nums text-sage-500">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-lg italic text-sage-800 sm:text-xl">{line}</span>
                </li>
              ))}
            </ol>
          </motion.div>
        </div>
      </section>

      {/* -------------------------------- Mission & Vision -------------------------------- */}
      <section className="bg-cream pb-14 sm:pb-16 lg:pb-20">
        <div className="container-academy grid gap-4 md:grid-cols-2 lg:gap-5">
          <Pillar dark icon={Target} title={t.missionTitle} tagline={t.missionTagline} text={t.mission} />
          <Pillar icon={Eye} title={t.visionTitle} tagline={t.visionTagline} text={t.vision} delay={0.08} />
        </div>
      </section>

      {/* ---------------------------------- Our Founders ---------------------------------- */}
      <section className="bg-ivory-200/70 py-14 sm:py-16 lg:py-20">
        <div className="container-academy">
          <div className="text-center">
            <motion.span {...reveal()} className="eyebrow justify-center">
              <span className="h-1 w-1 rounded-full bg-sage-500" />
              {t.foundersEyebrow}
            </motion.span>
            <motion.h2
              {...reveal(0.05)}
              className="mt-3 text-balance font-display text-[clamp(1.9rem,1.3rem+1.8vw,2.75rem)] font-medium leading-[1.08] tracking-tight text-charcoal-900"
            >
              {t.foundersTitle}
            </motion.h2>
          </div>

          <div className="mx-auto mt-8 grid max-w-5xl items-start gap-5 md:grid-cols-2 lg:mt-10">
            {/* Founder: the first paragraph of the story, the rest on "Read the full story" */}
            <PersonCard photo={founderPhoto} name={t.title} role={t.founderRole} alt={t.imageAlt} tagline={t.highlight}>
              <p className="text-xs font-semibold uppercase tracking-widest2 text-sage-600">{t.eyebrow}</p>
              {body[0] && <p className="mt-2">{body[0]}</p>}
              <AnimatePresence initial={false}>
                {storyOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 pt-3">
                      {body.slice(1).map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                    {quote && (
                      // A border, not a ring: the expanding wrapper clips anything drawn outside the box
                      <blockquote className="relative mt-7 rounded-2xl border border-sage-200/70 bg-sage-50 p-5 pt-6">
                        <span className="absolute -top-4 left-5 grid h-8 w-8 place-items-center rounded-full bg-sage-600 text-white shadow-md">
                          <Quote className="h-3.5 w-3.5" />
                        </span>
                        <p className="font-display text-base leading-snug text-charcoal-900 sm:text-lg">{quote}</p>
                        <footer className="mt-3 text-sm text-charcoal-500">{t.quoteBy}</footer>
                      </blockquote>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              {hasMore && (
                <button
                  type="button"
                  onClick={() => setStoryOpen((open) => !open)}
                  aria-expanded={storyOpen}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sage-700 transition-colors hover:text-sage-900"
                >
                  {storyOpen ? t.showLess : t.readStory}
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", storyOpen && "rotate-180")} />
                </button>
              )}
            </PersonCard>

            <PersonCard
              photo={t.coFounderPhoto}
              name={t.coFounderName}
              role={t.coFounderRole}
              alt={`${t.coFounderName}, ${t.coFounderRole}`}
              delay={0.08}
            >
              <div className="space-y-3">
                {paragraphs(t.coFounderBio).map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </PersonCard>
          </div>
        </div>
      </section>

      {/* ------------------------------------ Closing ------------------------------------ */}
      <section className="relative overflow-hidden bg-cream pb-16 pt-14 sm:pb-20 lg:pt-16">
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
            {shown("/classes") && (
              <Link href="/classes" className={cn(buttonVariants(), "w-full max-w-xs sm:w-auto")}>
                {dictionary.hero.exploreClasses} <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            {shown("/contact") && (
              <Link href="/contact" className={cn(buttonVariants({ variant: "outline" }), "w-full max-w-xs sm:w-auto")}>
                {dictionary.nav.contact}
              </Link>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
}

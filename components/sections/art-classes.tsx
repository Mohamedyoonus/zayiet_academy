"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, Clock, Users, CalendarDays, Star, Video, PlayCircle, School } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";
import { useData, useT } from "@/hooks/use-i18n";

const modeIcons = { school: School, video: Video, play: PlayCircle } as const;

// Shown on its own page (/classes). Cards stack on phones and tablets so every
// detail is readable without swiping, and sit three across on desktop.
export default function ArtClasses() {
  const router = useRouter();
  const t = useT();
  const { courses, deliveryModes, admissionNote } = useData();

  return (
    <section
      id="classes"
      className="relative overflow-hidden bg-sage-50 pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pb-28 lg:pt-36 dark:bg-ink-950"
    >
      {/* Soft botanical wash - matching Hero section */}
      <div className="pointer-events-none absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full bg-sage-200/50 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-sage-100/70 blur-[130px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-50/30 blur-[140px]" />

      {/* Subtle gradient overlay for depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-sage-200/10" />

      <div className="container-academy relative z-10">
        <SectionHeading
          align="center"
          eyebrow={t.classes.eyebrow}
          title={t.classes.title}
          highlight={t.classes.highlight}
          description={t.classes.description}
        />

        {/* Course tier cards */}
        <div className="mx-auto mt-10 grid max-w-xl gap-5 sm:gap-6 lg:mt-12 lg:max-w-none lg:grid-cols-3">
          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="card-hover group relative flex flex-col overflow-hidden rounded-3xl border border-sage-300/30 bg-white/80 shadow-lg shadow-sage-200/20 backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-white/10 dark:bg-ink-900/90"
            >
              <div className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-sage-400 via-ember-gold to-sage-400" />

              <div className="relative h-44 overflow-hidden sm:h-52 lg:h-44">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 36rem, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <Badge className="absolute left-4 top-4 bg-white/90 px-3 py-1 text-xs text-sage-800 shadow-sm">

                  {course.tierLabel}
                </Badge>
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="font-display text-xl font-medium leading-tight text-charcoal-900 sm:text-2xl">{course.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-600">{course.description}</p>

                {/* Duration, batch size and weekly schedule */}
                <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 border-y border-sage-200/40 py-4">
                  <div className="flex items-start gap-2">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-sage-600" />
                    <div>
                      <div className="text-sm font-semibold text-charcoal-900">{course.duration}</div>
                      <div className="text-xs text-charcoal-500">{t.classes.duration}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="mt-0.5 h-4 w-4 shrink-0 text-sage-600" />
                    <div>
                      <div className="text-sm font-semibold text-charcoal-900">{course.batchSize}</div>
                      <div className="text-xs text-charcoal-500">{t.classes.batch}</div>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-start gap-2">
                    <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-sage-600" />
                    <div>
                      <div className="text-sm font-semibold text-charcoal-900">{course.schedule}</div>
                      <div className="text-xs text-charcoal-500">{t.classes.weeklySchedule}</div>
                    </div>
                  </div>
                </div>

                <ul className="mt-4 space-y-2">
                  {course.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage-600" />
                      <span className="text-charcoal-800">{h}</span>
                    </li>
                  ))}
                </ul>

                {/* Fees + enroll, pinned to the bottom so the three cards line up */}
                <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-2xl font-semibold text-charcoal-900">{formatINR(course.feeOffline)}</span>
                      <span className="text-xs text-charcoal-500">{t.classes.perMonthOffline}</span>
                    </div>
                    <div className="mt-0.5 text-xs text-charcoal-500">
                      {formatINR(course.feeOnline)}
                      {t.classes.perMonthOnline}
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    className="h-11 shrink-0 px-6 text-sm"
                    onClick={() => router.push(`/enroll?course=${course.id}`)}
                  >
                    {t.common.enroll}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Statement below course cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-10 max-w-3xl rounded-3xl border border-sage-200/50 bg-white/70 p-6 text-center shadow-sm backdrop-blur-sm sm:p-8 dark:border-white/10 dark:bg-ink-900/40"
        >
          <h4 className="font-display text-lg font-medium text-charcoal-900 sm:text-xl dark:text-white">
            {t.classes.paceTitle}
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-charcoal-600 sm:text-base dark:text-charcoal-300">
            {t.classes.paceDesc}
          </p>
          {/* A left-aligned list on phones, a centered row on wider screens */}
          <ul className="mx-auto mt-5 flex w-fit flex-col gap-2 border-t border-sage-200/40 pt-5 text-left text-sm text-charcoal-600 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 dark:text-charcoal-400">
            <li>✓ Structured Levels: Basic, Advanced, Pro</li>
            <li>✓ Ages 5–16</li>
            <li>✓ 6 Months Duration (2 classes/week · 1.5 hrs)</li>
            <li>✓ Certificate Included</li>
            <li>✓ Online & Offline Studio</li>
          </ul>
        </motion.div>

        <p className="mx-auto mt-5 max-w-3xl text-center text-sm text-charcoal-500 dark:text-charcoal-400">{admissionNote}</p>

        {/* Delivery modes */}
        <div className="mt-16 sm:mt-20">
          <SectionHeading eyebrow={t.classes.howEyebrow} title={t.classes.howTitle} highlight={t.classes.howHighlight} align="center" />
          <div className="mx-auto mt-8 grid max-w-xl gap-4 sm:gap-5 md:max-w-none md:grid-cols-3">
            {deliveryModes.map((mode, i) => {
              const Icon = modeIcons[mode.icon as keyof typeof modeIcons];
              return (
                <motion.div
                  key={mode.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="card-hover rounded-3xl border border-sage-200/40 bg-white/60 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md sm:p-6 dark:border-white/10 dark:bg-ink-900/40"
                >
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-sage-500 to-sage-600 text-white shadow-lg shadow-sage-200/40">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="mt-4 font-display text-lg font-medium text-charcoal-900 sm:text-xl">{mode.title}</h4>
                  <ul className="mt-3 space-y-2 text-sm text-charcoal-600 dark:text-charcoal-300">
                    {mode.points.map((p) => (
                      <li key={p} className="flex items-start gap-2">
                        <Star className="mt-1 h-3 w-3 shrink-0 text-sage-500" fill="currentColor" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

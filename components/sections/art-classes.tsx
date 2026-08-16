"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Check, Clock, Users, Award, Star, Video, PlayCircle, School } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { courses, deliveryModes } from "@/lib/data";
import { formatINR, cn } from "@/lib/utils";

const modeIcons = { school: School, video: Video, play: PlayCircle } as const;

export default function ArtClasses() {
  return (
    <section id="classes" className="relative bg-sage-50 py-8 sm:py-14 lg:py-20 dark:bg-ink-950">
      {/* Soft botanical wash - matching Hero section */}
      <div className="pointer-events-none absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full bg-sage-200/50 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-sage-100/70 blur-[130px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-50/30 blur-[140px]" />
      
      {/* Subtle gradient overlay for depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-sage-200/10" />

      <div className="container-academy relative z-10">
        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Art Classes"
            title="A course for"
            highlight="every stage"
            description="From your very first pencil stroke to a portfolio ready for the world — three tiers, built to grow with you."
          />
        </div>

        {/* Course tier cards - ULTRA COMPACT */}
        <div className="mt-8 grid gap-3 sm:gap-4 lg:mt-10 lg:grid-cols-3">
          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={cn(
                "card-hover group relative flex flex-col overflow-hidden rounded-2xl border backdrop-blur-sm transition-all duration-300",
                course.featured
                  ? "border-sage-300/30 bg-white/80 shadow-lg shadow-sage-200/20 hover:shadow-xl dark:border-white/10 dark:bg-ink-900/90"
                  : "border-sage-200/40 bg-white/60 shadow-md backdrop-blur-sm hover:shadow-lg dark:border-white/10 dark:bg-ink-900/60"
              )}
            >
              {course.featured && (
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sage-400 via-ember-gold to-sage-400" />
              )}
              
              {/* Smaller image */}
              <div className="relative h-28 sm:h-32 lg:h-36 overflow-hidden">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <Badge variant={course.featured ? "gold" : "default"} className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3 text-[10px] sm:text-xs px-2 py-0.5">
                  {course.tier}
                </Badge>
                {course.oldFee && (
                  <div className="absolute right-2.5 top-2.5 sm:right-3 sm:top-3 rounded-full bg-ember-500/90 px-2 py-0.5 text-[9px] font-bold text-white shadow-lg">
                    Save {Math.round((1 - course.fee / course.oldFee) * 100)}%
                  </div>
                )}
              </div>

              {/* Ultra compact content */}
              <div className="flex flex-1 flex-col p-3 sm:p-4 lg:p-5">
                <h3 className="font-display text-base sm:text-lg font-medium text-ink-900 dark:text-white leading-tight">{course.title}</h3>
                <p className={cn("mt-1 text-xs leading-relaxed line-clamp-2", course.featured ? "text-ink-600" : "text-ink-500 dark:text-ink-300")}>
                  {course.description}
                </p>

                {/* Ultra compact info grid */}
                <div className={cn("mt-3 grid grid-cols-2 gap-1.5 border-y py-2.5 text-xs", course.featured ? "border-sage-200/30" : "border-ink-900/8 dark:border-white/10")}>
                  <div className="flex items-start gap-1.5">
                    <Clock className="mt-0.5 h-3 w-3 shrink-0 text-sage-600" />
                    <div>
                      <div className="font-semibold text-ink-900 dark:text-white text-[11px]">{course.duration}</div>
                      <div className={cn("text-[9px]", course.featured ? "text-ink-500" : "text-ink-400 dark:text-ink-400")}>Duration</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Users className="mt-0.5 h-3 w-3 shrink-0 text-sage-600" />
                    <div>
                      <div className="font-semibold text-ink-900 dark:text-white text-[11px]">{course.batchSize}</div>
                      <div className={cn("text-[9px]", course.featured ? "text-ink-500" : "text-ink-400 dark:text-ink-400")}>Batch</div>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-start gap-1.5">
                    <Award className="mt-0.5 h-3 w-3 shrink-0 text-sage-600" />
                    <div>
                      <div className="font-semibold text-ink-900 dark:text-white text-[11px]">{course.schedule}</div>
                      <div className={cn("text-[9px]", course.featured ? "text-ink-500" : "text-ink-400 dark:text-ink-400")}>Weekly Schedule</div>
                    </div>
                  </div>
                </div>

                {/* Ultra compact highlights */}
                <ul className="mt-2.5 space-y-1">
                  {course.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="flex items-start gap-1.5 text-[11px] sm:text-xs">
                      <Check className="mt-0.5 h-3 w-3 shrink-0 text-sage-600 flex-shrink-0" />
                      <span className={cn(course.featured ? "text-ink-800" : "text-ink-700 dark:text-ink-200")}>{h}</span>
                    </li>
                  ))}
                </ul>

                {/* Ultra compact footer */}
                <div className="mt-3 flex items-center justify-between gap-2">
                  <div>
                    {course.oldFee && (
                      <span className={cn("mr-1 text-[10px] line-through", course.featured ? "text-ink-400" : "text-ink-400 dark:text-ink-400")}>
                        {formatINR(course.oldFee)}
                      </span>
                    )}
                    <span className="font-display text-lg sm:text-xl font-semibold text-ink-900 dark:text-white">{formatINR(course.fee)}</span>
                  </div>
                  
                  {/* Ultra compact button */}
                  <Button
                    variant={course.featured ? "primary" : "dark"}
                    className="h-8 sm:h-9 text-xs px-4 sm:px-5"
                  >
                    Enroll
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Delivery modes comparison - ULTRA COMPACT */}
        <div className="mt-12 sm:mt-14 lg:mt-16">
          <SectionHeading eyebrow="How You Learn" title="Choose your" highlight="format" align="left" />
          <div className="mt-5 sm:mt-6 grid gap-3 sm:gap-4 md:grid-cols-3">
            {deliveryModes.map((mode, i) => {
              const Icon = modeIcons[mode.icon as keyof typeof modeIcons];
              return (
                <motion.div
                  key={mode.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="card-hover rounded-2xl border border-sage-200/40 bg-white/60 p-3.5 sm:p-4 lg:p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md dark:border-white/10 dark:bg-ink-900/40"
                >
                  <div className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-xl bg-gradient-to-br from-sage-500 to-sage-600 text-white shadow-lg shadow-sage-200/40">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <h4 className="mt-3 font-display text-base sm:text-lg font-medium text-ink-900 dark:text-white">{mode.title}</h4>
                  <ul className="mt-2 space-y-1 text-[11px] sm:text-xs text-ink-500 dark:text-ink-300">
                    {mode.points.slice(0, 3).map((p) => (
                      <li key={p} className="flex items-center gap-1.5">
                        <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gold-500" fill="currentColor" />
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
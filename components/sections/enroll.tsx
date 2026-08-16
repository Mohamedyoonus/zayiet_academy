"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { courses, admissionNote } from "@/lib/data";
import { cn, formatINR } from "@/lib/utils";

function RadioDot({ checked, size = "md" }: { checked: boolean; size?: "sm" | "md" }) {
  const outer = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const inner = size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2";
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-full border-2 transition-colors duration-300",
        outer,
        checked ? "border-sage-500 bg-sage-500" : "border-charcoal-300 bg-white"
      )}
    >
      {checked && <span className={cn("rounded-full bg-white", inner)} />}
    </span>
  );
}

function StepLabel({ step, title, hint }: { step: number; title: string; hint: string }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sage-500 text-xs font-semibold text-white">
          {step}
        </span>
        <h3 className="font-display text-base sm:text-lg font-medium text-charcoal-900">{title}</h3>
      </div>
      <p className="mt-1 pl-8 text-xs text-charcoal-500">{hint}</p>
    </div>
  );
}

export default function Enroll() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("course");
  const initialCourseId = courses.find((c) => c.id === preselected)?.id ?? courses[0].id;

  const [courseId, setCourseId] = useState(initialCourseId);
  const [mode, setMode] = useState<"offline" | "online">("offline");
  const [submitted, setSubmitted] = useState(false);

  const course = courses.find((c) => c.id === courseId) ?? courses[0];
  const fee = mode === "offline" ? course.feeOffline : course.feeOnline;

  return (
    <section className="relative overflow-hidden bg-sage-50/40 py-16 sm:py-20 lg:py-28 dark:bg-ink-950">
      {/* Soft botanical wash - matching all sections */}
      <div className="pointer-events-none absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full bg-sage-200/50 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-sage-100/70 blur-[130px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-50/30 blur-[140px]" />

      {/* Subtle gradient overlay for depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-sage-200/10" />

      <div className="container-academy relative z-10">
        <SectionHeading
          eyebrow="Enroll"
          title="Start your"
          highlight="art journey"
          description="Pick a course and format, tell us about the student, and we'll confirm your seat."
          align="center"
        />

        <div className="mt-12 grid gap-6 lg:mt-14 lg:grid-cols-[1fr_1.15fr] lg:items-start lg:gap-8">
          {/* Left: course + mode selection + price summary */}
          <div className="space-y-6">
            <div>
              <StepLabel step={1} title="Choose a course" hint="Click a card (or press Tab then Enter) to select it." />
              <div role="radiogroup" aria-label="Choose a course" className="mt-3 space-y-3">
                {courses.map((c) => {
                  const checked = courseId === c.id;
                  const cFee = mode === "offline" ? c.feeOffline : c.feeOnline;
                  return (
                    <button
                      key={c.id}
                      role="radio"
                      aria-checked={checked}
                      type="button"
                      onClick={() => setCourseId(c.id)}
                      className={cn(
                        "w-full cursor-pointer rounded-2xl border p-4 text-left transition-all duration-300",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sage-50",
                        checked
                          ? "border-sage-500 bg-white shadow-md"
                          : "border-sage-200/40 bg-white/60 hover:border-sage-300 hover:bg-white"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <RadioDot checked={checked} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-display text-base font-medium text-charcoal-900">{c.title}</span>
                            <span className="shrink-0 text-xs sm:text-sm font-semibold text-sage-700">{formatINR(cFee)}/mo</span>
                          </div>
                          <p className="mt-1 text-xs text-charcoal-500 leading-relaxed">{c.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <StepLabel step={2} title="Choose a class format" hint="Offline meets in-studio; online is a live video class." />
              <div role="radiogroup" aria-label="Class format" className="mt-3 grid grid-cols-2 gap-3">
                {(["offline", "online"] as const).map((m) => {
                  const checked = mode === m;
                  return (
                    <button
                      key={m}
                      role="radio"
                      aria-checked={checked}
                      type="button"
                      onClick={() => setMode(m)}
                      className={cn(
                        "flex cursor-pointer items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium capitalize transition-all duration-300",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sage-50",
                        checked
                          ? "border-sage-500 bg-white text-charcoal-900 shadow-md"
                          : "border-sage-200/40 bg-white/60 text-charcoal-500 hover:border-sage-300 hover:bg-white"
                      )}
                    >
                      <RadioDot checked={checked} size="sm" />
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-sage-200/40 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
              <div className="text-xs uppercase tracking-wide text-charcoal-400">Your selection</div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-xs sm:text-sm text-charcoal-500">
                  {course.title} · {mode === "offline" ? "Offline" : "Online"}
                </span>
                <span className="font-display text-xl sm:text-2xl font-semibold text-charcoal-900">
                  {formatINR(fee)}
                  <span className="text-xs sm:text-sm font-normal text-charcoal-400">/mo</span>
                </span>
              </div>
              <p className="mt-2 text-xs text-charcoal-500 leading-relaxed">{admissionNote}</p>
            </div>
          </div>

          {/* Right: enrollment form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="rounded-5xl border border-sage-200/40 bg-white/70 p-6 sm:p-8 lg:p-10 shadow-sm backdrop-blur-sm"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center">
                <CheckCircle2 className="h-12 sm:h-14 w-12 sm:w-14 text-sage-500" />
                <h3 className="mt-4 font-display text-xl sm:text-2xl text-charcoal-900">You&apos;re on the list!</h3>
                <p className="mt-2 text-sm sm:text-base text-charcoal-500">
                  We&apos;ll call you shortly to confirm the seat for {course.title} ({mode}).
                </p>
              </div>
            ) : (
              <form
                className="space-y-4 sm:space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
              >
                <StepLabel step={3} title="Your details" hint="Fields marked * are required — we'll use these to confirm your seat." />

                <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                  <Field label="Student Name" placeholder="Full name" required />
                  <Field label="Student Age" type="number" placeholder="e.g. 9" min={5} max={16} required hint="Ages 5–16" />
                </div>
                <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                  <Field label="Parent / Guardian Name" placeholder="Full name" required />
                  <Field label="Mobile Number" type="tel" placeholder="+91 00000 00000" required />
                </div>
                <Field label="Email Address" type="email" placeholder="you@email.com" required />
                <div>
                  <label className="mb-2 block text-xs sm:text-sm font-medium text-charcoal-700">Message <span className="font-normal text-charcoal-400">(optional)</span></label>
                  <textarea
                    rows={4}
                    placeholder="Anything we should know before your first class?"
                    className="w-full rounded-2xl border border-sage-200/50 bg-white px-4 sm:px-5 py-3 sm:py-4 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-sage-400 focus:outline-none focus:ring-1 focus:ring-sage-400/50 focus-visible:ring-2 focus-visible:ring-sage-500"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full justify-center h-11 sm:h-12">
                  Confirm Enrollment <Send className="h-4 w-4" />
                </Button>
                <p className="text-center text-[11px] text-charcoal-400">
                  By submitting, you agree to be contacted by Zayith Academy about this enrollment.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  type = "text",
  placeholder,
  min,
  max,
  required,
  hint,
}: {
  label: string;
  type?: string;
  placeholder: string;
  min?: number;
  max?: number;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs sm:text-sm font-medium text-charcoal-700">
        {label}
        {required && (
          <>
            <span aria-hidden className="ml-0.5 text-red-500">*</span>
            <span className="sr-only"> (required)</span>
          </>
        )}
      </label>
      <input
        required={required}
        type={type}
        min={min}
        max={max}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-sage-200/50 bg-white px-4 sm:px-5 py-2.5 sm:py-3.5 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-sage-400 focus:outline-none focus:ring-1 focus:ring-sage-400/50 focus-visible:ring-2 focus-visible:ring-sage-500"
      />
      {hint && <p className="mt-1.5 text-[11px] text-charcoal-400">{hint}</p>}
    </div>
  );
}

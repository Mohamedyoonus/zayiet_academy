"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Send, CheckCircle2, UserPlus } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import Dots from "@/components/ui/dots";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn, formatINR } from "@/lib/utils";
import { useData, useT } from "@/hooks/use-i18n";
import { fmt } from "@/lib/i18n";
import { submitEnrollment } from "@/lib/submissions";
import { useToast } from "@/components/admin/toast";

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
  const t = useT();
  const e = t.enroll;
  const { courses, admissionNote } = useData();
  const searchParams = useSearchParams();
  const preselected = searchParams.get("course");
  const initialCourseId = courses.find((c) => c.id === preselected)?.id ?? courses[0].id;

  const [courseId, setCourseId] = useState(initialCourseId);
  const [mode, setMode] = useState<"offline" | "online">(
    searchParams.get("mode") === "online" ? "online" : "offline"
  );
  const [submitted, setSubmitted] = useState(false);
  const [sending, startSending] = useTransition();
  const toast = useToast();

  const course = courses.find((c) => c.id === courseId) ?? courses[0];
  const fee = mode === "offline" ? course.feeOffline : course.feeOnline;
  const modeLabel = mode === "offline" ? t.common.offline : t.common.online;

  // After sending, the two columns give way to one confirmation card; bring it into view
  const doneRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (submitted) doneRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [submitted]);

  const summary = (
    <div className="rounded-3xl border border-sage-200/40 bg-white/70 p-5 text-left shadow-sm backdrop-blur-sm">
      <div className="text-xs uppercase tracking-wide text-charcoal-400">{e.selection}</div>
      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="text-xs sm:text-sm text-charcoal-500">
          {course.title} · {modeLabel}
        </span>
        <span className="font-display text-xl sm:text-2xl font-semibold text-charcoal-900">
          {formatINR(fee)}
          <span className="text-xs sm:text-sm font-normal text-charcoal-400">{t.common.perMonthShort}</span>
        </span>
      </div>
      <p className="mt-2 text-xs text-charcoal-500 leading-relaxed">{admissionNote}</p>
    </div>
  );

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
          eyebrow={e.eyebrow}
          title={e.title}
          highlight={e.highlight}
          description={e.description}
          align="center"
        />

        {submitted ? (
          // Sent: one centred card with what was booked and what happens next
          <motion.div
            ref={doneRef}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-12 max-w-2xl rounded-5xl border border-sage-200/40 bg-white/70 p-6 text-center shadow-sm backdrop-blur-sm sm:p-10 lg:mt-14 lg:p-12"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
              className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sage-100 sm:h-20 sm:w-20"
            >
              <CheckCircle2 className="h-9 w-9 text-sage-600 sm:h-11 sm:w-11" />
            </motion.span>
            <h3 className="mt-5 font-display text-2xl text-charcoal-900 sm:text-3xl">{e.doneTitle}</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-charcoal-500 sm:text-base">
              {fmt(e.doneText, { course: course.title, mode: modeLabel })}
            </p>

            <div className="mt-8">{summary}</div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="outline" size="md" onClick={() => setSubmitted(false)}>
                <UserPlus className="h-4 w-4" /> {e.enrollAnother}
              </Button>
              <Link href="/" className={buttonVariants({ size: "md" })}>
                {t.notFound.home} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="mt-12 grid gap-6 lg:mt-14 lg:grid-cols-[1fr_1.15fr] lg:items-start lg:gap-8">
            {/* Left: course + mode selection + price summary */}
            <div className="space-y-6">
              <div>
                <StepLabel step={1} title={e.step1} hint={e.step1Hint} />
                <div role="radiogroup" aria-label={e.step1} className="mt-3 space-y-3">
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
                              <span className="shrink-0 text-xs sm:text-sm font-semibold text-sage-700">{formatINR(cFee)}{t.common.perMonthShort}</span>
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
                <StepLabel step={2} title={e.step2} hint={e.step2Hint} />
                <div role="radiogroup" aria-label={e.formatLabel} className="mt-3 grid grid-cols-2 gap-3">
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
                        {m === "offline" ? t.common.offline : t.common.online}
                      </button>
                    );
                  })}
                </div>
              </div>

              {summary}
            </div>

            {/* Right: enrollment form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="rounded-5xl border border-sage-200/40 bg-white/70 p-6 sm:p-8 lg:p-10 shadow-sm backdrop-blur-sm"
            >
              <form
                className="space-y-4 sm:space-y-5"
                onSubmit={(ev) => {
                  ev.preventDefault();
                  const form = new FormData(ev.currentTarget);
                  form.set("course", course.id);
                  form.set("mode", mode);
                  startSending(async () => {
                    const { ok } = await submitEnrollment(form);
                    if (!ok) return toast.error(t.common.submitError);
                    setSubmitted(true);
                    toast.success(e.doneTitle);
                  });
                }}
              >
                <StepLabel step={3} title={e.step3} hint={e.step3Hint} />
                {/* Left empty by people; bots that fill it in are ignored */}
                <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />

                <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                  <Field name="studentName" label={e.studentName} placeholder={e.fullName} required requiredLabel={t.common.required} />
                  <Field name="studentAge" label={e.studentAge} type="number" placeholder={e.agePlaceholder} min={5} max={16} required requiredLabel={t.common.required} hint={e.ageHint} />
                </div>
                <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                  <Field name="parentName" label={e.parentName} placeholder={e.fullName} required requiredLabel={t.common.required} />
                  <Field name="mobile" label={e.mobile} type="tel" placeholder="+91 00000 00000" required requiredLabel={t.common.required} />
                </div>
                <Field name="email" label={e.email} type="email" placeholder="you@email.com" required requiredLabel={t.common.required} />
                <div>
                  <label className="mb-2 block text-xs sm:text-sm font-medium text-charcoal-700">{e.message} <span className="font-normal text-charcoal-400">{t.common.optional}</span></label>
                  <textarea
                    name="message"
                    maxLength={2000}
                    rows={4}
                    placeholder={e.messagePlaceholder}
                    className="w-full rounded-2xl border border-sage-200/50 bg-white px-4 sm:px-5 py-3 sm:py-4 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-sage-400 focus:outline-none focus:ring-1 focus:ring-sage-400/50 focus-visible:ring-2 focus-visible:ring-sage-500"
                  />
                </div>
                <Button type="submit" size="lg" disabled={sending} className="w-full justify-center h-11 sm:h-12">
                  {e.confirm} {sending ? <Dots label="Sending" /> : <Send className="h-4 w-4" />}
                </Button>
                <p className="text-center text-[11px] text-charcoal-400">{e.consent}</p>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  min,
  max,
  required,
  requiredLabel,
  hint,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder: string;
  min?: number;
  max?: number;
  required?: boolean;
  /** Screen-reader text for the * marker, in the page language */
  requiredLabel?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs sm:text-sm font-medium text-charcoal-700">
        {label}
        {required && (
          <>
            <span aria-hidden className="ml-0.5 text-red-500">*</span>
            <span className="sr-only"> {requiredLabel}</span>
          </>
        )}
      </label>
      <input
        name={name}
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

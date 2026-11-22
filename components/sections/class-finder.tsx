"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Brush,
  CalendarDays,
  Clock,
  GraduationCap,
  MonitorPlay,
  Palette,
  Pencil,
  RotateCcw,
  School,
  Smile,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatINR } from "@/lib/utils";
import { useData, useT } from "@/hooks/use-i18n";
import { fmt, type Dictionary } from "@/lib/i18n";

type Option = { value: string; label: string; hint?: string; icon: LucideIcon };
type Question = { id: "age" | "experience" | "mode"; title: string; options: Option[] };
type Answers = Partial<Record<Question["id"], string>>;

function buildQuestions(t: Dictionary["classFinder"]): Question[] {
  return [
    {
      id: "age",
      title: t.ageTitle,
      options: [
        { value: "5-8", label: t.age5to8, icon: Smile },
        { value: "9-12", label: t.age9to12, icon: Sparkles },
        { value: "13-16", label: t.age13to16, icon: Palette },
        { value: "16+", label: t.ageOver16, icon: GraduationCap },
      ],
    },
    {
      // Courses build on each other: Basic → Advanced → Pro
      id: "experience",
      title: t.experienceTitle,
      options: [
        { value: "basic", label: t.expBasic, hint: t.expBasicHint, icon: Pencil },
        { value: "advanced", label: t.expAdvanced, hint: t.expAdvancedHint, icon: Brush },
        { value: "pro", label: t.expPro, hint: t.expProHint, icon: Award },
      ],
    },
    {
      id: "mode",
      title: t.modeTitle,
      options: [
        { value: "offline", label: t.modeOffline, hint: t.modeOfflineHint, icon: School },
        { value: "online", label: t.modeOnline, hint: t.modeOnlineHint, icon: MonitorPlay },
      ],
    },
  ];
}

// From sm up the answers sit in a grid. Full class names so Tailwind can see them.
const GRID_COLS: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
};

const slide = {
  initial: { opacity: 0, x: 32 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -32 },
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
} as const;

function Result({ answers, onRestart }: { answers: Answers; onRestart: () => void }) {
  const t = useT().classFinder;
  const { courses, admissionNote } = useData();

  if (answers.age === "16+") {
    return (
      <div className="text-center">
        <span className="eyebrow justify-center">
          <span className="h-1 w-1 rounded-full bg-sage-500" />
          {t.talkEyebrow}
        </span>
        <h3 className="mt-3 font-display text-2xl font-medium text-charcoal-900 sm:text-3xl">{t.olderTitle}</h3>
        <p className="mx-auto mt-3 max-w-md text-charcoal-500">{t.olderText}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/contact" className={buttonVariants({ size: "md" })}>
            {t.contactUs} <ArrowRight className="h-4 w-4" />
          </Link>
          <button type="button" onClick={onRestart} className={buttonVariants({ size: "md", variant: "outline" })}>
            <RotateCcw className="h-4 w-4" /> {t.retake}
          </button>
        </div>
      </div>
    );
  }

  const course = courses.find((c) => c.id === answers.experience) ?? courses[0];
  const mode = answers.mode === "online" ? "online" : "offline";
  const fee = mode === "online" ? course.feeOnline : course.feeOffline;

  const facts = [
    { icon: CalendarDays, text: course.duration },
    { icon: Clock, text: course.schedule },
    { icon: Users, text: course.batchSize },
    ...(course.certificate ? [{ icon: Award, text: t.certificate }] : []),
  ];

  return (
    <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-center md:gap-8">
      <div>
        <span className="eyebrow">
          <span className="h-1 w-1 rounded-full bg-sage-500" />
          {t.pickEyebrow}
        </span>
        <motion.h3
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
          className="mt-3 font-display text-3xl font-medium text-charcoal-900 sm:text-4xl"
        >
          {course.title}
        </motion.h3>
        <p className="mt-3 text-charcoal-500">{course.description}</p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {facts.map((f) => (
            <li key={f.text} className="flex items-center gap-2 text-sm text-charcoal-700">
              <f.icon className="h-4 w-4 shrink-0 text-sage-600" />
              {f.text}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-4xl bg-sage-50 p-5 text-center sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-widest2 text-sage-600">
          {mode === "online" ? t.liveOnline : t.studio}
        </p>
        <p className="mt-2 font-display text-4xl font-medium text-charcoal-900">{formatINR(fee)}</p>
        <p className="text-sm text-charcoal-500">{t.perMonth}</p>
        <Link
          href={`/enroll?course=${course.id}&mode=${mode}`}
          className={cn(buttonVariants({ size: "md" }), "mt-5 w-full")}
        >
          {fmt(t.enrollIn, { tier: course.tierLabel })} <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={onRestart}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-500 transition-colors hover:text-sage-700"
        >
          <RotateCcw className="h-3.5 w-3.5" /> {t.retake}
        </button>
        <p className="mt-4 text-[11px] leading-relaxed text-charcoal-400">{admissionNote}</p>
      </div>
    </div>
  );
}

export default function ClassFinder() {
  const t = useT();
  const questions = buildQuestions(t.classFinder);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const advancing = useRef(false);

  const done = step >= questions.length || answers.age === "16+";
  const question = questions[Math.min(step, questions.length - 1)];
  const progress = done ? 1 : step / questions.length;

  const choose = (value: string) => {
    if (advancing.current) return; // ignore double-clicks while moving on
    advancing.current = true;
    setAnswers((a) => ({ ...a, [question.id]: value }));
    // Short pause so the chosen tile visibly lights up before moving on
    window.setTimeout(() => {
      setStep((s) => s + 1);
      advancing.current = false;
    }, 260);
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
  };

  return (
    <section id="class-finder" className="relative overflow-hidden bg-sage-50/40 py-12 sm:py-14 lg:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(34rem_24rem_at_5%_10%,rgb(var(--c-sage-200)/0.5),transparent_70%),radial-gradient(30rem_22rem_at_95%_95%,rgb(232_176_75/0.1),transparent_70%)]"
      />

      <div className="container-academy relative z-10">
        <SectionHeading
          align="center"
          eyebrow={t.classFinder.eyebrow}
          title={t.classFinder.title}
          highlight={t.classFinder.highlight}
          description={t.classFinder.description}
        />

        <div className="mx-auto mt-8 w-full max-w-5xl overflow-hidden rounded-5xl border border-sage-200/60 bg-white/80 shadow-lg shadow-sage-500/5 backdrop-blur-sm">
          {/* Progress */}
          <div className="h-1.5 bg-sage-100">
            <motion.div
              className="h-full rounded-r-full bg-gradient-to-r from-sage-400 to-sage-600"
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          <div className="p-6 sm:p-10">
            <AnimatePresence mode="wait" initial={false}>
              {done ? (
                <motion.div key="result" {...slide}>
                  <Result answers={answers} onRestart={restart} />
                </motion.div>
              ) : (
                <motion.div key={question.id} {...slide}>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-semibold uppercase tracking-widest2 text-sage-600">
                      {fmt(t.classFinder.questionOf, { n: step + 1, total: questions.length })}
                    </p>
                    {step > 0 && (
                      <button
                        type="button"
                        onClick={() => setStep((s) => s - 1)}
                        className="inline-flex items-center gap-1 text-sm font-medium text-charcoal-500 transition-colors hover:text-sage-700"
                      >
                        <ArrowLeft className="h-4 w-4" /> {t.common.back}
                      </button>
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-medium text-charcoal-900 sm:text-3xl">
                    {question.title}
                  </h3>

                  {/* Phones: a swipeable row (two answers simply share the width) */}
                  <div
                    role="radiogroup"
                    aria-label={question.title}
                    className={cn(
                      "no-scrollbar -mx-6 mt-6 flex snap-x snap-mandatory scroll-pl-6 gap-3 overflow-x-auto overflow-y-hidden px-6 py-1",
                      "sm:mx-0 sm:grid sm:snap-none sm:overflow-visible sm:px-0 sm:py-0",
                      GRID_COLS[question.options.length]
                    )}
                  >
                    {question.options.map((o) => {
                      const selected = answers[question.id] === o.value;
                      return (
                        <motion.button
                          key={o.value}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => choose(o.value)}
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.97 }}
                          className={cn(
                            "flex min-w-[42%] flex-1 shrink-0 snap-start flex-col items-center gap-2 rounded-3xl border p-4 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 sm:min-w-0 sm:p-5",
                            selected
                              ? "border-sage-500 bg-sage-100"
                              : "border-sage-200/70 bg-white hover:border-sage-400 hover:bg-sage-50"
                          )}
                        >
                          <span
                            className={cn(
                              "grid h-11 w-11 place-items-center rounded-full transition-colors",
                              selected ? "bg-sage-500 text-white" : "bg-sage-100 text-sage-700"
                            )}
                          >
                            <o.icon className="h-5 w-5" />
                          </span>
                          <span className="font-medium text-charcoal-900">{o.label}</span>
                          {o.hint && <span className="text-xs text-charcoal-500">{o.hint}</span>}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

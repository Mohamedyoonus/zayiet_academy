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
import { admissionNote, courses } from "@/lib/data";
import { cn, formatINR } from "@/lib/utils";

type Option = { value: string; label: string; hint?: string; icon: LucideIcon };
type Question = { id: "age" | "experience" | "mode"; title: string; options: Option[] };
type Answers = Partial<Record<Question["id"], string>>;

const questions: Question[] = [
  {
    id: "age",
    title: "How old is your child?",
    options: [
      { value: "5-8", label: "5 – 8 years", icon: Smile },
      { value: "9-12", label: "9 – 12 years", icon: Sparkles },
      { value: "13-16", label: "13 – 16 years", icon: Palette },
      { value: "16+", label: "Older than 16", icon: GraduationCap },
    ],
  },
  {
    // Courses build on each other: Basic → Advanced → Pro
    id: "experience",
    title: "How much art have they learned so far?",
    options: [
      { value: "basic", label: "Just starting out", hint: "No formal art classes yet", icon: Pencil },
      { value: "advanced", label: "Finished a beginner course", hint: "Comfortable with pencil & shading", icon: Brush },
      { value: "pro", label: "Finished an advanced course", hint: "Ready to build a portfolio", icon: Award },
    ],
  },
  {
    id: "mode",
    title: "Where would they like to learn?",
    options: [
      { value: "offline", label: "In our Bangalore studio", hint: "Offline, in-person classes", icon: School },
      { value: "online", label: "Live online from home", hint: "Live video classes", icon: MonitorPlay },
    ],
  },
];

// Full class names so Tailwind can see them
const GRID_COLS: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
};

const slide = {
  initial: { opacity: 0, x: 32 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -32 },
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
} as const;

function Result({ answers, onRestart }: { answers: Answers; onRestart: () => void }) {
  if (answers.age === "16+") {
    return (
      <div className="text-center">
        <span className="eyebrow justify-center">
          <span className="h-1 w-1 rounded-full bg-sage-500" />
          Let&apos;s talk
        </span>
        <h3 className="mt-3 font-display text-2xl font-medium text-charcoal-900 sm:text-3xl">
          Our courses are built for ages 5–16
        </h3>
        <p className="mx-auto mt-3 max-w-md text-charcoal-500">
          Reach out and we&apos;ll help you find a workshop or session that suits an older learner.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/contact" className={buttonVariants({ size: "md" })}>
            Contact us <ArrowRight className="h-4 w-4" />
          </Link>
          <button type="button" onClick={onRestart} className={buttonVariants({ size: "md", variant: "outline" })}>
            <RotateCcw className="h-4 w-4" /> Retake quiz
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
    ...(course.certificate ? [{ icon: Award, text: "Certificate included" }] : []),
  ];

  return (
    <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-center md:gap-8">
      <div>
        <span className="eyebrow">
          <span className="h-1 w-1 rounded-full bg-sage-500" />
          Our pick for your child
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
          {mode === "online" ? "Live online" : "Studio · Bangalore"}
        </p>
        <p className="mt-2 font-display text-4xl font-medium text-charcoal-900">{formatINR(fee)}</p>
        <p className="text-sm text-charcoal-500">per month</p>
        <Link
          href={`/enroll?course=${course.id}&mode=${mode}`}
          className={cn(buttonVariants({ size: "md" }), "mt-5 w-full")}
        >
          Enroll in {course.tier} <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={onRestart}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-500 transition-colors hover:text-sage-700"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Retake quiz
        </button>
        <p className="mt-4 text-[11px] leading-relaxed text-charcoal-400">{admissionNote}</p>
      </div>
    </div>
  );
}

export default function ClassFinder() {
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
    <section id="class-finder" className="relative overflow-hidden bg-sage-50/40 py-10 sm:py-16 lg:py-28">
      <div className="pointer-events-none absolute -left-32 top-10 h-[24rem] w-[24rem] rounded-full bg-sage-200/50 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[20rem] w-[20rem] rounded-full bg-[#E8B04B]/10 blur-[120px]" />

      <div className="container-academy relative z-10">
        <SectionHeading
          align="center"
          eyebrow="Class Finder"
          title="Not sure where to"
          highlight="start?"
          description="Answer three quick questions and we'll suggest the right course for your child."
        />

        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-5xl border border-sage-200/60 bg-white/80 shadow-lg shadow-sage-500/5 backdrop-blur-sm lg:mt-12">
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
                      Question {step + 1} of {questions.length}
                    </p>
                    {step > 0 && (
                      <button
                        type="button"
                        onClick={() => setStep((s) => s - 1)}
                        className="inline-flex items-center gap-1 text-sm font-medium text-charcoal-500 transition-colors hover:text-sage-700"
                      >
                        <ArrowLeft className="h-4 w-4" /> Back
                      </button>
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-medium text-charcoal-900 sm:text-3xl">
                    {question.title}
                  </h3>

                  <div
                    role="radiogroup"
                    aria-label={question.title}
                    className={cn("mt-6 grid gap-3", GRID_COLS[question.options.length])}
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
                            "flex flex-col items-center gap-2 rounded-3xl border p-4 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 sm:p-5",
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

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { CalendarDays, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonClass } from "@/components/admin/ui";
import { startNavigationProgress } from "@/components/admin/nav-progress";

export type DatePreset = { label: string; from: string; to: string };

// Dates travel as "YYYY-MM-DD"; the calendar works with local Date objects
const toDate = (ymd: string) => {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const toYmd = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const show = (ymd: string, withYear = true) =>
  new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", ...(withYear && { year: "numeric" }), timeZone: "UTC" }).format(
    new Date(`${ymd}T00:00:00Z`)
  );

function describe(from: string | undefined, to: string | undefined, presets: DatePreset[]) {
  const preset = presets.find((p) => p.from === from && p.to === to);
  if (preset) return preset.label;
  if (from && to) return from === to ? show(from) : `${show(from, from.slice(0, 4) !== to.slice(0, 4))} – ${show(to)}`;
  if (from) return `From ${show(from)}`;
  if (to) return `Until ${show(to)}`;
  return "All dates";
}

/**
 * One field for the date filter. It opens a panel (centred on desktop, a sheet
 * from the bottom on phones): pick the first and last day or a quick choice,
 * then press Apply.
 */
export default function DateRangeField({
  basePath,
  q,
  from,
  to,
  today,
  presets,
}: {
  basePath: string;
  /** The current search, kept when the dates change */
  q?: string;
  from?: string;
  to?: string;
  today: string;
  presets: DatePreset[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange | undefined>();
  const [month, setMonth] = useState<Date>(() => toDate(today));
  const [twoMonths, setTwoMonths] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const update = () => setTwoMonths(wide.matches);
    update();
    wide.addEventListener("change", update);
    return () => wide.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Show the month of the range's end date (with two months, as the right-hand one)
  const monthFor = (range: DateRange | undefined) => {
    const anchor = range?.to ?? range?.from ?? toDate(today);
    return new Date(anchor.getFullYear(), anchor.getMonth() - (twoMonths ? 1 : 0), 1);
  };

  const go = (nextFrom?: string, nextTo?: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (nextFrom) params.set("from", nextFrom);
    if (nextTo) params.set("to", nextTo);
    const query = params.toString();
    setOpen(false);
    startNavigationProgress();
    router.push(query ? `${basePath}?${query}` : basePath);
  };

  const openPanel = () => {
    const current = from || to ? { from: from ? toDate(from) : undefined, to: to ? toDate(to) : undefined } : undefined;
    setDraft(current);
    setMonth(monthFor(current));
    setOpen(true);
  };

  const pickPreset = (preset: DatePreset) => {
    const range = { from: toDate(preset.from), to: toDate(preset.to) };
    setDraft(range);
    setMonth(monthFor(range));
  };

  const apply = () => {
    if (!draft?.from) return go();
    const start = toYmd(draft.from);
    go(start, draft.to ? toYmd(draft.to) : start);
  };

  const active = Boolean(from || to);
  const draftFrom = draft?.from ? toYmd(draft.from) : undefined;
  const draftTo = draft?.to ? toYmd(draft.to) : draftFrom;

  return (
    <div className="flex shrink-0">
      <button
        type="button"
        onClick={openPanel}
        aria-haspopup="dialog"
        className={cn(
          buttonClass.secondary,
          "h-[42px] w-full justify-between sm:w-56",
          active && "rounded-r-none border-r-0 border-sage-500 text-sage-800"
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          <CalendarDays className="h-4 w-4 shrink-0" />
          <span className="truncate">{describe(from, to, presets)}</span>
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
      </button>
      {active && (
        <button
          type="button"
          onClick={() => go()}
          aria-label="Clear dates"
          title="Clear dates"
          className="grid h-[42px] w-10 shrink-0 place-items-center rounded-r-full border border-sage-500 bg-white text-charcoal-500 hover:text-red-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-charcoal-900/30 sm:items-center sm:p-4"
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Choose dates"
            className="flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:w-auto sm:max-w-[calc(100vw-2rem)] sm:rounded-3xl"
          >
            <div className="flex items-center justify-between border-b border-charcoal-100 px-5 py-3.5">
              <p className="font-display text-lg text-charcoal-900">Choose dates</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-full text-charcoal-500 hover:bg-charcoal-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto p-4 sm:p-5 md:flex-row md:gap-6">
              <div className="flex flex-wrap gap-1.5 md:w-36 md:flex-col md:flex-nowrap md:border-r md:border-charcoal-100 md:pr-4">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => pickPreset(preset)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-left text-sm transition-colors md:rounded-lg",
                      preset.from === draftFrom && preset.to === draftTo ? "bg-sage-100 font-medium text-sage-800" : "text-charcoal-700 hover:bg-charcoal-50"
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <DayPicker
                mode="range"
                selected={draft}
                onSelect={setDraft}
                month={month}
                onMonthChange={setMonth}
                numberOfMonths={twoMonths ? 2 : 1}
                endMonth={toDate(today)}
                disabled={{ after: toDate(today) }}
                weekStartsOn={1}
                className="mx-auto"
                style={
                  {
                    "--rdp-accent-color": "rgb(var(--c-sage-600))",
                    "--rdp-accent-background-color": "rgb(var(--c-sage-100))",
                    "--rdp-day-height": "38px",
                    "--rdp-day-width": "38px",
                    "--rdp-day_button-height": "36px",
                    "--rdp-day_button-width": "36px",
                    "--rdp-months-gap": "1.5rem",
                    fontSize: "0.875rem",
                  } as React.CSSProperties
                }
              />
            </div>

            {/* Always visible, so Apply is never off-screen */}
            <div className="flex flex-col gap-3 border-t border-charcoal-100 bg-ivory-100/60 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-charcoal-600">
                {draftFrom
                  ? draftTo && draftTo !== draftFrom
                    ? `${show(draftFrom)} – ${show(draftTo)}`
                    : `${show(draftFrom)} · tap another day for a range`
                  : "Tap the first day, then the last day."}
              </p>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setDraft(undefined)} className="mr-auto px-2 text-sm text-charcoal-500 hover:text-charcoal-800 sm:mr-0">
                  Reset
                </button>
                <button type="button" onClick={() => setOpen(false)} className={cn(buttonClass.secondary, "h-10")}>
                  Cancel
                </button>
                <button type="button" onClick={apply} className={cn(buttonClass.primary, "h-10 px-6")}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

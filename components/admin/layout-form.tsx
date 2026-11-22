"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, ExternalLink, Home, Lock } from "lucide-react";
import { saveLayout } from "@/app/admin/actions";
import SaveBar from "@/components/admin/save-bar";
import { useToast } from "@/components/admin/toast";
import { Card, Toggle } from "@/components/admin/ui";
import { HOME_SECTIONS, PAGES, type LayoutContent, type PageId } from "@/lib/site-layout";
import { cn } from "@/lib/utils";

function CardTitle({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="border-b border-charcoal-100 pb-3">
      <h2 className="font-display text-lg text-charcoal-900">{title}</h2>
      <p className="mt-0.5 text-xs text-charcoal-500">{hint}</p>
    </div>
  );
}

const iconButton =
  "grid h-8 w-8 place-items-center rounded-lg text-charcoal-500 transition-colors hover:bg-charcoal-50 hover:text-charcoal-900 disabled:pointer-events-none disabled:opacity-30";

export default function LayoutForm({ initial }: { initial: LayoutContent }) {
  const [layout, setLayout] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [saving, startSaving] = useTransition();
  const toast = useToast();
  const dirty = JSON.stringify(layout) !== JSON.stringify(saved);

  const sections = layout.homeSections;
  const setSectionVisible = (index: number, visible: boolean) =>
    setLayout((l) => ({ ...l, homeSections: l.homeSections.map((s, i) => (i === index ? { ...s, visible } : s)) }));
  // Swap with the neighbour above (-1) or below (+1); the hero (index 0) stays put
  const move = (index: number, dir: -1 | 1) =>
    setLayout((l) => {
      const next = [...l.homeSections];
      [next[index], next[index + dir]] = [next[index + dir], next[index]];
      return { ...l, homeSections: next };
    });

  const pageShown = (id: PageId) => !layout.hiddenPages.includes(id);
  const setPageShown = (id: PageId, shown: boolean) =>
    setLayout((l) => ({
      ...l,
      hiddenPages: shown ? l.hiddenPages.filter((p) => p !== id) : [...l.hiddenPages, id],
    }));

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    startSaving(async () => {
      const result = await saveLayout(layout);
      if (!result.ok) return toast.error(result.error);
      setSaved(layout);
      toast.success("Saved — the website is updated.");
    });
  };

  const hiddenSections = sections.filter((s) => !s.visible).length;

  return (
    <form onSubmit={save} className="mx-auto grid max-w-5xl gap-5 pb-24 lg:grid-cols-2 lg:items-start">
      {/* ----------------------------- Home page sections ----------------------------- */}
      <Card className="space-y-1">
        <CardTitle
          title="Home page sections"
          hint="Turn sections on or off and change their order with the arrows. The hero always stays at the top."
        />
        <ol className="divide-y divide-charcoal-100">
          {sections.map((s, i) => {
            const info = HOME_SECTIONS.find((h) => h.id === s.id)!;
            const isHero = s.id === "hero";
            return (
              <li key={s.id} className={cn("flex items-center gap-3 py-3", !s.visible && "opacity-60")}>
                <span className="w-5 shrink-0 text-center font-display text-sm tabular-nums text-charcoal-400">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-sm font-medium text-charcoal-900">
                    {info.label}
                    {isHero && <Lock className="h-3.5 w-3.5 text-charcoal-400" aria-label="Always at the top" />}
                  </p>
                  <p className="text-xs text-charcoal-500">{info.description}</p>
                </div>
                <div className="flex shrink-0 items-center">
                  <button
                    type="button"
                    aria-label={`Move ${info.label} up`}
                    disabled={isHero || i === 1}
                    onClick={() => move(i, -1)}
                    className={iconButton}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Move ${info.label} down`}
                    disabled={isHero || i === sections.length - 1}
                    onClick={() => move(i, 1)}
                    className={iconButton}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
                <Toggle on={s.visible} onChange={(on) => setSectionVisible(i, on)} label={`Show ${info.label}`} />
              </li>
            );
          })}
        </ol>
        {hiddenSections === sections.length && (
          <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Every section is hidden, so the home page will be empty.
          </p>
        )}
      </Card>

      {/* ------------------------------------ Pages ------------------------------------ */}
      <Card className="space-y-1">
        <CardTitle
          title="Pages"
          hint="A hidden page leaves the menu, the footer and the buttons that lead to it. Anyone who opens its address is sent to the home page."
        />
        <ul className="divide-y divide-charcoal-100">
          {PAGES.map((p) => {
            const shown = pageShown(p.id);
            return (
              <li key={p.id} className={cn("flex items-center gap-3 py-3", !shown && "opacity-60")}>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-charcoal-900">{p.label}</p>
                  <p className="text-xs text-charcoal-500">{p.href}</p>
                </div>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${p.label} on the website`}
                  className={iconButton}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                <Toggle on={shown} onChange={(on) => setPageShown(p.id, on)} label={`Show the ${p.label} page`} />
              </li>
            );
          })}
        </ul>
        <p className="flex items-center gap-2 pt-2 text-xs text-charcoal-500">
          <Home className="h-3.5 w-3.5 shrink-0" />
          Home, Enroll and Settings are always shown.
        </p>
      </Card>

      <SaveBar dirty={dirty} saving={saving} viewHref="/" viewLabel="View website" />
    </form>
  );
}

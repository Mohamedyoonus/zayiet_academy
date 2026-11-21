"use client";

import { useState, useTransition } from "react";
import type { HeroContent } from "@/lib/content";
import { saveHero } from "@/app/admin/actions";
import ImageUpload from "@/components/admin/image-upload";
import SaveBar from "@/components/admin/save-bar";
import { useToast } from "@/components/admin/toast";
import { Card, Field, inputClass } from "@/components/admin/ui";

export default function HeroForm({ initial }: { initial: HeroContent }) {
  // Always three stat rows, matching the layout on the home page
  const start: HeroContent = { ...initial, stats: [0, 1, 2].map((i) => initial.stats[i] ?? { value: "", label: "" }) };
  const [hero, setHero] = useState(start);
  const [saved, setSaved] = useState(start);
  const [saving, startSaving] = useTransition();
  const toast = useToast();
  const dirty = JSON.stringify(hero) !== JSON.stringify(saved);

  const set = (key: keyof HeroContent, value: string) => setHero((h) => ({ ...h, [key]: value }));
  const setStat = (index: number, key: "value" | "label", value: string) =>
    setHero((h) => ({ ...h, stats: h.stats.map((s, i) => (i === index ? { ...s, [key]: value } : s)) }));

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    startSaving(async () => {
      const result = await saveHero(hero);
      if (!result.ok) return toast.error(result.error);
      setSaved(hero);
      toast.success("Saved — the home page is updated.");
    });
  };

  return (
    <form onSubmit={save} className="grid gap-5 pb-24 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
      <Card className="space-y-4">
        <Field label="Small label above the title">
          <input value={hero.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} maxLength={80} className={inputClass} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Title — start">
            <input value={hero.titleBefore} onChange={(e) => set("titleBefore", e.target.value)} maxLength={120} className={inputClass} />
          </Field>
          <Field label="Title — highlighted" hint="Shown in green italics">
            <input value={hero.titleHighlight} onChange={(e) => set("titleHighlight", e.target.value)} maxLength={120} className={inputClass} />
          </Field>
          <Field label="Title — end">
            <input value={hero.titleAfter} onChange={(e) => set("titleAfter", e.target.value)} maxLength={120} className={inputClass} />
          </Field>
        </div>
        <div className="rounded-xl bg-ivory-100 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-400">Preview</p>
          <p className="mt-1 font-display text-lg text-charcoal-900">
            {hero.titleBefore} <span className="italic text-sage-700">{hero.titleHighlight}</span> {hero.titleAfter}
          </p>
        </div>
        <Field label="Description">
          <textarea value={hero.description} onChange={(e) => set("description", e.target.value)} rows={3} maxLength={600} className={inputClass} />
        </Field>

        <div>
          <p className="mb-1.5 text-sm font-medium text-charcoal-700">Numbers under the buttons</p>
          <div className="space-y-2">
            {hero.stats.map((stat, i) => (
              <div key={i} className="grid grid-cols-[6rem_1fr] gap-2">
                <input
                  aria-label={`Number ${i + 1}`}
                  value={stat.value}
                  onChange={(e) => setStat(i, "value", e.target.value)}
                  placeholder="1200+"
                  maxLength={20}
                  className={inputClass}
                />
                <input
                  aria-label={`Label ${i + 1}`}
                  value={stat.label}
                  onChange={(e) => setStat(i, "label", e.target.value)}
                  placeholder="Students Trained"
                  maxLength={40}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <p className="mb-3 text-sm font-medium text-charcoal-700">Photo</p>
        <ImageUpload value={hero.image} onChange={(url) => set("image", url)} folder="hero" />
      </Card>

      <SaveBar dirty={dirty} saving={saving} viewHref="/" viewLabel="View home page" />
    </form>
  );
}

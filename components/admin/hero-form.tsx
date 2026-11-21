"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import type { HeroContent } from "@/lib/content";
import { saveHero } from "@/app/admin/actions";
import ImageUpload from "@/components/admin/image-upload";
import { Card, Field, buttonClass, inputClass } from "@/components/admin/ui";

export default function HeroForm({ initial }: { initial: HeroContent }) {
  // Always three stat rows, matching the layout on the home page
  const [hero, setHero] = useState<HeroContent>({
    ...initial,
    stats: [0, 1, 2].map((i) => initial.stats[i] ?? { value: "", label: "" }),
  });
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [saving, startSaving] = useTransition();

  const set = (key: keyof HeroContent, value: string) => {
    setHero((h) => ({ ...h, [key]: value }));
    setMessage(null);
  };
  const setStat = (index: number, key: "value" | "label", value: string) => {
    setHero((h) => ({ ...h, stats: h.stats.map((s, i) => (i === index ? { ...s, [key]: value } : s)) }));
    setMessage(null);
  };

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    startSaving(async () => {
      const result = await saveHero(hero);
      setMessage(result.ok ? { ok: true, text: "Saved — the website is updated." } : { ok: false, text: result.error });
    });
  };

  return (
    <form onSubmit={save} className="grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
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
        <p className="rounded-xl bg-ivory-100 px-4 py-3 font-display text-lg text-charcoal-900">
          {hero.titleBefore} <span className="italic text-sage-700">{hero.titleHighlight}</span> {hero.titleAfter}
        </p>
        <Field label="Description">
          <textarea
            value={hero.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            maxLength={600}
            className={inputClass}
          />
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

      <div className="space-y-5">
        <Card>
          <p className="mb-3 text-sm font-medium text-charcoal-700">Photo</p>
          <ImageUpload value={hero.image} onChange={(url) => set("image", url)} folder="hero" />
        </Card>
        <Card className="space-y-3">
          <button type="submit" disabled={saving} className={`${buttonClass.primary} w-full`}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Save changes
          </button>
          {message && <p className={message.ok ? "text-sm text-emerald-700" : "text-sm text-red-600"}>{message.text}</p>}
          <a href="/" target="_blank" rel="noreferrer" className="block text-center text-sm text-sage-700 underline-offset-2 hover:underline">
            View the home page
          </a>
        </Card>
      </div>
    </form>
  );
}

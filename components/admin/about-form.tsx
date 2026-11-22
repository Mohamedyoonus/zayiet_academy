"use client";

import { useState, useTransition, type ReactNode } from "react";
import type { AboutContent } from "@/lib/content";
import { saveAbout } from "@/app/admin/actions";
import ImageUpload from "@/components/admin/image-upload";
import SaveBar from "@/components/admin/save-bar";
import { useToast } from "@/components/admin/toast";
import { Card, Field, inputClass } from "@/components/admin/ui";

type Key = keyof AboutContent;

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <Card className="space-y-4">
      <div className="border-b border-charcoal-100 pb-3">
        <h2 className="font-display text-lg text-charcoal-900">{title}</h2>
        {hint && <p className="mt-0.5 text-xs text-charcoal-500">{hint}</p>}
      </div>
      {children}
    </Card>
  );
}

export default function AboutForm({ initial }: { initial: AboutContent }) {
  const [about, setAbout] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [saving, startSaving] = useTransition();
  const toast = useToast();
  const dirty = JSON.stringify(about) !== JSON.stringify(saved);

  const set = (key: Key, value: string) => setAbout((a) => ({ ...a, [key]: value }));
  const line = (key: Key, label: string, hint?: string) => (
    <Field label={label} hint={hint}>
      <input value={about[key]} onChange={(e) => set(key, e.target.value)} maxLength={200} className={inputClass} />
    </Field>
  );
  const text = (key: Key, label: string, rows: number, hint?: string) => (
    <Field label={label} hint={hint}>
      <textarea value={about[key]} onChange={(e) => set(key, e.target.value)} rows={rows} maxLength={3000} className={inputClass} />
    </Field>
  );

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    startSaving(async () => {
      const result = await saveAbout(about);
      if (!result.ok) return toast.error(result.error);
      setSaved(about);
      toast.success("Saved — the About page is updated.");
    });
  };

  return (
    <form onSubmit={save} className="mx-auto max-w-4xl space-y-5 pb-24">
      <Section title="About Zayit Academy" hint="The top of the page: the main heading and the academy’s story.">
        {line("aboutZayitTitle", "Title")}
        {text("aboutZayitText", "Text", 6, "Leave an empty line between paragraphs. The first paragraph is shown larger.")}
        {line("aboutZayitTagline", "Tagline", "Each sentence becomes a numbered line (01, 02, 03).")}
      </Section>

      <div className="grid gap-5 md:grid-cols-2">
        <Section title="Mission">
          {line("missionTitle", "Label")}
          {line("missionTagline", "Headline")}
          {text("mission", "Text", 4)}
        </Section>
        <Section title="Vision">
          {line("visionTitle", "Label")}
          {line("visionTagline", "Headline")}
          {text("vision", "Text", 4)}
        </Section>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Section title="Founder" hint="Shown in “Our Founders”, with a small photo.">
          <ImageUpload
            value={about.photo}
            onChange={(url) => set("photo", url)}
            folder="about"
            aspect="aspect-[3/4]"
            compact
            hint="A portrait photo works best. Large photos are made smaller automatically."
          />
          {line("title", "Name")}
          {line("founderRole", "Role")}
          {line("highlight", "Line under the name")}
          {line("eyebrow", "Label above the story")}
          {text("story", "Story", 8, "Leave an empty line between paragraphs. The last paragraph is shown as a highlighted quote.")}
          {line("quoteBy", "Under the quote")}
        </Section>

        <Section title="Co-founder" hint="Shown next to the founder. Replace the [placeholders] with the real details.">
          <ImageUpload
            value={about.coFounderPhoto}
            onChange={(url) => set("coFounderPhoto", url)}
            folder="about"
            aspect="aspect-[3/4]"
            compact
            hint="Optional. Without a photo, the co-founder’s initials are shown."
          />
          {line("coFounderName", "Name")}
          {line("coFounderRole", "Role")}
          {text("coFounderBio", "Introduction", 6, "Leave an empty line between paragraphs.")}
        </Section>
      </div>

      <Section title="Closing" hint="The last part of the page, above the buttons.">
        {line("closingTitle", "Title")}
        {text("closingText", "Text", 2)}
        {line("closingSignature", "Signature line")}
      </Section>

      <SaveBar dirty={dirty} saving={saving} viewHref="/about" viewLabel="View About page" />
    </form>
  );
}

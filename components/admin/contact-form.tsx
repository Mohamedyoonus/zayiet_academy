"use client";

import { useState, useTransition, type ReactNode } from "react";
import type { ContactContent } from "@/lib/content";
import { mapEmbedUrl } from "@/lib/contact";
import { saveContact } from "@/app/admin/actions";
import SaveBar from "@/components/admin/save-bar";
import { useToast } from "@/components/admin/toast";
import { Card, Field, inputClass } from "@/components/admin/ui";

type Key = keyof ContactContent;

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

const mapQueryOf = (c: ContactContent) => c.mapQuery || c.addressValue || "Bangalore, Karnataka";

export default function ContactForm({ initial }: { initial: ContactContent }) {
  const [contact, setContact] = useState(initial);
  const [saved, setSaved] = useState(initial);
  // The map preview refreshes when you leave the field, not on every key press
  const [mapPreview, setMapPreview] = useState(mapQueryOf(initial));
  const [saving, startSaving] = useTransition();
  const toast = useToast();
  const dirty = JSON.stringify(contact) !== JSON.stringify(saved);

  const set = (key: Key, value: string) => setContact((c) => ({ ...c, [key]: value }));
  const refreshMap = () => setMapPreview(mapQueryOf(contact));
  const input = (key: Key, label: string, options: { hint?: string; placeholder?: string; type?: string } = {}) => (
    <Field label={label} hint={options.hint}>
      <input
        type={options.type ?? "text"}
        value={contact[key]}
        onChange={(e) => set(key, e.target.value)}
        onBlur={key === "mapQuery" ? refreshMap : undefined}
        placeholder={options.placeholder}
        maxLength={300}
        className={inputClass}
      />
    </Field>
  );

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    startSaving(async () => {
      const result = await saveContact(contact);
      if (!result.ok) return toast.error(result.error);
      setSaved(contact);
      toast.success("Saved — the website is updated.");
    });
  };

  return (
    <form onSubmit={save} className="grid gap-5 pb-24 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
      <div className="space-y-5">
        <Section title="Contact details" hint="Shown on the Contact page. The numbers also power the call and WhatsApp buttons on phones.">
          <div className="grid gap-4 sm:grid-cols-2">
            {input("phoneValue", "Phone number", { type: "tel", placeholder: "+91 98765 43210" })}
            {input("whatsapp", "WhatsApp number", { type: "tel", placeholder: "Same as phone", hint: "Leave empty to use the phone number." })}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {input("emailValue", "Email", { type: "email", placeholder: "hello@zayitacademy.com" })}
            {input("hoursValue", "Working hours", { placeholder: "Mon – Sat · 10 AM – 7 PM" })}
          </div>
          <Field label="Address">
            <textarea
              value={contact.addressValue}
              onChange={(e) => set("addressValue", e.target.value)}
              onBlur={refreshMap}
              rows={2}
              maxLength={600}
              className={inputClass}
            />
          </Field>
        </Section>

        <Section title="Social media" hint="Paste the full link of each page. An icon only appears on the website once its link is added.">
          {input("instagram", "Instagram", { type: "url", placeholder: "https://instagram.com/zayitacademy" })}
          {input("facebook", "Facebook", { type: "url", placeholder: "https://facebook.com/zayitacademy" })}
          {input("youtube", "YouTube", { type: "url", placeholder: "https://youtube.com/@zayitacademy" })}
        </Section>

        <Section title="Contact page heading">
          {input("eyebrow", "Small label above the title")}
          <div className="grid gap-4 sm:grid-cols-2">
            {input("title", "Title")}
            {input("highlight", "Highlighted word(s)")}
          </div>
          <Field label="Description">
            <textarea value={contact.description} onChange={(e) => set("description", e.target.value)} rows={2} maxLength={600} className={inputClass} />
          </Field>
        </Section>
      </div>

      <Section title="Map">
        {input("mapQuery", "Location on the map", {
          placeholder: "Zayit Academy, Indiranagar, Bengaluru",
          hint: "Type it as you would search on Google Maps. Leave empty to use the address.",
        })}
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-charcoal-100 bg-charcoal-50">
          <iframe title="Map preview" src={mapEmbedUrl(mapPreview)} className="absolute inset-0 h-full w-full" loading="lazy" />
        </div>
      </Section>

      <SaveBar dirty={dirty} saving={saving} viewHref="/contact" viewLabel="View Contact page" />
    </form>
  );
}

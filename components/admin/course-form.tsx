"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Trash2 } from "lucide-react";
import { slugify } from "@/lib/admin-shared";
import { deleteCourse, saveCourse, type CourseInput } from "@/app/admin/actions";
import ImageUpload from "@/components/admin/image-upload";
import { Card, Field, buttonClass, inputClass } from "@/components/admin/ui";

type TextKey = "tier" | "title" | "description" | "duration" | "schedule" | "batchSize";

export default function CourseForm({ initial, isNew }: { initial: CourseInput; isNew: boolean }) {
  const router = useRouter();
  const [course, setCourse] = useState(initial);
  const [highlights, setHighlights] = useState(initial.highlights.join("\n"));
  const [error, setError] = useState("");
  const [busy, startTransition] = useTransition();

  const update = <K extends keyof CourseInput>(key: K, value: CourseInput[K]) => {
    setCourse((c) => ({ ...c, [key]: value }));
    setError("");
  };
  const text = (key: TextKey) => ({
    value: course[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update(key, e.target.value),
  });

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    // A new course's id becomes its link (/enroll?course=…), so it's fixed once created
    const id = isNew ? slugify(course.title) || `course-${Date.now().toString(36)}` : course.id;
    startTransition(async () => {
      const result = await saveCourse({ ...course, id, highlights: highlights.split("\n") }, isNew);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/admin/classes");
      router.refresh();
    });
  };

  const remove = () => {
    if (!window.confirm(`Delete “${course.title}”? It will disappear from the website.`)) return;
    startTransition(async () => {
      const result = await deleteCourse(course.id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/admin/classes");
      router.refresh();
    });
  };

  return (
    <form onSubmit={save} className="grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
      <Card className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_10rem]">
          <Field label="Course name">
            <input required maxLength={120} placeholder="Basic Course" className={inputClass} {...text("title")} />
          </Field>
          <Field label="Level" hint="Shown on the photo">
            <input required maxLength={40} placeholder="Basic" className={inputClass} {...text("tier")} />
          </Field>
        </div>
        <Field label="Description">
          <textarea rows={3} maxLength={600} className={inputClass} {...text("description")} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Fee per month — offline (₹)">
            <input
              type="number"
              min={0}
              step={50}
              value={course.feeOffline}
              onChange={(e) => update("feeOffline", Number(e.target.value))}
              className={inputClass}
            />
          </Field>
          <Field label="Fee per month — online (₹)">
            <input
              type="number"
              min={0}
              step={50}
              value={course.feeOnline}
              onChange={(e) => update("feeOnline", Number(e.target.value))}
              className={inputClass}
            />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Duration">
            <input maxLength={60} placeholder="6 Months" className={inputClass} {...text("duration")} />
          </Field>
          <Field label="Batch size">
            <input maxLength={60} placeholder="15 Students Only" className={inputClass} {...text("batchSize")} />
          </Field>
          <Field label="Order on page" hint="1 shows first">
            <input type="number" value={course.sort} onChange={(e) => update("sort", Number(e.target.value))} className={inputClass} />
          </Field>
        </div>
        <Field label="Weekly schedule">
          <input maxLength={80} placeholder="2 classes / week · 1.5 hrs each" className={inputClass} {...text("schedule")} />
        </Field>
        <Field label="What students learn" hint="One point per line (up to 8)">
          <textarea
            rows={5}
            value={highlights}
            onChange={(e) => {
              setHighlights(e.target.value);
              setError("");
            }}
            className={inputClass}
          />
        </Field>
      </Card>

      <div className="space-y-5">
        <Card>
          <p className="mb-3 text-sm font-medium text-charcoal-700">Photo</p>
          <ImageUpload value={course.image} onChange={(url) => update("image", url)} folder="courses" aspect="aspect-[16/9]" />
        </Card>
        <Card className="space-y-3">
          <label className="flex items-center gap-3 text-sm text-charcoal-800">
            <input
              type="checkbox"
              checked={course.published}
              onChange={(e) => update("published", e.target.checked)}
              className="h-4 w-4 accent-sage-600"
            />
            Show on the website
          </label>
          <label className="flex items-center gap-3 text-sm text-charcoal-800">
            <input
              type="checkbox"
              checked={course.certificate}
              onChange={(e) => update("certificate", e.target.checked)}
              className="h-4 w-4 accent-sage-600"
            />
            Includes a certificate
          </label>
        </Card>
        <Card className="space-y-3">
          <button type="submit" disabled={busy} className={`${buttonClass.primary} w-full`}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {isNew ? "Add course" : "Save changes"}
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {!isNew && (
            <button type="button" onClick={remove} disabled={busy} className={`${buttonClass.danger} w-full`}>
              <Trash2 className="h-4 w-4" /> Delete course
            </button>
          )}
        </Card>
      </div>
    </form>
  );
}

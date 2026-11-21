"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { ArrowLeft, ArrowRight, Trash2, Upload } from "lucide-react";
import Dots from "@/components/ui/dots";
import { cn } from "@/lib/utils";
import { galleryCategories } from "@/lib/data";
import type { GalleryRow } from "@/lib/content";
import { ACCEPTED_IMAGES, uploadImage } from "@/lib/upload-image";
import { addGalleryItems, deleteGalleryItem, reorderGallery, updateGalleryItem } from "@/app/admin/actions";
import { Card, EmptyState, Field, buttonClass, inputClass } from "@/components/admin/ui";
import { useToast } from "@/components/admin/toast";
import { useConfirm } from "@/components/admin/confirm";

/** "IMG_2041.jpg" → "", "sunset-study.png" → "Sunset study" */
function titleFromFile(name: string) {
  const base = name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
  if (/^(img|dsc|pxl|whatsapp|screenshot|photo|image)\b/i.test(base) || /^\d[\d\s]*$/.test(base)) return "";
  return base.charAt(0).toUpperCase() + base.slice(1);
}

export default function GalleryManager({ items: savedItems }: { items: GalleryRow[] }) {
  const [items, setItems] = useState(savedItems);
  useEffect(() => setItems(savedItems), [savedItems]);
  const [category, setCategory] = useState<string>(galleryCategories[0]);
  const [progress, setProgress] = useState("");
  const [busy, startTransition] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const confirm = useConfirm();

  /** Shows a snackbar: the error if it failed, otherwise the success message (if any) */
  const report = (result: { ok: boolean; error?: string }, success?: string) => {
    if (!result.ok) toast.error(result.error ?? "Something went wrong.");
    else if (success) toast.success(success);
  };

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;
    const added: { title: string; category: string; image: string }[] = [];
    try {
      for (const [i, file] of files.entries()) {
        setProgress(`Uploading ${i + 1} of ${files.length}…`);
        added.push({ title: titleFromFile(file.name), category, image: await uploadImage(file, "gallery") });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    }
    if (added.length) {
      setProgress("Saving…");
      report(await addGalleryItems(added), added.length === 1 ? "Photo added to the gallery." : `${added.length} photos added to the gallery.`);
    }
    setProgress("");
  }

  const move = (index: number, step: -1 | 1) => {
    const target = index + step;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    startTransition(async () => report(await reorderGallery(next.map((item) => item.id))));
  };

  const remove = async (item: GalleryRow) => {
    const ok = await confirm({
      title: "Delete this photo?",
      message: `${item.title ? `“${item.title}” ` : "It "}will be removed from the website’s gallery.`,
    });
    if (!ok) return;
    setItems((list) => list.filter((i) => i.id !== item.id));
    startTransition(async () => report(await deleteGalleryItem(item.id), "Photo deleted."));
  };

  const edit = (id: string, patch: { title?: string; category?: string }) => {
    setItems((list) => list.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    startTransition(async () => report(await updateGalleryItem(id, patch), patch.title !== undefined ? "Title saved." : "Category saved."));
  };

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="sm:w-72">
            <Field label="Category for new photos">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                {galleryCategories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
          </div>
          <input ref={fileInput} type="file" accept={ACCEPTED_IMAGES} multiple className="hidden" onChange={upload} />
          <button type="button" disabled={Boolean(progress)} onClick={() => fileInput.current?.click()} className={buttonClass.primary}>
            {progress ? (
              <>
                {progress} <Dots label={progress} />
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" /> Upload photos
              </>
            )}
          </button>
          {busy && !progress && (
            <span className="flex items-center gap-2 text-sm text-charcoal-500 sm:mb-2.5">
              Saving <Dots label="Saving" />
            </span>
          )}
        </div>
        <p className="mt-2 text-xs text-charcoal-500">You can pick several photos at once. New photos appear first on the website.</p>
      </Card>

      {items.length === 0 ? (
        <EmptyState title="The gallery is empty">Upload photos and they’ll show in the website’s gallery.</EmptyState>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {items.map((item, index) => (
            <div key={item.id} className="overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-sm">
              <div className="relative aspect-[4/5] bg-charcoal-50">
                {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnail of any uploaded URL */}
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                <button
                  type="button"
                  aria-label="Delete photo"
                  onClick={() => remove(item)}
                  className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-red-600 shadow-sm hover:bg-white"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2 p-2.5 sm:p-3">
                <input
                  aria-label="Title"
                  defaultValue={item.title}
                  placeholder="Title (optional)"
                  maxLength={120}
                  onBlur={(e) => e.target.value.trim() !== item.title && edit(item.id, { title: e.target.value.trim() })}
                  className={cn(inputClass, "px-3 py-2")}
                />
                <select
                  aria-label="Category"
                  value={item.category}
                  onChange={(e) => edit(item.id, { category: e.target.value })}
                  className={cn(inputClass, "px-3 py-2")}
                >
                  {galleryCategories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <div className="flex justify-between">
                  <button
                    type="button"
                    aria-label="Move earlier"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                    className="grid h-8 w-8 place-items-center rounded-full text-charcoal-600 hover:bg-charcoal-50 disabled:opacity-30"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Move later"
                    disabled={index === items.length - 1}
                    onClick={() => move(index, 1)}
                    className="grid h-8 w-8 place-items-center rounded-full text-charcoal-600 hover:bg-charcoal-50 disabled:opacity-30"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

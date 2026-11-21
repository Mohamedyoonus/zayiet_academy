"use client";

import { useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ACCEPTED_IMAGES, uploadImage } from "@/lib/upload-image";
import Dots from "@/components/ui/dots";
import Skeleton from "@/components/ui/skeleton";
import { buttonClass } from "@/components/admin/ui";
import { useToast } from "@/components/admin/toast";

/**
 * Shows the current photo with a button to replace it. `compact` puts a small
 * preview beside the button (for tall portraits that would otherwise fill the page).
 */
export default function ImageUpload({
  value,
  onChange,
  folder,
  aspect = "aspect-[4/3]",
  compact = false,
  hint,
}: {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  aspect?: string;
  compact?: boolean;
  hint?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  async function pick(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      onChange(await uploadImage(file, folder));
      toast.success("Photo uploaded — remember to save.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  const preview = (
    <div className={cn("relative overflow-hidden rounded-xl border border-charcoal-100 bg-charcoal-50", aspect, compact && "w-32 shrink-0 sm:w-36")}>
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element -- admin preview of any uploaded URL
        <img src={value} alt="" className="h-full w-full object-cover object-top" />
      ) : (
        <div className="grid h-full place-items-center text-sm text-charcoal-400">No photo yet</div>
      )}
      {busy && (
        <div className="absolute inset-0 bg-white/40">
          <Skeleton className="absolute inset-0 rounded-none bg-transparent" />
          <span className="absolute inset-x-0 bottom-2 mx-auto flex w-max items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-charcoal-700 shadow-sm">
            Uploading <Dots size="sm" label="Uploading" />
          </span>
        </div>
      )}
    </div>
  );

  const button = (
    <button type="button" disabled={busy} onClick={() => input.current?.click()} className={buttonClass.secondary}>
      <ImagePlus className="h-4 w-4" /> {value ? "Change photo" : "Upload photo"}
    </button>
  );

  return (
    <div>
      <input ref={input} type="file" accept={ACCEPTED_IMAGES} className="hidden" onChange={pick} />
      {compact ? (
        <div className="flex items-center gap-4">
          {preview}
          <div className="space-y-2">
            {button}
            <p className="text-xs text-charcoal-500">{hint ?? "JPG, PNG or WebP. Large photos are made smaller automatically."}</p>
          </div>
        </div>
      ) : (
        <>
          {preview}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {button}
            {hint && <p className="text-xs text-charcoal-500">{hint}</p>}
          </div>
        </>
      )}
    </div>
  );
}

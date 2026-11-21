"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ACCEPTED_IMAGES, uploadImage } from "@/lib/upload-image";
import { buttonClass } from "@/components/admin/ui";

/** Shows the current photo with a button to replace it */
export default function ImageUpload({
  value,
  onChange,
  folder,
  aspect = "aspect-[4/3]",
}: {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  aspect?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function pick(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await uploadImage(file, folder));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className={cn("relative overflow-hidden rounded-xl border border-charcoal-100 bg-charcoal-50", aspect)}>
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin preview of any uploaded URL
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-sm text-charcoal-400">No photo yet</div>
        )}
        {busy && (
          <div className="absolute inset-0 grid place-items-center bg-white/70">
            <Loader2 className="h-6 w-6 animate-spin text-charcoal-600" />
          </div>
        )}
      </div>
      <input ref={input} type="file" accept={ACCEPTED_IMAGES} className="hidden" onChange={pick} />
      <button type="button" disabled={busy} onClick={() => input.current?.click()} className={cn(buttonClass.secondary, "mt-3")}>
        <ImagePlus className="h-4 w-4" /> {value ? "Change photo" : "Upload photo"}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

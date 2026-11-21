"use client";

import { useEffect } from "react";
import { Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import Dots from "@/components/ui/dots";
import { buttonClass } from "@/components/admin/ui";

/**
 * A bar fixed to the bottom of an edit page: shows whether there are unsaved
 * changes and keeps the Save button in reach. Put it inside the <form>.
 */
export default function SaveBar({
  dirty,
  saving,
  canSave = dirty,
  saveLabel = "Save changes",
  viewHref,
  viewLabel = "View on website",
}: {
  dirty: boolean;
  saving: boolean;
  /** Defaults to "has changes"; a new item can be saved straight away */
  canSave?: boolean;
  saveLabel?: string;
  viewHref?: string;
  viewLabel?: string;
}) {
  // Ask before leaving the page with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-charcoal-100 bg-white/95 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.15)] backdrop-blur lg:left-64">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
        <p className="flex min-w-0 items-center gap-2 text-sm">
          <span className={cn("h-2 w-2 shrink-0 rounded-full", dirty ? "bg-amber-500" : "bg-emerald-500")} />
          <span className={cn("truncate", dirty ? "font-medium text-amber-800" : "text-charcoal-500")}>
            {dirty ? "Unsaved changes" : "All changes saved"}
          </span>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          {viewHref && (
            <a href={viewHref} target="_blank" rel="noreferrer" className={cn(buttonClass.secondary, "hidden sm:inline-flex")}>
              <ExternalLink className="h-4 w-4" /> {viewLabel}
            </a>
          )}
          <button type="submit" disabled={saving || !canSave} className={buttonClass.primary}>
            {saving ? (
              <>
                Saving <Dots label="Saving" />
              </>
            ) : (
              <>
                <Check className="h-4 w-4" /> {saveLabel}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

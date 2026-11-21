"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Dots from "@/components/ui/dots";
import { inputClass } from "@/components/admin/ui";

/**
 * Search box that filters the list as you type (a moment after you stop),
 * with an ✕ to clear it. Keeps the chosen dates.
 */
export default function SearchField({ basePath, q, from, to }: { basePath: string; q?: string; from?: string; to?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(q ?? "");
  const [pending, startTransition] = useTransition();

  const go = (term: string) => {
    const params = new URLSearchParams();
    if (term) params.set("q", term);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const query = params.toString();
    startTransition(() => router.replace(query ? `${basePath}?${query}` : basePath, { scroll: false }));
  };

  // Search 350ms after the last key press
  useEffect(() => {
    const term = value.trim();
    if (term === (q ?? "")) return;
    const timer = window.setTimeout(() => go(term), 350);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `go` only reads the current props
  }, [value, q]);

  return (
    <div className="relative min-w-0 flex-1">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search name, phone or email"
        aria-label="Search"
        className={cn(inputClass, "h-[42px] pl-10 pr-16 [&::-webkit-search-cancel-button]:hidden")}
      />
      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
        {pending && <Dots size="sm" label="Searching" className="text-charcoal-400" />}
        {value && (
          <button
            type="button"
            onClick={() => {
              setValue("");
              go("");
            }}
            aria-label="Clear search"
            title="Clear search"
            className="grid h-7 w-7 place-items-center rounded-full text-charcoal-400 transition-colors hover:bg-charcoal-100 hover:text-charcoal-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

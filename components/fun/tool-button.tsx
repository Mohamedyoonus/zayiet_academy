"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ToolButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  active,
  primary,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 disabled:pointer-events-none disabled:opacity-40",
        primary
          ? "border-transparent bg-charcoal-800 text-cream hover:bg-sage-700"
          : active
            ? "border-sage-500 bg-sage-100 text-sage-800"
            : "border-charcoal-800/15 bg-white text-charcoal-700 hover:border-sage-400 hover:text-sage-700"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

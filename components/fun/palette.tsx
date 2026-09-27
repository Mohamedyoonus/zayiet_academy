"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export const PALETTE = [
  "#D9695F", "#F08A5D", "#E8B04B", "#F6D55C",
  "#93A57D", "#4F9D69", "#6B9AC4", "#3F6FB5",
  "#9B7BC4", "#E58FB5", "#A0674B", "#F5E6CC",
  "#FFFFFF", "#A6AC9A", "#5C6152", "#1C1F1A",
];

export default function Palette({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}) {
  const isCustom = !PALETTE.includes(value);

  return (
    <div className={cn("flex flex-wrap gap-2", className)} role="radiogroup" aria-label="Colors">
      {PALETTE.map((c) => {
        const selected = c === value;
        return (
          <motion.button
            key={c}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={c}
            onClick={() => onChange(c)}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            animate={{ scale: selected ? 1.15 : 1 }}
            className={cn(
              "h-8 w-8 rounded-full border border-charcoal-900/15 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 sm:h-9 sm:w-9",
              selected && "ring-2 ring-charcoal-800 ring-offset-2 ring-offset-white"
            )}
            style={{ backgroundColor: c }}
          />
        );
      })}

      {/* Custom color picker */}
      <label
        className={cn(
          "relative grid h-8 w-8 cursor-pointer place-items-center overflow-hidden rounded-full border border-charcoal-900/15 bg-[conic-gradient(#D9695F,#E8B04B,#93A57D,#6B9AC4,#9B7BC4,#D9695F)] shadow-sm sm:h-9 sm:w-9",
          isCustom && "ring-2 ring-charcoal-800 ring-offset-2 ring-offset-white"
        )}
        title="Pick any color"
      >
        <span className="grid h-5 w-5 place-items-center rounded-full bg-white/90">
          <Plus className="h-3 w-3 text-charcoal-700" />
        </span>
        <input
          type="color"
          value={isCustom ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 cursor-pointer opacity-0"
          aria-label="Custom color"
        />
      </label>
    </div>
  );
}

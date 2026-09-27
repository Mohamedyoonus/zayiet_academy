"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Paintbrush, PaintBucket } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import ColoringBook from "@/components/fun/coloring-book";
import DrawingBoard from "@/components/fun/drawing-board";
import { cn } from "@/lib/utils";

const modes = [
  { id: "color", label: "Color a picture", icon: PaintBucket },
  { id: "draw", label: "Free drawing", icon: Paintbrush },
] as const;

type Mode = (typeof modes)[number]["id"];

export default function FunZone() {
  const [mode, setMode] = useState<Mode>("color");

  return (
    <section id="fun-zone" className="relative overflow-hidden bg-ivory py-28">
      <div className="pointer-events-none absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full bg-[#E8B04B]/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-[#6B9AC4]/15 blur-[130px]" />

      <div className="container-academy relative z-10">
        <SectionHeading
          align="center"
          eyebrow="Student Fun Zone"
          title="Let's color and"
          highlight="create"
          description="Pick a picture and fill it with your favourite colors, or grab a brush and draw anything you like. Save it and show your family!"
        />

        {/* Mode switcher */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex rounded-full border border-sage-200/70 bg-white/70 p-1 shadow-sm backdrop-blur-sm">
            {modes.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                aria-pressed={mode === m.id}
                className={cn(
                  "relative isolate flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 sm:px-6",
                  mode === m.id ? "text-cream" : "text-charcoal-700 hover:text-sage-700"
                )}
              >
                {mode === m.id && (
                  <motion.span
                    layoutId="fun-mode-bubble"
                    className="absolute inset-0 -z-10 rounded-full bg-charcoal-800"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <m.icon className="h-4 w-4" />
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-6xl lg:mt-10">
          {/* Both stay mounted so switching tabs never loses a child's work */}
          <div hidden={mode !== "color"}>
            <ColoringBook />
          </div>
          <div hidden={mode !== "draw"}>
            <DrawingBoard />
          </div>
        </div>
      </div>
    </section>
  );
}

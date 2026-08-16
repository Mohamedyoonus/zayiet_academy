"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = "left",
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn("eyebrow", light && "text-sage-200")}
      >
        <span className={cn("h-1 w-1 rounded-full", light ? "bg-sage-200" : "bg-sage-500")} />
        {eyebrow}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "mt-4 font-display text-3xl font-medium leading-[1.12] tracking-tight sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl",
          light ? "text-cream" : "text-charcoal-900"
        )}
      >
        {title}{" "}
        {highlight && (
          <span className="brush-underline italic text-sage-700">
            {highlight}
            <svg viewBox="0 0 200 20" preserveAspectRatio="none" fill="none">
              <path
                d="M2 14C40 6 90 4 100 9C110 14 150 17 198 8"
                stroke="#AFBF9C"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        )}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className={cn("mt-4 text-base sm:text-lg leading-relaxed", light ? "text-cream/70" : "text-charcoal-500")}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}

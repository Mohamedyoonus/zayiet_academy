"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

const PAINT_DROPS = [
  "rgba(232,176,75,0.55)",
  "rgba(217,105,95,0.5)",
  "rgba(107,154,196,0.5)",
  "rgba(147,165,125,0.55)",
];

type Drop = { id: number; x: number; y: number; size: number; color: string };

/**
 * Colorful paint blobs that follow the cursor and fade out.
 * Call `spawn(x, y)` from a mousemove handler (coordinates relative to a
 * `relative` container) and render `trail` inside that container.
 */
export function usePaintTrail() {
  const [drops, setDrops] = useState<Drop[]>([]);
  const lastDrop = useRef({ x: -999, y: -999 });
  const dropId = useRef(0);

  // Drop a blob every ~36px of cursor travel
  const spawn = (x: number, y: number) => {
    if (Math.hypot(x - lastDrop.current.x, y - lastDrop.current.y) < 36) return;
    lastDrop.current = { x, y };
    const id = ++dropId.current;
    const drop = {
      id,
      x,
      y,
      size: 10 + Math.random() * 16,
      color: PAINT_DROPS[id % PAINT_DROPS.length],
    };
    setDrops((prev) => [...prev.slice(-20), drop]);
    window.setTimeout(() => setDrops((prev) => prev.filter((p) => p.id !== id)), 1000);
  };

  const trail = drops.map((d) => (
    <motion.span
      key={d.id}
      aria-hidden
      className="pointer-events-none absolute z-0 rounded-[45%_55%_50%_50%]"
      style={{
        left: d.x - d.size / 2,
        top: d.y - d.size / 2,
        width: d.size,
        height: d.size,
        backgroundColor: d.color,
      }}
      initial={{ scale: 0, opacity: 0.75 }}
      animate={{ scale: [0, 1.15, 1], opacity: [0.75, 0.6, 0] }}
      transition={{ duration: 1, ease: "easeOut" }}
    />
  ));

  return { spawn, trail };
}

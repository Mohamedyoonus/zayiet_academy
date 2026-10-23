"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useMotionReduced } from "@/hooks/use-settings";
import { cn } from "@/lib/utils";

const PAD = 240; // room around the button for the threads to reach into
const RANGE = 220; // px from the button where the threads start shooting out
const THREADS = 10;
const SPREAD = 2.3; // radians of the button's edge (facing the cursor) the threads grow from

// Fixed per-thread personality, so every thread moves a little differently
const THREAD_STYLE = Array.from({ length: THREADS }, (_, i) => ({
  phase: i * 1.7,
  speed: 2.4 + (i % 3) * 0.8,
  bow: 9 + (i % 4) * 5, // how far the thread curves while it writhes
  width: 1 + (i % 3) * 0.55,
  delay: i * 0.035, // threads launch one after another
}));

type Thread = { p: number; cx: number; cy: number };

/**
 * A button with a Venom-style symbiote inside: when the cursor comes near,
 * thin black threads shoot out from the button's edge, wrap onto the cursor
 * and hold it — then snap back in when the cursor escapes.
 */
export default function VenomButton({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const knotRef = useRef<SVGCircleElement>(null);
  const reduced = useMotionReduced();

  useEffect(() => {
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    const knot = knotRef.current;
    // Only for real mouse pointers; touch screens have no cursor to capture
    if (!wrap || !svg || !knot || reduced || !window.matchMedia("(pointer: fine)").matches) return;

    const threads: Thread[] = Array.from({ length: THREADS }, () => ({ p: 0, cx: 0, cy: 0 }));
    let w = 0;
    let h = 0;
    let cursor: { x: number; y: number } | null = null;
    let activeSince = -1;
    let frame = 0;
    const start = performance.now();

    const resize = () => {
      w = wrap.offsetWidth;
      h = wrap.offsetHeight;
      svg.setAttribute("width", String(w + PAD * 2));
      svg.setAttribute("height", String(h + PAD * 2));
      svg.setAttribute("viewBox", `0 0 ${w + PAD * 2} ${h + PAD * 2}`);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const tick = (now: number) => {
      const t = (now - start) / 1000;
      const center = { x: PAD + w / 2, y: PAD + h / 2 };

      // How eagerly the threads reach: 1 near the button, 0 at the edge of RANGE
      let strength = 0;
      if (cursor) {
        const dx = Math.max(PAD - cursor.x, 0, cursor.x - (PAD + w));
        const dy = Math.max(PAD - cursor.y, 0, cursor.y - (PAD + h));
        strength = Math.max(0, 1 - Math.hypot(dx, dy) / RANGE);
      }
      if (strength > 0 && activeSince < 0) activeSince = t;
      if (strength === 0) activeSince = -1;
      // Far out they only grope towards the cursor; closer in they latch on
      const reach = Math.min(1, strength * 2);
      const facing = cursor ? Math.atan2(cursor.y - center.y, cursor.x - center.x) : 0;

      let moving = false;
      let attached = 0;
      threads.forEach((thread, i) => {
        const style = THREAD_STYLE[i];
        const el = pathRefs.current[i];

        // Root: a point just inside the button's edge, fanned around the side facing the cursor
        const angle = facing + SPREAD * (i / (THREADS - 1) - 0.5);
        const root = {
          x: center.x + Math.cos(angle) * (w / 2) * 0.9,
          y: center.y + Math.sin(angle) * (h / 2) * 0.8,
        };

        // Each thread's grip trails the cursor slightly, so fast moves stretch the threads
        if (cursor) {
          if (thread.p < 0.01) {
            thread.cx = cursor.x;
            thread.cy = cursor.y;
          }
          thread.cx += (cursor.x - thread.cx) * 0.35;
          thread.cy += (cursor.y - thread.cy) * 0.35;
        }

        const launched = activeSince >= 0 && t - activeSince > style.delay;
        const target = launched ? reach : 0;
        // Shoot out quickly, snap back even faster
        thread.p += (target - thread.p) * (target > thread.p ? 0.16 : 0.24);
        if (Math.abs(target - thread.p) > 0.002) moving = true;
        if (thread.p > 0.9) attached++;

        if (!el) return;
        if (thread.p < 0.01) {
          el.setAttribute("d", "");
          return;
        }

        const end = {
          x: root.x + (thread.cx - root.x) * thread.p,
          y: root.y + (thread.cy - root.y) * thread.p,
        };
        // Bow the thread sideways (writhing), loosening as it latches on, plus a little sag
        const len = Math.hypot(end.x - root.x, end.y - root.y) || 1;
        const nx = -(end.y - root.y) / len;
        const ny = (end.x - root.x) / len;
        const bend = Math.sin(t * style.speed + style.phase) * style.bow * (1.1 - thread.p * 0.6);
        const ctrl = {
          x: (root.x + end.x) / 2 + nx * bend,
          y: (root.y + end.y) / 2 + ny * bend + len * 0.08,
        };
        el.setAttribute(
          "d",
          `M ${root.x.toFixed(1)} ${root.y.toFixed(1)} Q ${ctrl.x.toFixed(1)} ${ctrl.y.toFixed(1)} ${end.x.toFixed(1)} ${end.y.toFixed(1)}`
        );
      });

      // A small knot where the threads have caught the cursor
      const caught = attached / THREADS;
      if (caught > 0.3 && cursor) {
        const lead = threads[Math.floor(THREADS / 2)];
        knot.setAttribute("cx", lead.cx.toFixed(1));
        knot.setAttribute("cy", lead.cy.toFixed(1));
        knot.setAttribute("r", (2.5 + caught * 2 + Math.sin(t * 6) * 0.6).toFixed(1));
      } else {
        knot.setAttribute("r", "0");
      }

      // Keep animating while threads are out (they writhe) or still moving
      frame = strength > 0 || moving ? requestAnimationFrame(tick) : 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = wrap.getBoundingClientRect();
      cursor = { x: e.clientX - rect.left + PAD, y: e.clientY - rect.top + PAD };
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      cursor = null;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [reduced]);

  return (
    <div ref={wrapRef} className="relative inline-flex">
      <svg
        ref={svgRef}
        aria-hidden
        // max-w-none: the global `svg { max-width: 100% }` would squash it to the button's width
        className="pointer-events-none absolute max-w-none"
        style={{ left: -PAD, top: -PAD, filter: "drop-shadow(0 2px 2px rgb(0 0 0 / 0.18))" }}
      >
        <g className="stroke-charcoal-800" fill="none" strokeLinecap="round">
          {THREAD_STYLE.map((style, i) => (
            <path
              key={i}
              ref={(el) => {
                pathRefs.current[i] = el;
              }}
              strokeWidth={style.width}
            />
          ))}
        </g>
        <circle ref={knotRef} r={0} className="fill-charcoal-800" />
      </svg>

      <Button
        size="lg"
        onClick={onClick}
        // Stays symbiote-black on hover so the button and its threads read as one
        className={cn("relative z-10 hover:bg-charcoal-800", className)}
      >
        {children}
      </Button>
    </div>
  );
}

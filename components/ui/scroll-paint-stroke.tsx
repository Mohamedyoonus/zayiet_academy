"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";

type Geometry = { width: number; height: number; startY: number; d: string };

const CONTAINER_MAX = 1400; // matches .container-academy
const WOBBLE = 8;

/**
 * Builds a brush-stroke path that runs down the page margin beside each
 * section (skipping the hero) and swings across to the other side in the
 * padding between sections. Every joint has a vertical tangent, so the whole
 * stroke is smooth and always moves downward.
 */
function buildGeometry(wrapper: HTMLElement): Geometry | null {
  const sections = Array.from(wrapper.querySelectorAll<HTMLElement>(":scope > section")).slice(1);
  if (!sections.length) return null;

  const width = wrapper.offsetWidth;
  const height = wrapper.offsetHeight;
  // Sit in the page gutter: inside the container padding, or halfway into the empty margin on wide screens
  const gutter = Math.max(16, ((width - CONTAINER_MAX) / 2 + 32) / 2);
  const sideX = [gutter, width - gutter];

  const startY = sections[0].offsetTop + 20;
  const points: { x: number; y: number }[] = [{ x: width / 2, y: startY }];

  sections.forEach((section, i) => {
    const top = section.offsetTop + 120;
    const bottom = section.offsetTop + section.offsetHeight - 120;
    const x = sideX[i % 2];
    if (bottom <= top) {
      points.push({ x, y: section.offsetTop + section.offsetHeight / 2 });
      return;
    }
    const steps = Math.max(1, Math.round((bottom - top) / 320));
    for (let s = 0; s <= steps; s++) {
      const wobble = s % 2 === 0 ? 0 : i % 2 === 0 ? WOBBLE : -WOBBLE;
      points.push({ x: x + wobble, y: top + ((bottom - top) * s) / steps });
    }
  });

  const last = sections[sections.length - 1];
  points.push({ x: width / 2, y: last.offsetTop + last.offsetHeight - 40 });

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const k = (b.y - a.y) / 2;
    d += ` C ${a.x} ${a.y + k}, ${b.x} ${b.y - k}, ${b.x} ${b.y}`;
  }

  return { width, height, startY, d };
}

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function ScrollPaintStroke({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const samples = useRef<{ total: number; lens: number[]; ys: number[] }>({ total: 0, lens: [], ys: [] });
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const reduceMotion = useReducedMotion();

  const progress = useMotionValue(0);
  const smooth = useSpring(progress, { stiffness: 120, damping: 30, mass: 0.4 });
  const tipX = useMotionValue(0);
  const tipY = useMotionValue(0);
  const tipOpacity = useMotionValue(0);
  const { scrollY } = useScroll();

  // Re-measure whenever the page layout changes size (images loading, resizes…)
  useIsoLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const measure = () => setGeometry(buildGeometry(wrapper));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrapper);
    return () => ro.disconnect();
  }, []);

  // Keep the stroke's tip about 60% of the way down the viewport
  const update = useCallback(
    (y: number) => {
      const wrapper = wrapperRef.current;
      const { total, lens, ys } = samples.current;
      if (!wrapper || !total) return;
      const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
      const target = y + window.innerHeight * 0.6 - wrapperTop;
      let len = 0;
      if (target >= ys[ys.length - 1]) len = total;
      else if (target > ys[0]) {
        let i = 1;
        while (ys[i] < target) i++;
        const t = (target - ys[i - 1]) / (ys[i] - ys[i - 1] || 1);
        len = lens[i - 1] + t * (lens[i] - lens[i - 1]);
      }
      progress.set(len / total);
    },
    [progress]
  );

  // Sample the path so a page y-position can be turned into a length along it
  useEffect(() => {
    const path = pathRef.current;
    if (!path || !geometry) return;
    const total = path.getTotalLength();
    const lens: number[] = [];
    const ys: number[] = [];
    for (let i = 0; i <= 300; i++) {
      const len = (total * i) / 300;
      lens.push(len);
      ys.push(path.getPointAtLength(len).y);
    }
    samples.current = { total, lens, ys };
    update(window.scrollY);
  }, [geometry, update]);

  useMotionValueEvent(scrollY, "change", update);

  // Move the wet-paint blob along with the tip
  useMotionValueEvent(smooth, "change", (v) => {
    const path = pathRef.current;
    const { total } = samples.current;
    if (!path || !total) return;
    const pt = path.getPointAtLength(v * total);
    tipX.set(pt.x);
    tipY.set(pt.y);
    tipOpacity.set(v > 0.002 && v < 0.998 ? 1 : 0);
  });

  return (
    <div ref={wrapperRef} className="relative">
      {children}
      {geometry && !reduceMotion && (
        <svg
          aria-hidden
          width={geometry.width}
          height={geometry.height}
          viewBox={`0 0 ${geometry.width} ${geometry.height}`}
          className="pointer-events-none absolute left-0 top-0 z-[5] hidden lg:block"
        >
          <defs>
            <linearGradient
              id="paint-stroke-gradient"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1={geometry.startY}
              x2="0"
              y2={geometry.height}
            >
              <stop offset="0%" stopColor="#93A57D" />
              <stop offset="30%" stopColor="#E8B04B" />
              <stop offset="55%" stopColor="#D9695F" />
              <stop offset="80%" stopColor="#6B9AC4" />
              <stop offset="100%" stopColor="#93A57D" />
            </linearGradient>
          </defs>
          <motion.path
            ref={pathRef}
            d={geometry.d}
            fill="none"
            stroke="url(#paint-stroke-gradient)"
            strokeWidth={5}
            strokeLinecap="round"
            opacity={0.6}
            style={{ pathLength: smooth }}
          />
          <motion.circle r={6} cx={tipX} cy={tipY} fill="url(#paint-stroke-gradient)" style={{ opacity: tipOpacity }} />
        </svg>
      )}
    </div>
  );
}

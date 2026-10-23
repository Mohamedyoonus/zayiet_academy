"use client";

import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffectEnabled } from "@/hooks/use-settings";

type Point = { x: number; y: number };
type Geometry = { width: number; height: number; startY: number; strokeWidth: number; d: string };
type Drip = {
  id: number;
  x: number;
  y: number;
  /** Distance along the stroke where this drip hangs */
  at: number;
  length: number;
  width: number;
  fall: number;
  delay: number;
  color: string;
};
type Flick = { id: number; x: number; y: number; dx: number; fall: number; scale: number; color: string };

const CONTAINER_MAX = 1400; // matches .container-academy
const WOBBLE = 8;
const SAMPLES = 600;
const DRIP_SPACING = 90; // px of sideways-running paint between drips
const FLICK_EVERY = 260; // px of forward travel between droplets shed by the tip

// Water-drop silhouette in a 24x32 box: pointed tail on top, round belly centered at (12, 20.5)
const DROP_PATH = "M12 1 C12 1 3 13.5 3 20.5 a9 9 0 0 0 18 0 C21 13.5 12 1 12 1 Z";
const DROP_CX = 12;
const DROP_CY = 20.5;
const DROP_R = 9;
// Places a drop so its belly is centred on (x, y) at the given scale
const dropAt = (x: number, y: number, scale: number) =>
  `translate(${x - DROP_CX * scale} ${y - DROP_CY * scale}) scale(${scale})`;

// Paint colours from the top of the stroke to the bottom. Neighbouring hues
// blend cleanly, so the paint never turns muddy grey between two stops.
const STOPS: [number, [number, number, number]][] = [
  [0, [147, 165, 125]], // sage
  [0.25, [107, 154, 196]], // blue
  [0.5, [155, 123, 196]], // purple
  [0.75, [217, 105, 95]], // coral
  [1, [232, 176, 75]], // yellow
];

// Same colour the SVG gradient paints at page height y (drips and the tip
// are transformed, which would shift a userSpaceOnUse gradient, so they get solid fills)
function colorAt(y: number, g: Geometry) {
  const t = Math.min(1, Math.max(0, (y - g.startY) / Math.max(1, g.height - g.startY)));
  let i = 1;
  while (i < STOPS.length - 1 && STOPS[i][0] < t) i++;
  const [t0, c0] = STOPS[i - 1];
  const [t1, c1] = STOPS[i];
  const k = (t - t0) / (t1 - t0 || 1);
  const [r, gr, b] = c0.map((v, j) => Math.round(v + (c1[j] - v) * k));
  return `rgb(${r} ${gr} ${b})`;
}

// Stable pseudo-random numbers, so drips land in the same places after a re-measure
const seeded = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/**
 * Builds a paint path that runs down the page gutter beside each section
 * (skipping the hero) and swings across to the other side inside the padding
 * between sections. Every joint has a vertical tangent, so the whole stroke is
 * smooth and always moves downward.
 */
function buildGeometry(wrapper: HTMLElement): Geometry | null {
  const sections = Array.from(wrapper.querySelectorAll<HTMLElement>(":scope > section")).slice(1);
  if (!sections.length) return null;

  const width = wrapper.offsetWidth;
  const height = wrapper.offsetHeight;
  const small = width < 640;
  // Sit in the page gutter: inside the container padding, or halfway into the empty margin on wide screens
  const gutter = small ? 8 : Math.max(16, ((width - CONTAINER_MAX) / 2 + 32) / 2);
  const sideX = [gutter, width - gutter];

  const startY = sections[0].offsetTop + 20;
  const points: Point[] = [{ x: small ? sideX[0] : width / 2, y: startY }];

  sections.forEach((section, i) => {
    // Turn inside the section's own padding so the swings cross empty space, not content
    const style = getComputedStyle(section);
    const padTop = Math.min(120, Math.max(24, parseFloat(style.paddingTop) || 0));
    const padBottom = Math.min(120, Math.max(24, parseFloat(style.paddingBottom) || 0));
    const top = section.offsetTop + padTop;
    const bottom = section.offsetTop + section.offsetHeight - padBottom;
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

  if (!small) {
    const last = sections[sections.length - 1];
    points.push({ x: width / 2, y: last.offsetTop + last.offsetHeight - 40 });
  }

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const k = (b.y - a.y) / 2;
    d += ` C ${a.x} ${a.y + k}, ${b.x} ${b.y - k}, ${b.x} ${b.y}`;
  }

  return { width, height, startY, strokeWidth: small ? 5 : 7, d };
}

const DRIP_GROW = 1.1; // s for a drip to run to full length

/**
 * A run of paint that slides down from the stroke: wide where it leaves the
 * line, a slim neck, and a glossy bulb at the end. Once it has run, a drop
 * breaks off the bulb and falls.
 */
const PaintDrip = memo(function PaintDrip({ drip, active }: { drip: Drip; active: boolean }) {
  const { x, y, width: w } = drip;
  const bulb = w * 0.85;
  const length = useMotionValue(0);

  useEffect(() => {
    const controls = animate(
      length,
      active ? drip.length : 0,
      active
        ? { duration: DRIP_GROW, delay: drip.delay, ease: [0.22, 1, 0.36, 1] }
        : { duration: 0.25, ease: "easeIn" }
    );
    return () => controls.stop();
  }, [active, drip.length, drip.delay, length]);

  // At length 0 every shape collapses to nothing, so unreached drips stay invisible
  const stem = useTransform(length, (l) => {
    const neck = Math.min(l, w * 1.4);
    const top = w * 1.7; // flares out where it joins the line
    const tail = w * 0.38; // thins toward the heavy bulb, like real running paint
    return `M ${x - top / 2} ${y} Q ${x - w / 2} ${y} ${x - w / 2} ${y + neck} L ${x - tail} ${y + l} L ${x + tail} ${y + l} L ${x + w / 2} ${y + neck} Q ${x + w / 2} ${y} ${x + top / 2} ${y} Z`;
  });
  const bulbY = useTransform(length, (l) => y + l);
  const bulbR = useTransform(length, (l) => bulb * Math.min(1, l / (w * 2.5)));
  const shineY = useTransform(length, (l) => y + l - bulb * 0.3);
  const shineR = useTransform(bulbR, (r) => r * 0.32);
  const dropScale = (bulb * 0.9) / DROP_R;

  return (
    <g>
      <motion.path d={stem} fill={drip.color} />
      <motion.circle cx={x} cy={bulbY} r={bulbR} fill={drip.color} />
      <motion.circle cx={x - bulb * 0.35} cy={shineY} r={shineR} fill="white" opacity={0.45} />
      {/* The drop that breaks off the bulb and falls, stretching as it speeds up */}
      <motion.g
        initial={{ y: 0, opacity: 0 }}
        animate={active ? { y: [0, drip.fall], opacity: [1, 0], scaleY: [1, 1.4] } : { y: 0, opacity: 0, scaleY: 1 }}
        transition={
          active
            ? { delay: drip.delay + DRIP_GROW * 0.85, duration: 0.75, ease: [0.11, 0, 0.5, 0] }
            : { duration: 0.15 }
        }
      >
        <path d={DROP_PATH} transform={dropAt(x, y + drip.length, dropScale)} fill={drip.color} />
      </motion.g>
    </g>
  );
});

/** A droplet flung off the moving tip */
function PaintFlick({ flick }: { flick: Flick }) {
  return (
    <motion.g
      initial={{ x: 0, y: 0, opacity: 1 }}
      animate={{ x: flick.dx, y: flick.fall, opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.11, 0, 0.5, 0] }}
    >
      <path d={DROP_PATH} transform={dropAt(flick.x, flick.y, flick.scale)} fill={flick.color} />
    </motion.g>
  );
}

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function ScrollPaintStroke({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const tipRef = useRef<SVGGElement>(null);
  const tipPaintRef = useRef<SVGPathElement>(null);
  const samples = useRef<{ total: number; lens: number[]; ys: number[] }>({ total: 0, lens: [], ys: [] });
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const geometryRef = useRef<Geometry | null>(null);
  geometryRef.current = geometry;
  const enabled = useEffectEnabled("stroke");

  const [drips, setDrips] = useState<Drip[]>([]);
  const dripsRef = useRef<Drip[]>([]);
  const [reached, setReached] = useState(0); // how many drips the paint has flowed past
  const reachedRef = useRef(0);
  const [flicks, setFlicks] = useState<Flick[]>([]);
  const flickId = useRef(0);
  const lastFlickAt = useRef(0);
  const lastLen = useRef(0);

  const progress = useMotionValue(0);
  const smooth = useSpring(progress, { stiffness: 120, damping: 30, mass: 0.4 });
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

  // Sample the path (y-position → length lookup) and find where drips can hang
  useEffect(() => {
    const path = pathRef.current;
    if (!path || !geometry) return;
    const total = path.getTotalLength();
    const lens: number[] = [];
    const xs: number[] = [];
    const ys: number[] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const len = (total * i) / SAMPLES;
      const p = path.getPointAtLength(len);
      lens.push(len);
      xs.push(p.x);
      ys.push(p.y);
    }
    samples.current = { total, lens, ys };

    // Paint only drips where the stroke runs mostly sideways. Phones have
    // slimmer section padding, so their drips stay shorter.
    const reach = geometry.width < 640 ? 0.55 : 1;
    const found: Drip[] = [];
    let run = 0;
    for (let i = 1; i <= SAMPLES; i++) {
      const dx = xs[i] - xs[i - 1];
      const dy = ys[i] - ys[i - 1];
      if (Math.abs(dx) < Math.abs(dy) * 1.5) {
        run = 0;
        continue;
      }
      run += Math.hypot(dx, dy);
      if (run < DRIP_SPACING) continue;
      run = 0;
      const r1 = seeded(i);
      const r2 = seeded(i + 0.37);
      const r3 = seeded(i + 0.71);
      if (r1 < 0.2) continue; // leave natural gaps
      found.push({
        id: i,
        x: xs[i],
        y: ys[i],
        at: lens[i],
        length: (14 + r2 * 56) * reach,
        width: geometry.strokeWidth * (0.6 + r3 * 0.3),
        fall: (50 + r1 * 90) * reach,
        delay: r3 * 0.3,
        color: colorAt(ys[i], geometry),
      });
    }
    dripsRef.current = found;
    setDrips(found);
    update(window.scrollY);
    // Re-place the tip and drips right away; the spring may already be at rest
    onSmoothRef.current(smooth.get());
  }, [geometry, update, enabled, smooth]);

  useMotionValueEvent(scrollY, "change", update);

  const spawnFlick = (p: Point, g: Geometry) => {
    const id = ++flickId.current;
    const r = Math.random();
    const flick: Flick = {
      id,
      x: p.x,
      y: p.y,
      dx: (Math.random() < 0.5 ? -1 : 1) * (5 + r * 12),
      fall: 40 + Math.random() * 60,
      scale: (g.strokeWidth / DROP_R) * (0.3 + r * 0.2),
      color: colorAt(p.y, g),
    };
    setFlicks((prev) => [...prev.slice(-7), flick]);
    window.setTimeout(() => setFlicks((prev) => prev.filter((f) => f.id !== id)), 900);
  };

  // Move the water-drop tip, let drips run, and shed droplets as the paint advances
  const onSmooth = (v: number) => {
    const path = pathRef.current;
    const tip = tipRef.current;
    const g = geometryRef.current;
    const { total } = samples.current;
    if (!path || !tip || !g || !total) return;

    const len = v * total;
    const p = path.getPointAtLength(len);
    // Direction of travel along the path, so the drop's round belly leads
    let dx: number;
    let dy: number;
    if (len >= 4) {
      const q = path.getPointAtLength(len - 4);
      dx = p.x - q.x;
      dy = p.y - q.y;
    } else {
      const q = path.getPointAtLength(4);
      dx = q.x - p.x;
      dy = q.y - p.y;
    }
    const angle = (Math.atan2(-dx, dy) * 180) / Math.PI;
    // The drop stretches out when the paint runs fast
    const speed = Math.abs(smooth.getVelocity()) * total;
    const stretch = 1 + Math.min(0.5, speed / 3500);
    const s = (g.strokeWidth * 1.5) / DROP_R; // a plump drop, belly about 3× the line's width
    tip.setAttribute(
      "transform",
      `translate(${p.x} ${p.y}) rotate(${angle}) scale(${s / Math.sqrt(stretch)} ${s * stretch})`
    );
    tip.style.opacity = v > 0.002 ? "1" : "0";
    tipPaintRef.current?.setAttribute("fill", colorAt(p.y, g));

    // Drips start running once the paint has flowed past them
    const list = dripsRef.current;
    let n = 0;
    while (n < list.length && list[n].at <= len - 12) n++;
    if (n !== reachedRef.current) {
      reachedRef.current = n;
      setReached(n);
    }

    // Shed a droplet now and then while scrolling down at a normal pace
    const step = len - lastLen.current;
    lastLen.current = len;
    if (step <= 0 || step > 80) lastFlickAt.current = len;
    else if (len - lastFlickAt.current > FLICK_EVERY) {
      lastFlickAt.current = len;
      spawnFlick(p, g);
    }
  };
  const onSmoothRef = useRef(onSmooth);
  onSmoothRef.current = onSmooth;
  useMotionValueEvent(smooth, "change", onSmooth);

  return (
    <div ref={wrapperRef} className="relative">
      {children}
      {geometry && enabled && (
        <svg
          aria-hidden
          width={geometry.width}
          height={geometry.height}
          viewBox={`0 0 ${geometry.width} ${geometry.height}`}
          className="pointer-events-none absolute left-0 top-0 z-[5]"
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
              {STOPS.map(([at, [r, g, b]]) => (
                <stop key={at} offset={at} stopColor={`rgb(${r} ${g} ${b})`} />
              ))}
            </linearGradient>
          </defs>

          <g opacity={0.9}>
            {/* Wet paint line + a thin glossy highlight running along it */}
            <motion.path
              ref={pathRef}
              d={geometry.d}
              fill="none"
              stroke="url(#paint-stroke-gradient)"
              strokeWidth={geometry.strokeWidth}
              strokeLinecap="round"
              style={{ pathLength: smooth }}
            />
            <motion.path
              d={geometry.d}
              fill="none"
              stroke="white"
              strokeOpacity={0.35}
              strokeWidth={geometry.strokeWidth * 0.3}
              strokeLinecap="round"
              style={{ pathLength: smooth }}
            />

            {drips.map((d, i) => (
              <PaintDrip key={d.id} drip={d} active={i < reached} />
            ))}

            {flicks.map((f) => (
              <PaintFlick key={f.id} flick={f} />
            ))}

            {/* The water-drop tip — positioned imperatively on every frame */}
            <g ref={tipRef} style={{ opacity: 0 }}>
              <g transform={`translate(${-DROP_CX} ${-DROP_CY})`}>
                <path ref={tipPaintRef} d={DROP_PATH} />
                <ellipse cx={8.5} cy={19.5} rx={2} ry={3.6} fill="white" opacity={0.55} transform="rotate(18 8.5 19.5)" />
              </g>
            </g>
          </g>
        </svg>
      )}
    </div>
  );
}

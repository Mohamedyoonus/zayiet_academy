"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, Palette, Sparkles } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePaintTrail } from "@/hooks/use-paint-trail";
import { useSettings } from "@/hooks/use-settings";
import { useT } from "@/hooks/use-i18n";
import { useShownLink } from "@/hooks/use-content";

type Stroke = { d: string; color: string; width?: number };

type Kid = {
  name: string;
  accent: string;
  skin: string;
  hair: string;
  shirt: string;
  hairStyle: "pigtails" | "spiky" | "bun" | "side" | "curly";
  tool: "pencil" | "brush";
  toolColor: string;
  hand: { x: number; y: number };
  strokes: Stroke[];
};

const kids: Kid[] = [
  {
    name: "Aarav",
    accent: "#E8B04B",
    skin: "#C68B59",
    hair: "#2A2420",
    shirt: "#7C8B6F",
    hairStyle: "spiky",
    tool: "pencil",
    toolColor: "#E8B04B",
    hand: { x: 112, y: 206 },
    strokes: [
      { d: "M80,226 L80,202 L100,186 L120,202 L120,226 Z", color: "#C9694A" },
      { d: "M95,226 L95,213 L105,213 L105,226", color: "#8A5A3C" },
      { d: "M140,178 a10,10 0 1 0 20,0 a10,10 0 1 0 -20,0", color: "#E8B04B" },
      { d: "M150,162 L150,158 M164,178 L168,178 M136,178 L132,178 M160,168 L163,165 M140,168 L137,165", color: "#E8B04B" },
      { d: "M68,230 q6,-7 12,0 q6,-7 12,0 q6,-7 12,0 q6,-7 12,0 q6,-7 12,0 q6,-7 12,0 q6,-7 12,0 q6,-7 12,0 q6,-7 12,0", color: "#7C8B6F" },
    ],
  },
  {
    name: "Meera",
    accent: "#D9695F",
    skin: "#E0A878",
    hair: "#3B2A20",
    shirt: "#D98C7A",
    hairStyle: "pigtails",
    tool: "brush",
    toolColor: "#6B9AC4",
    hand: { x: 128, y: 200 },
    strokes: [
      { d: "M74,226 A46,46 0 0 1 166,226", color: "#D9695F", width: 6 },
      { d: "M82,226 A38,38 0 0 1 158,226", color: "#E8B04B", width: 6 },
      { d: "M90,226 A30,30 0 0 1 150,226", color: "#93A57D", width: 6 },
      { d: "M98,226 A22,22 0 0 1 142,226", color: "#6B9AC4", width: 6 },
      { d: "M66,226 q0,-9 9,-8 q3,-7 11,-3 q7,1 5,11 Z", color: "#A6AC9A", width: 3 },
    ],
  },
  {
    name: "Ishaan",
    accent: "#4E9C8F",
    skin: "#B67B52",
    hair: "#2A2420",
    shirt: "#6B9AC4",
    hairStyle: "side",
    tool: "pencil",
    toolColor: "#4E9C8F",
    hand: { x: 120, y: 208 },
    strokes: [
      // Hull, mast, sail, flag, then the waves
      { d: "M84,212 L156,212 L144,226 L96,226 Z", color: "#8A5A3C" },
      { d: "M120,212 L120,166", color: "#5B4636" },
      { d: "M123,170 L152,206 L123,206 Z", color: "#D9695F" },
      { d: "M120,166 L134,171 L120,176", color: "#E8B04B" },
      { d: "M74,234 q8,-6 16,0 q8,-6 16,0 q8,-6 16,0 q8,-6 16,0 q8,-6 16,0 q8,-6 16,0", color: "#6B9AC4", width: 3 },
    ],
  },
  {
    name: "Diya",
    accent: "#6B9AC4",
    skin: "#A86B44",
    hair: "#1C1F1A",
    shirt: "#E8B04B",
    hairStyle: "bun",
    tool: "pencil",
    toolColor: "#D9695F",
    hand: { x: 132, y: 198 },
    strokes: [
      { d: "M120,236 C117,218 123,204 120,190", color: "#5B6B4F" },
      { d: "M120,218 q-18,-3 -20,-17 q15,2 20,17", color: "#7C8B6F" },
      { d: "M120,208 q18,-3 20,-17 q-15,2 -20,17", color: "#7C8B6F" },
      {
        d: "M120,170 q8,-12 16,0 q12,6 0,14 q4,12 -10,10 q-6,10 -12,0 q-14,2 -10,-10 q-12,-8 0,-14 q8,-12 16,0",
        color: "#D9695F",
      },
      { d: "M116,180 a4,4 0 1 0 8,0 a4,4 0 1 0 -8,0", color: "#E8B04B", width: 4 },
    ],
  },
  {
    name: "Anika",
    accent: "#9B7EC4",
    skin: "#D4976A",
    hair: "#3B2A20",
    shirt: "#8E79B8",
    hairStyle: "curly",
    tool: "brush",
    toolColor: "#9B7EC4",
    hand: { x: 126, y: 202 },
    strokes: [
      // Body, left wings, right wings, spots, then the antennae
      { d: "M120,178 L120,222", color: "#3B2A20", width: 4 },
      {
        d: "M118,188 C98,164 74,176 84,194 C90,204 106,202 118,196 M118,202 C102,204 92,222 106,226 C114,228 118,216 118,206",
        color: "#9B7EC4",
        width: 4,
      },
      {
        d: "M122,188 C142,164 166,176 156,194 C150,204 134,202 122,196 M122,202 C138,204 148,222 134,226 C126,228 122,216 122,206",
        color: "#9B7EC4",
        width: 4,
      },
      { d: "M92,190 a4,4 0 1 0 8,0 a4,4 0 1 0 -8,0 M140,190 a4,4 0 1 0 8,0 a4,4 0 1 0 -8,0", color: "#E8B04B", width: 4 },
      { d: "M118,178 Q112,166 106,162 M122,178 Q128,166 134,162", color: "#3B2A20", width: 3 },
    ],
  },
];

// Hand scribble path, as offsets from the hand's resting position (used only
// for the first frame, before the strokes have been measured)
const scribbleX = [0, -16, 10, -8, 14, -4, 0];
const scribbleY = [0, 10, -6, 12, 2, -8, 0];
const SHOULDER = { x: 150, y: 138 };
// Where both hands grip the lifted board in the "show" pose
const SHOW_RIGHT = { x: 182, y: 178 };
const SHOW_LEFT = { x: 58, y: 178 };

// Drawing timeline: strokes are drawn one after another, and between them the
// pencil lifts and moves to where the next stroke starts
const STROKE_TIME = 0.6; // seconds to draw one stroke
const STROKE_GAP = 0.15; // seconds to move to the next stroke
const FIRST_STROKE = 0.25;
const strokeStart = (i: number) => FIRST_STROKE + i * (STROKE_TIME + STROKE_GAP);
/** Seconds until the kid finishes and shows off the artwork (a beat after the last stroke) */
const drawTime = (kid: Kid) => strokeStart(kid.strokes.length - 1) + STROKE_TIME + 0.25;
/** Where the tip of the pencil/brush sits, relative to the centre of the hand */
const TIP = { x: -3, y: 8 };
/** Points sampled along each stroke for the pencil to follow */
const SAMPLES = 16;

type Track = { x: number[]; y: number[]; times: number[]; duration: number };

function Hair({ kid }: { kid: Kid }) {
  const cap = "M86,82 A34,34 0 0 1 154,82 Q140,62 120,64 Q100,62 86,82 Z";
  if (kid.hairStyle === "spiky") {
    return (
      <path
        d="M86,82 A34,34 0 0 1 154,82 L148,64 L140,72 L132,58 L122,70 L112,58 L104,72 L94,64 Z"
        fill={kid.hair}
      />
    );
  }
  if (kid.hairStyle === "side") {
    // Side-swept fringe
    return (
      <path
        d="M86,84 A34,34 0 0 1 154,80 Q150,66 138,62 Q128,76 108,72 Q94,70 86,84 Z"
        fill={kid.hair}
      />
    );
  }
  if (kid.hairStyle === "curly") {
    // A cloud of curls around the top of the head
    const curls = [
      [87, 76, 10],
      [93, 62, 12],
      [106, 53, 12],
      [120, 50, 13],
      [134, 53, 12],
      [147, 62, 12],
      [153, 76, 10],
    ];
    return (
      <>
        {curls.map(([cx, cy, r]) => (
          <circle key={cx} cx={cx} cy={cy} r={r} fill={kid.hair} />
        ))}
        <path d={cap} fill={kid.hair} />
      </>
    );
  }
  if (kid.hairStyle === "bun") {
    return (
      <>
        <circle cx={120} cy={42} r={14} fill={kid.hair} />
        <path d={cap} fill={kid.hair} />
      </>
    );
  }
  return <path d={cap} fill={kid.hair} />;
}

function KidIllustration({
  kid,
  playing,
  blinkDelay,
}: {
  kid: Kid;
  playing: boolean;
  blinkDelay: number;
}) {
  const { hand } = kid;
  const doneDelay = drawTime(kid);

  // Measure every stroke once, so the pencil tip can trace exactly the line being drawn
  const strokeRefs = useRef<(SVGPathElement | null)[]>([]);
  const [track, setTrack] = useState<Track | null>(null);
  useEffect(() => {
    const x = [hand.x];
    const y = [hand.y];
    const times = [0];
    kid.strokes.forEach((_, i) => {
      const path = strokeRefs.current[i];
      if (!path) return;
      const length = path.getTotalLength();
      for (let j = 0; j <= SAMPLES; j++) {
        const point = path.getPointAtLength((length * j) / SAMPLES);
        x.push(point.x - TIP.x);
        y.push(point.y - TIP.y);
        times.push(strokeStart(i) + (STROKE_TIME * j) / SAMPLES);
      }
    });
    const duration = times[times.length - 1];
    if (duration > 0) setTrack({ x, y, times: times.map((t) => t / duration), duration });
  }, [kid, hand]);

  // Phases: idle → drawing → done (smile + show the artwork). Leaving resets to idle.
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!playing) {
      setDone(false);
      return;
    }
    const t = window.setTimeout(() => setDone(true), doneDelay * 1000);
    return () => window.clearTimeout(t);
  }, [playing, doneDelay]);
  const drawing = playing && !done;

  // The drawing hand is driven by motion values rather than the `animate` prop.
  // The site's MotionConfig skips transform animations when the device asks for
  // reduced motion, which froze the pencil while its line still drew itself.
  const handX = useMotionValue(0); // offset from the resting position
  const handY = useMotionValue(0);
  const armX = useTransform(handX, (v) => hand.x + v);
  const armY = useTransform(handY, (v) => hand.y + v);
  useEffect(() => {
    let moves: { stop: () => void }[];
    if (drawing && track) {
      // Pencil tip follows each stroke exactly as it appears
      const timing = { duration: track.duration, times: track.times, ease: "linear" } as const;
      moves = [
        animate(handX, track.x.map((v) => v - hand.x), timing),
        animate(handY, track.y.map((v) => v - hand.y), timing),
      ];
    } else if (drawing) {
      // Strokes not measured yet: a generic scribble
      const timing = { duration: 1.1, repeat: Infinity, ease: "easeInOut" } as const;
      moves = [animate(handX, scribbleX, timing), animate(handY, scribbleY, timing)];
    } else {
      // Done: grip the board's side. Idle: back to resting on the paper.
      const target = done ? SHOW_RIGHT : hand;
      const timing = { duration: 0.45, ease: "easeOut" } as const;
      moves = [animate(handX, target.x - hand.x, timing), animate(handY, target.y - hand.y, timing)];
    }
    return () => moves.forEach((move) => move.stop());
  }, [drawing, done, track, hand, handX, handY]);

  const mouth = done
    ? "M107,96 Q120,114 133,96" // big grin
    : drawing
      ? "M116,101 Q120,105 124,101" // concentrating "o"
      : "M111,98 Q120,107 129,98"; // soft smile

  return (
    <svg
      viewBox="0 0 240 260"
      // Desktop: never taller than the screen height allows, so the section fits in view
      className="h-auto w-full lg:max-h-[clamp(10rem,calc(100vh_-_550px),22rem)]"
      aria-hidden
    >
      {/* Backdrop blob */}
      <circle cx={120} cy={140} r={104} fill={kid.accent} opacity={0.14} />

      {/* Head + body: bob while drawing, happy hop when done.
          (Every moving SVG group needs an `initial`, or its movement is never applied.) */}
      <motion.g
        initial={{ y: 0 }}
        animate={drawing ? { y: [0, 2, 0] } : done ? { y: [0, -5, 0] } : { y: 0 }}
        transition={
          drawing
            ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
            : done
              ? { duration: 0.5, repeat: 1, ease: "easeOut" }
              : { duration: 0.3 }
        }
      >
        {kid.hairStyle === "pigtails" && (
          <>
            <circle cx={82} cy={96} r={12} fill={kid.hair} />
            <circle cx={158} cy={96} r={12} fill={kid.hair} />
          </>
        )}
        {/* Body */}
        <rect x={112} y={108} width={16} height={14} fill={kid.skin} />
        <path d="M82,170 Q82,124 120,118 Q158,124 158,170 Z" fill={kid.shirt} />
        {/* Ears + head */}
        <circle cx={86} cy={86} r={6} fill={kid.skin} />
        <circle cx={154} cy={86} r={6} fill={kid.skin} />
        <circle cx={120} cy={84} r={34} fill={kid.skin} />
        <Hair kid={kid} />
        {/* Cheeks */}
        <circle cx={100} cy={96} r={5} fill="#E58A7A" opacity={0.45} />
        <circle cx={140} cy={96} r={5} fill="#E58A7A" opacity={0.45} />
        {/* Eyes look down at the paper while drawing */}
        <motion.g initial={{ y: 0 }} animate={{ y: drawing ? 3 : 0 }} transition={{ duration: 0.3 }}>
          {/* Idle blink so the kids feel alive */}
          <motion.g
            initial={{ scaleY: 1 }}
            animate={{ scaleY: [1, 1, 0.1, 1] }}
            transition={{ duration: 4, times: [0, 0.92, 0.96, 1], repeat: Infinity, delay: blinkDelay }}
          >
            <circle cx={108} cy={84} r={3.5} fill="#1C1F1A" />
            <circle cx={132} cy={84} r={3.5} fill="#1C1F1A" />
          </motion.g>
        </motion.g>
        {/* Mouth: soft smile → concentrating "o" → big grin */}
        <motion.path
          fill="none"
          stroke="#7A3E2E"
          strokeWidth={2.5}
          strokeLinecap="round"
          animate={{ d: mouth }}
          transition={{ duration: 0.3 }}
        />
      </motion.g>

      {/* Drawing board — lifts up to show the finished artwork */}
      <motion.g
        initial={{ y: 0, scale: 1 }}
        animate={done ? { y: -10, scale: 1.04 } : { y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
      >
        <rect x={56} y={148} width={128} height={98} rx={6} fill="#C9A77C" />
        <rect x={62} y={154} width={116} height={86} rx={3} fill="#FFFFFF" />

        {/* Artwork strokes reveal one after another, then stay while hovered */}
        {kid.strokes.map((s, i) => (
          <motion.path
            key={i}
            ref={(el) => {
              strokeRefs.current[i] = el;
            }}
            d={s.d}
            fill="none"
            stroke={s.color}
            strokeWidth={s.width ?? 3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={playing ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={
              // Linear, so the line grows exactly in step with the pencil tip
              playing ? { duration: STROKE_TIME, delay: strokeStart(i), ease: "linear" } : { duration: 0.35 }
            }
          />
        ))}

        {/* "Done!" star sticker */}
        <motion.g
          initial={{ scale: 0, rotate: -30 }}
          animate={done ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -30 }}
          transition={done ? { type: "spring", stiffness: 320, damping: 14 } : { duration: 0.2 }}
        >
          <circle cx={186} cy={150} r={17} fill={kid.accent} />
          <path
            d="M186 139 L189 146 L197 147 L191 152 L193 160 L186 156 L179 160 L181 152 L175 147 L183 146 Z"
            fill="#FFFFFF"
          />
          <path
            d="M208 132 v8 M204 136 h8 M166 128 v6 M163 131 h6"
            stroke={kid.accent}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        </motion.g>
      </motion.g>

      {/* Left arm: rests on the board, then grips its side to hold it up */}
      <motion.line
        x1={92}
        y1={140}
        stroke={kid.shirt}
        strokeWidth={12}
        strokeLinecap="round"
        initial={{ x2: 84, y2: 156 }}
        animate={done ? { x2: SHOW_LEFT.x, y2: SHOW_LEFT.y } : { x2: 84, y2: 156 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      />
      <motion.circle
        r={7}
        fill={kid.skin}
        initial={{ cx: 84, cy: 157 }}
        animate={done ? { cx: SHOW_LEFT.x, cy: SHOW_LEFT.y } : { cx: 84, cy: 157 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      />

      {/* Drawing arm: the pencil tip traces each stroke as it appears, then the hand grips the board's other side */}
      <motion.line
        x1={SHOULDER.x}
        y1={SHOULDER.y}
        x2={armX}
        y2={armY}
        stroke={kid.shirt}
        strokeWidth={12}
        strokeLinecap="round"
      />
      <motion.g style={{ x: handX, y: handY }}>
        <g transform={`translate(${hand.x} ${hand.y})`}>
          {kid.tool === "pencil" ? (
            <>
              <line x1={-3} y1={8} x2={8} y2={-20} stroke={kid.toolColor} strokeWidth={5} strokeLinecap="round" />
              <circle cx={-3} cy={8} r={2} fill="#2A2E28" />
            </>
          ) : (
            <>
              <line x1={-2} y1={6} x2={8} y2={-22} stroke="#8A5A3C" strokeWidth={3.5} strokeLinecap="round" />
              <ellipse cx={-3} cy={9} rx={3} ry={5} fill={kid.toolColor} transform="rotate(20 -3 9)" />
            </>
          )}
          <circle r={7} fill={kid.skin} />
        </g>
      </motion.g>
    </svg>
  );
}

// Mini artworks pinned on the clothesline (40x40 viewBox)
const hangingArt = [
  { color: "#E8B04B", d: "M20 13 a7 7 0 1 0 0.01 0 M20 4 v4 M20 32 v4 M4 20 h4 M32 20 h4 M9 9 l3 3 M28 28 l3 3 M9 31 l3 -3 M28 12 l3 -3" },
  { color: "#6B9AC4", d: "M6 20 Q16 8 28 20 Q16 32 6 20 Z M28 20 L36 13 L36 27 Z M12 18 v0.5" },
  { color: "#D9695F", d: "M20 32 C 8 24 6 15 11 11 C 15 8 20 11 20 14 C 20 11 25 8 29 11 C 34 15 32 24 20 32 Z" },
  { color: "#93A57D", d: "M20 36 V24 M20 24 a10 10 0 1 1 0.01 0 M14 36 h12" },
  { color: "#D9695F", d: "M8 34 V20 L20 9 L32 20 V34 Z M17 34 V26 H23 V34" },
];

/** Which artwork hangs where along the line (t: 0 = left end, 1 = right end) */
type Hanging = { art: number; t: number; phoneHidden?: boolean };

// Phones & tablets: all five across a line above the call-to-action
const bandFrames: Hanging[] = [
  { art: 0, t: 0.08 },
  { art: 1, t: 0.27, phoneHidden: true },
  { art: 2, t: 0.5 },
  { art: 3, t: 0.73, phoneHidden: true },
  { art: 4, t: 0.92 },
];
// Desktop: a garland across the top, with art either side of the heading
const garlandFrames: Hanging[] = [
  { art: 0, t: 0.05 },
  { art: 1, t: 0.15 },
  { art: 3, t: 0.85 },
  { art: 4, t: 0.95 },
];

/** A line tied between two nails with mini artworks pegged on it. `dip` = how far (px) the middle sags. */
function Clothesline({ frames, dip, className }: { frames: Hanging[]; dip: number; className?: string }) {
  // Quadratic curve, 20px from the top at both ends
  const sag = (t: number) => 20 + 4 * dip * t * (1 - t);
  return (
    <div aria-hidden className={cn("relative", className)}>
      <svg viewBox="0 0 1000 120" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-[120px] w-full">
        <path
          d={`M0 20 Q500 ${20 + 2 * dip} 1000 20`}
          fill="none"
          stroke="#C9A77C"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* Nails the line is tied to */}
      <span className="absolute left-0 top-4 h-2 w-2 -translate-x-1/2 rounded-full bg-[#A07C55]" />
      <span className="absolute right-0 top-4 h-2 w-2 translate-x-1/2 rounded-full bg-[#A07C55]" />
      {frames.map(({ art: index, t, phoneHidden }, i) => {
        const art = hangingArt[index];
        return (
          <div
            key={index}
            className={cn("absolute -translate-x-1/2", phoneHidden && "hidden sm:block")}
            style={{ left: `${t * 100}%`, top: sag(t) - 4 }}
          >
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
            >
              <motion.div
                className="flex flex-col items-center"
                style={{ transformOrigin: "top center" }}
                animate={{ rotate: [-4, 4, -4] }}
                transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Clothespin */}
                <span className="h-3 w-1.5 rounded-sm bg-[#A07C55]" />
                <span className="-mt-0.5 grid h-14 w-12 place-items-center rounded-md border border-charcoal-900/5 bg-white shadow-md sm:h-16 sm:w-14">
                  <svg viewBox="0 0 40 40" className="h-9 w-9 sm:h-10 sm:w-10" fill="none">
                    <path d={art.d} stroke={art.color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </motion.div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

// Faint crayon scribbles scattered in the section background
const bgDoodles = [
  { className: "left-[4%] top-[18%] h-12 w-12", color: "#E8B04B", d: "M20 3 L24.5 14.5 L37 15.5 L27.5 23.5 L30.5 36 L20 29 L9.5 36 L12.5 23.5 L3 15.5 L15.5 14.5 Z" },
  { className: "right-[6%] top-[30%] h-10 w-16", color: "#6B9AC4", d: "M2 20 Q 8 8 14 20 T 26 20 T 38 20" },
  { className: "left-[8%] bottom-[14%] h-12 w-12", color: "#D9695F", d: "M20 20 a3 3 0 1 1 4 3 a7 7 0 1 1 -10 -6 a11 11 0 1 1 15 13" },
  { className: "right-[10%] bottom-[10%] h-10 w-10", color: "#93A57D", d: "M10 2 v16 M2 10 h16 M26 22 v10 M21 27 h10" },
];

// A strip of washi tape "pins" each card; tilted a little differently on each
const tapeTilt = ["-rotate-3", "rotate-2", "-rotate-2", "rotate-3", "-rotate-1"];

function KidCard({
  kid,
  index,
  playing,
  dimmed,
  onHover,
  onToggle,
}: {
  kid: Kid;
  index: number;
  playing: boolean;
  dimmed: boolean;
  onHover: () => void;
  onToggle: () => void;
}) {
  const t = useT();
  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-pressed={playing}
      onPointerEnter={(e) => e.pointerType === "mouse" && onHover()}
      onPointerUp={(e) => e.pointerType !== "mouse" && onToggle()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      animate={{ scale: playing ? 1.03 : 1, opacity: dimmed ? 0.55 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className={cn(
        // Phones & tablets: a fixed-width slide in the swipe row. Desktop: one of five grid cells.
        "relative w-[66vw] shrink-0 snap-center cursor-pointer select-none rounded-4xl border px-4 pb-4 pt-5 shadow-sm outline-none backdrop-blur-sm transition-shadow focus-visible:ring-2 focus-visible:ring-sage-400 sm:w-[42vw] md:w-[32vw] lg:w-auto lg:shrink",
        playing && "shadow-lg"
      )}
      style={{
        borderColor: `${kid.accent}40`,
        background: `linear-gradient(180deg, ${kid.accent}1c 0%, transparent 55%), rgb(255 255 255 / 0.75)`,
      }}
    >
      {/* Washi tape */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rounded-sm shadow-sm",
          tapeTilt[index % tapeTilt.length]
        )}
        style={{
          backgroundColor: `${kid.accent}b3`,
          backgroundImage: "repeating-linear-gradient(135deg, rgb(255 255 255 / 0.3) 0 5px, transparent 5px 10px)",
        }}
      />

      <KidIllustration kid={kid} playing={playing} blinkDelay={index * 1.3} />

      <h3 className="mt-2 text-center font-display text-lg font-medium text-charcoal-900">{kid.name}</h3>

      {/* "Watch me draw" while idle — turns into a progress bar that fills as the kid draws */}
      <div className="relative mx-auto mt-2 h-7 max-w-[10.5rem]">
        <motion.span
          className="absolute inset-0 flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full text-[11px] font-semibold text-white shadow-sm"
          style={{ backgroundColor: kid.accent }}
          initial={false}
          animate={playing ? { opacity: 0, scale: 0.85 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
        >
          <Sparkles className="h-3 w-3" /> {t.littleArtists.watchMeDraw}
        </motion.span>
        <motion.span
          aria-hidden
          className="absolute inset-0 flex items-center px-3"
          initial={false}
          animate={{ opacity: playing ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <span className="h-1.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: `${kid.accent}2e` }}>
            <motion.span
              className="block h-full w-full rounded-full"
              style={{ backgroundColor: kid.accent, originX: 0 }}
              initial={false}
              animate={{ scaleX: playing ? 1 : 0 }}
              transition={playing ? { duration: drawTime(kid), ease: "linear" } : { duration: 0.2 }}
            />
          </span>
        </motion.span>
      </div>
    </motion.div>
  );
}

export default function LittleArtists() {
  const [active, setActive] = useState<number | null>(null);
  const { settings } = useSettings();
  const t = useT();
  // "Try the Fun Zone" only while the admin shows that page
  const shown = useShownLink();
  // The trail itself checks the "trail" setting and reduced motion
  const { spawn, trail } = usePaintTrail();

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    spawn(e.clientX - rect.left, e.clientY - rect.top);
  };

  // Phones: the kids sit in a swipeable row. Track which card is centred (for
  // the dots), and when a swipe comes to rest on a new kid, they start drawing.
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const settled = useRef(0);
  const settleTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(settleTimer.current), []);

  const centredCard = () => {
    const el = scrollerRef.current;
    if (!el) return 0;
    const middle = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDistance = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const card = child as HTMLElement;
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - middle);
      if (distance < bestDistance) {
        best = i;
        bestDistance = distance;
      }
    });
    return best;
  };

  const handleScroll = () => {
    setCurrent(centredCard());
    window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => {
      const i = centredCard();
      if (i !== settled.current) {
        settled.current = i;
        setActive(i);
      }
    }, 140);
  };

  /** Slides a card to the middle of the row (does nothing once it's a grid) */
  const scrollToCard = (i: number) => {
    const el = scrollerRef.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (!el || !card || el.scrollWidth <= el.clientWidth) return;
    el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2, behavior: "smooth" });
  };

  return (
    <section
      id="little-artists"
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden bg-ivory py-12 sm:py-14 lg:pb-10 lg:pt-14"
    >
      {/* Paint trail — sits behind the content */}
      {trail}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(36rem_26rem_at_95%_10%,rgb(var(--c-sage-200)/0.4),transparent_70%),radial-gradient(30rem_22rem_at_5%_95%,rgb(232_176_75/0.1),transparent_70%)]"
      />

      {settings.effects.doodles && bgDoodles.map((d, i) => (
        <motion.svg
          key={i}
          aria-hidden
          viewBox="0 0 40 40"
          fill="none"
          className={cn("pointer-events-none absolute hidden opacity-40 md:block", d.className)}
          animate={{ y: [0, -8, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 7 + i, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d={d.d} stroke={d.color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      ))}

      <div className="container-academy relative z-10">
        {/* Desktop: the clothesline hangs across the top, its art either side of the heading */}
        <div className="pointer-events-none absolute inset-x-8 -top-12 hidden lg:block xl:inset-x-10">
          <Clothesline frames={garlandFrames} dip={14} className="h-[120px]" />
        </div>

        <SectionHeading
          align="center"
          eyebrow={t.littleArtists.eyebrow}
          title={t.littleArtists.title}
          highlight={t.littleArtists.highlight}
          description={t.littleArtists.description}
        />

        {/* One simple column on every screen: heading → kids → call-to-action.
            Desktop: all five kids side by side across the full width, never taller than
            the screen allows. Phones & tablets: a swipeable row, the middle card centred. */}
        <div className="mt-4 w-full min-w-0 sm:mt-8 lg:mt-6">
          <div
            ref={scrollerRef}
            onScroll={handleScroll}
            onMouseLeave={() => setActive(null)}
            className="no-scrollbar relative -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden px-[17vw] py-5 sm:-mx-5 sm:px-[29vw] md:-mx-6 md:px-[34vw] lg:mx-0 lg:grid lg:snap-none lg:grid-cols-5 lg:overflow-visible lg:px-0 lg:pb-0 lg:pt-3 xl:gap-5"
          >
            {kids.map((kid, i) => {
              const playing = active === i;
              return (
                <KidCard
                  key={kid.name}
                  kid={kid}
                  index={i}
                  playing={playing}
                  dimmed={active !== null && !playing}
                  onHover={() => setActive(i)}
                  onToggle={() => {
                    setActive(playing ? null : i);
                    scrollToCard(i);
                  }}
                />
              );
            })}
          </div>

          {/* Phones & tablets: which kid is showing, and a nudge to swipe */}
          <div className="flex flex-col items-center gap-1 lg:hidden">
            <div className="flex">
              {kids.map((kid, i) => (
                <button
                  key={kid.name}
                  type="button"
                  aria-label={kid.name}
                  aria-current={current === i}
                  onClick={() => scrollToCard(i)}
                  className="p-1.5"
                >
                  <span
                    className={cn(
                      "block h-2 rounded-full transition-all duration-300",
                      current === i ? "w-6" : "w-2 bg-charcoal-900/15"
                    )}
                    style={current === i ? { backgroundColor: kid.accent } : undefined}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-charcoal-500">{t.littleArtists.swipeHint}</p>
          </div>
        </div>

        {/* Phones & tablets: the clothesline sits above the call-to-action */}
        <Clothesline frames={bandFrames} dip={35} className="mx-auto mt-6 h-[122px] max-w-4xl sm:h-[132px] lg:hidden" />

        {/* Nudge parents toward enrolling — one line on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mt-1 flex flex-col items-center gap-4 text-center lg:mt-6 lg:flex-row lg:justify-center lg:gap-6"
        >
          <p className="text-balance font-display text-lg italic text-charcoal-700 sm:text-xl">
            {t.littleArtists.cta}
          </p>
          {/* Phones: the two buttons share one row */}
          <div className="flex w-full gap-2 sm:w-auto sm:flex-wrap sm:justify-center sm:gap-3">
            <Link
              href="/enroll"
              className={cn(
                buttonVariants({ size: "md" }),
                "min-w-0 flex-1 gap-1.5 whitespace-nowrap px-3 text-[13px] sm:flex-none sm:gap-2 sm:px-6 sm:text-sm"
              )}
            >
              {t.littleArtists.enrollChild} <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
            {shown("/fun-zone") && (
              <Link
                href="/fun-zone"
                className={cn(
                  buttonVariants({ size: "md", variant: "outline" }),
                  "min-w-0 flex-1 gap-1.5 whitespace-nowrap px-3 text-[13px] sm:flex-none sm:gap-2 sm:px-6 sm:text-sm"
                )}
              >
                <Palette className="h-4 w-4 shrink-0" /> {t.littleArtists.tryFunZone}
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

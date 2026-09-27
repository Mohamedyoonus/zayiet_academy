"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Palette, Sparkles } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePaintTrail } from "@/hooks/use-paint-trail";

type Stroke = { d: string; color: string; width?: number };

type Kid = {
  name: string;
  activity: string;
  accent: string;
  skin: string;
  hair: string;
  shirt: string;
  hairStyle: "pigtails" | "spiky" | "bun";
  tool: "pencil" | "brush";
  toolColor: string;
  hand: { x: number; y: number };
  strokes: Stroke[];
};

const kids: Kid[] = [
  {
    name: "Aarav",
    activity: "Sketching a home",
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
    activity: "Painting a rainbow",
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
    name: "Diya",
    activity: "Drawing a flower",
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
];

// Hand scribble path, as offsets from the hand's resting position
const scribbleX = [0, -16, 10, -8, 14, -4, 0];
const scribbleY = [0, 10, -6, 12, 2, -8, 0];
const SHOULDER = { x: 150, y: 138 };

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
  // Last stroke finishes at 0.15 + (n - 1) * 0.6 + 0.8
  const doneDelay = 0.35 + kid.strokes.length * 0.6;

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

  // Where both hands grip the lifted board in the "show" pose
  const showRight = { x: 182, y: 178 };
  const showLeft = { x: 58, y: 178 };

  const mouth = done
    ? "M107,96 Q120,114 133,96" // big grin
    : drawing
      ? "M116,101 Q120,105 124,101" // concentrating "o"
      : "M111,98 Q120,107 129,98"; // soft smile

  return (
    <svg viewBox="0 0 240 260" className="h-auto w-full" aria-hidden>
      {/* Backdrop blob */}
      <circle cx={120} cy={140} r={104} fill={kid.accent} opacity={0.14} />

      {/* Head + body: bob while drawing, happy hop when done */}
      <motion.g
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
        <motion.g animate={{ y: drawing ? 3 : 0 }} transition={{ duration: 0.3 }}>
          {/* Idle blink so the kids feel alive */}
          <motion.g
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
        animate={done ? { y: -10, scale: 1.04 } : { y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
      >
        <rect x={56} y={148} width={128} height={98} rx={6} fill="#C9A77C" />
        <rect x={62} y={154} width={116} height={86} rx={3} fill="#FFFFFF" />

        {/* Artwork strokes reveal one after another, then stay while hovered */}
        {kid.strokes.map((s, i) => (
          <motion.path
            key={i}
            d={s.d}
            fill="none"
            stroke={s.color}
            strokeWidth={s.width ?? 3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={playing ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={
              playing
                ? { duration: 0.8, delay: 0.15 + i * 0.6, ease: "easeInOut" }
                : { duration: 0.35 }
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
        animate={done ? { x2: showLeft.x, y2: showLeft.y } : { x2: 84, y2: 156 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      />
      <motion.circle
        r={7}
        fill={kid.skin}
        initial={{ cx: 84, cy: 157 }}
        animate={done ? { cx: showLeft.x, cy: showLeft.y } : { cx: 84, cy: 157 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      />

      {/* Drawing arm: scribbles while drawing, then grips the board's other side */}
      <motion.line
        x1={SHOULDER.x}
        y1={SHOULDER.y}
        stroke={kid.shirt}
        strokeWidth={12}
        strokeLinecap="round"
        initial={{ x2: hand.x, y2: hand.y }}
        animate={
          drawing
            ? { x2: scribbleX.map((d) => hand.x + d), y2: scribbleY.map((d) => hand.y + d) }
            : done
              ? { x2: showRight.x, y2: showRight.y }
              : { x2: hand.x, y2: hand.y }
        }
        transition={drawing ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" } : { duration: 0.45, ease: "easeOut" }}
      />
      <motion.g
        animate={
          drawing
            ? { x: scribbleX, y: scribbleY }
            : done
              ? { x: showRight.x - hand.x, y: showRight.y - hand.y }
              : { x: 0, y: 0 }
        }
        transition={drawing ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" } : { duration: 0.45, ease: "easeOut" }}
      >
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
  { t: 0.08, color: "#E8B04B", d: "M20 13 a7 7 0 1 0 0.01 0 M20 4 v4 M20 32 v4 M4 20 h4 M32 20 h4 M9 9 l3 3 M28 28 l3 3 M9 31 l3 -3 M28 12 l3 -3" },
  { t: 0.27, color: "#6B9AC4", d: "M6 20 Q16 8 28 20 Q16 32 6 20 Z M28 20 L36 13 L36 27 Z M12 18 v0.5" },
  { t: 0.5, color: "#D9695F", d: "M20 32 C 8 24 6 15 11 11 C 15 8 20 11 20 14 C 20 11 25 8 29 11 C 34 15 32 24 20 32 Z" },
  { t: 0.73, color: "#93A57D", d: "M20 36 V24 M20 24 a10 10 0 1 1 0.01 0 M14 36 h12" },
  { t: 0.92, color: "#D9695F", d: "M8 34 V20 L20 9 L32 20 V34 Z M17 34 V26 H23 V34" },
];

// y of the sagging line: quadratic M0 20 Q500 120 1000 20 (dips to 70 at the middle)
const sag = (t: number) => 20 + 200 * t * (1 - t);

function Clothesline() {
  return (
    <div aria-hidden className="relative mx-auto mt-8 h-[140px] max-w-3xl sm:h-[150px]">
      <svg viewBox="0 0 1000 120" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-[120px] w-full">
        <path d="M0 20 Q500 120 1000 20" fill="none" stroke="#C9A77C" strokeWidth={2} vectorEffect="non-scaling-stroke" />
      </svg>
      {hangingArt.map((art, i) => (
        <div
          key={i}
          className={cn("absolute -translate-x-1/2", (i === 1 || i === 3) && "hidden sm:block")}
          style={{ left: `${art.t * 100}%`, top: sag(art.t) - 4 }}
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
      ))}
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

export default function LittleArtists() {
  const [active, setActive] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const { spawn, trail } = usePaintTrail();

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    spawn(e.clientX - rect.left, e.clientY - rect.top);
  };

  return (
    <section
      id="little-artists"
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden bg-ivory py-10 sm:py-16 lg:py-28"
    >
      {/* Paint trail — sits behind the content */}
      {trail}

      <div className="pointer-events-none absolute -right-32 top-10 h-[24rem] w-[24rem] rounded-full bg-sage-200/40 blur-[120px]" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-[20rem] w-[20rem] rounded-full bg-[#E8B04B]/10 blur-[120px]" />

      {bgDoodles.map((d, i) => (
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
        <SectionHeading
          align="center"
          eyebrow="Little Artists"
          title="Every child is an"
          highlight="artist"
          description="Hover over our little artists and watch their ideas come to life."
        />

        <Clothesline />

        <div
          className="mx-auto mt-6 grid max-w-[16rem] grid-cols-1 gap-5 sm:max-w-3xl sm:grid-cols-3 lg:gap-6"
          onMouseLeave={() => setActive(null)}
        >
          {kids.map((kid, i) => {
            const playing = active === i;
            const dimmed = active !== null && !playing;
            return (
              <motion.div
                key={kid.name}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                onPointerUp={(e) => e.pointerType !== "mouse" && setActive(playing ? null : i)}
                animate={{ scale: playing ? 1.03 : 1, opacity: dimmed ? 0.55 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                className={cn(
                  "relative cursor-pointer select-none rounded-4xl border bg-white/70 p-4 shadow-sm backdrop-blur-sm transition-shadow",
                  playing && "shadow-lg"
                )}
                style={{ borderColor: `${kid.accent}40` }}
              >
                {/* Hint pill — hides while the kid is drawing */}
                <span className="pointer-events-none absolute inset-x-0 top-3 z-10 flex justify-center">
                  <motion.span
                    className="flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm"
                    style={{ backgroundColor: kid.accent }}
                    animate={playing ? { opacity: 0, y: -4 } : { opacity: 1, y: [0, -3, 0] }}
                    transition={
                      playing
                        ? { duration: 0.2 }
                        : { y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }, opacity: { duration: 0.3 } }
                    }
                  >
                    <Sparkles className="h-3 w-3" /> Watch me draw
                  </motion.span>
                </span>

                <KidIllustration kid={kid} playing={playing} blinkDelay={i * 1.3} />
                <div className="mt-3 text-center">
                  <h3 className="font-display text-lg font-medium text-charcoal-900">{kid.name}</h3>
                  <p className="mt-1 text-sm" style={{ color: kid.accent }}>
                    {kid.activity}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Nudge parents toward enrolling */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mt-10 flex flex-col items-center gap-4 text-center lg:mt-12"
        >
          <p className="font-display text-lg italic text-charcoal-700 sm:text-xl">
            Your little one could be our next artist.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/enroll" className={buttonVariants({ size: "md" })}>
              Enroll your child <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/fun-zone" className={buttonVariants({ size: "md", variant: "outline" })}>
              <Palette className="h-4 w-4" /> Try the Fun Zone
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

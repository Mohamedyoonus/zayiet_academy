"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePaintTrail } from "@/hooks/use-paint-trail";

const ease = [0.16, 1, 0.3, 1] as const;

// Crayon palette shared by the doodles and paint trail
const CRAYON = {
  yellow: "#E8B04B",
  coral: "#D9695F",
  blue: "#6B9AC4",
  sage: "#93A57D",
};

// A hand-drawn doodle that "draws itself" on load, then floats gently.
function Doodle({
  d,
  color,
  className,
  delay = 0,
  viewBox = "0 0 40 40",
  strokeWidth = 2.5,
}: {
  d: string;
  color: string;
  className?: string;
  delay?: number;
  viewBox?: string;
  strokeWidth?: number;
}) {
  return (
    <motion.svg
      aria-hidden
      viewBox={viewBox}
      fill="none"
      className={cn("pointer-events-none absolute", className)}
      animate={{ y: [0, -5, 0], rotate: [0, 4, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <motion.path
        d={d}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.1, delay: 0.6 + delay, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}


const stats = [
  ["1200+", "Students Trained"],
  ["9+", "Years of Teaching"],
  ["18", "Awards Won"],
];

// Shared spring feel for every parallax layer — quick but never jittery.
const PARALLAX_SPRING = { stiffness: 120, damping: 22, mass: 0.5 };

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const [parallaxEnabled, setParallaxEnabled] = useState(false);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    setParallaxEnabled(isFinePointer && !prefersReducedMotion);
  }, [prefersReducedMotion]);

  // Normalized cursor position relative to the hero: -1 (top/left) to 1 (bottom/right).
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  // Raw pixel position, used only to place the cursor-light glow.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  // 0 -> 1 while the cursor is inside the hero, drives hover-only effects.
  const hoverMV = useMotionValue(0);

  const springX = useSpring(mouseX, PARALLAX_SPRING);
  const springY = useSpring(mouseY, PARALLAX_SPRING);
  const springRawX = useSpring(rawX, PARALLAX_SPRING);
  const springRawY = useSpring(rawY, PARALLAX_SPRING);
  const hoverSpring = useSpring(hoverMV, PARALLAX_SPRING);

  // Layer 1 — background atmosphere: barely moves.
  const bgX = useTransform(springX, (v) => v * 3);
  const bgY = useTransform(springY, (v) => v * 2);
  const bgScale = useTransform(hoverSpring, [0, 1], [1, 1.02]);

  // Layer 2 — text composition: a light drift for cohesion.
  const textX = useTransform(springX, (v) => v * 4);
  const textY = useTransform(springY, (v) => v * 3);

  // Layer 3 — the artwork itself: the strongest, most deliberate move.
  const imgX = useTransform(springX, (v) => v * 12);
  const imgY = useTransform(springY, (v) => v * 8);
  const imgRotateY = useTransform(springX, (v) => v * 1.5);
  const imgRotateX = useTransform(springY, (v) => v * -1.5);

  // Layer 4/5 — small decorative accents: most reactive of all.
  const decorAX = useTransform(springX, (v) => v * 18);
  const decorAY = useTransform(springY, (v) => v * 12);
  const decorARotate = useTransform(springX, (v) => v * 4);
  const decorBX = useTransform(springX, (v) => v * -10);
  const decorBY = useTransform(springY, (v) => v * -7);

  // Soft cursor-following light.
  const lightX = useTransform(springRawX, (v) => v - 210);
  const lightY = useTransform(springRawY, (v) => v - 210);
  const lightOpacity = useTransform(hoverSpring, [0, 1], [0, 1]);

  const { spawn: spawnDrop, trail } = usePaintTrail();

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!parallaxEnabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    mouseX.set((px / rect.width) * 2 - 1);
    mouseY.set((py / rect.height) * 2 - 1);
    rawX.set(px);
    rawY.set(py);
    spawnDrop(px, py);
  };

  const handlePointerEnter = () => {
    if (parallaxEnabled) hoverMV.set(1);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    hoverMV.set(0);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
      className="
        relative
        overflow-hidden
        bg-cream

        pt-[76px]

        lg:h-screen
        lg:pt-[84px]
      "
    >
      {/* =====================================================
          BACKGROUND GLOW
      ====================================================== */}

      <motion.div
        aria-hidden
        style={{ x: bgX, y: bgY, scale: bgScale }}
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="
            absolute
            -left-32
            top-[76px]
            h-[22rem]
            w-[22rem]
            rounded-full
            bg-sage-200/40
            blur-[110px]

            lg:top-[100px]
          "
        />

        <div
          className="
            absolute
            -right-24
            bottom-0
            h-[18rem]
            w-[18rem]
            rounded-full
            bg-sage-100/60
            blur-[120px]
          "
        />
      </motion.div>

      {/* Soft cursor-following light — desktop only, fades in on hover */}
      {parallaxEnabled && (
        <motion.div
          aria-hidden
          style={{ x: lightX, y: lightY, opacity: lightOpacity }}
          className="
            pointer-events-none
            absolute
            left-0
            top-0
            hidden
            h-[420px]
            w-[420px]
            rounded-full
            bg-[radial-gradient(circle,rgba(124,139,111,0.16)_0%,rgba(124,139,111,0)_70%)]
            blur-2xl

            lg:block
          "
        />
      )}

      {/* Paint trail — sits behind the content */}
      {trail}

      {/* =====================================================
          MAIN HERO CONTAINER
      ====================================================== */}

      <div
        className="
          container-academy
          relative
          z-10
          grid
          h-full
          w-full
          items-start
          gap-8
          px-5
          py-6

          sm:px-6
          sm:py-10

          md:gap-10

          lg:grid-cols-[1fr_0.86fr]
          lg:gap-10
          lg:px-8
          lg:py-0

          xl:grid-cols-[1fr_0.88fr]
          xl:gap-12
          xl:px-10
          xl:py-0
        "
      >
        {/* =====================================================
            LEFT CONTENT
        ====================================================== */}

        <motion.div
          style={{ x: textX, y: textY }}
          className="
            relative
            order-2
            flex
            flex-col
            items-center
            justify-start
            text-center

            lg:order-none
            lg:items-start
            lg:pt-1
            lg:text-left

           xl:pt-3
          "
        >
          {/* Crayon doodles */}
          <Doodle
            d="M20 3 L24.5 14.5 L37 15.5 L27.5 23.5 L30.5 36 L20 29 L9.5 36 L12.5 23.5 L3 15.5 L15.5 14.5 Z"
            color={CRAYON.yellow}
            className="right-[8%] top-0 h-9 w-9 sm:h-11 sm:w-11 lg:right-[14%] lg:top-2"
          />
          <Doodle
            d="M20 34 C 6 24 4 14 10 9 C 15 5 20 9 20 13 C 20 9 25 5 30 9 C 36 14 34 24 20 34 Z"
            color={CRAYON.coral}
            delay={0.3}
            className="right-[4%] top-[48%] hidden h-9 w-9 lg:block"
          />
          <Doodle
            d="M20 20 a3 3 0 1 1 4 3 a7 7 0 1 1 -10 -6 a11 11 0 1 1 15 13"
            color={CRAYON.blue}
            delay={0.6}
            className="bottom-2 right-[10%] hidden h-10 w-10 sm:block lg:right-[16%]"
          />

          {/* Eyebrow */}

          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease,
            }}
            className="
              eyebrow
              text-xs
              sm:text-sm
            "
          >
            <span className="h-1 w-1 rounded-full bg-sage-500" />
            Zayith Academy
          </motion.span>

          {/* Heading */}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.08,
              ease,
            }}
            className="
              mt-4
              max-w-2xl
              font-display
              text-[2.65rem]
              font-medium
              leading-[0.98]
              tracking-tight
              text-charcoal-900

              sm:mt-5
              sm:text-5xl

              md:text-6xl

              lg:mt-4
              lg:text-[3.45rem]
              lg:leading-[0.94]

              xl:text-[3.9rem]

              2xl:text-[4.25rem]
            "
          >
            Discover the{" "}
            <span className="relative inline-block italic text-sage-700">
              artist
              <svg
                aria-hidden
                viewBox="0 0 120 12"
                preserveAspectRatio="none"
                fill="none"
                className="pointer-events-none absolute -bottom-1 left-0 h-2.5 w-full"
              >
                <motion.path
                  d="M2 8 Q 12 2 22 8 T 42 8 T 62 8 T 82 8 T 102 8 T 118 7"
                  stroke={CRAYON.coral}
                  strokeWidth={3}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, delay: 0.7, ease: "easeInOut" }}
                />
              </svg>
            </span>{" "}
            within you
          </motion.h1>

          {/* Description */}

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.16,
              ease,
            }}
            className="
              mt-5
              max-w-lg
              text-base
              leading-[1.55]
              text-charcoal-500

              sm:mt-6
              sm:text-lg

              lg:mt-5
              lg:max-w-[31rem]
              lg:text-[1rem]
              lg:leading-[1.5]

              xl:text-[1.05rem]
            "
          >
            Professional art education for children aged 5–16 — offline in
            Bangalore or live online, in small batches, with real mentorship.
          </motion.p>

          {/* Buttons */}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.24,
              ease,
            }}
            className="
              mt-6
              flex
              flex-wrap
              items-center
              gap-3

              sm:mt-8

              lg:mt-6
            "
          >
            <Button
              size="lg"
              className="
                h-11
                px-5
                text-sm

                sm:h-12
                sm:px-6
                sm:text-base
              "
              onClick={() =>
                document
                  .getElementById("classes")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              Explore Classes
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="
                h-11
                px-5
                text-sm

                sm:h-12
                sm:px-6
                sm:text-base
              "
              onClick={() =>
                document
                  .getElementById("gallery")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              View Gallery
            </Button>
          </motion.div>

          {/* Stats */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.7,
              delay: 0.35,
              ease,
            }}
            className="
              mt-7
              flex
              items-center
              gap-6
              border-t
              border-charcoal-900/8
              pt-5

              sm:mt-9
              sm:gap-9
              sm:pt-6

              lg:mt-6
              lg:gap-8
              lg:pt-5

              xl:gap-10
            "
          >
            {stats.map(([value, label]) => (
              <div
                key={label}
                className="min-w-0"
              >
                <div
                  className="
                    font-display
                    text-xl
                    font-medium
                    text-charcoal-900

                    sm:text-2xl

                    lg:text-[1.4rem]
                  "
                >
                  {value}
                </div>

                <div
                  className="
                    mt-0.5
                    whitespace-nowrap
                    text-[10px]
                    text-charcoal-400

                    sm:text-xs
                  "
                >
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* =====================================================
            RIGHT IMAGE

            Starts below navbar and stays inside hero.
        ====================================================== */}

        <div
          className="
            relative
            order-1
            aspect-[4/3]
            w-full

            sm:aspect-[16/10]

            lg:order-none
            lg:mt-2
            lg:aspect-auto
            lg:h-[90%]
            lg:min-h-0

            xl:mt-3
            xl:h-[90%]
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.9,
              delay: 0.15,
              ease,
            }}
            style={{
              x: imgX,
              y: imgY,
              rotateX: imgRotateX,
              rotateY: imgRotateY,
              transformPerspective: 1000,
            }}
            className="
              relative
              h-full
              w-full
              overflow-hidden
              rounded-[1.5rem]

              xl:rounded-[1.75rem]
            "
          >
            <Image
              src="/assets/hero.PNG"
              alt="Students painting together at the Zayith Academy studio"
              fill
              priority
              sizes="
                (min-width: 1536px) 42vw,
                (min-width: 1280px) 44vw,
                (min-width: 1024px) 45vw,
                100vw
              "
              className="
                object-cover
                object-center
              "
            />

            {/* Image overlay */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-t
                from-charcoal-900/20
                via-transparent
                to-transparent
              "
            />
          </motion.div>

          {/* Decorative floating accents — react more than the artwork itself */}

          <motion.div
            aria-hidden
            style={{ x: decorAX, y: decorAY, rotate: decorARotate }}
            className="
              pointer-events-none
              absolute
              -right-3
              -top-3
              h-16
              w-16
              rounded-full
              border
              border-sage-300/50

              xl:-right-4
              xl:-top-4
              xl:h-20
              xl:w-20
            "
          />

          <motion.div
            aria-hidden
            style={{ x: decorBX, y: decorBY }}
            className="
              pointer-events-none
              absolute
              -bottom-4
              -left-4
              h-10
              w-10
              rounded-full
              bg-sage-400/30
              blur-md

              xl:-bottom-5
              xl:-left-5
              xl:h-12
              xl:w-12
            "
          />

          {/* Sun + sparkle doodles around the artwork */}
          <Doodle
            d="M20 13 a7 7 0 1 0 0.01 0 M20 3 v4 M20 33 v4 M3 20 h4 M33 20 h4 M8 8 l3 3 M29 29 l3 3 M8 32 l3 -3 M29 11 l3 -3"
            color={CRAYON.yellow}
            delay={0.9}
            className="-bottom-7 right-[22%] z-20 hidden h-12 w-12 lg:block"
          />
          <Doodle
            d="M10 2 v16 M2 10 h16 M26 22 v10 M21 27 h10"
            viewBox="0 0 34 34"
            color={CRAYON.sage}
            delay={1.1}
            className="-left-6 top-[38%] z-20 hidden h-8 w-8 lg:block"
          />
        </div>
      </div>
    </section>
  );
}
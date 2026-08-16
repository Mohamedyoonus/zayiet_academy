"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ease = [0.16, 1, 0.3, 1] as const;

const stats = [
  ["1200+", "Students Trained"],
  ["9+", "Years of Teaching"],
  ["18", "Awards Won"],
];

export default function Hero() {
  return (
    <section
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

      <div
        className="
          pointer-events-none
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
          pointer-events-none
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

        <div
          className="
            flex
            flex-col
            justify-start

           lg:pt-1
xl:pt-3
          "
        >
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
            <span className="italic text-sage-700">artist</span> within you
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
            Professional art education designed to help every learner explore,
            create and grow — in small batches, with real mentorship.
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
        </div>

        {/* =====================================================
            RIGHT IMAGE

            Starts below navbar and stays inside hero.
        ====================================================== */}

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
          className="
            relative
            hidden
            self-start
            overflow-hidden
            rounded-[1.5rem]

            lg:mt-2
            lg:block
            lg:h-[90%]
            lg:min-h-0

            xl:mt-3
            xl:h-[90%]
            xl:rounded-[1.75rem]
          "
        >
          <Image
            src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1400&auto=format&fit=crop"
            alt="Student painting at Zayith Academy"
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
      </div>
    </section>
  );
}
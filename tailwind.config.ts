import type { Config } from "tailwindcss";

// Colors come from CSS variables (see app/globals.css) so themes chosen on
// /settings can recolor the site. The default values are the original palette.
const v = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep charcoal — primary text / ink (#2A2E28 … #111310)
        charcoal: {
          DEFAULT: v("charcoal-800"),
          50: v("charcoal-50"),
          100: v("charcoal-100"),
          200: v("charcoal-200"),
          300: v("charcoal-300"),
          400: v("charcoal-400"),
          500: v("charcoal-500"),
          600: v("charcoal-600"),
          700: v("charcoal-700"),
          800: v("charcoal-800"),
          900: v("charcoal-900"),
          950: v("charcoal-950"),
        },
        // Sage green — primary accent, from the logo's botanical elements (500 = #7C8B6F)
        sage: {
          DEFAULT: v("sage-500"),
          50: v("sage-50"),
          100: v("sage-100"),
          200: v("sage-200"),
          300: v("sage-300"),
          400: v("sage-400"),
          500: v("sage-500"), // primary
          600: v("sage-600"),
          700: v("sage-700"),
          800: v("sage-800"),
          900: v("sage-900"),
        },
        // Muted natural / secondary botanical green
        moss: {
          DEFAULT: v("moss-500"),
          400: v("moss-400"),
          500: v("moss-500"),
          600: v("moss-600"),
        },
        // Warm ivory / cream — background & surfaces
        ivory: {
          DEFAULT: v("ivory-100"),
          50: v("ivory-50"),
          100: v("ivory-100"),
          200: v("ivory-200"),
          300: v("ivory-300"),
        },
        cream: v("cream"),
        surface: v("surface"),
        paper: v("paper"),
        // Header chrome: logo accent / nav bubble (#A8BA8E), hover text (#4F5E3C)
        brand: {
          DEFAULT: v("brand"),
          ink: v("brand-ink"),
        },
        // Header background (#FDFBF5) and nav text (#2D2D2D)
        header: {
          DEFAULT: v("header"),
          ink: v("header-ink"),
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      letterSpacing: {
        widest2: "0.22em",
      },
      animation: {
        "float-slow": "float 9s ease-in-out infinite",
        "float-slower": "float 13s ease-in-out infinite",
        "fade-up": "fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both",
        marquee: "marquee 34s linear infinite",
        // Loading states: a light sweep across skeleton blocks, and three pulsing dots
        shimmer: "shimmer 1.4s ease-in-out infinite",
        "dot-pulse": "dotPulse 1.1s ease-in-out infinite",
        // Snackbar timer bar; its duration is set per snackbar
        countdown: "countdown linear forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-16px) rotate(2deg)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        countdown: {
          from: { transform: "scaleX(1)" },
          to: { transform: "scaleX(0)" },
        },
        dotPulse: {
          "0%, 80%, 100%": { opacity: "0.3", transform: "scale(0.75)" },
          "40%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep charcoal — primary text / ink
        charcoal: {
          DEFAULT: "#2A2E28",
          50: "#F5F6F3",
          100: "#E7E9E3",
          200: "#CBCFC3",
          300: "#A6AC9A",
          400: "#7C8271",
          500: "#5C6152",
          600: "#474C3F",
          700: "#383C33",
          800: "#2A2E28",
          900: "#1C1F1A",
          950: "#111310",
        },
        // Sage green — primary accent, from the logo's botanical elements
        sage: {
          DEFAULT: "#7C8B6F",
          50: "#F4F6F1",
          100: "#E6EBDE",
          200: "#CDD8BE",
          300: "#AFBF9C",
          400: "#93A57D",
          500: "#7C8B6F", // primary
          600: "#64715A",
          700: "#4F5947",
          800: "#3E4538",
          900: "#31362D",
        },
        // Muted natural / secondary botanical green
        moss: {
          DEFAULT: "#5B6B4F",
          400: "#7A8C6C",
          500: "#5B6B4F",
          600: "#485440",
        },
        // Warm ivory / cream — background & surfaces
        ivory: {
          DEFAULT: "#FBF8F2",
          50: "#FFFFFF",
          100: "#FBF8F2",
          200: "#F5F0E5",
          300: "#EEE7D6",
        },
        cream: "#FBF8F2",
        surface: "#F5F1E8",
        paper: "#FFFFFF",
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
      },
    },
  },
  plugins: [],
};

export default config;

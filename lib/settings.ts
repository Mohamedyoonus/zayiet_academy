// Site preferences chosen on /settings. Saved per device in localStorage and
// applied as data-* attributes on <html> (see app/globals.css).

export type ThemeId = "sage" | "ocean" | "sunset" | "lavender" | "rose" | "golden";
export type TextSize = "sm" | "md" | "lg" | "xl";
export type HeadingFont = "elegant" | "modern" | "playful";
export type MotionPref = "auto" | "reduce";
export type Contrast = "normal" | "high";

export type Effects = {
  /** Colorful paint blobs that follow the cursor */
  trail: boolean;
  /** Paint splash when a menu link is clicked */
  splash: boolean;
  /** Crayon doodles floating around headings and sections */
  doodles: boolean;
};

export type Settings = {
  theme: ThemeId;
  textSize: TextSize;
  font: HeadingFont;
  motion: MotionPref;
  contrast: Contrast;
  effects: Effects;
};

export const DEFAULT_SETTINGS: Settings = {
  theme: "sage",
  textSize: "md",
  font: "elegant",
  motion: "auto",
  contrast: "normal",
  effects: { trail: true, splash: true, doodles: true },
};

export const STORAGE_KEY = "zayit-settings";

export const THEMES: { id: ThemeId; name: string; tagline: string }[] = [
  { id: "sage", name: "Sage Garden", tagline: "The original Zayit look" },
  { id: "ocean", name: "Ocean Breeze", tagline: "Calm, cool blues" },
  { id: "sunset", name: "Sunset Clay", tagline: "Warm terracotta" },
  { id: "lavender", name: "Lavender Dream", tagline: "Soft, gentle purple" },
  { id: "rose", name: "Rose Petal", tagline: "Dusty, friendly pink" },
  { id: "golden", name: "Golden Hour", tagline: "Sunny ochre warmth" },
];

export const PLAYFUL_FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap";

export function parseSettings(raw: string | null): Settings {
  try {
    const stored = raw ? (JSON.parse(raw) as Partial<Settings>) : {};
    // Only keep effects that still exist, so a removed one saved earlier doesn't linger
    const saved: Partial<Effects> = stored.effects ?? {};
    const effects = { ...DEFAULT_SETTINGS.effects };
    for (const key of Object.keys(effects) as (keyof Effects)[]) {
      const value = saved[key];
      if (typeof value === "boolean") effects[key] = value;
    }
    return { ...DEFAULT_SETTINGS, ...stored, effects };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Runs in <head> before the page paints, so a saved theme or text size shows
 * immediately instead of flashing the default first. Keep in sync with
 * applySettingsToDocument in hooks/use-settings.tsx.
 */
export const settingsBootScript = `(function(){try{
var s=JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)})||"{}"),d=document.documentElement;
if(s.theme&&s.theme!=="sage")d.setAttribute("data-theme",s.theme);
if(s.textSize&&s.textSize!=="md")d.setAttribute("data-text-size",s.textSize);
if(s.font&&s.font!=="elegant")d.setAttribute("data-font",s.font);
if(s.motion==="reduce")d.setAttribute("data-motion","reduce");
if(s.contrast==="high")d.setAttribute("data-contrast","high");
if(s.font==="playful"){var l=document.createElement("link");l.rel="stylesheet";l.id="font-playful";l.href=${JSON.stringify(PLAYFUL_FONT_HREF)};document.head.appendChild(l);}
}catch(e){}})();`;

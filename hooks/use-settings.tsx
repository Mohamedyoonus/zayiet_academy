"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { MotionConfig, useReducedMotion } from "framer-motion";
import {
  DEFAULT_SETTINGS,
  PLAYFUL_FONT_HREF,
  STORAGE_KEY,
  parseSettings,
  type Effects,
  type Settings,
} from "@/lib/settings";

type SettingsContextValue = {
  settings: Settings;
  update: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  setEffect: (key: keyof Effects, value: boolean) => void;
  reset: () => void;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

// Keep in sync with settingsBootScript in lib/settings.ts
function applySettingsToDocument(s: Settings) {
  const root = document.documentElement;
  const setAttr = (name: string, value: string | null) =>
    value ? root.setAttribute(name, value) : root.removeAttribute(name);

  setAttr("data-theme", s.theme === "sage" ? null : s.theme);
  setAttr("data-text-size", s.textSize === "md" ? null : s.textSize);
  setAttr("data-font", s.font === "elegant" ? null : s.font);
  setAttr("data-motion", s.motion === "reduce" ? "reduce" : null);
  setAttr("data-contrast", s.contrast === "high" ? "high" : null);

  // Only download the playful heading font for people who pick it
  if (s.font === "playful" && !document.getElementById("font-playful")) {
    const link = document.createElement("link");
    link.id = "font-playful";
    link.rel = "stylesheet";
    link.href = PLAYFUL_FONT_HREF;
    document.head.appendChild(link);
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      setSettings(parseSettings(localStorage.getItem(STORAGE_KEY)));
    } catch {
      // Storage can be blocked (private mode etc.) — the defaults still work
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    applySettingsToDocument(settings);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings, loaded]);

  // Changing settings in one tab updates every other open tab
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setSettings(parseSettings(e.newValue));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const update = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }));
  }, []);

  const setEffect = useCallback((key: keyof Effects, value: boolean) => {
    setSettings((s) => ({ ...s, effects: { ...s.effects, [key]: value } }));
  }, []);

  const reset = useCallback(() => setSettings(DEFAULT_SETTINGS), []);

  const value = useMemo(() => ({ settings, update, setEffect, reset }), [settings, update, setEffect, reset]);

  return (
    <SettingsContext.Provider value={value}>
      {/* "user" follows the device's reduce-motion setting; "always" is the explicit choice on /settings */}
      <MotionConfig reducedMotion={settings.motion === "reduce" ? "always" : "user"}>{children}</MotionConfig>
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}

/** True when the device asks for less motion or the visitor chose it on /settings */
export function useMotionReduced() {
  const device = useReducedMotion();
  const { settings } = useSettings();
  return Boolean(device) || settings.motion === "reduce";
}

/** Whether a decorative effect should run: switched on and motion not reduced */
export function useEffectEnabled(key: keyof Effects) {
  const { settings } = useSettings();
  const reduced = useMotionReduced();
  return settings.effects[key] && !reduced;
}

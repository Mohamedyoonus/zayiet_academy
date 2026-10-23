"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Check,
  Contrast as ContrastIcon,
  Droplet,
  Droplets,
  Languages,
  Loader2,
  MousePointer2,
  Palette,
  PenLine,
  RotateCcw,
  Sparkles,
  Type,
  Wind,
  type LucideIcon,
} from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { useSettings } from "@/hooks/use-settings";
import { useI18n } from "@/hooks/use-i18n";
import type { Dictionary } from "@/lib/i18n";
import { LANGUAGES, scriptFontHref, type Language, type Locale } from "@/lib/i18n/config";
import {
  DEFAULT_SETTINGS,
  PLAYFUL_FONT_HREF,
  THEMES,
  type Effects,
  type HeadingFont,
  type TextSize,
  type ThemeId,
} from "@/lib/settings";
import { cn } from "@/lib/utils";

type SettingsText = Dictionary["settings"];

/* ----------------------------- Building blocks ----------------------------- */

function Group({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-4xl border border-sage-200/60 bg-white/70 p-5 shadow-sm backdrop-blur-sm sm:p-8"
    >
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sage-100 text-sage-700">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-xl font-medium text-charcoal-900 sm:text-2xl">{title}</h2>
          <p className="mt-1 text-sm text-charcoal-500">{description}</p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </motion.section>
  );
}

function Segmented<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: T;
  options: { value: T; label: string; preview: ReactNode }[];
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest2 text-sage-600">{label}</p>
      <div
        role="radiogroup"
        aria-label={label}
        className={cn("mt-3 grid gap-2", options.length === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3")}
      >
        {options.map((o) => {
          const selected = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(o.value)}
              className={cn(
                "relative isolate flex flex-col items-center gap-1 rounded-2xl border px-3 py-3 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500",
                selected ? "border-sage-400 text-sage-800" : "border-sage-200/70 text-charcoal-700 hover:border-sage-300"
              )}
            >
              {selected && (
                <motion.span
                  layoutId={`seg-${id}`}
                  className="absolute inset-0 -z-10 rounded-2xl bg-sage-100"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              {o.preview}
              <span className="text-xs font-medium">{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Switch({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40",
        checked ? "justify-end bg-sage-500" : "justify-start bg-charcoal-200"
      )}
    >
      <motion.span layout transition={{ type: "spring", stiffness: 500, damping: 32 }} className="h-5 w-5 rounded-full bg-white shadow" />
    </button>
  );
}

function SwitchRow({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
  disabled,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-4 py-4", disabled && "opacity-60")}>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ivory-200 text-sage-700">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-charcoal-900">{title}</p>
        <p className="text-sm text-charcoal-500">{description}</p>
      </div>
      <Switch checked={checked} onChange={onChange} disabled={disabled} label={title} />
    </div>
  );
}

/* ----------------------------- Language cards ------------------------------ */

function LanguageCard({
  language,
  selected,
  loading,
  onSelect,
}: {
  language: Language;
  selected: boolean;
  loading: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "flex items-center justify-between gap-3 rounded-2xl border-2 bg-white px-4 py-3 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2",
        selected ? "border-sage-500 shadow-md" : "border-transparent shadow-sm hover:border-sage-200"
      )}
    >
      <span className="min-w-0">
        {/* Each name is written in its own script, with that script's font */}
        <span
          lang={language.code}
          dir={language.dir}
          className="block truncate text-lg font-medium text-charcoal-900"
          style={language.font ? { fontFamily: `"${language.font}", var(--font-jakarta)` } : undefined}
        >
          {language.native}
        </span>
        {language.english !== language.native && (
          <span className="block text-xs text-charcoal-500">{language.english}</span>
        )}
      </span>
      <span
        className={cn(
          "grid h-6 w-6 shrink-0 place-items-center rounded-full transition-all",
          selected || loading ? "scale-100 bg-sage-500 text-white" : "scale-75 bg-charcoal-100 text-transparent"
        )}
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
      </span>
    </motion.button>
  );
}

/* ------------------------------- Theme cards ------------------------------- */

const SWATCHES = ["bg-sage-200", "bg-sage-300", "bg-sage-500", "bg-sage-700", "bg-surface"];

// Dictionary keys for each theme's name and tagline
const THEME_TEXT: Record<ThemeId, { name: keyof SettingsText; tagline: keyof SettingsText }> = {
  sage: { name: "themeSage", tagline: "themeSageTagline" },
  ocean: { name: "themeOcean", tagline: "themeOceanTagline" },
  sunset: { name: "themeSunset", tagline: "themeSunsetTagline" },
  lavender: { name: "themeLavender", tagline: "themeLavenderTagline" },
  rose: { name: "themeRose", tagline: "themeRoseTagline" },
  golden: { name: "themeGolden", tagline: "themeGoldenTagline" },
};

type PreviewText = { home: string; before: string; highlight: string; explore: string; enquire: string; original: string };

function ThemeCard({
  id,
  name,
  tagline,
  preview,
  selected,
  onSelect,
}: {
  id: ThemeId;
  name: string;
  tagline: string;
  preview: PreviewText;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "rounded-3xl border-2 bg-white p-2 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2",
        selected ? "border-sage-500 shadow-md" : "border-transparent shadow-sm hover:border-sage-200"
      )}
    >
      {/* Mini page rendered in this theme's own colors */}
      <div data-theme={id} className="overflow-hidden rounded-2xl border border-charcoal-900/5 bg-cream" aria-hidden>
        <div className="flex items-center justify-between bg-header px-3 py-2">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-brand" />
            <span className="h-1.5 w-8 rounded-full bg-header-ink/70" />
          </div>
          <div className="flex items-center gap-1">
            <span className="rounded-full bg-brand/25 px-2 py-0.5 text-[8px] font-medium text-brand-ink">{preview.home}</span>
            <span className="h-1.5 w-4 rounded-full bg-header-ink/25" />
            <span className="h-1.5 w-4 rounded-full bg-header-ink/25" />
          </div>
        </div>
        <div className="space-y-2 p-3">
          <span className="block h-1 w-10 rounded-full bg-sage-600/70" />
          <p className="font-display text-sm font-medium leading-tight text-charcoal-900">
            {preview.before && <>{preview.before} </>}
            <span className="italic text-sage-700">{preview.highlight}</span>
          </p>
          <span className="block h-1.5 w-4/5 rounded-full bg-charcoal-200" />
          <div className="flex items-center gap-1.5 pt-1">
            <span className="rounded-full bg-charcoal-800 px-2 py-1 text-[8px] text-cream">{preview.explore}</span>
            <span className="rounded-full bg-brand px-2 py-1 text-[8px] text-header">{preview.enquire}</span>
          </div>
          <div className="flex gap-1 pt-1">
            {SWATCHES.map((c) => (
              <span key={c} className={cn("h-3 flex-1 rounded-full", c)} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-start justify-between gap-2 px-2 pb-1 pt-3">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-1.5 font-medium text-charcoal-900">
            {name}
            {id === "sage" && (
              <span className="rounded-full bg-sage-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sage-700">
                {preview.original}
              </span>
            )}
          </p>
          <p className="text-xs text-charcoal-500">{tagline}</p>
        </div>
        <span
          className={cn(
            "grid h-6 w-6 shrink-0 place-items-center rounded-full transition-all",
            selected ? "scale-100 bg-sage-500 text-white" : "scale-75 bg-charcoal-100 text-transparent"
          )}
        >
          <Check className="h-3.5 w-3.5" />
        </span>
      </div>
    </motion.button>
  );
}

/* --------------------------------- Options --------------------------------- */

const TEXT_SIZES: { value: TextSize; label: keyof SettingsText; px: number }[] = [
  { value: "sm", label: "sizeSmall", px: 14 },
  { value: "md", label: "sizeDefault", px: 17 },
  { value: "lg", label: "sizeLarge", px: 20 },
  { value: "xl", label: "sizeExtraLarge", px: 23 },
];

const FONTS: { value: HeadingFont; label: keyof SettingsText; family: string }[] = [
  { value: "elegant", label: "fontElegant", family: "Fraunces, Georgia, serif" },
  { value: "modern", label: "fontModern", family: '"Plus Jakarta Sans", system-ui, sans-serif' },
  { value: "playful", label: "fontPlayful", family: "Fredoka, ui-rounded, system-ui, sans-serif" },
];

const EFFECTS: { key: keyof Effects; icon: LucideIcon; title: keyof SettingsText; description: keyof SettingsText }[] = [
  { key: "trail", icon: MousePointer2, title: "effectTrail", description: "effectTrailDescription" },
  { key: "stroke", icon: Droplet, title: "effectStroke", description: "effectStrokeDescription" },
  { key: "splash", icon: Droplets, title: "effectSplash", description: "effectSplashDescription" },
  { key: "doodles", icon: PenLine, title: "effectDoodles", description: "effectDoodlesDescription" },
];

const addStylesheet = (id: string, href: string) => {
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
};

/* ---------------------------------- Page ---------------------------------- */

export default function SettingsPanel() {
  const { settings, update, setEffect, reset } = useSettings();
  const { t: dictionary, locale, setLocale, switching } = useI18n();
  const t = dictionary.settings;
  const [pending, setPending] = useState<Locale | null>(null);
  const deviceReducesMotion = useReducedMotion();
  const motionReduced = Boolean(deviceReducesMotion) || settings.motion === "reduce";
  const isDefault = JSON.stringify(settings) === JSON.stringify(DEFAULT_SETTINGS);

  // Load the playful font and every script's font so their preview tiles look right
  useEffect(() => {
    addStylesheet("font-playful", PLAYFUL_FONT_HREF);
    for (const l of LANGUAGES) if (l.font) addStylesheet(`font-script-${l.code}`, scriptFontHref(l.font));
  }, []);

  const chooseLanguage = (code: Locale) => {
    if (code === locale) return;
    setPending(code);
    setLocale(code);
  };

  const preview: PreviewText = {
    home: dictionary.nav.home,
    before: dictionary.hero.titleBefore,
    highlight: dictionary.hero.titleHighlight,
    explore: t.previewExplore,
    enquire: dictionary.common.enquire,
    original: t.original,
  };

  return (
    <section className="relative overflow-hidden bg-ivory py-28">
      <div className="pointer-events-none absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full bg-sage-200/50 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-sage-100/70 blur-[130px]" />

      <div className="container-academy relative z-10">
        <SectionHeading align="center" eyebrow={t.eyebrow} title={t.title} highlight={t.highlight} description={t.description} />

        <div className="mx-auto mt-10 max-w-5xl space-y-6 lg:mt-12">
          <Group icon={Languages} title={t.languageTitle} description={t.languageDescription}>
            <div role="radiogroup" aria-label={t.languageTitle} className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {LANGUAGES.map((l) => (
                <LanguageCard
                  key={l.code}
                  language={l}
                  selected={locale === l.code}
                  loading={switching && pending === l.code}
                  onSelect={() => chooseLanguage(l.code)}
                />
              ))}
            </div>
          </Group>

          <Group icon={Palette} title={t.themeTitle} description={t.themeDescription}>
            <div role="radiogroup" aria-label={t.themeTitle} className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
              {THEMES.map((theme) => (
                <ThemeCard
                  key={theme.id}
                  id={theme.id}
                  name={t[THEME_TEXT[theme.id].name]}
                  tagline={t[THEME_TEXT[theme.id].tagline]}
                  preview={preview}
                  selected={settings.theme === theme.id}
                  onSelect={() => update("theme", theme.id)}
                />
              ))}
            </div>
          </Group>

          <Group icon={Type} title={t.readingTitle} description={t.readingDescription}>
            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:gap-8">
              <div className="space-y-6">
                <Segmented
                  id="text-size"
                  label={t.textSize}
                  value={settings.textSize}
                  onChange={(v) => update("textSize", v)}
                  options={TEXT_SIZES.map((s) => ({
                    value: s.value,
                    label: t[s.label],
                    preview: (
                      <span className="font-display font-medium leading-none" style={{ fontSize: s.px }}>
                        {t.sample}
                      </span>
                    ),
                  }))}
                />
                <Segmented
                  id="font"
                  label={t.headingStyle}
                  value={settings.font}
                  onChange={(v) => update("font", v)}
                  options={FONTS.map((f) => ({
                    value: f.value,
                    label: t[f.label],
                    preview: (
                      <span className="text-xl font-medium leading-none" style={{ fontFamily: f.family }}>
                        {t.sample}
                      </span>
                    ),
                  }))}
                />
                <div className="flex items-center gap-4 rounded-2xl border border-sage-200/70 px-4 py-3">
                  <ContrastIcon className="h-5 w-5 shrink-0 text-sage-700" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-charcoal-900">{t.strongerText}</p>
                    <p className="text-sm text-charcoal-500">{t.strongerTextDescription}</p>
                  </div>
                  <Switch
                    checked={settings.contrast === "high"}
                    onChange={(on) => update("contrast", on ? "high" : "normal")}
                    label={t.strongerText}
                  />
                </div>
              </div>

              {/* Live preview of the reading choices */}
              <div className="rounded-3xl bg-cream p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-widest2 text-sage-600">{t.preview}</p>
                <p className="mt-3 font-display text-2xl font-medium leading-tight text-charcoal-900 sm:text-3xl">
                  {dictionary.littleArtists.title}{" "}
                  <span className="italic text-sage-700">{dictionary.littleArtists.highlight}</span>
                </p>
                <p className="mt-3 text-charcoal-500">{t.previewBody}</p>
                <p className="mt-2 text-sm text-charcoal-400">{t.previewMeta}</p>
              </div>
            </div>
          </Group>

          <Group icon={Sparkles} title={t.motionTitle} description={t.motionDescription}>
            <div className="flex items-center gap-4 rounded-2xl border border-sage-200/70 px-4 py-3">
              <Wind className="h-5 w-5 shrink-0 text-sage-700" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-charcoal-900">{t.reduceMotion}</p>
                <p className="text-sm text-charcoal-500">
                  {deviceReducesMotion ? t.reduceMotionDevice : t.reduceMotionDescription}
                </p>
              </div>
              <Switch
                checked={settings.motion === "reduce"}
                onChange={(on) => update("motion", on ? "reduce" : "auto")}
                label={t.reduceMotion}
              />
            </div>

            <div className="mt-2 divide-y divide-sage-200/50">
              {EFFECTS.map((e) => (
                <SwitchRow
                  key={e.key}
                  icon={e.icon}
                  title={t[e.title]}
                  description={t[e.description]}
                  checked={settings.effects[e.key]}
                  onChange={(on) => setEffect(e.key, on)}
                  disabled={motionReduced && e.key !== "doodles"}
                />
              ))}
            </div>
          </Group>

          <div className="flex flex-col items-center justify-between gap-3 rounded-4xl border border-sage-200/60 bg-white/50 px-5 py-4 text-sm text-charcoal-500 sm:flex-row sm:px-8">
            <p className="flex items-center gap-2">
              <Check className="h-4 w-4 text-sage-600" /> {t.saved}
            </p>
            <button
              type="button"
              onClick={reset}
              disabled={isDefault}
              className="inline-flex items-center gap-2 rounded-full border border-charcoal-800/15 bg-white px-4 py-2 font-medium text-charcoal-700 transition-colors hover:border-sage-400 hover:text-sage-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 disabled:pointer-events-none disabled:opacity-40"
            >
              <RotateCcw className="h-4 w-4" /> {t.reset}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

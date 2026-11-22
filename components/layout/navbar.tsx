"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, Palette, Settings as SettingsIcon, X } from "lucide-react";
import { nav } from "@/lib/data";
import { buttonVariants } from "@/components/ui/button";
import { cn, scrollToHash } from "@/lib/utils";
import { useHashScroll } from "@/hooks/use-hash-scroll";
import { useEffectEnabled } from "@/hooks/use-settings";
import { useData, useI18n } from "@/hooks/use-i18n";

type Splash = { id: number; href: string; scope: "desktop" | "mobile"; x: number; y: number };

/**
 * Stops the page scrolling behind the mobile menu. The page scrolls on <html>
 * here (globals.css gives html `overflow-x: hidden`), so that's what gets
 * locked; the scrollbar's width is kept as padding so nothing jumps sideways.
 */
function setScrollLock(locked: boolean) {
  const root = document.documentElement;
  if (locked) {
    const scrollbar = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;
  } else {
    root.style.overflow = "";
    root.style.paddingRight = "";
  }
}

// Theme-aware: brand (#A8BA8E), sage-400 (#93A57D), sage-500 (#7C8B6F) and a light brand tint (~#BFCDA8)
const SPLASH_COLORS = [
  "rgb(var(--c-brand))",
  "rgb(var(--c-sage-400))",
  "rgb(var(--c-sage-500))",
  "color-mix(in srgb, rgb(var(--c-brand)) 72%, white)",
];

// Irregular liquid splat, drawn around (0,0) in a 100x100 box
const SPLAT_PATH =
  "M0,-30 C8,-30 10,-42 16,-40 C22,-38 16,-28 22,-22 C28,-16 42,-22 42,-12 C42,-4 30,-4 30,4 C30,12 44,16 38,24 C32,32 22,22 16,28 C10,34 14,46 4,46 C-6,46 -4,34 -10,30 C-16,26 -26,38 -32,30 C-38,22 -26,16 -30,8 C-34,0 -46,-2 -44,-12 C-42,-22 -30,-16 -24,-22 C-18,-28 -24,-40 -14,-42 C-4,-44 -8,-30 0,-30 Z";

type Droplet = { dx: number; up: number; size: number; color: string; delay: number };

// Droplets are thrown up and outward, then fall back down like real liquid
function makeDroplets(): Droplet[] {
  return Array.from({ length: 9 }, (_, i) => {
    const deg = -165 + (i / 8) * 150 + (Math.random() * 16 - 8);
    const angle = (deg * Math.PI) / 180;
    const distance = 22 + Math.random() * 22;
    return {
      dx: Math.cos(angle) * distance,
      up: Math.sin(angle) * distance,
      size: 4 + Math.random() * 5,
      color: SPLASH_COLORS[i % SPLASH_COLORS.length],
      delay: Math.random() * 0.06,
    };
  });
}

// Click feedback: the bubble wobbles and bursts into a liquid splash at the click point
function BubbleSplash({ x, y, rounded }: { x: number; y: number; rounded: string }) {
  // Randomised once per splash so re-renders never change a splash mid-flight
  const [droplets] = useState(makeDroplets);
  const [rotate] = useState(() => Math.random() * 360);

  return (
    <>
      {/* Bubble squash-and-stretch, then burst */}
      <motion.span
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 -z-10 bg-brand/50", rounded)}
        initial={{ scaleX: 1, scaleY: 1, opacity: 1 }}
        animate={{ scaleX: [1, 1.16, 0.94, 1.3], scaleY: [1, 0.82, 1.1, 1.3], opacity: [1, 1, 1, 0] }}
        transition={{ duration: 0.5, times: [0, 0.25, 0.5, 1], ease: "easeOut" }}
      />

      <span aria-hidden className="pointer-events-none absolute -z-10" style={{ left: x, top: y }}>
        {/* Paint splat */}
        <motion.svg
          viewBox="-50 -50 100 100"
          className="absolute -left-8 -top-8 h-16 w-16"
          initial={{ scale: 0, opacity: 0.85, rotate }}
          animate={{ scale: [0, 1.15, 1], opacity: [0.85, 0.6, 0] }}
          transition={{ duration: 0.75, times: [0, 0.3, 1], delay: 0.08, ease: "easeOut" }}
        >
          <path d={SPLAT_PATH} className="fill-brand" />
          <circle cx={-40} cy={-34} r={5} className="fill-sage-400" />
          <circle cx={44} cy={-30} r={4} className="fill-brand" />
          <circle cx={-44} cy={30} r={3.5} className="fill-sage-500" />
        </motion.svg>

        {/* Flying droplets */}
        {droplets.map((d, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: -d.size / 2,
              top: -d.size / 2,
              width: d.size,
              height: d.size,
              backgroundColor: d.color,
            }}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{
              x: [0, d.dx * 0.7, d.dx],
              y: [0, d.up, d.up + 22],
              scale: [1, 1, 0.4],
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 0.7, times: [0, 0.45, 1], delay: 0.05 + d.delay, ease: "easeOut" }}
          />
        ))}
      </span>
    </>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openCount, setOpenCount] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [mobileHovered, setMobileHovered] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [splashes, setSplashes] = useState<Splash[]>([]);
  const splashId = useRef(0);
  const splashEnabled = useEffectEnabled("splash");
  const pathname = usePathname();
  const { t, locale } = useI18n();
  const { nav: navItems } = useData();
  // Translated labels run longer than English, so the full menu needs a wider screen
  const wide = locale !== "en";

  const triggerSplash = (e: React.MouseEvent<HTMLElement>, href: string, scope: Splash["scope"]) => {
    if (!splashEnabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    // Keyboard "clicks" have no pointer position, so burst from the center
    const fromPointer = e.detail > 0;
    const splash: Splash = {
      id: ++splashId.current,
      href,
      scope,
      x: fromPointer ? e.clientX - rect.left : rect.width / 2,
      y: fromPointer ? e.clientY - rect.top : rect.height / 2,
    };
    setSplashes((prev) => [...prev, splash]);
    window.setTimeout(() => setSplashes((prev) => prev.filter((s) => s.id !== splash.id)), 950);
  };

  const splashesFor = (href: string, scope: Splash["scope"]) =>
    splashes.filter((s) => s.href === href && s.scope === scope);

  useHashScroll();

  // Sync the active bubble with the current route (and hash on the home page)
  useEffect(() => {
    const hash = window.location.hash;
    const current = pathname === "/" && hash ? `/${hash}` : pathname;
    const match =
      nav.find((n) => n.href === current) ?? nav.find((n) => n.href === pathname);
    setActive(match?.href ?? null);
  }, [pathname]);

  // Scroll spy on the home page: move the bubble to whichever section is in view
  useEffect(() => {
    if (pathname !== "/") return;
    const sectionLinks = nav.filter((n) => n.href.startsWith("/#"));

    const onScroll = () => {
      const line = window.innerHeight * 0.4;
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let current = "/";
      for (const link of sectionLinks) {
        const el = document.getElementById(link.href.slice(2));
        if (el && (el.getBoundingClientRect().top <= line || atBottom)) current = link.href;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // If already on the target page, smooth-scroll immediately; otherwise let
  // the Link's own navigation happen and useHashScroll picks it up on arrival.
  const handleNavClick = (href: string) => {
    // Release the menu's scroll lock first, so a same-page scroll below can move the page
    setScrollLock(false);
    setOpen(false);
    setActive(href);
    if (!href.includes("#")) return;
    const [path, hash] = href.split("#");
    const targetPath = path || "/";
    if (pathname === targetPath) {
      scrollToHash(hash);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The page behind the open menu mustn't scroll
  useEffect(() => {
    if (!open) {
      setMobileHovered(null);
      return;
    }
    setScrollLock(true);
    return () => setScrollLock(false);
  }, [open]);

  // Whatever changes the page (a menu link, the logo, the browser's Back button), close the menu
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "bg-header shadow-sm" : "bg-header"
      )}
    >
      <div className="container-academy flex h-[76px] items-center justify-between px-4 sm:px-6">
        
        {/* --- LOGO & COMPANY NAME SECTION --- */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Logo Image */}
          <Image
            src="/assets/logo_only.png"
            alt={t.nav.logoAlt}
            width={50}  
            height={50}
            priority
            className="object-contain h-[40px] sm:h-[45px] w-auto"
          />
          
          {/* Company Text - NOW VISIBLE ON MOBILE TOO */}
          <div className="flex flex-col leading-tight border-l-2 border-brand/60 pl-2 sm:pl-3">
            <span className="font-serif text-[1rem] sm:text-[1.1rem] font-semibold tracking-wide text-header-ink">
              Zayit
            </span>
            <span className="font-serif text-[0.75rem] sm:text-[0.85rem] font-normal italic tracking-wider text-brand">
              Academy
            </span>
          </div>
          
        </Link>

        {/* Desktop Navigation */}
        <nav
          className={cn("hidden items-center gap-0.5 2xl:gap-1", wide ? "2xl:flex" : "xl:flex")}
          onMouseLeave={() => setHovered(null)}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              scroll={item.href.includes("#") ? false : undefined}
              onClick={(e) => {
                triggerSplash(e, item.href, "desktop");
                handleNavClick(item.href);
              }}
              onMouseEnter={() => setHovered(item.href)}
              onFocus={() => setHovered(item.href)}
              onBlur={() => setHovered(null)}
              className="relative isolate whitespace-nowrap rounded-full px-3 py-2 text-sm 2xl:px-4 font-medium tracking-wide text-header-ink transition-colors hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500"
            >
              {(hovered ?? active) === item.href && (
                <motion.span
                  layoutId="nav-bubble"
                  className="absolute inset-0 -z-10 rounded-full bg-brand/25"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              {splashesFor(item.href, "desktop").map((s) => (
                <BubbleSplash key={s.id} x={s.x} y={s.y} rounded="rounded-full" />
              ))}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Fun Zone access on smaller screens (desktop has it in the nav) */}
          <Link
            href="/fun-zone"
            onClick={() => handleNavClick("/fun-zone")}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full bg-[linear-gradient(135deg,#E8B04B,#D9695F,#6B9AC4)] px-3 text-xs font-semibold text-white shadow-sm transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 sm:text-sm",
              wide ? "2xl:hidden" : "xl:hidden"
            )}
          >
            <Palette className="h-4 w-4 shrink-0" />
            {t.nav.funZone}
          </Link>
          <Link
            href="/settings"
            aria-label={t.nav.settings}
            title={t.nav.settings}
            onClick={() => handleNavClick("/settings")}
            className={cn(
              "group hidden h-10 w-10 place-items-center rounded-full text-header-ink transition-colors hover:bg-brand/25 hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 min-[380px]:grid",
              pathname === "/settings" && "bg-brand/25 text-brand-ink"
            )}
          >
            <SettingsIcon className="h-5 w-5 transition-transform duration-500 group-hover:rotate-90" />
          </Link>
          <Link
            href="/contact"
            onClick={() => handleNavClick("/contact")}
            className={cn(buttonVariants({ size: "sm" }), "hidden bg-brand text-header hover:bg-brand/90 sm:inline-flex")}
          >
            {t.common.enquire}
          </Link>
          <button
            aria-label={t.nav.openMenu}
            className={cn(
              "grid h-10 w-10 place-items-center rounded-full text-header-ink transition-colors hover:bg-charcoal-800/5 active:bg-charcoal-800/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500",
              wide ? "2xl:hidden" : "xl:hidden"
            )}
            aria-expanded={open}
            onClick={() => {
              setOpenCount((c) => c + 1);
              setOpen(true);
            }}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* --- MOBILE MENU ---
          Always on the page and faded in/out; when closed it's invisible, can't be tapped
          and is skipped by keyboard and screen readers. (Removing it with AnimatePresence
          could leave an invisible layer over the page after navigating, eating every tap.) */}
      <motion.div
        initial={false}
        animate={open ? { opacity: 1, visibility: "visible" } : { opacity: 0, transitionEnd: { visibility: "hidden" } }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        inert={!open}
        aria-hidden={!open}
        // Full screen (dvh = the visible height, below/above phone browser bars): header,
        // a scrolling list, and the Enquire button always in reach at the bottom
        className={cn(
          "fixed inset-x-0 top-0 z-[60] flex h-screen flex-col bg-header supports-[height:100dvh]:h-[100dvh]",
          !open && "pointer-events-none",
          wide ? "2xl:hidden" : "xl:hidden"
        )}
        onClick={() => setOpen(false)}
      >
        <div
          className="container-academy flex h-[76px] shrink-0 items-center justify-between px-4 sm:px-6"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Mobile Logo & Name */}
          <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2 shrink-0">
            <Image 
              src="/assets/logo_only.png"
              alt={t.nav.logoAlt}
              width={40}
              height={40}
              className="object-contain h-[40px] w-auto"
            />
            <div className="flex flex-col leading-none border-l-2 border-brand/60 pl-2">
              <span className="font-serif text-base font-semibold text-header-ink">
                Zayit
              </span>
              <span className="font-serif text-xs italic text-brand">
                Academy
              </span>
            </div>
          </Link>

          <button
            aria-label={t.nav.closeMenu}
            onClick={() => setOpen(false)}
            className="grid h-10 w-10 place-items-center rounded-full text-header-ink transition-colors hover:bg-charcoal-800/5 active:bg-charcoal-800/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* A new key each time the menu opens replays the items' slide-in */}
        <nav
          key={openCount}
          className="container-academy flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overscroll-contain px-4 py-2 sm:px-6"
          onPointerLeave={() => setMobileHovered(null)}
        >
          {navItems.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={item.href}
                scroll={item.href.includes("#") ? false : undefined}
                onClick={(e) => {
                  // Keep the menu open a beat so the splash is visible before it closes
                  e.stopPropagation();
                  triggerSplash(e, item.href, "mobile");
                  window.setTimeout(() => handleNavClick(item.href), splashEnabled ? 320 : 0);
                }}
                // Mouse: follow hover. Touch: slide the bubble to the tapped item.
                onPointerEnter={(e) => e.pointerType === "mouse" && setMobileHovered(item.href)}
                onPointerDown={() => setMobileHovered(item.href)}
                onFocus={() => setMobileHovered(item.href)}
                className={cn(
                  "relative isolate flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3 font-display text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500",
                  (mobileHovered ?? active) === item.href ? "text-brand-ink" : "text-header-ink"
                )}
              >
                {(mobileHovered ?? active) === item.href && (
                  <motion.span
                    layoutId="mobile-nav-bubble"
                    className="absolute inset-0 -z-10 rounded-2xl bg-brand/25"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {splashesFor(item.href, "mobile").map((s) => (
                  <BubbleSplash key={s.id} x={s.x} y={s.y} rounded="rounded-2xl" />
                ))}
                {item.label}
                {item.href === "/fun-zone" && (
                  <span className="rounded-full bg-[#D9695F] px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider text-white">
                    {t.common.newBadge}
                  </span>
                )}
              </Link>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + navItems.length * 0.04, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="/settings"
              onClick={(e) => {
                e.stopPropagation();
                handleNavClick("/settings");
              }}
              onPointerEnter={(e) => e.pointerType === "mouse" && setMobileHovered("/settings")}
              onPointerDown={() => setMobileHovered("/settings")}
              onFocus={() => setMobileHovered("/settings")}
              className={cn(
                "relative isolate flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3 font-display text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500",
                (mobileHovered ?? (pathname === "/settings" ? "/settings" : active)) === "/settings"
                  ? "text-brand-ink"
                  : "text-header-ink"
              )}
            >
              {(mobileHovered ?? (pathname === "/settings" ? "/settings" : active)) === "/settings" && (
                <motion.span
                  layoutId="mobile-nav-bubble"
                  className="absolute inset-0 -z-10 rounded-2xl bg-brand/25"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <SettingsIcon className="h-5 w-5" />
              {t.nav.settings}
            </Link>
          </motion.div>
        </nav>

        {/* Always visible at the bottom, clear of the phone's home bar */}
        <div
          className="container-academy shrink-0 border-t border-charcoal-900/5 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:px-6"
          onClick={(e) => e.stopPropagation()}
        >
          <Link
            href="/contact"
            onClick={() => handleNavClick("/contact")}
            className={cn(buttonVariants(), "w-full bg-brand text-header hover:bg-brand/90")}
          >
            {t.common.enquire}
          </Link>
        </div>
      </motion.div>
    </header>
  );
}
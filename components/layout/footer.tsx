"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Facebook, Youtube, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { scrollToHash } from "@/lib/utils";
import { useData, useT } from "@/hooks/use-i18n";
import { useContent, useShownLink } from "@/hooks/use-content";
import { fmt } from "@/lib/i18n";
import { webLink } from "@/lib/contact";
import FieldError from "@/components/ui/field-error";
import { useFieldErrors } from "@/hooks/use-field-errors";
import { checkEmail } from "@/lib/validation";
import { cn } from "@/lib/utils";

export default function Footer() {
  const pathname = usePathname();
  const t = useT();
  const { nav } = useData();
  // Social links from the admin's Contact page; an icon only shows once its link is set
  const contact = useContent().contact;
  const socials = [
    { icon: Instagram, label: "Instagram", href: webLink(contact?.instagram) },
    { icon: Facebook, label: "Facebook", href: webLink(contact?.facebook) },
    { icon: Youtube, label: "YouTube", href: webLink(contact?.youtube) },
  ].filter((s) => s.href);
  const linkClass =
    "transition-all duration-300 hover:text-sage-300 hover:pl-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 rounded px-1";
  // Pages the admin has hidden are left out
  const shown = useShownLink();
  const emailCheck = useFieldErrors("footer", (values) => {
    const code = checkEmail(values.email);
    return code ? { email: code } : {};
  });
  const supportLinks: [href: string, label: string][] = [
    ["/faq", t.footer.helpCenter],
    ["/classes", t.footer.courseSupport],
    ["/contact", t.footer.customerSupport],
    ["/faq", t.footer.faq],
    ["/accessories", t.footer.accessories],
    ["/other-services", t.footer.otherServices],
    ["/testimonials", t.footer.testimonials],
    ["/settings", t.footer.settings],
  ];

  // If already on the target page, smooth-scroll immediately; otherwise let
  // the Link's own navigation happen — Navbar's useHashScroll picks it up on arrival.
  const handleHashClick = (href: string) => {
    if (!href.includes("#")) return;
    const [path, hash] = href.split("#");
    const targetPath = path || "/";
    if (pathname === targetPath) {
      scrollToHash(hash);
    }
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-charcoal-900 via-ink-950 to-charcoal-900 text-white">
      {/* Soft botanical wash - matching all sections with dark theme */}
      <div className="pointer-events-none absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full bg-sage-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-sage-400/10 blur-[130px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-500/5 blur-[140px]" />
      
      {/* Subtle gradient overlay for depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sage-500/5 via-transparent to-transparent" />

      <div className="container-academy relative grid gap-10 sm:gap-12 py-20 pb-28 lg:pb-20 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
        <div>
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="font-display text-lg sm:text-xl font-medium">
              Zayit <span className="italic text-sage-300 transition-colors group-hover:text-sage-200">Academy</span>
            </span>
          </Link>
          <div className="mt-3 sm:mt-4 max-w-xs space-y-1 text-xs sm:text-sm text-white/70">
            <p className="font-medium text-white/90">Create with Purpose. Grow with Confidence.</p>
            <p className="text-sage-300">Spreading Peace Through Art.</p>
            {/* The address written out, so searches for "zayitacademy" (one word) match the site */}
            <p className="pt-1 text-white/50">www.zayitacademy.com</p>
          </div>
          {socials.length > 0 && (
            <div className="mt-6 flex gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all duration-300 hover:border-sage-400 hover:bg-sage-500/20 hover:text-sage-300 hover:shadow-lg hover:shadow-sage-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="font-display text-sm sm:text-base font-semibold text-white">{t.footer.quickLinks}</h4>
          <ul className="mt-4 sm:mt-5 space-y-2 sm:space-y-3 text-xs sm:text-sm text-white/60">
            {nav.slice(0, 6).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  scroll={item.href.includes("#") ? false : undefined}
                  onClick={() => handleHashClick(item.href)}
                  className="transition-all duration-300 hover:text-sage-300 hover:pl-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 rounded px-1"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm sm:text-base font-semibold text-white">{t.footer.support}</h4>
          <ul className="mt-4 sm:mt-5 space-y-2 sm:space-y-3 text-xs sm:text-sm text-white/60">
            {supportLinks
              .filter(([href]) => shown(href))
              .map(([href, label]) => (
                <li key={label}>
                  <Link href={href} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm sm:text-base font-semibold text-white">{t.footer.stayInspired}</h4>
          <p className="mt-3 sm:mt-5 text-xs sm:text-sm text-white/60">{t.footer.newsletter}</p>
          <form
            className="mt-4"
            {...emailCheck.formEvents}
            onSubmit={(e) => {
              e.preventDefault();
              emailCheck.checkAll(e.currentTarget);
            }}
          >
            <div className="flex flex-row items-center gap-2 sm:gap-3">
              <input
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                aria-label={t.footer.emailPlaceholder}
                placeholder={t.footer.emailPlaceholder}
                {...emailCheck.fieldProps("email")}
                className={cn(
                  "h-11 sm:h-12 min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-4 sm:px-5 text-sm text-white placeholder:text-white/40 transition-all duration-300 focus:border-sage-400 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-sage-400/20",
                  emailCheck.errors.email && "border-red-400/80 focus:border-red-400 focus:ring-red-400/30"
                )}
              />
              <Button
                size="md"
                className="!h-11 sm:!h-12 !w-11 sm:!w-12 !p-0 bg-sage-500 hover:bg-sage-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-sage-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 shrink-0"
                aria-label={t.footer.subscribe}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <FieldError dark id={emailCheck.messageId("email")} code={emailCheck.errors.email} />
          </form>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 sm:py-6">
        <div className="container-academy flex flex-col items-center justify-between gap-2 sm:gap-3 text-xs text-white/40">
          <span>{fmt(t.footer.rights, { year: new Date().getFullYear() })}</span>
          <span className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-sage-400" />
            {t.common.tagline}
            <span className="h-1 w-1 rounded-full bg-sage-400" />
          </span>
        </div>
      </div>
    </footer>
  );
}
"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ExternalLink, Handshake, Images, Inbox, LayoutTemplate, Palette, PhoneCall, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import NavigationProgress from "@/components/admin/nav-progress";
import SignOutButton from "@/components/admin/sign-out-button";
import { useToast } from "@/components/admin/toast";

const NAV_GROUPS = [
  {
    label: "Inbox",
    items: [
      { href: "/admin/enrollments", label: "Enrollments", icon: Inbox },
      { href: "/admin/enquiries", label: "Collaborations", icon: Handshake },
    ],
  },
  {
    label: "Website",
    items: [
      { href: "/admin/hero", label: "Hero section", icon: LayoutTemplate },
      { href: "/admin/classes", label: "Art Classes", icon: Palette },
      { href: "/admin/gallery", label: "Gallery", icon: Images },
      { href: "/admin/about", label: "About page", icon: UserRound },
      { href: "/admin/contact", label: "Contact details", icon: PhoneCall },
    ],
  },
];

/** Number of new submissions next to a menu item */
function Badge({ count, active }: { count?: number; active: boolean }) {
  if (!count) return null;
  return (
    <span
      className={cn(
        "ml-auto min-w-[1.375rem] rounded-full px-1.5 py-0.5 text-center text-[11px] font-semibold leading-none",
        active ? "bg-sage-700 text-white" : "bg-amber-100 text-amber-800"
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

/** Sidebar on desktop, a scrollable tab bar on phones */
export default function AdminShell({
  name,
  badges = {},
  children,
}: {
  /** The signed-in admin's username, shown at the bottom of the menu */
  name: string;
  /** New-submission counts by menu link, e.g. { "/admin/enrollments": 3 } */
  badges?: Record<string, number>;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { setSidebar } = useToast();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    setSidebar(true);
    return () => setSidebar(false);
  }, [setSidebar]);

  return (
    <div className="lg:flex">
      <NavigationProgress />

      <aside className="z-30 border-b border-charcoal-100 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-6 lg:py-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Image src="/assets/logo_only.png" alt="" width={36} height={36} className="h-9 w-9" />
            <div className="leading-tight">
              <p className="font-display text-base text-charcoal-900">Zayit Academy</p>
              <p className="text-xs text-charcoal-500">Admin</p>
            </div>
          </Link>
          <SignOutButton className="h-10 w-10 hover:bg-charcoal-50 lg:hidden" />
        </div>

        {/* Phones: one scrollable row of tabs */}
        <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 lg:hidden">
          {NAV_GROUPS.flatMap((group) => group.items).map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                isActive(href) ? "bg-sage-100 text-sage-800" : "text-charcoal-600 hover:bg-charcoal-50"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
              <Badge count={badges[href]} active={isActive(href)} />
            </Link>
          ))}
        </nav>

        {/* Desktop: grouped list; scrolls on its own if the screen is short */}
        <nav className="hidden flex-1 space-y-6 overflow-y-auto px-3 lg:block">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-charcoal-400">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive(href) ? "bg-sage-100 text-sage-800" : "text-charcoal-600 hover:bg-charcoal-50 hover:text-charcoal-900"
                    )}
                  >
                    {isActive(href) && <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-sage-600" />}
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                    <Badge count={badges[href]} active={isActive(href)} />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom of the menu: link to the website, then who's signed in with a sign-out button */}
        <div className="hidden space-y-2 border-t border-charcoal-100 p-3 lg:block">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-charcoal-600 transition-colors hover:bg-charcoal-50 hover:text-charcoal-900"
          >
            <ExternalLink className="h-4 w-4 shrink-0" /> View website
          </a>
          <div className="flex items-center gap-3 rounded-2xl border border-charcoal-100 bg-ivory-100/70 py-2 pl-2 pr-1.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sage-600 text-sm font-semibold uppercase text-white">
              {name.charAt(0)}
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-semibold text-charcoal-900">{name}</p>
              <p className="text-xs text-charcoal-500">Admin</p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:ml-64 lg:px-10 lg:py-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

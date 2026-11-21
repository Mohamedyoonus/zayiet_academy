"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ExternalLink, Handshake, Images, Inbox, LayoutTemplate, LogOut, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/admin/actions";

const NAV = [
  { href: "/admin/enrollments", label: "Enrollments", icon: Inbox },
  { href: "/admin/enquiries", label: "Enquiries", icon: Handshake },
  { href: "/admin/hero", label: "Hero section", icon: LayoutTemplate },
  { href: "/admin/classes", label: "Art Classes", icon: Palette },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
];

/** Sidebar on desktop, a scrollable tab bar on phones */
export default function AdminShell({ email, children }: { email: string; children: ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="lg:flex">
      <aside className="sticky top-0 z-30 border-b border-charcoal-100 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-5 lg:py-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Image src="/assets/logo_only.png" alt="" width={36} height={36} className="h-9 w-9" />
            <div className="leading-tight">
              <p className="font-display text-base text-charcoal-900">Zayit Academy</p>
              <p className="text-xs text-charcoal-500">Admin</p>
            </div>
          </Link>
          <form action={signOut} className="lg:hidden">
            <button type="submit" aria-label="Sign out" className="grid h-10 w-10 place-items-center rounded-full text-charcoal-600 hover:bg-charcoal-50">
              <LogOut className="h-5 w-5" />
            </button>
          </form>
        </div>

        <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3 lg:pb-0">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-colors lg:rounded-xl lg:py-2.5",
                isActive(href) ? "bg-sage-100 text-sage-800" : "text-charcoal-600 hover:bg-charcoal-50 hover:text-charcoal-900"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:absolute lg:inset-x-0 lg:bottom-0 lg:block lg:border-t lg:border-charcoal-100 lg:p-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-charcoal-600 hover:bg-charcoal-50"
          >
            <ExternalLink className="h-4 w-4" /> View website
          </a>
          <p className="mt-3 truncate px-3 text-xs text-charcoal-500" title={email}>
            {email}
          </p>
          <form action={signOut}>
            <button type="submit" className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-charcoal-600 hover:bg-charcoal-50">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:ml-64 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}

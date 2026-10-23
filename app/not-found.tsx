"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useT } from "@/hooks/use-i18n";

export default function NotFound() {
  const t = useT().notFound;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-6xl font-bold text-charcoal-900 dark:text-white">404</h1>
      <p className="mt-4 text-xl text-charcoal-500 dark:text-charcoal-300">{t.title}</p>
      <p className="mt-2 text-charcoal-400 dark:text-charcoal-500">{t.text}</p>
      <Link href="/" className="mt-8">
        <Button>{t.home}</Button>
      </Link>
    </div>
  );
}

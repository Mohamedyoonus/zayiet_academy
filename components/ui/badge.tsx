import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function Badge({
  children,
  className,
  variant = "default",
}: {
  children: ReactNode;
  className?: string;
  variant?: "default" | "gold" | "outline" | "dark";
}) {
  const styles = {
    default: "bg-ember-50 text-ember-700 dark:bg-ember-500/10 dark:text-ember-300",
    gold: "bg-gold-50 text-gold-600 dark:bg-gold-400/10 dark:text-gold-300",
    outline: "border border-ink-900/15 text-ink-700 dark:border-white/20 dark:text-white/80",
    dark: "bg-ink-900 text-white dark:bg-white dark:text-ink-900",
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", styles[variant], className)}>
      {children}
    </span>
  );
}

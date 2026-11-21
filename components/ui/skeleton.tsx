import { cn } from "@/lib/utils";

/** A grey placeholder block with a soft light sweeping across it, shown where content is about to appear */
export default function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      aria-hidden
      style={style}
      className={cn(
        "relative overflow-hidden rounded-lg bg-charcoal-100/80",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent",
        className
      )}
    />
  );
}

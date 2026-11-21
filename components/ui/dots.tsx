import { cn } from "@/lib/utils";

/** Three softly pulsing dots — the "working on it" sign inside buttons, in the text colour */
export default function Dots({
  className,
  label = "Loading",
  size = "md",
}: {
  className?: string;
  label?: string;
  size?: "sm" | "md";
}) {
  return (
    <span role="status" aria-label={label} className={cn("inline-flex items-center", size === "sm" ? "gap-0.5" : "gap-[3px]", className)}>
      {[0, 160, 320].map((delay) => (
        <span
          key={delay}
          className={cn("animate-dot-pulse rounded-full bg-current", size === "sm" ? "h-1 w-1" : "h-1.5 w-1.5")}
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  );
}

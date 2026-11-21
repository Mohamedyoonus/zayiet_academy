import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { STATUS_LABELS, type Status } from "@/lib/admin-shared";

// Small building blocks shared by the admin pages.

export const inputClass =
  "w-full rounded-xl border border-charcoal-200 bg-white px-3.5 py-2.5 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-500/20 disabled:opacity-60";

export const buttonClass = {
  primary:
    "inline-flex h-10 items-center justify-center gap-2 rounded-full bg-charcoal-800 px-5 text-sm font-medium text-white transition-colors hover:bg-sage-700 disabled:opacity-50",
  secondary:
    "inline-flex h-10 items-center justify-center gap-2 rounded-full border border-charcoal-200 bg-white px-4 text-sm font-medium text-charcoal-800 transition-colors hover:border-sage-500 hover:text-sage-700 disabled:opacity-50",
  danger:
    "inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50",
};

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-medium text-charcoal-900 sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-charcoal-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-charcoal-100 bg-white p-4 shadow-sm sm:p-5", className)}>{children}</div>;
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-charcoal-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-charcoal-500">{hint}</span>}
    </label>
  );
}

export const statusStyles: Record<Status, string> = {
  new: "bg-amber-100 text-amber-800",
  contacted: "bg-sky-100 text-sky-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-charcoal-100 text-charcoal-600",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", statusStyles[status])}>
      {STATUS_LABELS[status]}
    </span>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-charcoal-200 bg-white/60 px-6 py-14 text-center">
      <p className="font-display text-lg text-charcoal-900">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-md text-sm text-charcoal-500">{children}</div>}
    </div>
  );
}

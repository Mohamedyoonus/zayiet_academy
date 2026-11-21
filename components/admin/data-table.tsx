import type { ReactNode } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/admin-shared";

// The table used for Enrollments and Collaborations. On desktop it fills the
// page width with fixed column sizes; on small screens it scrolls sideways and
// the first column (the person's name) stays in view.

export type Column = { label: string; /** e.g. "14%" */ width: string };

export function TableShell({ columns, children }: { columns: Column[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-charcoal-100 bg-white shadow-sm lg:overflow-x-visible">
      <table className="w-full min-w-[900px] table-fixed border-separate border-spacing-0 text-left text-[13px] lg:min-w-0">
        <colgroup>
          {columns.map((column, i) => (
            <col key={i} style={{ width: column.width }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columns.map((column, i) => (
              <th
                key={i}
                scope="col"
                className={cn(
                  "border-b border-charcoal-100 bg-ivory-100 px-3 py-3 text-[11px] font-semibold uppercase tracking-wide text-charcoal-500",
                  i === 0 && "sticky left-0 z-10 rounded-tl-2xl",
                  i === columns.length - 1 && "rounded-tr-2xl"
                )}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

/** A table row; cells highlight together on hover */
export function Row({ children }: { children: ReactNode }) {
  return <tr className="group align-top">{children}</tr>;
}

export function Td({ sticky = false, className, children }: { sticky?: boolean; className?: string; children?: ReactNode }) {
  return (
    <td
      className={cn(
        "break-words border-b border-charcoal-100 px-3 py-3 group-last:border-b-0 group-hover:bg-ivory-100/60",
        sticky && "sticky left-0 z-10 bg-white",
        className
      )}
    >
      {children}
    </td>
  );
}

/** Tap-to-call number, WhatsApp link and email, stacked in one cell */
export function ContactCell({ mobile, email }: { mobile: string; email: string }) {
  return (
    <div className="min-w-0 space-y-1">
      <a href={`tel:${mobile.replace(/[^\d+]/g, "")}`} className="block truncate text-charcoal-800 hover:text-sage-700">
        {mobile}
      </a>
      <a href={whatsappLink(mobile)} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-emerald-700 hover:underline">
        <MessageCircle className="h-3.5 w-3.5 shrink-0" /> WhatsApp
      </a>
      <a href={`mailto:${email}`} className="flex min-w-0 items-center gap-1 text-xs text-charcoal-600 hover:text-sage-700" title={email}>
        <Mail className="h-3.5 w-3.5 shrink-0 text-charcoal-400" />
        <span className="truncate">{email}</span>
      </a>
    </div>
  );
}

/** Long text cut to three lines; the full text shows on hover */
export function ClampedText({ text }: { text: string | null }) {
  if (!text) return <span className="text-charcoal-300">—</span>;
  return (
    <p className="line-clamp-3 whitespace-pre-line" title={text}>
      {text}
    </p>
  );
}

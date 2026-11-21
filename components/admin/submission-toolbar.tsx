import Link from "next/link";
import { Download, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUSES, STATUS_LABELS, type Status, type SubmissionTable } from "@/lib/admin-shared";
import { buttonClass, inputClass } from "@/components/admin/ui";

/** Status filter, search box and Excel download above a list of submissions */
export default function SubmissionToolbar({
  table,
  counts,
  status,
  q,
}: {
  table: SubmissionTable;
  counts: Record<Status, number>;
  status?: Status;
  q?: string;
}) {
  const basePath = `/admin/${table}`;
  const total = STATUSES.reduce((sum, s) => sum + counts[s], 0);
  const href = (next?: Status) => {
    const params = new URLSearchParams();
    if (next) params.set("status", next);
    if (q) params.set("q", q);
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };
  const tabs: { key?: Status; label: string; count: number }[] = [
    { label: "All", count: total },
    ...STATUSES.map((s) => ({ key: s, label: STATUS_LABELS[s], count: counts[s] })),
  ];

  return (
    <div className="mb-5 space-y-3">
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        {tabs.map((tab) => (
          <Link
            key={tab.label}
            href={href(tab.key)}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              status === tab.key
                ? "border-charcoal-800 bg-charcoal-800 text-white"
                : "border-charcoal-200 bg-white text-charcoal-700 hover:border-sage-500"
            )}
          >
            {tab.label} <span className="opacity-70">{tab.count}</span>
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <form action={basePath} className="flex flex-1 gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={q} placeholder="Search name, phone or email" className={inputClass} />
          <button type="submit" aria-label="Search" className={cn(buttonClass.secondary, "w-11 shrink-0 px-0")}>
            <Search className="h-4 w-4" />
          </button>
        </form>
        <a href={`/admin/export/${table}${status ? `?status=${status}` : ""}`} className={buttonClass.secondary}>
          <Download className="h-4 w-4" /> Download Excel
        </a>
      </div>
    </div>
  );
}

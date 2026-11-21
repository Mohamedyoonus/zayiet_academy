import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { shiftDate, todayInIndia, type SubmissionTable } from "@/lib/admin-shared";
import { buttonClass } from "@/components/admin/ui";
import SearchField from "@/components/admin/search-field";
import DateRangeField from "@/components/admin/date-range-field";

export type SubmissionFilters = { q?: string; from?: string; to?: string };

/** Search (as you type), date filter and Excel download above a list of submissions */
export default function SubmissionToolbar({ table, filters }: { table: SubmissionTable; filters: SubmissionFilters }) {
  const { q, from, to } = filters;
  const basePath = `/admin/${table}`;

  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const exportQuery = params.toString();

  const today = todayInIndia();
  // Quick choices inside the date picker
  const presets = [
    { label: "Today", from: today, to: today },
    { label: "Yesterday", from: shiftDate(today, -1), to: shiftDate(today, -1) },
    { label: "Last 7 days", from: shiftDate(today, -6), to: today },
    { label: "Last 30 days", from: shiftDate(today, -29), to: today },
    { label: "This month", from: `${today.slice(0, 8)}01`, to: today },
  ];

  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
      <SearchField basePath={basePath} q={q} from={from} to={to} />
      <DateRangeField basePath={basePath} q={q} from={from} to={to} today={today} presets={presets} />
      <a href={`/admin/export/${table}${exportQuery ? `?${exportQuery}` : ""}`} className={cn(buttonClass.secondary, "h-[42px] shrink-0")}>
        <Download className="h-4 w-4" /> Download Excel
      </a>
    </div>
  );
}

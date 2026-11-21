import { getAdminState, searchFilter } from "@/lib/admin";
import {
  dateRange,
  formatDateTime,
  isDateParam,
  isStatus,
  isSubmissionTable,
  STATUS_LABELS,
  type Status,
} from "@/lib/admin-shared";
import { collaborationTypes } from "@/lib/data";

// Downloads enrollments or enquiries as a CSV file that opens in Excel.

type Row = Record<string, unknown>;
type Column = [header: string, value: (row: Row) => unknown];

const COLUMNS: Record<"enrollments" | "enquiries", Column[]> = {
  enrollments: [
    ["Date", (r) => formatDateTime(String(r.created_at))],
    ["Status", (r) => STATUS_LABELS[r.status as Status]],
    ["Student", (r) => r.student_name],
    ["Age", (r) => r.student_age],
    ["Course", (r) => r.course_title],
    ["Mode", (r) => r.mode],
    ["Parent / guardian", (r) => r.parent_name],
    ["Mobile", (r) => r.mobile],
    ["Email", (r) => r.email],
    ["Message", (r) => r.message],
    ["Notes", (r) => r.notes],
  ],
  enquiries: [
    ["Date", (r) => formatDateTime(String(r.created_at))],
    ["Status", (r) => STATUS_LABELS[r.status as Status]],
    ["Name", (r) => r.name],
    ["Organisation", (r) => r.organisation],
    ["Type", (r) => collaborationTypes.find((t) => t.value === r.collaboration_type)?.label ?? r.collaboration_type],
    ["Preferred date", (r) => r.preferred_date],
    ["Mobile", (r) => r.mobile],
    ["Email", (r) => r.email],
    ["Message", (r) => r.message],
    ["Notes", (r) => r.notes],
  ],
};

function cell(value: unknown) {
  let text = value === null || value === undefined ? "" : String(value);
  // Stop spreadsheet apps from running a visitor's text as a formula
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export async function GET(request: Request, { params }: { params: Promise<{ table: string }> }) {
  const { table } = await params;
  if (!isSubmissionTable(table)) return new Response("Not found", { status: 404 });

  const state = await getAdminState();
  if (state.status !== "admin") return new Response("Please sign in to the admin first.", { status: 401 });

  // Same filters as the list on screen
  const filters = new URL(request.url).searchParams;
  const status = filters.get("status");
  const from = filters.get("from");
  const to = filters.get("to");
  const range = dateRange(isDateParam(from) ? from : undefined, isDateParam(to) ? to : undefined);
  const searchColumns =
    table === "enrollments"
      ? ["student_name", "parent_name", "mobile", "email", "course_title"]
      : ["name", "organisation", "mobile", "email"];

  let query = state.supabase.from(table).select("*").order("created_at", { ascending: false });
  if (isStatus(status)) query = query.eq("status", status);
  if (range.start) query = query.gte("created_at", range.start);
  if (range.end) query = query.lt("created_at", range.end);
  const search = searchFilter(filters.get("q") ?? undefined, searchColumns);
  if (search) query = query.or(search);
  const { data, error } = await query;
  if (error) return new Response(`Couldn’t export: ${error.message}`, { status: 500 });

  const columns = COLUMNS[table];
  const lines = [
    columns.map(([header]) => cell(header)).join(","),
    ...((data ?? []) as Row[]).map((row) => columns.map(([, value]) => cell(value(row))).join(",")),
  ];
  const date = new Date().toISOString().slice(0, 10);

  // The byte-order mark makes Excel read Tamil, Hindi and other scripts correctly
  return new Response(`﻿${lines.join("\r\n")}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="zayit-${table}${isStatus(status) ? `-${status}` : ""}${isDateParam(from) ? `-from-${from}` : ""}${isDateParam(to) ? `-to-${to}` : ""}-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

import { Suspense } from "react";
import type { Metadata } from "next";
import { getAdminClient, searchFilter } from "@/lib/admin";
import { dateRange, formatDate, formatDateTime, isDateParam, type Enquiry } from "@/lib/admin-shared";
import { collaborationTypes } from "@/lib/data";
import { EmptyState, PageHeader } from "@/components/admin/ui";
import SubmissionToolbar, { type SubmissionFilters } from "@/components/admin/submission-toolbar";
import { DeleteCell, NotesCell, StatusCell } from "@/components/admin/submission-cells";
import { ClampedText, ContactCell, Row, TableShell, Td, type Column } from "@/components/admin/data-table";
import { TableSkeleton } from "@/components/admin/skeletons";

export const metadata: Metadata = { title: "Collaborations" };

const COLUMNS: Column[] = [
  { label: "Name", width: "16%" },
  { label: "Received", width: "11%" },
  { label: "Request", width: "16%" },
  { label: "Contact", width: "18%" },
  { label: "Message", width: "17%" },
  { label: "Status & notes", width: "18%" },
  { label: "", width: "4%" },
];

const typeLabel = (value: string) => collaborationTypes.find((t) => t.value === value)?.label ?? value;

type SearchParams = Promise<{ q?: string; from?: string; to?: string }>;

export default async function EnquiriesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const filters: SubmissionFilters = {
    q: params.q?.trim() || undefined,
    from: isDateParam(params.from) ? params.from : undefined,
    to: isDateParam(params.to) ? params.to : undefined,
  };

  return (
    <>
      <PageHeader
        title="Collaborations"
        description="Everyone who sent the form on the Collaboration page — schools, communities and organisations — newest first."
      />
      <SubmissionToolbar table="enquiries" filters={filters} />
      {/* Only the table waits for the data, so the search box keeps focus while you type */}
      <Suspense key={JSON.stringify(filters)} fallback={<TableSkeleton rows={6} />}>
        <EnquiriesTable filters={filters} />
      </Suspense>
    </>
  );
}

async function EnquiriesTable({ filters }: { filters: SubmissionFilters }) {
  const supabase = await getAdminClient();
  if (!supabase) return null;
  const range = dateRange(filters.from, filters.to);

  let query = supabase.from("enquiries").select("*").order("created_at", { ascending: false }).limit(500);
  if (range.start) query = query.gte("created_at", range.start);
  if (range.end) query = query.lt("created_at", range.end);
  const search = searchFilter(filters.q, ["name", "organisation", "mobile", "email"]);
  if (search) query = query.or(search);

  const { data, error } = await query;
  const enquiries = (data ?? []) as Enquiry[];
  const filtered = Boolean(filters.q || filters.from || filters.to);

  if (error) return <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">Couldn’t load collaboration requests: {error.message}</p>;
  if (enquiries.length === 0) {
    return (
      <EmptyState title={filtered ? "No matching collaboration requests" : "No collaboration requests yet"}>
        {filtered ? "Try a different search or date range." : "Requests sent from the Collaboration page will appear here."}
      </EmptyState>
    );
  }

  return (
    <>
      <p className="mb-2 text-sm text-charcoal-500">
        Showing {enquiries.length} {enquiries.length === 1 ? "request" : "requests"}
      </p>
      <TableShell columns={COLUMNS}>
        {enquiries.map((e) => (
          <Row key={e.id}>
            <Td sticky>
              <div className="font-medium text-charcoal-900">{e.name}</div>
              {e.organisation && <div className="text-xs text-charcoal-500">{e.organisation}</div>}
            </Td>
            <Td className="text-xs text-charcoal-600">{formatDateTime(e.created_at)}</Td>
            <Td>
              <div className="text-charcoal-800">{typeLabel(e.collaboration_type)}</div>
              {e.preferred_date && <div className="text-xs text-charcoal-500">For {formatDate(e.preferred_date)}</div>}
            </Td>
            <Td>
              <ContactCell mobile={e.mobile} email={e.email} />
            </Td>
            <Td className="text-charcoal-700">
              <ClampedText text={e.message} />
            </Td>
            <Td className="space-y-2 py-2.5">
              <StatusCell table="enquiries" id={e.id} status={e.status} />
              <NotesCell table="enquiries" id={e.id} notes={e.notes} />
            </Td>
            <Td className="px-1 py-2.5 text-center">
              <DeleteCell table="enquiries" id={e.id} />
            </Td>
          </Row>
        ))}
      </TableShell>
    </>
  );
}

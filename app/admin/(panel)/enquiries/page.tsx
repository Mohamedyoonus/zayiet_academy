import type { Metadata } from "next";
import { countByStatus, getAdminClient, searchFilter } from "@/lib/admin";
import { formatDate, formatDateTime, isStatus, type Enquiry } from "@/lib/admin-shared";
import { collaborationTypes } from "@/lib/data";
import { Card, EmptyState, PageHeader } from "@/components/admin/ui";
import SubmissionToolbar from "@/components/admin/submission-toolbar";
import SubmissionControls from "@/components/admin/submission-controls";
import ContactLinks from "@/components/admin/contact-links";

export const metadata: Metadata = { title: "Enquiries" };

const typeLabel = (value: string) => collaborationTypes.find((t) => t.value === value)?.label ?? value;

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const supabase = await getAdminClient();
  if (!supabase) return null;
  const { status: statusParam, q } = await searchParams;
  const status = isStatus(statusParam) ? statusParam : undefined;

  let query = supabase.from("enquiries").select("*").order("created_at", { ascending: false }).limit(500);
  if (status) query = query.eq("status", status);
  const search = searchFilter(q, ["name", "organisation", "mobile", "email"]);
  if (search) query = query.or(search);

  const [{ data, error }, counts] = await Promise.all([query, countByStatus(supabase, "enquiries")]);
  const enquiries = (data ?? []) as Enquiry[];

  return (
    <>
      <PageHeader title="Enquiries" description="Collaboration requests from schools, communities and organisations." />
      <SubmissionToolbar table="enquiries" counts={counts} status={status} q={q} />

      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">Couldn’t load enquiries: {error.message}</p>}

      {enquiries.length === 0 ? (
        <EmptyState title={q || status ? "No matching enquiries" : "No enquiries yet"}>
          {q || status ? "Try a different search or filter." : "Requests sent from the Collaboration page will appear here."}
        </EmptyState>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {enquiries.map((e) => (
            <Card key={e.id}>
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                <div>
                  <h2 className="font-display text-lg text-charcoal-900">{e.name}</h2>
                  {e.organisation && <p className="text-sm text-charcoal-600">{e.organisation}</p>}
                </div>
                <p className="text-xs text-charcoal-500">{formatDateTime(e.created_at)}</p>
              </div>

              <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-charcoal-500">Type</dt>
                  <dd className="text-charcoal-800">{typeLabel(e.collaboration_type)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-charcoal-500">Preferred date</dt>
                  <dd className="text-charcoal-800">{e.preferred_date ? formatDate(e.preferred_date) : "—"}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="mb-1 text-xs text-charcoal-500">Contact</dt>
                  <dd>
                    <ContactLinks mobile={e.mobile} email={e.email} />
                  </dd>
                </div>
              </dl>
              <p className="mt-3 whitespace-pre-line rounded-xl bg-ivory-100 p-3 text-sm text-charcoal-700">{e.message}</p>

              <SubmissionControls table="enquiries" id={e.id} status={e.status} notes={e.notes} />
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

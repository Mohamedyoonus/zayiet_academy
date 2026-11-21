import type { Metadata } from "next";
import { countByStatus, getAdminClient, searchFilter } from "@/lib/admin";
import { formatDateTime, isStatus, type Enrollment } from "@/lib/admin-shared";
import { Card, EmptyState, PageHeader } from "@/components/admin/ui";
import SubmissionToolbar from "@/components/admin/submission-toolbar";
import SubmissionControls from "@/components/admin/submission-controls";
import ContactLinks from "@/components/admin/contact-links";

export const metadata: Metadata = { title: "Enrollments" };

export default async function EnrollmentsPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const supabase = await getAdminClient();
  if (!supabase) return null;
  const { status: statusParam, q } = await searchParams;
  const status = isStatus(statusParam) ? statusParam : undefined;

  let query = supabase.from("enrollments").select("*").order("created_at", { ascending: false }).limit(500);
  if (status) query = query.eq("status", status);
  const search = searchFilter(q, ["student_name", "parent_name", "mobile", "email", "course_title"]);
  if (search) query = query.or(search);

  const [{ data, error }, counts] = await Promise.all([query, countByStatus(supabase, "enrollments")]);
  const enrollments = (data ?? []) as Enrollment[];

  return (
    <>
      <PageHeader title="Enrollments" description="Everyone who filled in the Enroll form on the website, newest first." />
      <SubmissionToolbar table="enrollments" counts={counts} status={status} q={q} />

      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">Couldn’t load enrollments: {error.message}</p>}

      {enrollments.length === 0 ? (
        <EmptyState title={q || status ? "No matching enrollments" : "No enrollments yet"}>
          {q || status ? "Try a different search or filter." : "When someone enrolls on the website, they’ll appear here."}
        </EmptyState>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {enrollments.map((e) => (
            <Card key={e.id}>
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                <div>
                  <h2 className="font-display text-lg text-charcoal-900">
                    {e.student_name}
                    {e.student_age !== null && <span className="font-body text-sm text-charcoal-500"> · {e.student_age} yrs</span>}
                  </h2>
                  <p className="text-sm text-charcoal-600">
                    {e.course_title} · <span className="capitalize">{e.mode}</span>
                  </p>
                </div>
                <p className="text-xs text-charcoal-500">{formatDateTime(e.created_at)}</p>
              </div>

              <dl className="mt-3 space-y-2 text-sm">
                <div>
                  <dt className="text-xs text-charcoal-500">Parent / guardian</dt>
                  <dd className="text-charcoal-800">{e.parent_name}</dd>
                </div>
                <div>
                  <dt className="mb-1 text-xs text-charcoal-500">Contact</dt>
                  <dd>
                    <ContactLinks mobile={e.mobile} email={e.email} />
                  </dd>
                </div>
              </dl>
              {e.message && <p className="mt-3 whitespace-pre-line rounded-xl bg-ivory-100 p-3 text-sm text-charcoal-700">{e.message}</p>}

              <SubmissionControls table="enrollments" id={e.id} status={e.status} notes={e.notes} />
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

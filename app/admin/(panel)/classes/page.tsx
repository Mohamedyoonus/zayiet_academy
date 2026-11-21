import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { getAdminClient } from "@/lib/admin";
import type { CourseRow } from "@/lib/content";
import { formatINR } from "@/lib/utils";
import { EmptyState, PageHeader, buttonClass } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Art Classes" };

export default async function ClassesAdminPage() {
  const supabase = await getAdminClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("courses").select("*").order("sort").order("title");
  const courses = (data ?? []) as CourseRow[];

  return (
    <>
      <PageHeader
        title="Art Classes"
        description="The courses on the Art Classes page, the enroll form and the class finder."
        actions={
          <Link href="/admin/classes/new" className={buttonClass.primary}>
            <Plus className="h-4 w-4" /> Add course
          </Link>
        }
      />

      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">Couldn’t load courses: {error.message}</p>}

      {courses.length === 0 ? (
        <EmptyState title="No courses yet">Add a course and it will appear on the website.</EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/admin/classes/${course.id}`}
              className="group overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[16/9] bg-charcoal-50">
                {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnail of any uploaded URL */}
                {course.image && <img src={course.image} alt="" className="h-full w-full object-cover" />}
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-sage-800">
                  {course.tier}
                </span>
                {!course.published && (
                  <span className="absolute right-3 top-3 rounded-full bg-charcoal-800 px-2.5 py-0.5 text-xs font-semibold text-white">
                    Hidden
                  </span>
                )}
              </div>
              <div className="flex items-start justify-between gap-3 p-4">
                <div className="min-w-0">
                  <h2 className="font-display text-lg text-charcoal-900">{course.title}</h2>
                  <p className="mt-0.5 text-sm text-charcoal-600">
                    {formatINR(course.fee_offline)} offline · {formatINR(course.fee_online)} online
                  </p>
                </div>
                <Pencil className="mt-1 h-4 w-4 shrink-0 text-charcoal-400 group-hover:text-sage-700" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAdminClient } from "@/lib/admin";
import { courseFromRow, type CourseRow } from "@/lib/content";
import type { CourseInput } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/ui";
import CourseForm from "@/components/admin/course-form";

export const metadata: Metadata = { title: "Edit course" };

export default async function CourseEditPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await getAdminClient();
  if (!supabase) return null;
  const { id } = await params;
  const isNew = id === "new";

  let initial: CourseInput;
  if (isNew) {
    // New courses go after the existing ones
    const { data: last } = await supabase.from("courses").select("sort").order("sort", { ascending: false }).limit(1).maybeSingle();
    initial = {
      id: "",
      sort: (last?.sort ?? 0) + 1,
      tier: "",
      title: "",
      description: "",
      duration: "6 Months",
      schedule: "2 classes / week · 1.5 hrs each",
      batchSize: "15 Students Only",
      feeOffline: 0,
      feeOnline: 0,
      highlights: [],
      image: "",
      certificate: true,
      published: true,
    };
  } else {
    const { data } = await supabase.from("courses").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    const row = data as CourseRow;
    initial = { ...courseFromRow(row), sort: row.sort, published: row.published };
  }

  return (
    <>
      <Link href="/admin/classes" className="mb-4 inline-flex items-center gap-1.5 text-sm text-charcoal-600 hover:text-sage-700">
        <ArrowLeft className="h-4 w-4" /> All courses
      </Link>
      <PageHeader title={isNew ? "Add course" : initial.title} />
      <CourseForm initial={initial} isNew={isNew} />
    </>
  );
}

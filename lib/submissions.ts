"use server";

import { createPublicClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";
import { getSiteContent } from "@/lib/content";
import { collaborationTypes, courses as defaultCourses } from "@/lib/data";
import { formValues, isoDate, validateEnquiry, validateEnrollment, type FieldErrors } from "@/lib/validation";

// Saves the website's Enroll and Collaboration forms so they show up in /admin.
// The same checks as in the browser (lib/validation) run here too.

/** `errors`: which fields were rejected, so the form can point at them */
type Result = { ok: boolean; errors?: FieldErrors };

/** Name of a hidden field real visitors never fill in; bots usually do */
const HONEYPOT = "website";

const text = (form: FormData, key: string, max: number) => String(form.get(key) ?? "").trim().slice(0, max);

async function save(table: "enrollments" | "enquiries", row: Record<string, unknown>): Promise<Result> {
  if (!supabaseConfigured) {
    console.warn(`Supabase isn't set up yet, so a new ${table} entry was not saved.`);
    return { ok: true };
  }
  const { error } = await createPublicClient().from(table).insert(row);
  if (error) {
    console.error(`Could not save to ${table}:`, error.message);
    return { ok: false };
  }
  return { ok: true };
}

export async function submitEnrollment(form: FormData): Promise<Result> {
  if (text(form, HONEYPOT, 200)) return { ok: true };

  const courseId = text(form, "course", 60);
  const { courses } = await getSiteContent();
  const course = (courses ?? defaultCourses).find((c) => c.id === courseId);
  const mode = text(form, "mode", 10);
  if (!course || (mode !== "offline" && mode !== "online")) return { ok: false };

  const errors = validateEnrollment(formValues(form));
  if (Object.keys(errors).length) return { ok: false, errors };

  return save("enrollments", {
    course_id: courseId,
    course_title: course.title,
    mode,
    student_name: text(form, "studentName", 120),
    student_age: Number.parseInt(text(form, "studentAge", 3), 10),
    parent_name: text(form, "parentName", 120),
    mobile: text(form, "mobile", 30),
    email: text(form, "email", 200),
    message: text(form, "message", 2000) || null,
  });
}

export async function submitEnquiry(form: FormData): Promise<Result> {
  if (text(form, HONEYPOT, 200)) return { ok: true };

  const errors = validateEnquiry(formValues(form), {
    types: collaborationTypes.map((c) => c.value),
    // A day's leeway: the visitor's "today" can be ahead of the server's
    earliestDate: isoDate(-1),
  });
  if (Object.keys(errors).length) return { ok: false, errors };

  return save("enquiries", {
    name: text(form, "name", 120),
    organisation: text(form, "organisation", 160) || null,
    email: text(form, "email", 200),
    mobile: text(form, "mobile", 30),
    collaboration_type: text(form, "collaborationType", 40),
    preferred_date: text(form, "preferredDate", 10),
    message: text(form, "message", 2000),
  });
}

"use server";

import { createPublicClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";
import { getSiteContent } from "@/lib/content";
import { collaborationTypes, courses as defaultCourses } from "@/lib/data";

// Saves the website's Enroll and Collaboration forms so they show up in /admin.

type Result = { ok: boolean };

/** Name of a hidden field real visitors never fill in; bots usually do */
const HONEYPOT = "website";

const text = (form: FormData, key: string, max: number) => String(form.get(key) ?? "").trim().slice(0, max);
const looksLikeEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const looksLikePhone = (value: string) => value.replace(/\D/g, "").length >= 7;

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
  const age = Number.parseInt(text(form, "studentAge", 3), 10);

  const row = {
    course_id: courseId,
    course_title: course?.title ?? courseId,
    mode,
    student_name: text(form, "studentName", 120),
    student_age: Number.isFinite(age) && age >= 3 && age <= 99 ? age : null,
    parent_name: text(form, "parentName", 120),
    mobile: text(form, "mobile", 30),
    email: text(form, "email", 200),
    message: text(form, "message", 2000) || null,
  };

  const valid =
    course &&
    (mode === "offline" || mode === "online") &&
    row.student_name &&
    row.parent_name &&
    looksLikePhone(row.mobile) &&
    looksLikeEmail(row.email);
  if (!valid) return { ok: false };

  return save("enrollments", row);
}

export async function submitEnquiry(form: FormData): Promise<Result> {
  if (text(form, HONEYPOT, 200)) return { ok: true };

  const type = text(form, "collaborationType", 40);
  const date = text(form, "preferredDate", 10);

  const row = {
    name: text(form, "name", 120),
    organisation: text(form, "organisation", 160) || null,
    email: text(form, "email", 200),
    mobile: text(form, "mobile", 30),
    collaboration_type: type,
    preferred_date: /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null,
    message: text(form, "message", 2000),
  };

  const valid =
    row.name &&
    row.message &&
    collaborationTypes.some((c) => c.value === type) &&
    looksLikePhone(row.mobile) &&
    looksLikeEmail(row.email);
  if (!valid) return { ok: false };

  return save("enquiries", row);
}

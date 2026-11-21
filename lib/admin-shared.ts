// Shared by the admin's server code and its browser components.

export const STATUSES = ["new", "contacted", "confirmed", "cancelled"] as const;
export type Status = (typeof STATUSES)[number];
export const STATUS_LABELS: Record<Status, string> = {
  new: "New",
  contacted: "Contacted",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
};
export const isStatus = (value: unknown): value is Status => STATUSES.includes(value as Status);

/** Tables that hold form submissions from the website */
export const SUBMISSION_TABLES = ["enrollments", "enquiries"] as const;
export type SubmissionTable = (typeof SUBMISSION_TABLES)[number];
export const isSubmissionTable = (value: unknown): value is SubmissionTable =>
  SUBMISSION_TABLES.includes(value as SubmissionTable);

export type Enrollment = {
  id: string;
  created_at: string;
  course_id: string;
  course_title: string;
  mode: "offline" | "online";
  student_name: string;
  student_age: number | null;
  parent_name: string;
  mobile: string;
  email: string;
  message: string | null;
  status: Status;
  notes: string | null;
};

export type Enquiry = {
  id: string;
  created_at: string;
  name: string;
  organisation: string | null;
  email: string;
  mobile: string;
  collaboration_type: string;
  preferred_date: string | null;
  message: string;
  status: Status;
  notes: string | null;
};

/** "21 Nov 2026, 1:31 pm" in Indian time */
export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(
    new Date(iso)
  );
}

/** A plain calendar date such as "2026-12-05" → "5 Dec 2026" */
export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

/** WhatsApp chat link; 10-digit numbers are treated as Indian */
export function whatsappLink(mobile: string) {
  let digits = mobile.replace(/\D/g, "");
  if (digits.length === 10) digits = `91${digits}`;
  return `https://wa.me/${digits}`;
}

/** "Watercolour Basics!" → "watercolour-basics" (used as a course's id in links) */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

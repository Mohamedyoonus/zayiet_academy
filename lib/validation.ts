// Checks for the website's forms. The same rules run in the browser (instant
// messages under each field) and on the server (so they can't be skipped).

/** What's wrong with a field; the message for each is in the dictionary's `validation` section */
export type ErrorCode =
  | "required"
  | "name"
  | "email"
  | "phone"
  | "age"
  | "date"
  | "datePast"
  | "message"
  | "choice"
  | "tooLong";

export type FieldErrors = Partial<Record<string, ErrorCode>>;

const clean = (value: unknown) => String(value ?? "").trim();

/** Every field of a form as trimmed text */
export function formValues(form: FormData): Record<string, string> {
  return Object.fromEntries([...form.entries()].map(([key, value]) => [key, clean(value)]));
}

/** A person's name: letters in any language, with spaces, dots, apostrophes or hyphens */
export function checkName(raw: unknown): ErrorCode | null {
  const value = clean(raw);
  if (!value) return "required";
  if (value.length > 120) return "tooLong";
  const letters = value.replace(/[^\p{L}]/gu, "").length;
  return /^[\p{L}\p{M}][\p{L}\p{M}\s.'’-]*$/u.test(value) && letters >= 2 ? null : "name";
}

export function checkEmail(raw: unknown): ErrorCode | null {
  const value = clean(raw);
  if (!value) return "required";
  if (value.length > 200) return "tooLong";
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? null : "email";
}

/**
 * An Indian mobile (10 digits starting 6–9, with or without +91 / 0 in front),
 * or an international number written with its + country code.
 */
export function checkPhone(raw: unknown): ErrorCode | null {
  const value = clean(raw);
  if (!value) return "required";
  if (!/^[+\d\s()-]+$/.test(value)) return "phone";
  const digits = value.replace(/\D/g, "");
  if (value.startsWith("+") && !value.startsWith("+91")) {
    return digits.length >= 8 && digits.length <= 15 ? null : "phone";
  }
  const local = digits.replace(/^(91|0)(?=\d{10}$)/, "");
  return /^[6-9]\d{9}$/.test(local) ? null : "phone";
}

/** Students are 5–16 */
export function checkAge(raw: unknown): ErrorCode | null {
  const value = clean(raw);
  if (!value) return "required";
  const age = Number(value);
  return /^\d{1,2}$/.test(value) && age >= 5 && age <= 16 ? null : "age";
}

/** Today's date (YYYY-MM-DD) where the code runs; `offsetDays` moves it */
export function isoDate(offsetDays = 0) {
  const d = new Date(Date.now() + offsetDays * 86_400_000);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

/** A real date (YYYY-MM-DD), not before `earliest`, and within the next two years */
export function checkDate(raw: unknown, earliest: string): ErrorCode | null {
  const value = clean(raw);
  if (!value) return "required";
  const date = new Date(`${value}T00:00:00`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(date.getTime())) return "date";
  if (value < earliest) return "datePast";
  return value <= isoDate(730) ? null : "date";
}

/** Free text: `min` characters when required; never over `max` */
export function checkText(raw: unknown, { required = false, min = 0, max = 2000 } = {}): ErrorCode | null {
  const value = clean(raw);
  if (!value) return required ? "required" : null;
  if (value.length > max) return "tooLong";
  return value.length >= min ? null : "message";
}

const collect = (checks: Record<string, ErrorCode | null>): FieldErrors =>
  Object.fromEntries(Object.entries(checks).filter(([, code]) => code !== null)) as FieldErrors;

export function validateEnrollment(values: Record<string, unknown>): FieldErrors {
  return collect({
    studentName: checkName(values.studentName),
    studentAge: checkAge(values.studentAge),
    parentName: checkName(values.parentName),
    mobile: checkPhone(values.mobile),
    email: checkEmail(values.email),
    message: checkText(values.message),
  });
}

export function validateEnquiry(
  values: Record<string, unknown>,
  { types, earliestDate }: { types: readonly string[]; earliestDate: string }
): FieldErrors {
  const type = clean(values.collaborationType);
  return collect({
    name: checkName(values.name),
    organisation: checkText(values.organisation, { max: 160 }),
    email: checkEmail(values.email),
    mobile: checkPhone(values.mobile),
    // A dropdown: "choose an option" reads better than "fill this in"
    collaborationType: types.includes(type) ? null : "choice",
    preferredDate: checkDate(values.preferredDate, earliestDate),
    message: checkText(values.message, { required: true, min: 10 }),
  });
}

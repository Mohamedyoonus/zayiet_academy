"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminClient } from "@/lib/admin";
import { isStatus, isSubmissionTable } from "@/lib/admin-shared";
import { CONTENT_TAG, type AboutContent, type ContactContent, type HeroContent } from "@/lib/content";
import { MEDIA_BUCKET, SUPABASE_URL, supabaseConfigured } from "@/lib/supabase/config";
import { createSessionClient } from "@/lib/supabase/server";
import { galleryCategories } from "@/lib/data";
import { normalizeLayout, type LayoutContent } from "@/lib/site-layout";
import { normalizeStore, storeProblem, type StoreContent } from "@/lib/store";

// Everything the admin pages change. Each action checks for a signed-in admin
// first; the database's own rules check again.

export type ActionResult = { ok: true } | { ok: false; error: string };

const done: ActionResult = { ok: true };
const failed = (error: string): ActionResult => ({ ok: false, error });

async function admin() {
  const supabase = await getAdminClient();
  if (!supabase) throw new Error("Your login has expired. Please sign in again.");
  return supabase;
}

async function run(action: () => Promise<ActionResult>): Promise<ActionResult> {
  try {
    return await action();
  } catch (error) {
    return failed(error instanceof Error ? error.message : "Something went wrong.");
  }
}

/** Updates the public website straight away */
function refreshSite(adminPath: string) {
  revalidateTag(CONTENT_TAG);
  revalidatePath(adminPath);
}

const clean = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max);

/** Storage path of a photo uploaded from the admin, or null for any other URL */
function mediaPath(url: string) {
  const prefix = `${SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/`;
  return url.startsWith(prefix) ? decodeURIComponent(url.slice(prefix.length)) : null;
}

async function removeMedia(supabase: Awaited<ReturnType<typeof admin>>, url: string) {
  const path = mediaPath(url);
  if (path) await supabase.storage.from(MEDIA_BUCKET).remove([path]);
}

/* ------------------------------ Form submissions ------------------------------ */

export async function setSubmissionStatus(table: string, id: string, status: string) {
  return run(async () => {
    if (!isSubmissionTable(table) || !isStatus(status)) return failed("Unknown status.");
    const supabase = await admin();
    const { error } = await supabase.from(table).update({ status }).eq("id", id);
    if (error) return failed(error.message);
    revalidatePath(`/admin/${table}`);
    return done;
  });
}

export async function saveSubmissionNotes(table: string, id: string, notes: string) {
  return run(async () => {
    if (!isSubmissionTable(table)) return failed("Unknown list.");
    const supabase = await admin();
    const { error } = await supabase
      .from(table)
      .update({ notes: clean(notes, 2000) || null })
      .eq("id", id);
    if (error) return failed(error.message);
    revalidatePath(`/admin/${table}`);
    return done;
  });
}

export async function deleteSubmission(table: string, id: string) {
  return run(async () => {
    if (!isSubmissionTable(table)) return failed("Unknown list.");
    const supabase = await admin();
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return failed(error.message);
    revalidatePath(`/admin/${table}`);
    return done;
  });
}

/* ------------------------------------ Hero ------------------------------------ */

export async function saveHero(input: HeroContent) {
  return run(async () => {
    const hero: HeroContent = {
      eyebrow: clean(input.eyebrow, 80),
      titleBefore: clean(input.titleBefore, 120),
      titleHighlight: clean(input.titleHighlight, 120),
      titleAfter: clean(input.titleAfter, 120),
      description: clean(input.description, 600),
      image: clean(input.image, 1000),
      stats: (input.stats ?? [])
        .map((s) => ({ value: clean(s.value, 20), label: clean(s.label, 40) }))
        .filter((s) => s.value || s.label)
        .slice(0, 3),
    };
    if (!hero.titleHighlight && !hero.titleBefore) return failed("Add a title.");
    if (!hero.image) return failed("Add a photo.");

    const supabase = await admin();
    const { error } = await supabase
      .from("site_content")
      .upsert({ key: "hero", data: hero, updated_at: new Date().toISOString() });
    if (error) return failed(error.message);
    refreshSite("/admin/hero");
    return done;
  });
}

/* ------------------------------- Pages & sections ------------------------------- */

export async function saveLayout(input: LayoutContent) {
  return run(async () => {
    // Drops unknown names and keeps the hero first, whatever was sent
    const layout = normalizeLayout(input);
    const supabase = await admin();
    const { error } = await supabase
      .from("site_content")
      .upsert({ key: "layout", data: layout, updated_at: new Date().toISOString() });
    if (error) return failed(error.message);
    refreshSite("/admin/pages");
    return done;
  });
}

/* ------------------------------------ Store ------------------------------------ */

export async function saveStore(input: StoreContent) {
  return run(async () => {
    const store = normalizeStore(input);
    if (!store) return failed("Nothing to save.");
    const problem = storeProblem(store);
    if (problem) return failed(problem.message);

    const supabase = await admin();
    // Photos uploaded for products that are now deleted (or replaced) are removed from storage
    const { data: before } = await supabase.from("site_content").select("data").eq("key", "store").maybeSingle();
    const kept = new Set(store.products.map((p) => p.image));
    const dropped = (normalizeStore(before?.data)?.products ?? []).map((p) => p.image).filter((url) => !kept.has(url));

    const { error } = await supabase
      .from("site_content")
      .upsert({ key: "store", data: store, updated_at: new Date().toISOString() });
    if (error) return failed(error.message);
    await Promise.all(dropped.map((url) => removeMedia(supabase, url)));
    refreshSite("/admin/store");
    return done;
  });
}

/* ------------------------------- About & Contact ------------------------------- */

async function savePage(key: "about" | "contact", data: Record<string, string>) {
  const supabase = await admin();
  const { error } = await supabase.from("site_content").upsert({ key, data, updated_at: new Date().toISOString() });
  if (error) return failed(error.message);
  refreshSite(`/admin/${key}`);
  return done;
}

// Longer fields hold paragraphs; everything else is a line or two
const ABOUT_LONG = new Set<keyof AboutContent>(["story", "coFounderBio", "aboutZayitText", "mission", "vision", "closingText"]);
const ABOUT_PHOTOS = new Set<keyof AboutContent>(["photo", "coFounderPhoto"]);

export async function saveAbout(input: AboutContent) {
  return run(async () => {
    const data = Object.fromEntries(
      (Object.keys(input) as (keyof AboutContent)[]).map((key) => [
        key,
        clean(input[key], ABOUT_PHOTOS.has(key) ? 1000 : ABOUT_LONG.has(key) ? 3000 : 200),
      ])
    );
    if (!data.photo) return failed("Add the founder’s photo.");
    if (!data.title) return failed("Add the founder’s name.");
    return savePage("about", data);
  });
}

export async function saveContact(input: ContactContent) {
  return run(async () => {
    const data = Object.fromEntries(
      (Object.keys(input) as (keyof ContactContent)[]).map((key) => [
        key,
        clean(input[key], key === "description" || key === "addressValue" ? 600 : 300),
      ])
    );
    if (data.emailValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emailValue)) return failed("Check the email address.");
    for (const [key, label] of [
      ["phoneValue", "phone number"],
      ["whatsapp", "WhatsApp number"],
    ] as const) {
      if (data[key] && data[key].replace(/\D/g, "").length < 8) return failed(`Check the ${label}.`);
    }
    for (const [key, label] of [
      ["instagram", "Instagram"],
      ["facebook", "Facebook"],
      ["youtube", "YouTube"],
    ] as const) {
      if (data[key] && !/^https?:\/\/\S+$/i.test(data[key])) return failed(`The ${label} link should start with https://`);
    }
    return savePage("contact", data);
  });
}

/* ---------------------------------- Courses ---------------------------------- */

export type CourseInput = {
  id: string;
  sort: number;
  tier: string;
  title: string;
  description: string;
  duration: string;
  schedule: string;
  batchSize: string;
  feeOffline: number;
  feeOnline: number;
  highlights: string[];
  image: string;
  certificate: boolean;
  published: boolean;
};

const fee = (value: number) => (Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0);

/** The enroll form and class finder need at least one course on the website */
async function isLastPublishedCourse(supabase: Awaited<ReturnType<typeof admin>>, id: string) {
  const { count } = await supabase
    .from("courses")
    .select("id", { count: "exact", head: true })
    .eq("published", true)
    .neq("id", id);
  return (count ?? 0) === 0;
}

export async function saveCourse(input: CourseInput, isNew: boolean) {
  return run(async () => {
    const id = clean(input.id, 40);
    if (!/^[a-z0-9-]{1,40}$/.test(id)) return failed("Add a course name.");
    const title = clean(input.title, 120);
    const tier = clean(input.tier, 40);
    if (!title) return failed("Add a course name.");
    if (!tier) return failed("Add a level (for example Basic).");
    if (!input.image) return failed("Add a photo.");

    const row = {
      id,
      sort: Number.isFinite(input.sort) ? Math.round(input.sort) : 0,
      tier,
      title,
      description: clean(input.description, 600),
      duration: clean(input.duration, 60),
      schedule: clean(input.schedule, 80),
      batch_size: clean(input.batchSize, 60),
      fee_offline: fee(input.feeOffline),
      fee_online: fee(input.feeOnline),
      highlights: input.highlights.map((h) => clean(h, 120)).filter(Boolean).slice(0, 8),
      image: clean(input.image, 1000),
      certificate: Boolean(input.certificate),
      published: Boolean(input.published),
      updated_at: new Date().toISOString(),
    };

    const supabase = await admin();
    if (!row.published && !isNew && (await isLastPublishedCourse(supabase, id))) {
      return failed("Keep at least one course on the website — the enroll form needs it.");
    }

    const { error } = isNew
      ? await supabase.from("courses").insert(row)
      : await supabase.from("courses").update(row).eq("id", id);
    if (error) {
      return failed(error.code === "23505" ? "A course with this name already exists. Choose another name." : error.message);
    }
    refreshSite("/admin/classes");
    return done;
  });
}

export async function deleteCourse(id: string) {
  return run(async () => {
    const supabase = await admin();
    if (await isLastPublishedCourse(supabase, id)) {
      return failed("Keep at least one course on the website — the enroll form needs it.");
    }
    const { data } = await supabase.from("courses").select("image").eq("id", id).maybeSingle();
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) return failed(error.message);
    if (data?.image) await removeMedia(supabase, data.image);
    refreshSite("/admin/classes");
    return done;
  });
}

/* ---------------------------------- Gallery ---------------------------------- */

const validCategory = (category: string) => (galleryCategories as readonly string[]).includes(category);

export async function addGalleryItems(items: { title: string; category: string; image: string }[]) {
  return run(async () => {
    if (!items.length) return done;
    if (!items.every((item) => validCategory(item.category) && item.image)) return failed("Choose a category.");
    const supabase = await admin();
    // New photos go to the front of the gallery
    const { data: first } = await supabase.from("gallery_items").select("sort").order("sort").limit(1).maybeSingle();
    const start = (first?.sort ?? 1) - items.length;
    const { error } = await supabase.from("gallery_items").insert(
      items.map((item, i) => ({
        title: clean(item.title, 120),
        category: item.category,
        image: clean(item.image, 1000),
        sort: start + i,
      }))
    );
    if (error) return failed(error.message);
    refreshSite("/admin/gallery");
    return done;
  });
}

export async function updateGalleryItem(id: string, patch: { title?: string; category?: string }) {
  return run(async () => {
    const update: Record<string, string> = {};
    if (patch.title !== undefined) update.title = clean(patch.title, 120);
    if (patch.category !== undefined) {
      if (!validCategory(patch.category)) return failed("Unknown category.");
      update.category = patch.category;
    }
    const supabase = await admin();
    const { error } = await supabase.from("gallery_items").update(update).eq("id", id);
    if (error) return failed(error.message);
    refreshSite("/admin/gallery");
    return done;
  });
}

/** Saves a new order: `ids` from first to last */
export async function reorderGallery(ids: string[]) {
  return run(async () => {
    const supabase = await admin();
    const results = await Promise.all(
      ids.map((id, i) => supabase.from("gallery_items").update({ sort: i + 1 }).eq("id", id))
    );
    const error = results.find((r) => r.error)?.error;
    if (error) return failed(error.message);
    refreshSite("/admin/gallery");
    return done;
  });
}

export async function deleteGalleryItem(id: string) {
  return run(async () => {
    const supabase = await admin();
    const { data } = await supabase.from("gallery_items").select("image").eq("id", id).maybeSingle();
    const { error } = await supabase.from("gallery_items").delete().eq("id", id);
    if (error) return failed(error.message);
    if (data?.image) await removeMedia(supabase, data.image);
    refreshSite("/admin/gallery");
    return done;
  });
}

/* ----------------------------------- Login ----------------------------------- */

const WRONG_LOGIN = "Wrong username or password.";

/** Signs in with a username (looked up in the admins table) or a full email, plus password */
export async function signIn(login: string, password: string): Promise<ActionResult> {
  return run(async () => {
    if (!supabaseConfigured) return failed("The admin isn’t connected yet.");
    const supabase = await createSessionClient();

    let email = login.trim();
    if (!email.includes("@")) {
      const { data } = await supabase.rpc("admin_login_email", { login: email });
      if (typeof data !== "string" || !data) return failed(WRONG_LOGIN);
      email = data;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return failed(error.message === "Invalid login credentials" ? WRONG_LOGIN : error.message);
    return done;
  });
}

// Works for anyone signed in, including someone whose email isn't an admin
export async function signOut() {
  if (supabaseConfigured) await (await createSessionClient()).auth.signOut();
  redirect("/admin/login");
}

import type { Metadata } from "next";
import { getAdminClient } from "@/lib/admin";
import type { GalleryRow } from "@/lib/content";
import { PageHeader } from "@/components/admin/ui";
import GalleryManager from "@/components/admin/gallery-manager";

export const metadata: Metadata = { title: "Gallery" };

export default async function GalleryAdminPage() {
  const supabase = await getAdminClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("gallery_items")
    .select("id, sort, title, category, image")
    .order("sort")
    .order("created_at", { ascending: false });

  return (
    <>
      <PageHeader title="Gallery" description="Photos in the gallery on the home page. Changes show on the website straight away." />
      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">Couldn’t load the gallery: {error.message}</p>}
      <GalleryManager items={(data ?? []) as GalleryRow[]} />
    </>
  );
}

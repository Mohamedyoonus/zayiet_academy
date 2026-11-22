import type { Metadata } from "next";
import { getAdminClient } from "@/lib/admin";
import { normalizeLayout } from "@/lib/site-layout";
import { PageHeader } from "@/components/admin/ui";
import LayoutForm from "@/components/admin/layout-form";

export const metadata: Metadata = { title: "Pages & sections" };

export default async function PagesAdminPage() {
  const supabase = await getAdminClient();
  if (!supabase) return null;
  const { data } = await supabase.from("site_content").select("data").eq("key", "layout").maybeSingle();

  return (
    <>
      <PageHeader
        title="Pages & sections"
        description="Choose which pages visitors can open, and which sections the home page shows, in what order."
      />
      {/* Nothing saved yet → everything shown, in the original order */}
      <LayoutForm initial={normalizeLayout(data?.data)} />
    </>
  );
}

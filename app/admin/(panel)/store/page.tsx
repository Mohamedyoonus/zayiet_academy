import type { Metadata } from "next";
import { getAdminClient } from "@/lib/admin";
import { STARTING_STORE, normalizeStore } from "@/lib/store";
import { PageHeader } from "@/components/admin/ui";
import StoreManager from "@/components/admin/store-manager";

export const metadata: Metadata = { title: "Store" };

export default async function StoreAdminPage() {
  const supabase = await getAdminClient();
  if (!supabase) return null;
  const { data } = await supabase.from("site_content").select("data").eq("key", "store").maybeSingle();

  return (
    <>
      <PageHeader
        title="Store"
        description="The products on the Store page: photos, prices, stock and what’s included. Customers send their order on WhatsApp."
      />
      {/* Nothing saved yet → the six starting products, ready to edit */}
      <StoreManager initial={normalizeStore(data?.data) ?? STARTING_STORE} />
    </>
  );
}

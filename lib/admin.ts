import { cache } from "react";
import { createSessionClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";

// Server-side helpers for the admin pages.

type SessionClient = Awaited<ReturnType<typeof createSessionClient>>;

export type AdminState =
  | { status: "unconfigured" }
  | { status: "signed-out" }
  | { status: "not-admin"; email: string }
  | { status: "admin"; email: string; supabase: SessionClient };

/** Who is visiting the admin. Cached per request, so the layout and page share one check. */
export const getAdminState = cache(async (): Promise<AdminState> => {
  if (!supabaseConfigured) return { status: "unconfigured" };
  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "signed-out" };
  // Signing in isn't enough: the email must also be listed in the admins table
  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || !isAdmin) return { status: "not-admin", email: user.email ?? "" };
  return { status: "admin", email: user.email ?? "", supabase };
});

/** The signed-in admin's database client, or null (the layout then shows login or setup instead) */
export async function getAdminClient() {
  const state = await getAdminState();
  return state.status === "admin" ? state.supabase : null;
}

/** Turns a search box entry into a "matches any of these columns" filter */
export function searchFilter(term: string | undefined, columns: string[]) {
  const clean = (term ?? "").replace(/["\\,()%*]/g, " ").trim().slice(0, 60);
  return clean ? columns.map((column) => `${column}.ilike."%${clean}%"`).join(",") : null;
}

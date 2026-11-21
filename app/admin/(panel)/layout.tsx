import { redirect } from "next/navigation";
import { getAdminState } from "@/lib/admin";
import AdminShell from "@/components/admin/admin-shell";
import SetupNotice from "@/components/admin/setup-notice";
import { Card } from "@/components/admin/ui";
import SignOutButton from "@/components/admin/sign-out-button";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const state = await getAdminState();

  if (state.status === "unconfigured") return <SetupNotice />;
  if (state.status === "signed-out") redirect("/admin/login");
  if (state.status === "not-admin") {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <Card className="p-6 text-center sm:p-8">
          <h1 className="font-display text-2xl text-charcoal-900">No admin access</h1>
          <p className="mt-2 text-sm text-charcoal-600">
            {state.email} is signed in, but isn’t on the admin list. Ask the academy to add this email.
          </p>
          <div className="mt-6">
            <SignOutButton withLabel />
          </div>
        </Card>
      </div>
    );
  }

  // How many new (not yet handled) submissions each list has, shown as badges in the menu
  const newCount = (table: "enrollments" | "enquiries") =>
    state.supabase.from(table).select("id", { count: "exact", head: true }).eq("status", "new");
  const [enrollments, enquiries, username] = await Promise.all([
    newCount("enrollments"),
    newCount("enquiries"),
    state.supabase.rpc("my_admin_username"),
  ]);
  const badges = {
    "/admin/enrollments": enrollments.count ?? 0,
    "/admin/enquiries": enquiries.count ?? 0,
  };
  // The admin's username (e.g. "chalz"); the start of the email until it's set up
  const name = (typeof username.data === "string" && username.data) || state.email.split("@")[0];

  return (
    <AdminShell name={name} badges={badges}>
      {children}
    </AdminShell>
  );
}

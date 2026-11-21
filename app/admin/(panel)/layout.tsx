import { redirect } from "next/navigation";
import { getAdminState } from "@/lib/admin";
import AdminShell from "@/components/admin/admin-shell";
import SetupNotice from "@/components/admin/setup-notice";
import { Card, buttonClass } from "@/components/admin/ui";
import { signOut } from "@/app/admin/actions";

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
          <form action={signOut} className="mt-6">
            <button type="submit" className={buttonClass.secondary}>
              Sign out
            </button>
          </form>
        </Card>
      </div>
    );
  }

  return <AdminShell email={state.email}>{children}</AdminShell>;
}

import type { Metadata } from "next";
import { ConfirmProvider } from "@/components/admin/confirm";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Zayit Admin" },
  robots: { index: false, follow: false },
};

// Snackbars come from the site-wide ToastProvider in app/layout.tsx;
// "Delete this?" dialogs from the ConfirmProvider here.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ivory-200/60 text-charcoal-800">
      <ConfirmProvider>{children}</ConfirmProvider>
    </div>
  );
}

"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import Dots from "@/components/ui/dots";
import { useConfirm } from "@/components/admin/confirm";
import { signOut } from "@/app/admin/actions";

/**
 * Asks "Sign out?" first, then shows a "Signing out…" overlay until the
 * server has signed you out and the login page opens.
 */
export default function SignOutButton({ withLabel = false, className }: { withLabel?: boolean; className?: string }) {
  const confirm = useConfirm();
  const [pending, startTransition] = useTransition();

  const click = async () => {
    const ok = await confirm({
      title: "Sign out of the admin?",
      message: "You’ll need your username and password to sign in again.",
      confirmLabel: "Sign out",
      icon: LogOut,
    });
    if (!ok) return;
    startTransition(async () => {
      await signOut();
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={click}
        disabled={pending}
        aria-label="Sign out"
        title="Sign out"
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full text-charcoal-500 transition-colors hover:text-red-600 disabled:opacity-60",
          withLabel ? "h-10 border border-charcoal-200 bg-white px-4 text-sm font-medium text-charcoal-700" : "h-9 w-9 hover:bg-white",
          className
        )}
      >
        <LogOut className="h-4 w-4" />
        {withLabel && "Sign out"}
      </button>

      {pending && (
        <div role="status" aria-live="polite" className="fixed inset-0 z-[130] grid place-items-center bg-ivory-100/70 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 text-sm font-medium text-charcoal-800 shadow-xl ring-1 ring-black/5">
            Signing out <Dots label="Signing out" />
          </div>
        </div>
      )}
    </>
  );
}

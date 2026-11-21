"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonClass } from "@/components/admin/ui";

// A confirmation dialog in the admin's own style, used instead of the browser's
// "localhost says…" pop-up:  if (await confirm({ title: "Delete?" })) { … }

type ConfirmOptions = {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Shown in the red circle; a bin by default */
  icon?: LucideIcon;
};

type Pending = ConfirmOptions & { resolve: (ok: boolean) => void };

const ConfirmContext = createContext<((options: ConfirmOptions) => Promise<boolean>) | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<Pending | null>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const Icon = pending?.icon ?? Trash2;

  const confirm = useCallback(
    (options: ConfirmOptions) => new Promise<boolean>((resolve) => setPending({ ...options, resolve })),
    []
  );

  const close = useCallback(
    (ok: boolean) => {
      pending?.resolve(ok);
      setPending(null);
    },
    [pending]
  );

  // Esc cancels; Cancel gets focus so an accidental Enter never deletes anything
  useEffect(() => {
    if (!pending) return;
    cancelButton.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [pending, close]);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AnimatePresence>
        {pending && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[120] flex items-end justify-center bg-charcoal-900/40 p-4 sm:items-center"
            onMouseDown={(e) => e.target === e.currentTarget && close(false)}
          >
            <motion.div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="confirm-title"
              aria-describedby={pending.message ? "confirm-message" : undefined}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
            >
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-red-50 text-red-600">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 pt-0.5">
                  <h2 id="confirm-title" className="font-display text-lg leading-snug text-charcoal-900">
                    {pending.title}
                  </h2>
                  {pending.message && (
                    <p id="confirm-message" className="mt-1 text-sm leading-relaxed text-charcoal-600">
                      {pending.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button ref={cancelButton} type="button" onClick={() => close(false)} className={buttonClass.secondary}>
                  {pending.cancelLabel ?? "Cancel"}
                </button>
                <button
                  type="button"
                  onClick={() => close(true)}
                  className={cn(buttonClass.primary, "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500")}
                >
                  {pending.confirmLabel ?? "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const confirm = useContext(ConfirmContext);
  if (!confirm) throw new Error("useConfirm must be used inside ConfirmProvider");
  return confirm;
}

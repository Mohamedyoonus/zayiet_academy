"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Snackbars: short messages in the top-right corner ("Saved", "Thank you!",
// "Upload failed", …) with a bar that shrinks until they close by themselves.
// Hovering pauses the countdown. Used on the website and in the admin.

type Kind = "success" | "error";
type Toast = { id: number; kind: Kind; message: string };

const DURATION: Record<Kind, number> = { success: 4500, error: 6500 };

type ToastApi = {
  success: (message: string) => void;
  error: (message: string) => void;
  /** Inside the admin there's no website menu bar, so snackbars sit at the very top */
  setSidebar: (inAdmin: boolean) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const duration = DURATION[toast.kind];
  const [paused, setPaused] = useState(false);
  const remaining = useRef(duration);
  const dismiss = useRef(onDismiss);
  dismiss.current = onDismiss;

  // Close when the time runs out; hovering pauses the clock where it is
  useEffect(() => {
    if (paused) return;
    const startedAt = Date.now();
    const timer = window.setTimeout(() => dismiss.current(), remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current -= Date.now() - startedAt;
    };
  }, [paused]);

  const success = toast.kind === "success";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 32, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 32, scale: 0.97 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      role={success ? "status" : "alert"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="pointer-events-auto relative w-full overflow-hidden rounded-2xl bg-charcoal-900 text-sm text-white shadow-xl ring-1 ring-black/10"
    >
      <div className="flex items-start gap-3 px-4 pb-3.5 pt-3">
        {success ? (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
        ) : (
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
        )}
        <p className="flex-1 leading-snug">{toast.message}</p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="-mr-1 grid h-6 w-6 shrink-0 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      {/* Time left: shrinks from full width to nothing */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
        <div
          className={cn("h-full origin-left animate-countdown", success ? "bg-emerald-400" : "bg-red-400")}
          style={{ animationDuration: `${duration}ms`, animationPlayState: paused ? "paused" : "running" }}
        />
      </div>
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [inAdmin, setSidebar] = useState(false);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const show = useCallback((kind: Kind, message: string) => {
    const id = ++nextId.current;
    // Newest first, at most three on screen
    setToasts((list) => [{ id, kind, message }, ...list].slice(0, 3));
  }, []);

  const api = useMemo<ToastApi>(() => ({ success: (m) => show("success", m), error: (m) => show("error", m), setSidebar }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className={cn(
          "pointer-events-none fixed inset-x-3 z-[110] flex flex-col gap-2 sm:left-auto sm:right-5 sm:w-96",
          // On the website, sit just under the menu bar
          inAdmin ? "top-3 sm:top-5" : "top-[5.25rem]"
        )}
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const api = useContext(ToastContext);
  if (!api) throw new Error("useToast must be used inside ToastProvider");
  return api;
}

"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CircleAlert, Eye, EyeOff, Lock, User } from "lucide-react";
import { signIn } from "@/app/admin/actions";
import Dots from "@/components/ui/dots";
import { Field, buttonClass, inputClass } from "@/components/admin/ui";
import { SITE_TAGLINE } from "@/lib/site";
import { cn } from "@/lib/utils";

// "Beyond Art. Towards a Better You" → two lines on the photo panel
const [taglineFirst, taglineRest] = (() => {
  const cut = SITE_TAGLINE.indexOf(". ");
  return cut === -1 ? [SITE_TAGLINE, ""] : [SITE_TAGLINE.slice(0, cut + 1), SITE_TAGLINE.slice(cut + 2)];
})();

function Brand({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "grid h-12 w-12 shrink-0 place-items-center rounded-2xl",
          light ? "bg-white/90 shadow-md" : "border border-charcoal-100 bg-white shadow-sm"
        )}
      >
        <Image src="/assets/logo_only.png" alt="" width={36} height={36} className="h-9 w-9" />
      </span>
      <div>
        <p className={cn("font-display text-xl leading-tight", light ? "text-white" : "text-charcoal-900")}>
          Zayit Academy
        </p>
        <p className={cn("text-sm", light ? "text-white/70" : "text-charcoal-500")}>Admin panel</p>
      </div>
    </div>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const [busy, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await signIn(String(form.get("username")), String(form.get("password")));
      if (!result.ok) return setError(result.error);
      router.replace("/admin");
      router.refresh();
    });
  }

  const checkCapsLock = (event: React.KeyboardEvent<HTMLInputElement>) =>
    setCapsLock(event.getModifierState("CapsLock"));

  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      {/* Desktop: the studio photo with the brand and tagline */}
      <aside className="relative hidden overflow-hidden lg:block">
        <Image
          src="/assets/hero.webp"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 55vw, 0px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/35 to-charcoal-900/20" />
        <div className="relative flex h-full flex-col justify-between p-10 xl:p-12">
          <Brand light />
          <div className="text-white">
            <p className="font-display text-4xl leading-tight xl:text-5xl">
              {taglineFirst}
              {taglineRest && (
                <>
                  <br />
                  <span className="italic text-sage-200">{taglineRest}</span>
                </>
              )}
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75">
              Manage classes, the gallery, enrollments and enquiries: everything visitors see on the website.
            </p>
          </div>
        </div>
      </aside>

      {/* The form */}
      <main className="relative flex items-center justify-center overflow-hidden px-5 py-12 sm:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(32rem_24rem_at_100%_0%,rgb(var(--c-sage-200)/0.5),transparent_70%),radial-gradient(28rem_20rem_at_0%_100%,rgb(232_176_75/0.12),transparent_70%)]"
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-sm"
        >
          {/* Phones & tablets: the photo panel is hidden, so show the brand here */}
          <div className="mb-10 lg:hidden">
            <Brand />
          </div>

          <h1 className="font-display text-3xl font-medium text-charcoal-900">Welcome back</h1>
          <p className="mt-1.5 text-sm text-charcoal-500">Sign in to manage the Zayit Academy website.</p>

          {error && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
            >
              <CircleAlert className="mt-px h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Typing again clears the last error */}
          <form onSubmit={submit} onChange={() => error && setError(null)} className="mt-6 space-y-4">
            <Field label="Username or email">
              <span className="relative block">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
                <input
                  name="username"
                  required
                  autoFocus
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  className={cn(inputClass, "h-11 pl-10")}
                />
              </span>
            </Field>

            <Field label="Password">
              <span className="relative block">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  onKeyDown={checkCapsLock}
                  onKeyUp={checkCapsLock}
                  onBlur={() => setCapsLock(false)}
                  className={cn(inputClass, "h-11 pl-10 pr-11")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-charcoal-400 transition-colors hover:bg-charcoal-50 hover:text-charcoal-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </span>
            </Field>
            {capsLock && <p className="-mt-2 text-xs font-medium text-amber-700">Caps Lock is on</p>}

            <button type="submit" disabled={busy} className={cn(buttonClass.primary, "!mt-6 h-11 w-full")}>
              {busy ? (
                <>
                  Signing in <Dots label="Signing in" />
                </>
              ) : (
                <>
                  Sign in <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <Link
            href="/"
            className="mt-10 inline-flex items-center gap-1.5 text-sm text-charcoal-500 transition-colors hover:text-sage-700"
          >
            <ArrowLeft className="h-4 w-4" /> Back to website
          </Link>
        </motion.div>
      </main>
    </div>
  );
}

"use client";

import { useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "@/app/admin/actions";
import Dots from "@/components/ui/dots";
import { Card, Field, buttonClass, inputClass } from "@/components/admin/ui";
import { useToast } from "@/components/admin/toast";

export default function LoginForm() {
  const router = useRouter();
  const toast = useToast();
  const [busy, startTransition] = useTransition();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await signIn(String(form.get("username")), String(form.get("password")));
      if (!result.ok) return toast.error(result.error);
      router.replace("/admin");
      router.refresh();
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <Image src="/assets/logo_only.png" alt="" width={44} height={44} className="h-11 w-11" />
          <div>
            <p className="font-display text-xl text-charcoal-900">Zayit Academy</p>
            <p className="text-sm text-charcoal-500">Admin sign in</p>
          </div>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field label="Username">
            <input
              name="username"
              required
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              className={inputClass}
            />
          </Field>
          <Field label="Password">
            <input name="password" type="password" required autoComplete="current-password" className={inputClass} />
          </Field>
          <button type="submit" disabled={busy} className={`${buttonClass.primary} w-full`}>
            {busy ? (
              <>
                Signing in <Dots label="Signing in" />
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </Card>
    </div>
  );
}

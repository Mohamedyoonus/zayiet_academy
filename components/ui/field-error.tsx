"use client";

import { CircleAlert } from "lucide-react";
import { useT } from "@/hooks/use-i18n";
import type { ErrorCode } from "@/lib/validation";
import { cn } from "@/lib/utils";

/** The message under a form field that needs fixing (nothing when it's fine) */
export default function FieldError({ id, code, dark = false }: { id: string; code?: ErrorCode; dark?: boolean }) {
  const t = useT().validation;
  if (!code) return null;
  return (
    <p id={id} className={cn("mt-1.5 flex items-start gap-1.5 text-xs font-medium", dark ? "text-red-300" : "text-red-600")}>
      <CircleAlert className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
      {t[code]}
    </p>
  );
}

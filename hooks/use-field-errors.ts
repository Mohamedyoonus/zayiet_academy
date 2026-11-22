"use client";

import { useState } from "react";
import { formValues, type FieldErrors } from "@/lib/validation";

/**
 * Field-by-field checking for a website form (`id` keeps the message ids unique):
 * - leaving a filled-in field checks it, and fixing a field clears its message as you type
 * - `checkAll(form)` checks everything before sending, shows every message and
 *   moves to the first field that needs fixing
 */
export function useFieldErrors(id: string, validate: (values: Record<string, string>) => FieldErrors) {
  const [errors, setErrors] = useState<FieldErrors>({});

  const checkOne = (form: HTMLFormElement, name: string) => {
    const code = validate(formValues(new FormData(form)))[name];
    setErrors((current) => {
      const next = { ...current };
      if (code) next[name] = code;
      else delete next[name];
      return next;
    });
  };

  /** Show these errors (from the browser or the server) and move to the first one */
  const show = (form: HTMLFormElement, found: FieldErrors) => {
    setErrors(found);
    const first = Array.from(form.elements).find((el) => (el as HTMLInputElement).name in found) as
      | HTMLElement
      | undefined;
    if (first) {
      first.focus({ preventScroll: true });
      first.scrollIntoView({ block: "center", behavior: "smooth" });
    }
    return !first;
  };

  return {
    errors,
    /** True when every field is fine */
    checkAll: (form: HTMLFormElement) => show(form, validate(formValues(new FormData(form)))),
    show,
    clear: () => setErrors({}),
    /** Spread onto the <form> */
    formEvents: {
      noValidate: true,
      onBlur: (event: React.FocusEvent<HTMLFormElement>) => {
        // The event comes up from the field inside the form
        const field = event.target as unknown as HTMLInputElement;
        // Empty fields are only flagged on send, so tabbing past one isn't scolded
        if (field.name && (field.value.trim() || errors[field.name])) checkOne(event.currentTarget, field.name);
      },
      onChange: (event: React.ChangeEvent<HTMLFormElement>) => {
        const field = event.target as unknown as HTMLInputElement;
        if (field.name && errors[field.name]) checkOne(event.currentTarget, field.name);
      },
    },
    /** Spread onto an input: marks it invalid and links it to its message */
    fieldProps: (name: string) => ({
      "aria-invalid": errors[name] ? true : undefined,
      "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
    }),
    messageId: (name: string) => `${id}-${name}-error`,
  };
}

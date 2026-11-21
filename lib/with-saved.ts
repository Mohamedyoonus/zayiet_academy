/** Values saved in the admin, laid over the built-in text. Fields left empty in the admin keep the built-in text. */
export function withSaved<T extends object, S extends object>(defaults: T, saved: S | null | undefined): T & Partial<S> {
  const filled = Object.fromEntries(
    Object.entries(saved ?? {}).filter(([, value]) => (typeof value === "string" ? value.trim() !== "" : value != null))
  );
  return { ...defaults, ...filled } as T & Partial<S>;
}

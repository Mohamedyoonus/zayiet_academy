// Supabase project keys (Project Settings → API Keys). Both are safe to expose:
// the database's row-level security decides what each visitor can do.
// Until they're set, the site uses the content in lib/data.ts and the admin
// shows setup instructions.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

/** Public bucket for photos uploaded from the admin */
export const MEDIA_BUCKET = "media";

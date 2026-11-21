import { Card } from "@/components/admin/ui";

/** Shown on /admin until the Supabase keys are added */
export default function SetupNotice() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <Card className="p-6 sm:p-8">
        <h1 className="font-display text-2xl text-charcoal-900">Admin isn’t connected yet</h1>
        <p className="mt-2 text-sm text-charcoal-600">
          The admin needs a Supabase project. Until it’s connected, the website shows its built-in content and form
          submissions are not saved.
        </p>
        <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-charcoal-700">
          <li>Create a project at supabase.com (region: Mumbai).</li>
          <li>
            In its SQL Editor, run <code className="rounded bg-charcoal-50 px-1">supabase/schema.sql</code> from this
            project.
          </li>
          <li>
            Add <code className="rounded bg-charcoal-50 px-1">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code className="rounded bg-charcoal-50 px-1">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> to{" "}
            <code className="rounded bg-charcoal-50 px-1">.env.local</code> and to Vercel’s Environment Variables.
          </li>
          <li>Restart the site (or redeploy on Vercel).</li>
        </ol>
      </Card>
    </div>
  );
}

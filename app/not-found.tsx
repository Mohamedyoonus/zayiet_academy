import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-6xl font-bold text-charcoal-900 dark:text-white">404</h1>
      <p className="mt-4 text-xl text-charcoal-500 dark:text-charcoal-300">Page not found</p>
      <p className="mt-2 text-charcoal-400 dark:text-charcoal-500">The page you're looking for doesn't exist.</p>
      <Link href="/" className="mt-8">
        <Button>Go back home</Button>
      </Link>
    </div>
  );
}

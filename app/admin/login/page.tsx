import type { Metadata } from "next";
import { supabaseConfigured } from "@/lib/supabase/config";
import SetupNotice from "@/components/admin/setup-notice";
import LoginForm from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function AdminLoginPage() {
  return supabaseConfigured ? <LoginForm /> : <SetupNotice />;
}

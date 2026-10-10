import { redirect } from "next/navigation";
import { AppShell, SetupNotice } from "@/components/app-shell";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) return <SetupNotice/>;
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return <AppShell email={user.email || "Personal account"}>{children}</AppShell>;
}

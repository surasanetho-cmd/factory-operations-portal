import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Profile, UserRole } from "@/types/database";

export async function DashboardShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  const { count } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar role={profile.role as UserRole} />
      <div className="flex flex-1 flex-col">
        <Header profile={profile as Profile} unreadCount={count ?? 0} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

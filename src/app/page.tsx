import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { defaultDashboardPath } from "@/lib/permissions";
import type { UserRole } from "@/types/database";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  redirect(defaultDashboardPath((profile?.role as UserRole) ?? "MANAGER"));
}

import { createClient } from "@/lib/supabase/server";

export async function logActivity(
  userId: string,
  action: string,
  module: string,
  description: string
) {
  const supabase = await createClient();
  await supabase.from("activity_logs").insert({
    user_id: userId,
    action,
    module,
    description,
  });
}

export async function createNotification(
  userId: string,
  title: string,
  message: string
) {
  const supabase = await createClient();
  await supabase.from("notifications").insert({
    user_id: userId,
    title,
    message,
  });
}

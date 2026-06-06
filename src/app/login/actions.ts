"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { defaultDashboardPath } from "@/lib/permissions";
import type { UserRole } from "@/types/database";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "กรุณากรอกอีเมลและรหัสผ่าน" };
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  ) {
    return {
      error:
        "ยังไม่ได้ตั้งค่า Supabase บน Vercel — ใส่ NEXT_PUBLIC_SUPABASE_URL และ NEXT_PUBLIC_SUPABASE_ANON_KEY",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return {
        error:
          "อีเมลยังไม่ได้ยืนยัน — ใน Supabase Dashboard ให้ติ๊ก Auto Confirm หรือยืนยัน user ด้วยตนเอง",
      };
    }
    if (error.message.toLowerCase().includes("fetch failed")) {
      return {
        error:
          "เชื่อมต่อ Supabase ไม่ได้ — ตรวจ NEXT_PUBLIC_SUPABASE_URL บน Vercel ว่าเป็น https://mpjenispayfpsozcyird.supabase.co (สะกด mpjenispay ไม่ใช่ mpjeninspay) แล้ว Redeploy",
      };
    }
    return { error: "เข้าสู่ระบบไม่สำเร็จ: " + error.message };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "เข้าสู่ระบบไม่สำเร็จ — ไม่พบ session" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    return {
      error:
        "ไม่พบ profile ของ user นี้ — ตรวจใน Supabase Table Editor ว่ามีแถวใน profiles หรือรัน migration/trigger handle_new_user",
    };
  }

  revalidatePath("/", "layout");
  redirect(defaultDashboardPath(profile.role as UserRole));
}

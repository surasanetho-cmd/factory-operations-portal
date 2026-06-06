"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ configError }: { configError: boolean }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAction,
    {}
  );

  return (
    <div className="card-glass w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl font-bold text-accent">FOP</h1>
        <p className="text-sm text-muted">Factory Operations Portal</p>
      </div>
      {configError && (
        <p className="mb-4 rounded-md border border-[var(--color-danger)] bg-[rgba(224,92,74,0.1)] p-3 text-sm text-[var(--color-danger)]">
          ยังไม่ได้ตั้งค่า Supabase บน Vercel — ใส่ NEXT_PUBLIC_SUPABASE_URL และ
          NEXT_PUBLIC_SUPABASE_ANON_KEY แล้ว Redeploy
        </p>
      )}
      {state.error && (
        <p className="mb-4 rounded-md border border-[var(--color-danger)] bg-[rgba(224,92,74,0.1)] p-3 text-sm text-[var(--color-danger)]">
          {state.error}
        </p>
      )}
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">อีเมล</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@company.com"
            required
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">รหัสผ่าน</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </div>
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </Button>
      </form>
    </div>
  );
}

"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const configError = searchParams.get("error") === "config";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast.error("เข้าสู่ระบบไม่สำเร็จ: " + error.message);
      return;
    }

    toast.success("เข้าสู่ระบบสำเร็จ");
    router.push("/");
    router.refresh();
  }

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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">อีเมล</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">รหัสผ่าน</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </Button>
      </form>
    </div>
  );
}

function LoginFormFallback() {
  return (
    <div className="card-glass w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl font-bold text-accent">FOP</h1>
        <p className="text-sm text-muted">Factory Operations Portal</p>
      </div>
      <p className="text-center text-sm text-muted">กำลังโหลด...</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-4">
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

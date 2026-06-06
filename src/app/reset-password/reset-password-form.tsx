"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("รหัสผ่านไม่ตรงกัน");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast.error("เปลี่ยนรหัสผ่านไม่สำเร็จ: " + error.message);
      return;
    }

    toast.success("เปลี่ยนรหัสผ่านสำเร็จ");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="card-glass w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl font-bold text-accent">FOP</h1>
        <p className="text-sm text-muted">ตั้งรหัสผ่านใหม่</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">รหัสผ่านใหม่</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "กำลังบันทึก..." : "บันทึกรหัสผ่าน"}
        </Button>
      </form>
    </div>
  );
}

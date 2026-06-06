"use client";

import { Bell, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types/database";

export function Header({
  profile,
  unreadCount = 0,
}: {
  profile: Profile;
  unreadCount?: number;
}) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-[var(--color-bg-subtle)] px-6">
      <div>
        <p className="text-sm text-muted">ยินดีต้อนรับ</p>
        <p className="font-medium text-foreground">{profile.name}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative rounded-md p-2 hover:bg-accent/10"
          aria-label="การแจ้งเตือน"
        >
          <Bell className="h-5 w-5 text-[var(--color-text-subtle)]" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-danger)] text-[10px] text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
        <div className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5">
          <User className="h-4 w-4 text-muted" />
          <span className="text-sm">{profile.role}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          ออกจากระบบ
        </Button>
      </div>
    </header>
  );
}

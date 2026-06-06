"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function HashSessionHandler() {
  const router = useRouter();
  const [handling, setHandling] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;

    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const type = params.get("type");

    if (!accessToken || !refreshToken) return;

    setHandling(true);
    const supabase = createClient();

    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ error }) => {
        window.history.replaceState(null, "", window.location.pathname);
        if (error) {
          router.replace("/login?error=auth");
          return;
        }
        if (type === "recovery") {
          router.replace("/reset-password");
          return;
        }
        router.replace("/");
        router.refresh();
      })
      .finally(() => setHandling(false));
  }, [router]);

  if (!handling) return null;

  return (
    <p className="mb-4 text-center text-sm text-muted">กำลังยืนยันการเข้าสู่ระบบ...</p>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  CalendarDays,
  ClipboardList,
  Warehouse,
  Users,
  Settings,
  Upload,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { can } from "@/lib/permissions";
import type { UserRole } from "@/types/database";

const navGroups = [
  {
    label: "แดชบอร์ด",
    items: [
      { href: "/dashboard/executive", label: "ผู้บริหาร", roles: ["ADMIN", "MANAGER"] },
      { href: "/dashboard/sales", label: "ฝ่ายขาย", roles: ["SALE", "ADMIN"] },
      { href: "/dashboard/planning", label: "วางแผน", roles: ["PLANNING", "ADMIN"] },
      { href: "/dashboard/store", label: "คลัง", roles: ["STORE", "ADMIN"] },
      { href: "/dashboard/production", label: "ผลิต", roles: ["PRODUCTION", "ADMIN"] },
    ],
  },
  {
    label: "ปฏิบัติการ",
    items: [
      { href: "/operations/orders", label: "คำสั่งผลิต", resource: "orders" as const },
      { href: "/operations/plans", label: "แผนผลิต", resource: "plans" as const },
      { href: "/operations/material-requests", label: "เบิกวัสดุ", resource: "material_requests" as const },
      { href: "/operations/inventory", label: "สต็อก", resource: "inventory" as const },
    ],
  },
  {
    label: "ผู้ดูแลระบบ",
    items: [
      { href: "/admin/users", label: "ผู้ใช้", resource: "users" as const },
      { href: "/admin/import", label: "นำเข้า CSV", resource: "import" as const },
      { href: "/admin/settings", label: "ตั้งค่า", resource: "settings" as const },
      { href: "/admin/activity-logs", label: "บันทึกกิจกรรม", resource: "activity_logs" as const },
    ],
  },
];

const icons: Record<string, React.ElementType> = {
  "/dashboard/executive": LayoutDashboard,
  "/dashboard/sales": LayoutDashboard,
  "/dashboard/planning": LayoutDashboard,
  "/dashboard/store": LayoutDashboard,
  "/dashboard/production": LayoutDashboard,
  "/operations/orders": Package,
  "/operations/plans": CalendarDays,
  "/operations/material-requests": ClipboardList,
  "/operations/inventory": Warehouse,
  "/admin/users": Users,
  "/admin/import": Upload,
  "/admin/settings": Settings,
  "/admin/activity-logs": FileText,
};

export function Sidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();

  return (
    <aside className="sidebar flex flex-col">
      <div className="border-b border-border p-6">
        <p className="font-display text-lg font-bold text-accent">FOP</p>
        <p className="text-xs text-muted">Factory Operations Portal</p>
      </div>
      <nav className="flex-1 space-y-6 p-4">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((item) => {
            if ("roles" in item && item.roles) {
              return item.roles.includes(role);
            }
            if ("resource" in item && item.resource) {
              return can(role, "read", item.resource);
            }
            return false;
          });
          if (visibleItems.length === 0) return null;
          return (
            <div key={group.label}>
              <p className="mb-2 px-2 text-xs uppercase tracking-wider text-muted">
                {group.label}
              </p>
              <ul className="space-y-1">
                {visibleItems.map((item) => {
                  const Icon = icons[item.href] ?? Package;
                  const active = pathname.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                          active
                            ? "bg-accent/15 text-accent"
                            : "text-[var(--color-text-subtle)] hover:bg-accent/10 hover:text-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

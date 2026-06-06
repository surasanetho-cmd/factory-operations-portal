import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { updateUserRole } from "@/app/actions";
import type { UserRole } from "@/types/database";

const ROLES: UserRole[] = [
  "ADMIN",
  "SALE",
  "PLANNING",
  "STORE",
  "PRODUCTION",
  "MANAGER",
];

export default async function UsersPage() {
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("name");

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">จัดการผู้ใช้</h1>
        <p className="page-subtitle">Role Management</p>
      </div>
      <div className="table-scroll-wrap">
        <table>
          <thead>
            <tr>
              <th>รหัส</th>
              <th>ชื่อ</th>
              <th>อีเมล</th>
              <th>แผนก</th>
              <th>Role</th>
              <th>สถานะ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(users ?? []).map((u) => (
              <tr key={u.id}>
                <td>{u.employee_code}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.department ?? "-"}</td>
                <td>{u.role}</td>
                <td>{u.status}</td>
                <td>
                  <form action={updateUserRole.bind(null, u.id)} className="flex gap-2">
                    <select name="role" defaultValue={u.role} className="rounded-md border border-border bg-[var(--color-bg-raised)] px-2 py-1 text-sm">
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    <Button type="submit" size="sm" variant="outline">บันทึก</Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

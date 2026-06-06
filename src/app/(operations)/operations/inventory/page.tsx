import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/domain/status-badge";
import { can } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateInventory } from "@/app/actions";
import type { UserRole } from "@/types/database";

export default async function InventoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single();
  const role = profile?.role as UserRole;

  const { data: items } = await supabase
    .from("inventory")
    .select("*")
    .order("material_code");

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">สต็อกวัสดุ</h1>
        <p className="page-subtitle">คลังโรงงาน (Plant เดียว)</p>
      </div>
      <div className="table-scroll-wrap">
        <table>
          <thead>
            <tr>
              <th>รหัส</th>
              <th>ชื่อ</th>
              <th>คงเหลือ</th>
              <th>Safety</th>
              <th>หน่วย</th>
              <th>สถานะ</th>
              {can(role, "update", "inventory") && <th>อัปเดต</th>}
            </tr>
          </thead>
          <tbody>
            {(items ?? []).map((item) => (
              <tr key={item.id}>
                <td>{item.material_code}</td>
                <td>{item.material_name}</td>
                <td>{item.current_stock}</td>
                <td>{item.safety_stock}</td>
                <td>{item.unit}</td>
                <td><StatusBadge status={item.status} /></td>
                {can(role, "update", "inventory") && (
                  <td>
                    <form action={updateInventory} className="flex gap-2">
                      <input type="hidden" name="id" value={item.id} />
                      <Input name="current_stock" type="number" defaultValue={item.current_stock} className="w-24" />
                      <Button type="submit" size="sm" variant="outline">บันทึก</Button>
                    </form>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

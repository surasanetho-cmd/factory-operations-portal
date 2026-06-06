import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/domain/status-badge";
import { formatDate, isLateOrder } from "@/lib/utils";
import { can } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createOrder } from "@/app/actions";
import type { UserRole } from "@/types/database";

export default async function OrdersPage() {
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
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">คำสั่งผลิต</h1>
          <p className="page-subtitle">ติดตาม Order ทั้งหมด</p>
        </div>
      </div>

      {can(role, "create", "orders") && (
        <form action={createOrder} className="card-glass mb-6 grid gap-4 md:grid-cols-3">
          <div><Label>เลขที่</Label><Input name="order_no" required /></div>
          <div><Label>ลูกค้า</Label><Input name="customer_name" required /></div>
          <div><Label>รหัสชิ้น</Label><Input name="part_no" required /></div>
          <div><Label>ชื่อชิ้น</Label><Input name="part_name" required /></div>
          <div><Label>จำนวน</Label><Input name="quantity" type="number" required /></div>
          <div><Label>ครบกำหนด</Label><Input name="due_date" type="date" required /></div>
          <input type="hidden" name="status" value="NEW" />
          <div className="flex items-end md:col-span-3">
            <Button type="submit">เพิ่มคำสั่ง</Button>
          </div>
        </form>
      )}

      <div className="table-scroll-wrap">
        <table>
          <thead>
            <tr>
              <th>เลขที่</th>
              <th>ลูกค้า</th>
              <th>ชิ้นงาน</th>
              <th>จำนวน</th>
              <th>ครบกำหนด</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((order) => (
              <tr key={order.id}>
                <td>
                  <Link href={`/operations/orders/${order.id}`} className="text-accent hover:underline">
                    {order.order_no}
                  </Link>
                  {isLateOrder(order.due_date, order.status) && (
                    <span className="ml-2 badge badge-danger">ล่าช้า</span>
                  )}
                </td>
                <td>{order.customer_name}</td>
                <td>{order.part_name}</td>
                <td>{order.quantity}</td>
                <td>{formatDate(order.due_date)}</td>
                <td><StatusBadge status={order.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/domain/status-badge";
import { formatDate } from "@/lib/utils";
import { can } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPlan, updatePlanStatus } from "@/app/actions";
import type { UserRole } from "@/types/database";

export default async function PlansPage() {
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

  const [{ data: plans }, { data: orders }] = await Promise.all([
    supabase
      .from("production_plans")
      .select("*, orders(order_no, customer_name)")
      .order("plan_date", { ascending: false }),
    supabase.from("orders").select("id, order_no").order("order_no"),
  ]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">แผนผลิต</h1>
        <p className="page-subtitle">Production Plans</p>
      </div>

      {can(role, "create", "plans") && (
        <form action={createPlan} className="card-glass mb-6 grid gap-4 md:grid-cols-4">
          <div>
            <Label>คำสั่ง</Label>
            <select name="order_id" required className="flex h-10 w-full rounded-md border border-border bg-[var(--color-bg-raised)] px-3 text-sm">
              <option value="">เลือก...</option>
              {(orders ?? []).map((o) => (
                <option key={o.id} value={o.id}>{o.order_no}</option>
              ))}
            </select>
          </div>
          <div><Label>วันแผน</Label><Input name="plan_date" type="date" required /></div>
          <div><Label>จำนวน</Label><Input name="quantity" type="number" required /></div>
          <div><Label>ความสำคัญ (1-5)</Label><Input name="priority" type="number" min={1} max={5} defaultValue={3} required /></div>
          <input type="hidden" name="status" value="DRAFT" />
          <div className="md:col-span-4"><Button type="submit">สร้างแผน</Button></div>
        </form>
      )}

      <div className="table-scroll-wrap">
        <table>
          <thead>
            <tr>
              <th>คำสั่ง</th>
              <th>วันแผน</th>
              <th>จำนวน</th>
              <th>ความสำคัญ</th>
              <th>สถานะ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(plans ?? []).map((plan) => (
              <tr key={plan.id}>
                <td>{plan.orders?.order_no ?? "-"}</td>
                <td>{formatDate(plan.plan_date)}</td>
                <td>{plan.quantity}</td>
                <td>{plan.priority}</td>
                <td><StatusBadge status={plan.status} /></td>
                <td className="space-x-2">
                  {can(role, "update", "plans") && plan.status === "DRAFT" && (
                    <form action={updatePlanStatus.bind(null, plan.id, "RELEASED")} className="inline">
                      <Button type="submit" size="sm" variant="outline">ปล่อย</Button>
                    </form>
                  )}
                  {can(role, "update", "plans") && plan.status === "RELEASED" && (
                    <form action={updatePlanStatus.bind(null, plan.id, "IN_PROGRESS")} className="inline">
                      <Button type="submit" size="sm">เริ่มผลิต</Button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

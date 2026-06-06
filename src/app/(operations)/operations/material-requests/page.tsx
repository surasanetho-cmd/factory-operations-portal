import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/domain/status-badge";
import { formatDate } from "@/lib/utils";
import { can } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { updateMrStatus } from "@/app/actions";
import { MaterialRequestForm } from "@/components/domain/material-request-form";
import type { UserRole } from "@/types/database";

export default async function MaterialRequestsPage() {
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

  const [{ data: requests }, { data: plans }, { data: inventory }] = await Promise.all([
    supabase
      .from("material_requests")
      .select("*, profiles(name), production_plans(plan_date, orders(order_no))")
      .order("created_at", { ascending: false }),
    supabase
      .from("production_plans")
      .select("id, plan_date, orders(order_no)")
      .in("status", ["RELEASED", "IN_PROGRESS"]),
    supabase.from("inventory").select("material_code, material_name").limit(50),
  ]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">เบิกวัสดุ</h1>
        <p className="page-subtitle">Material Requests</p>
      </div>

      {can(role, "create", "material_requests") && (
        <MaterialRequestForm plans={plans ?? []} inventory={inventory ?? []} />
      )}

      <div className="table-scroll-wrap">
        <table>
          <thead>
            <tr>
              <th>เลขที่</th>
              <th>ผู้ขอ</th>
              <th>แผน</th>
              <th>วันที่</th>
              <th>สถานะ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(requests ?? []).map((mr) => (
              <tr key={mr.id}>
                <td>{mr.request_no}</td>
                <td>{mr.profiles?.name ?? "-"}</td>
                <td>{mr.production_plans?.orders?.order_no ?? "-"}</td>
                <td>{formatDate(mr.request_date)}</td>
                <td><StatusBadge status={mr.status} /></td>
                <td className="space-x-1">
                  {can(role, "update", "material_requests") && mr.status === "DRAFT" && (
                    <form action={updateMrStatus.bind(null, mr.id, "SUBMITTED")} className="inline">
                      <Button size="sm" type="submit">ส่ง</Button>
                    </form>
                  )}
                  {can(role, "process", "material_requests") && mr.status === "SUBMITTED" && (
                    <form action={updateMrStatus.bind(null, mr.id, "APPROVED")} className="inline">
                      <Button size="sm" type="submit" variant="outline">อนุมัติ</Button>
                    </form>
                  )}
                  {can(role, "process", "material_requests") && mr.status === "APPROVED" && (
                    <form action={updateMrStatus.bind(null, mr.id, "ISSUED")} className="inline">
                      <Button size="sm" type="submit">จ่าย</Button>
                    </form>
                  )}
                  {can(role, "process", "material_requests") && mr.status === "ISSUED" && (
                    <form action={updateMrStatus.bind(null, mr.id, "COMPLETED")} className="inline">
                      <Button size="sm" type="submit" variant="outline">เสร็จ</Button>
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

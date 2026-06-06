import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/domain/status-badge";
import { formatDate } from "@/lib/utils";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, production_plans(*)")
    .eq("id", id)
    .single();

  if (!order) notFound();

  return (
    <div>
      <div className="page-header">
        <Link href="/operations/orders" className="text-sm text-accent">← กลับ</Link>
        <h1 className="page-title mt-2">{order.order_no}</h1>
        <p className="page-subtitle">{order.customer_name} — {order.part_name}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card-glass">
          <h2 className="mb-4 font-semibold">รายละเอียด</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted">รหัสชิ้น</dt><dd>{order.part_no}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">จำนวน</dt><dd>{order.quantity}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">ครบกำหนด</dt><dd>{formatDate(order.due_date)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">สถานะ</dt><dd><StatusBadge status={order.status} /></dd></div>
          </dl>
        </div>
        <div className="card-glass">
          <h2 className="mb-4 font-semibold">แผนผลิต ({order.production_plans?.length ?? 0})</h2>
          <ul className="space-y-2">
            {(order.production_plans ?? []).map((plan: { id: string; plan_date: string; quantity: number; status: string }) => (
              <li key={plan.id} className="flex items-center justify-between border-b border-border pb-2">
                <span>{formatDate(plan.plan_date)} — {plan.quantity} ชิ้น</span>
                <StatusBadge status={plan.status} />
              </li>
            ))}
            {(order.production_plans ?? []).length === 0 && (
              <p className="text-sm text-muted">ยังไม่มีแผนผลิต</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

import { KpiCard } from "@/components/domain/kpi-card";
import { getPlanningStats } from "@/lib/dashboard-stats";

export default async function PlanningDashboardPage() {
  const stats = await getPlanningStats();

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">แดชบอร์ดวางแผน</h1>
        <p className="page-subtitle">แผนผลิตและคำสั่งเสี่ยง</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard title="แผนเปิด" value={stats.openPlans} />
        <KpiCard title="ดำเนินการ" value={stats.inProgress} variant="success" />
        <KpiCard title="คำสั่งเสี่ยง" value={stats.riskOrders} variant="danger" />
      </div>
    </div>
  );
}

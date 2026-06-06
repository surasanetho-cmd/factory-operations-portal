import { KpiCard } from "@/components/domain/kpi-card";
import { getProductionStats } from "@/lib/dashboard-stats";

export default async function ProductionDashboardPage() {
  const stats = await getProductionStats();

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">แดชบอร์ดฝ่ายผลิต</h1>
        <p className="page-subtitle">แผนวันนี้และเบิกวัสดุ</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard title="แผนวันนี้" value={stats.todaysPlans} />
        <KpiCard title="กำลังผลิต" value={stats.inProgress} variant="success" />
        <KpiCard title="เบิกเปิด" value={stats.openMr} variant="warning" />
      </div>
    </div>
  );
}

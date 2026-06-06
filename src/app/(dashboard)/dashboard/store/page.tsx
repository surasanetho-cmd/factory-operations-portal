import { KpiCard } from "@/components/domain/kpi-card";
import { getStoreStats } from "@/lib/dashboard-stats";

export default async function StoreDashboardPage() {
  const stats = await getStoreStats();

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">แดชบอร์ดคลัง</h1>
        <p className="page-subtitle">เบิกวัสดุและสต็อก</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard title="เบิกรอดำเนินการ" value={stats.pendingMr} variant="warning" />
        <KpiCard title="สต็อกใกล้หมด" value={stats.lowStock} variant="warning" />
        <KpiCard title="สต็อกวิกฤต" value={stats.criticalStock} variant="danger" />
      </div>
    </div>
  );
}

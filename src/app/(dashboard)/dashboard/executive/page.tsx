import { KpiCard } from "@/components/domain/kpi-card";
import { ExecutiveChart } from "@/components/domain/executive-chart";
import { getExecutiveStats } from "@/lib/dashboard-stats";

export default async function ExecutiveDashboardPage() {
  const stats = await getExecutiveStats();

  const chartData = [
    { name: "เปิด", value: stats.openOrders },
    { name: "ล่าช้า", value: stats.lateOrders },
    { name: "เบิกค้าง", value: stats.pendingMr },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">แดชบอร์ดผู้บริหาร</h1>
        <p className="page-subtitle">ภาพรวมการดำเนินงานโรงงาน</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <KpiCard title="คำสั่งทั้งหมด" value={stats.totalOrders} />
        <KpiCard title="คำสั่งเปิด" value={stats.openOrders} />
        <KpiCard title="คำสั่งล่าช้า" value={stats.lateOrders} variant="danger" />
        <KpiCard title="ความคืบหน้าผลิต" value={`${stats.progressPct}%`} variant="success" />
        <KpiCard title="แจ้งเตือนสต็อก" value={stats.inventoryAlerts} variant="warning" />
        <KpiCard title="เบิกวัสดุค้าง" value={stats.pendingMr} variant="warning" />
      </div>
      <div className="card-glass mt-6 h-72">
        <h2 className="mb-4 font-display text-lg font-semibold">สรุปสถานะ</h2>
        <div className="h-[85%]">
          <ExecutiveChart data={chartData} />
        </div>
      </div>
    </div>
  );
}

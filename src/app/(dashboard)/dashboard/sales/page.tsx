import { KpiCard } from "@/components/domain/kpi-card";
import { getSalesStats } from "@/lib/dashboard-stats";

export default async function SalesDashboardPage() {
  const stats = await getSalesStats();

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">แดชบอร์ดฝ่ายขาย</h1>
        <p className="page-subtitle">ติดตามคำสั่งลูกค้าและความคืบหน้า</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard title="คำสั่งลูกค้า" value={stats.customerOrders} />
        <KpiCard title="ครบกำหนดสัปดาห์นี้" value={stats.dueThisWeek} variant="warning" />
        <KpiCard title="กำลังผลิต" value={stats.inProduction} variant="success" />
      </div>
    </div>
  );
}

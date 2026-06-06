import { createClient } from "@/lib/supabase/server";
import { isLateOrder } from "@/lib/utils";

export async function getExecutiveStats() {
  const supabase = await createClient();

  const [ordersRes, plansRes, inventoryRes, mrRes] = await Promise.all([
    supabase.from("orders").select("id, status, due_date"),
    supabase.from("production_plans").select("id, status"),
    supabase.from("inventory").select("id, status"),
    supabase.from("material_requests").select("id, status"),
  ]);

  const orders = ordersRes.data ?? [];
  const plans = plansRes.data ?? [];
  const inventory = inventoryRes.data ?? [];
  const mr = mrRes.data ?? [];

  const openOrders = orders.filter(
    (o) => !["COMPLETED", "SHIPPED"].includes(o.status)
  ).length;
  const lateOrders = orders.filter((o) =>
    isLateOrder(o.due_date, o.status)
  ).length;
  const completedPlans = plans.filter((p) => p.status === "COMPLETED").length;
  const progressPct =
    plans.length > 0 ? Math.round((completedPlans / plans.length) * 100) : 0;
  const inventoryAlerts = inventory.filter((i) =>
    ["LOW", "CRITICAL"].includes(i.status)
  ).length;
  const pendingMr = mr.filter((m) =>
    ["SUBMITTED", "APPROVED"].includes(m.status)
  ).length;

  return {
    totalOrders: orders.length,
    openOrders,
    lateOrders,
    progressPct,
    inventoryAlerts,
    pendingMr,
  };
}

export async function getSalesStats() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, production_plans(status)");

  const all = orders ?? [];
  const weekFromNow = new Date();
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  return {
    customerOrders: all.length,
    dueThisWeek: all.filter((o) => {
      const d = new Date(o.due_date);
      return d <= weekFromNow && !["COMPLETED", "SHIPPED"].includes(o.status);
    }).length,
    inProduction: all.filter((o) => o.status === "IN_PRODUCTION").length,
  };
}

export async function getPlanningStats() {
  const supabase = await createClient();
  const [plansRes, ordersRes] = await Promise.all([
    supabase.from("production_plans").select("id, status"),
    supabase.from("orders").select("id, due_date, status"),
  ]);

  const plans = plansRes.data ?? [];
  const orders = ordersRes.data ?? [];

  return {
    openPlans: plans.filter((p) => ["DRAFT", "RELEASED"].includes(p.status)).length,
    inProgress: plans.filter((p) => p.status === "IN_PROGRESS").length,
    riskOrders: orders.filter((o) => isLateOrder(o.due_date, o.status)).length,
  };
}

export async function getStoreStats() {
  const supabase = await createClient();
  const [mrRes, invRes] = await Promise.all([
    supabase
      .from("material_requests")
      .select("id, status")
      .in("status", ["SUBMITTED", "APPROVED"]),
    supabase.from("inventory").select("id, status"),
  ]);

  const inv = invRes.data ?? [];
  return {
    pendingMr: mrRes.data?.length ?? 0,
    lowStock: inv.filter((i) => i.status === "LOW").length,
    criticalStock: inv.filter((i) => i.status === "CRITICAL").length,
  };
}

export async function getProductionStats() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const [plansRes, mrRes] = await Promise.all([
    supabase
      .from("production_plans")
      .select("id, status, plan_date")
      .eq("plan_date", today),
    supabase
      .from("material_requests")
      .select("id, status")
      .in("status", ["DRAFT", "SUBMITTED"]),
  ]);

  const plans = plansRes.data ?? [];
  return {
    todaysPlans: plans.length,
    inProgress: plans.filter((p) => p.status === "IN_PROGRESS").length,
    openMr: mrRes.data?.length ?? 0,
  };
}

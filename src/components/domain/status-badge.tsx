import { cn } from "@/lib/cn";
import type {
  OrderStatus,
  PlanStatus,
  MaterialRequestStatus,
  InventoryStatus,
} from "@/types/database";

const statusStyles: Record<string, string> = {
  NEW: "badge-info",
  PLANNING: "badge-neutral",
  MATERIAL_CHECK: "badge-warning",
  READY: "badge-info",
  IN_PRODUCTION: "badge-warning",
  COMPLETED: "badge-success",
  SHIPPED: "badge-success",
  DRAFT: "badge-neutral",
  RELEASED: "badge-info",
  IN_PROGRESS: "badge-warning",
  SUBMITTED: "badge-info",
  APPROVED: "badge-warning",
  ISSUED: "badge-info",
  NORMAL: "badge-success",
  LOW: "badge-warning",
  CRITICAL: "badge-danger",
};

const statusLabels: Record<string, string> = {
  NEW: "ใหม่",
  PLANNING: "วางแผน",
  MATERIAL_CHECK: "ตรวจวัสดุ",
  READY: "พร้อมผลิต",
  IN_PRODUCTION: "กำลังผลิต",
  COMPLETED: "เสร็จสิ้น",
  SHIPPED: "จัดส่งแล้ว",
  DRAFT: "ร่าง",
  RELEASED: "ปล่อยแผน",
  IN_PROGRESS: "ดำเนินการ",
  SUBMITTED: "ส่งคำขอ",
  APPROVED: "อนุมัติ",
  ISSUED: "จ่ายแล้ว",
  NORMAL: "ปกติ",
  LOW: "ใกล้หมด",
  CRITICAL: "วิกฤต",
};

export function StatusBadge({
  status,
  className,
}: {
  status:
    | OrderStatus
    | PlanStatus
    | MaterialRequestStatus
    | InventoryStatus
    | string;
  className?: string;
}) {
  return (
    <span className={cn("badge", statusStyles[status] ?? "badge-neutral", className)}>
      {statusLabels[status] ?? status}
    </span>
  );
}

export type UserRole =
  | "ADMIN"
  | "SALE"
  | "PLANNING"
  | "STORE"
  | "PRODUCTION"
  | "MANAGER";

export type OrderStatus =
  | "NEW"
  | "PLANNING"
  | "MATERIAL_CHECK"
  | "READY"
  | "IN_PRODUCTION"
  | "COMPLETED"
  | "SHIPPED";

export type PlanStatus = "DRAFT" | "RELEASED" | "IN_PROGRESS" | "COMPLETED";

export type MaterialRequestStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "ISSUED"
  | "COMPLETED";

export type InventoryStatus = "NORMAL" | "LOW" | "CRITICAL";

export type ProfileStatus = "ACTIVE" | "INACTIVE";

export interface Profile {
  id: string;
  employee_code: string;
  name: string;
  email: string;
  role: UserRole;
  department: string | null;
  status: ProfileStatus;
  created_at: string;
}

export interface Order {
  id: string;
  order_no: string;
  customer_name: string;
  part_no: string;
  part_name: string;
  quantity: number;
  due_date: string;
  status: OrderStatus;
  created_at: string;
}

export interface ProductionPlan {
  id: string;
  order_id: string;
  plan_date: string;
  quantity: number;
  priority: number;
  status: PlanStatus;
  created_at: string;
  orders?: Order;
}

export interface MaterialRequest {
  id: string;
  request_no: string;
  production_plan_id: string;
  request_date: string;
  requested_by: string;
  status: MaterialRequestStatus;
  created_at: string;
  production_plans?: ProductionPlan;
  profiles?: Profile;
}

export interface MaterialRequestItem {
  id: string;
  material_request_id: string;
  material_code: string;
  material_name: string;
  requested_qty: number;
  issued_qty: number;
}

export interface InventoryItem {
  id: string;
  material_code: string;
  material_name: string;
  current_stock: number;
  safety_stock: number;
  unit: string;
  status: InventoryStatus;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  module: string;
  description: string;
  created_at: string;
  profiles?: Profile;
}

export type Resource =
  | "orders"
  | "plans"
  | "material_requests"
  | "inventory"
  | "notifications"
  | "activity_logs"
  | "users"
  | "settings"
  | "import";

export type Action = "create" | "read" | "update" | "delete" | "process";

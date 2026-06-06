import type { Action, Resource, UserRole } from "@/types/database";

type PermissionMap = Record<Resource, Action[]>;

const ROLE_PERMISSIONS: Record<UserRole, PermissionMap> = {
  ADMIN: {
    orders: ["create", "read", "update", "delete"],
    plans: ["create", "read", "update", "delete"],
    material_requests: ["create", "read", "update", "delete", "process"],
    inventory: ["create", "read", "update", "delete"],
    notifications: ["read", "update"],
    activity_logs: ["read"],
    users: ["create", "read", "update", "delete"],
    settings: ["read", "update"],
    import: ["create"],
  },
  SALE: {
    orders: ["read"],
    plans: ["read"],
    material_requests: [],
    inventory: ["read"],
    notifications: ["read", "update"],
    activity_logs: [],
    users: [],
    settings: [],
    import: [],
  },
  PLANNING: {
    orders: ["read"],
    plans: ["create", "read", "update", "delete"],
    material_requests: ["read"],
    inventory: ["read"],
    notifications: ["read", "update"],
    activity_logs: [],
    users: [],
    settings: [],
    import: [],
  },
  STORE: {
    orders: [],
    plans: ["read"],
    material_requests: ["read", "process"],
    inventory: ["read", "update"],
    notifications: ["read", "update"],
    activity_logs: [],
    users: [],
    settings: [],
    import: [],
  },
  PRODUCTION: {
    orders: [],
    plans: ["read", "update"],
    material_requests: ["create", "read", "update"],
    inventory: ["read"],
    notifications: ["read", "update"],
    activity_logs: [],
    users: [],
    settings: [],
    import: [],
  },
  MANAGER: {
    orders: ["read"],
    plans: ["read"],
    material_requests: ["read"],
    inventory: ["read"],
    notifications: ["read", "update"],
    activity_logs: ["read"],
    users: [],
    settings: [],
    import: [],
  },
};

export function can(role: UserRole, action: Action, resource: Resource): boolean {
  return ROLE_PERMISSIONS[role][resource]?.includes(action) ?? false;
}

export function defaultDashboardPath(role: UserRole): string {
  const paths: Record<UserRole, string> = {
    ADMIN: "/dashboard/executive",
    SALE: "/dashboard/sales",
    PLANNING: "/dashboard/planning",
    STORE: "/dashboard/store",
    PRODUCTION: "/dashboard/production",
    MANAGER: "/dashboard/executive",
  };
  return paths[role];
}

export function canTransitionMrStatus(
  role: UserRole,
  from: string,
  to: string
): boolean {
  if (role === "ADMIN") return true;
  if (role !== "STORE" && role !== "PRODUCTION") return false;

  const productionTransitions: Record<string, string[]> = {
    DRAFT: ["SUBMITTED"],
  };
  const storeTransitions: Record<string, string[]> = {
    SUBMITTED: ["APPROVED"],
    APPROVED: ["ISSUED"],
    ISSUED: ["COMPLETED"],
  };

  if (role === "PRODUCTION") {
    return productionTransitions[from]?.includes(to) ?? false;
  }
  return storeTransitions[from]?.includes(to) ?? false;
}

export { ROLE_PERMISSIONS };

import { describe, expect, it } from "vitest";
import { can, canTransitionMrStatus, defaultDashboardPath } from "@/lib/permissions";
import { computeInventoryStatus, isLateOrder } from "@/lib/utils";

describe("permissions", () => {
  it("allows ADMIN full orders access", () => {
    expect(can("ADMIN", "create", "orders")).toBe(true);
    expect(can("ADMIN", "delete", "orders")).toBe(true);
  });

  it("restricts SALE to read-only orders", () => {
    expect(can("SALE", "read", "orders")).toBe(true);
    expect(can("SALE", "create", "orders")).toBe(false);
  });

  it("allows STORE to process material requests", () => {
    expect(can("STORE", "process", "material_requests")).toBe(true);
  });

  it("returns role-specific dashboard paths", () => {
    expect(defaultDashboardPath("PLANNING")).toBe("/dashboard/planning");
    expect(defaultDashboardPath("STORE")).toBe("/dashboard/store");
  });
});

describe("canTransitionMrStatus", () => {
  it("allows PRODUCTION to submit drafts", () => {
    expect(canTransitionMrStatus("PRODUCTION", "DRAFT", "SUBMITTED")).toBe(true);
  });

  it("allows STORE to approve submitted requests", () => {
    expect(canTransitionMrStatus("STORE", "SUBMITTED", "APPROVED")).toBe(true);
  });

  it("denies PRODUCTION from approving", () => {
    expect(canTransitionMrStatus("PRODUCTION", "SUBMITTED", "APPROVED")).toBe(false);
  });
});

describe("domain utils", () => {
  it("detects late orders", () => {
    expect(isLateOrder("2020-01-01", "IN_PRODUCTION")).toBe(true);
    expect(isLateOrder("2099-01-01", "IN_PRODUCTION")).toBe(false);
    expect(isLateOrder("2020-01-01", "COMPLETED")).toBe(false);
  });

  it("computes inventory status", () => {
    expect(computeInventoryStatus(0, 10)).toBe("CRITICAL");
    expect(computeInventoryStatus(5, 10)).toBe("LOW");
    expect(computeInventoryStatus(50, 10)).toBe("NORMAL");
  });
});

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity";
import { orderSchema, planSchema } from "@/lib/validators";

export async function createOrder(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const parsed = orderSchema.safeParse({
    order_no: formData.get("order_no"),
    customer_name: formData.get("customer_name"),
    part_no: formData.get("part_no"),
    part_name: formData.get("part_name"),
    quantity: formData.get("quantity"),
    due_date: formData.get("due_date"),
    status: formData.get("status") || "NEW",
  });

  if (!parsed.success) return;

  const { error } = await supabase.from("orders").insert(parsed.data);
  if (error) return;

  await logActivity(user.id, "CREATE", "orders", `สร้างคำสั่ง ${parsed.data.order_no}`);
  revalidatePath("/operations/orders");
}

export async function createPlan(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const parsed = planSchema.safeParse({
    order_id: formData.get("order_id"),
    plan_date: formData.get("plan_date"),
    quantity: formData.get("quantity"),
    priority: formData.get("priority"),
    status: formData.get("status") || "DRAFT",
  });

  if (!parsed.success) return;

  const { error } = await supabase.from("production_plans").insert(parsed.data);
  if (error) return;

  await supabase
    .from("orders")
    .update({ status: "PLANNING" })
    .eq("id", parsed.data.order_id)
    .eq("status", "NEW");

  await logActivity(user.id, "CREATE", "plans", `สร้างแผนผลิตสำหรับ order ${parsed.data.order_id}`);
  revalidatePath("/operations/plans");
}

export async function updatePlanStatus(planId: string, status: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: plan } = await supabase
    .from("production_plans")
    .select("order_id")
    .eq("id", planId)
    .single();

  const { error } = await supabase
    .from("production_plans")
    .update({ status })
    .eq("id", planId);

  if (error) return;

  if (status === "IN_PROGRESS" && plan) {
    await supabase
      .from("orders")
      .update({ status: "IN_PRODUCTION" })
      .eq("id", plan.order_id);
  }

  await logActivity(user.id, "UPDATE", "plans", `อัปเดตสถานะแผน ${planId} เป็น ${status}`);
  revalidatePath("/operations/plans");
}

export async function updateInventory(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const id = formData.get("id") as string;
  const current_stock = Number(formData.get("current_stock"));

  const { error } = await supabase
    .from("inventory")
    .update({ current_stock })
    .eq("id", id);

  if (error) return;

  await logActivity(user.id, "UPDATE", "inventory", `อัปเดตสต็อก ${id}`);
  revalidatePath("/operations/inventory");
}

export async function createMaterialRequest(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const requestNo = `MR-${Date.now()}`;
  const productionPlanId = formData.get("production_plan_id") as string;
  const materialCode = formData.get("material_code") as string;
  const materialName = formData.get("material_name") as string;
  const requestedQty = Number(formData.get("requested_qty"));

  const { data: mr, error: mrError } = await supabase
    .from("material_requests")
    .insert({
      request_no: requestNo,
      production_plan_id: productionPlanId,
      requested_by: user.id,
      status: "DRAFT",
    })
    .select()
    .single();

  if (mrError || !mr) return;

  const { error: itemError } = await supabase.from("material_request_items").insert({
    material_request_id: mr.id,
    material_code: materialCode,
    material_name: materialName,
    requested_qty: requestedQty,
  });

  if (itemError) return;

  await logActivity(user.id, "CREATE", "material_requests", `สร้าง ${requestNo}`);
  revalidatePath("/operations/material-requests");
}

export async function updateMrStatus(mrId: string, status: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("material_requests")
    .update({ status })
    .eq("id", mrId);

  if (error) return;

  await logActivity(user.id, "UPDATE", "material_requests", `อัปเดต MR ${mrId} เป็น ${status}`);
  revalidatePath("/operations/material-requests");
}

export type ImportResult = {
  error?: string;
  success?: boolean;
  imported?: number;
  errors?: string[];
};

export async function importOrdersCsv(
  rows: Record<string, string>[]
): Promise<ImportResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "ไม่ได้เข้าสู่ระบบ" };

  const { csvOrderRowSchema } = await import("@/lib/validators");
  const errors: string[] = [];
  const validRows = [];

  for (let i = 0; i < rows.length; i++) {
    const parsed = csvOrderRowSchema.safeParse(rows[i]);
    if (!parsed.success) {
      errors.push(`แถว ${i + 1}: ${parsed.error.errors[0]?.message}`);
    } else {
      validRows.push({ ...parsed.data, status: "NEW" as const });
    }
  }

  if (validRows.length > 0) {
    const { error } = await supabase.from("orders").upsert(validRows, {
      onConflict: "order_no",
    });
    if (error) return { error: error.message, errors };
  }

  await logActivity(user.id, "IMPORT", "orders", `นำเข้า ${validRows.length} คำสั่ง`);
  revalidatePath("/operations/orders");
  return { success: true, imported: validRows.length, errors };
}

export async function importInventoryCsv(
  rows: Record<string, string>[]
): Promise<ImportResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "ไม่ได้เข้าสู่ระบบ" };

  const { csvInventoryRowSchema } = await import("@/lib/validators");
  const errors: string[] = [];
  const validRows = [];

  for (let i = 0; i < rows.length; i++) {
    const parsed = csvInventoryRowSchema.safeParse(rows[i]);
    if (!parsed.success) {
      errors.push(`แถว ${i + 1}: ${parsed.error.errors[0]?.message}`);
    } else {
      validRows.push(parsed.data);
    }
  }

  if (validRows.length > 0) {
    const { error } = await supabase.from("inventory").upsert(validRows, {
      onConflict: "material_code",
    });
    if (error) return { error: error.message, errors };
  }

  await logActivity(user.id, "IMPORT", "inventory", `นำเข้า ${validRows.length} รายการ`);
  revalidatePath("/operations/inventory");
  return { success: true, imported: validRows.length, errors };
}

export async function updateUserRole(userId: string, formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const role = formData.get("role") as string;

  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error) return;

  await logActivity(user.id, "UPDATE", "users", `เปลี่ยน role ผู้ใช้ ${userId}`);
  revalidatePath("/admin/users");
}

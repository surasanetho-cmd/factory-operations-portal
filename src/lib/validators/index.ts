import { z } from "zod";

export const orderSchema = z.object({
  order_no: z.string().min(1, "กรุณาระบุเลขที่คำสั่ง"),
  customer_name: z.string().min(1, "กรุณาระบุชื่อลูกค้า"),
  part_no: z.string().min(1, "กรุณาระบุรหัสชิ้นงาน"),
  part_name: z.string().min(1, "กรุณาระบุชื่อชิ้นงาน"),
  quantity: z.coerce.number().int().positive("จำนวนต้องมากกว่า 0"),
  due_date: z.string().min(1, "กรุณาระบุวันครบกำหนด"),
  status: z.enum([
    "NEW",
    "PLANNING",
    "MATERIAL_CHECK",
    "READY",
    "IN_PRODUCTION",
    "COMPLETED",
    "SHIPPED",
  ]),
});

export const planSchema = z.object({
  order_id: z.string().uuid("กรุณาเลือกคำสั่ง"),
  plan_date: z.string().min(1, "กรุณาระบุวันแผน"),
  quantity: z.coerce.number().int().positive(),
  priority: z.coerce.number().int().min(1).max(5),
  status: z.enum(["DRAFT", "RELEASED", "IN_PROGRESS", "COMPLETED"]),
});

export const inventorySchema = z.object({
  material_code: z.string().min(1),
  material_name: z.string().min(1),
  current_stock: z.coerce.number().min(0),
  safety_stock: z.coerce.number().min(0),
  unit: z.string().min(1),
});

export const csvOrderRowSchema = z.object({
  order_no: z.string(),
  customer_name: z.string(),
  part_no: z.string(),
  part_name: z.string(),
  quantity: z.coerce.number().int().positive(),
  due_date: z.string(),
});

export const csvInventoryRowSchema = z.object({
  material_code: z.string(),
  material_name: z.string(),
  current_stock: z.coerce.number().min(0),
  safety_stock: z.coerce.number().min(0),
  unit: z.string().default("PCS"),
});

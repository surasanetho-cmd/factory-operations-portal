"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createMaterialRequest } from "@/app/actions";
import { formatDate } from "@/lib/utils";
import { useState } from "react";

type Plan = {
  id: string;
  plan_date: string;
  orders: { order_no: string } | { order_no: string }[] | null;
};

type InvItem = { material_code: string; material_name: string };

export function MaterialRequestForm({
  plans,
  inventory,
}: {
  plans: Plan[];
  inventory: InvItem[];
}) {
  const [materialName, setMaterialName] = useState("");

  return (
    <form action={createMaterialRequest} className="card-glass mb-6 grid gap-4 md:grid-cols-4">
      <div>
        <Label>แผนผลิต</Label>
        <select
          name="production_plan_id"
          required
          className="flex h-10 w-full rounded-md border border-border bg-[var(--color-bg-raised)] px-3 text-sm"
        >
          <option value="">เลือก...</option>
          {plans.map((p) => {
            const orderNo = Array.isArray(p.orders)
              ? p.orders[0]?.order_no
              : p.orders?.order_no;
            return (
            <option key={p.id} value={p.id}>
              {orderNo} — {formatDate(p.plan_date)}
            </option>
            );
          })}
        </select>
      </div>
      <div>
        <Label>วัสดุ</Label>
        <select
          name="material_code"
          required
          className="flex h-10 w-full rounded-md border border-border bg-[var(--color-bg-raised)] px-3 text-sm"
          onChange={(e) => {
            const item = inventory.find((i) => i.material_code === e.target.value);
            setMaterialName(item?.material_name ?? "");
          }}
        >
          <option value="">เลือก...</option>
          {inventory.map((i) => (
            <option key={i.material_code} value={i.material_code}>
              {i.material_code} — {i.material_name}
            </option>
          ))}
        </select>
        <input type="hidden" name="material_name" value={materialName} />
      </div>
      <div>
        <Label>จำนวน</Label>
        <Input name="requested_qty" type="number" step="0.01" required />
      </div>
      <div className="flex items-end">
        <Button type="submit">สร้างคำขอ</Button>
      </div>
    </form>
  );
}

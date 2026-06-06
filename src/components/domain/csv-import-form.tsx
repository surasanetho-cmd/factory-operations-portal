"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { importOrdersCsv, importInventoryCsv } from "@/app/actions";

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    return headers.reduce<Record<string, string>>((acc, header, i) => {
      acc[header] = values[i] ?? "";
      return acc;
    }, {});
  });
}

export function CsvImportForm({
  type,
}: {
  type: "orders" | "inventory";
}) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) {
      toast.error("กรุณาเลือกไฟล์");
      return;
    }

    setLoading(true);
    const text = await file.text();
    const rows = parseCsv(text);
    const result =
      type === "orders"
        ? await importOrdersCsv(rows)
        : await importInventoryCsv(rows);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(`นำเข้าสำเร็จ ${result.imported} รายการ`);
    if (result.errors?.length) {
      toast.warning(result.errors.join("\n"));
    }
    form.reset();
  }

  const hint =
    type === "orders"
      ? "order_no,customer_name,part_no,part_name,quantity,due_date"
      : "material_code,material_name,current_stock,safety_stock,unit";

  return (
    <form onSubmit={handleSubmit} className="card-glass space-y-4">
      <div>
        <Label>ไฟล์ CSV ({type})</Label>
        <p className="mb-2 text-xs text-muted">หัวคอลัมน์: {hint}</p>
        <input
          type="file"
          name="file"
          accept=".csv"
          required
          className="block w-full text-sm text-muted file:mr-4 file:rounded-md file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#080f08]"
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "กำลังนำเข้า..." : "นำเข้า"}
      </Button>
    </form>
  );
}

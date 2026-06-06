import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(typeof date === "string" ? new Date(date) : date);
}

export function isLateOrder(dueDate: string, status: string): boolean {
  if (status === "COMPLETED" || status === "SHIPPED") return false;
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return due < today;
}

export function computeInventoryStatus(
  current: number,
  safety: number
): "NORMAL" | "LOW" | "CRITICAL" {
  if (current <= 0) return "CRITICAL";
  if (current <= safety) return "LOW";
  return "NORMAL";
}

import { CsvImportForm } from "@/components/domain/csv-import-form";

export default function ImportPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">นำเข้า CSV</h1>
        <p className="page-subtitle">Admin only — Orders และ Inventory</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <CsvImportForm type="orders" />
        <CsvImportForm type="inventory" />
      </div>
    </div>
  );
}

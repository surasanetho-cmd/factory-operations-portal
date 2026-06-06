export default function SettingsPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">ตั้งค่าระบบ</h1>
        <p className="page-subtitle">Phase 1 — การตั้งค่าพื้นฐาน</p>
      </div>
      <div className="card-glass max-w-xl space-y-4">
        <div>
          <p className="text-sm font-medium">โหมดธีม</p>
          <p className="text-sm text-muted">Dark-first (ตาม Design System v1.0)</p>
        </div>
        <div>
          <p className="text-sm font-medium">ภาษา</p>
          <p className="text-sm text-muted">ไทย</p>
        </div>
        <div>
          <p className="text-sm font-medium">SAP Integration</p>
          <p className="text-sm text-muted">Phase 2 — ยังไม่เปิดใช้งาน</p>
        </div>
      </div>
    </div>
  );
}

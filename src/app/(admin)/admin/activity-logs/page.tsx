import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export default async function ActivityLogsPage() {
  const supabase = await createClient();
  const { data: logs } = await supabase
    .from("activity_logs")
    .select("*, profiles(name)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">บันทึกกิจกรรม</h1>
        <p className="page-subtitle">Audit Trail</p>
      </div>
      <div className="table-scroll-wrap">
        <table>
          <thead>
            <tr>
              <th>เวลา</th>
              <th>ผู้ใช้</th>
              <th>การกระทำ</th>
              <th>โมดูล</th>
              <th>รายละเอียด</th>
            </tr>
          </thead>
          <tbody>
            {(logs ?? []).map((log) => (
              <tr key={log.id}>
                <td>{formatDate(log.created_at)}</td>
                <td>{log.profiles?.name ?? "-"}</td>
                <td>{log.action}</td>
                <td>{log.module}</td>
                <td>{log.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

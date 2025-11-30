// pages/admin/bookings.js
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

function StatusChip({ status }) {
  const s = status || "待確認";
  let base =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px]";

  if (s === "已確認") {
    base += " border-amber-300 bg-amber-500/10 text-amber-100";
  } else if (s === "已完成") {
    base += " border-emerald-300 bg-emerald-500/10 text-emerald-100";
  } else {
    base += " border-pink-400 bg-pink-500/10 text-pink-100";
  }

  return <span className={base}>{s}</span>;
}

const nextStatus = (current) => {
  const c = current || "待確認";
  if (c === "待確認") return "已確認";
  if (c === "已確認") return "已完成";
  if (c === "已完成") return "待確認";
  return "待確認";
};

export default function AdminBookingsPage() {
  const router = useRouter();
  const [summary, setSummary] = useState({
    todayCount: 0,
    futureCount: 0,
    totalCount: 0,
  });
  const [records, setRecords] = useState([]);
  const [memberMap, setMemberMap] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError("");

      try {
        // 1) 預約列表
        const bookingResp = await fetch("/api/admin/bookings");
        const bookingData = await bookingResp.json();

        if (!bookingResp.ok) {
          setError(bookingData.error || "讀取預約資料失敗。");
          setRecords([]);
        } else {
          setRecords(Array.isArray(bookingData.records) ? bookingData.records : []);

          setSummary({
            todayCount: bookingData.todayCount || 0,
            futureCount: bookingData.futureCount || 0,
            totalCount: Array.isArray(bookingData.records)
              ? bookingData.records.length
              : 0,
          });
        }
      } catch (err) {
        console.error(err);
        setError("讀取預約資料時發生錯誤。");
        setRecords([]);
      }

      // 2) 會員清單（用來補姓名：phone → name）
      try {
        const memberResp = await fetch("/api/admin/members");
        const memberData = await memberResp.json();

        if (memberResp.ok && Array.isArray(memberData.records)) {
          const map = new Map();
          memberData.records.forEach((m) => {
            if (m.phone) {
              map.set(String(m.phone).trim(), m.name || "");
            }
          });
          setMemberMap(map);
        } else {
          // 不擋流程，只是名字可能顯示不出來
          console.warn("載入會員資料失敗，用 bookings 裡的 name 為主。");
        }
      } catch (err) {
        console.error("載入會員資料錯誤：", err);
      }

      setLoading(false);
    }

    fetchAll();
  }, []);

  const enrichedRecords = useMemo(() => {
    return records.map((r) => {
      const phone = r.phone ? String(r.phone).trim() : "";
      const nameFromMember = phone ? memberMap.get(phone) : "";
      return {
        ...r,
        name: r.name || nameFromMember || "",
      };
    });
  }, [records, memberMap]);

  const handleToggleStatus = async (record) => {
    const current = record.status || "待確認";
    const newStatus = nextStatus(current);

    try {
      setUpdatingId(record.id);
      const resp = await fetch("/api/admin/update-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 這裡要用 bookingId，對應 API 裡的參數名稱
        body: JSON.stringify({ bookingId: record.id, status: newStatus }),
      });
      const data = await resp.json();

      if (!resp.ok) {
        alert(data.error || "更新狀態失敗");
        return;
      }

      // 本地列表一起更新
      setRecords((prev) =>
        prev.map((r) =>
          r.id === record.id ? { ...r, status: newStatus } : r
        )
      );
    } catch (err) {
      console.error(err);
      alert("系統錯誤，請稍後再試");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-pink-50">
      <header className="border-b border-pink-500/20 bg-black/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs text-pink-300/80">EnjoyCare Admin</p>
            <h1 className="text-lg font-semibold tracking-wide">
              預約紀錄管理
            </h1>
            <p className="text-[11px] text-pink-300/70 mt-1">
              查看所有長輩預約，並調整狀態（待確認 / 已確認 / 已完成）
            </p>
          </div>
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-pink-500 text-white hover:bg-pink-400 shadow-lg shadow-pink-500/30"
          >
            返回管理總覽
          </button>
        </div>
      </header>

      <main className="flex-1 w-full">
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          {/* Summary 卡片 */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-3xl border border-pink-500/40 bg-gray-950/70 px-4 py-4 shadow-lg shadow-pink-500/30">
              <div className="text-xs text-pink-200/80 mb-1">今日預約數</div>
              <div className="text-3xl font-bold text-pink-100 mb-1">
                {summary.todayCount}
              </div>
              <div className="text-[11px] text-pink-200/70">
                以「預約日期」等於今天為準
              </div>
            </div>

            <div className="rounded-3xl border border-pink-500/40 bg-gray-950/70 px-4 py-4 shadow-lg shadow-pink-500/30">
              <div className="text-xs text-pink-200/80 mb-1">未來預約數</div>
              <div className="text-3xl font-bold text-pink-100 mb-1">
                {summary.futureCount}
              </div>
              <div className="text-[11px] text-pink-200/70">
                預約日期大於今天的筆數
              </div>
            </div>

            <div className="rounded-3xl border border-pink-500/40 bg-gray-950/70 px-4 py-4 shadow-lg shadow-pink-500/30">
              <div className="text-xs text-pink-200/80 mb-1">全部預約數</div>
              <div className="text-3xl font-bold text-pink-100 mb-1">
                {summary.totalCount}
              </div>
              <div className="text-[11px] text-pink-200/70">
                目前 Airtable 中所有預約紀錄
              </div>
            </div>
          </section>

          {/* 預約列表 */}
          <section className="rounded-3xl border border-pink-500/40 bg-gray-950/80 px-4 py-4 shadow-lg shadow-pink-500/30">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-pink-100">
                預約紀錄列表
              </h2>
              {loading && (
                <span className="text-[11px] text-pink-200">
                  載入中…
                </span>
              )}
            </div>

            {error && (
              <div className="mb-3 rounded-xl border border-rose-400/60 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-100">
                {error}
              </div>
            )}

            <div className="overflow-x-auto rounded-2xl border border-pink-500/30">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-950/80">
                  <tr className="text-[11px] text-pink-200">
                    <th className="px-3 py-2 text-left">日期</th>
                    <th className="px-3 py-2 text-left">時間</th>
                    <th className="px-3 py-2 text-left">姓名</th>
                    <th className="px-3 py-2 text-left">電話</th>
                    <th className="px-3 py-2 text-left">服務類型</th>
                    <th className="px-3 py-2 text-left">陪伴員</th>
                    <th className="px-3 py-2 text-left">狀態</th>
                    <th className="px-3 py-2 text-left">備註</th>
                  </tr>
                </thead>
                <tbody>
                  {!loading && enrichedRecords.length === 0 && !error && (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-6 text-center text-[11px] text-pink-200/80"
                      >
                        目前尚無預約紀錄。
                      </td>
                    </tr>
                  )}

                  {enrichedRecords.map((r) => (
                    <tr
                      key={r.id}
                      className="border-t border-pink-500/10 hover:bg-gray-900/60"
                    >
                      <td className="px-3 py-2 text-pink-50">
                        {r.date || "—"}
                      </td>
                      <td className="px-3 py-2 text-pink-50">
                        {r.time || "—"}
                      </td>
                      <td className="px-3 py-2 text-pink-50">
                        {r.name || "—"}
                      </td>
                      <td className="px-3 py-2 text-pink-100/90">
                        {r.phone || "—"}
                      </td>
                      <td className="px-3 py-2 text-pink-100/90">
                        {r.serviceType || "—"}
                      </td>
                      <td className="px-3 py-2 text-pink-100/90">
                        {r.companionName || r.companion || "—"}
                      </td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(r)}
                          disabled={updatingId === r.id}
                          className="inline-flex items-center gap-1 rounded-full border border-pink-400/60 bg-pink-500/10 px-2.5 py-0.5 text-[11px] text-pink-100 hover:bg-pink-500/20 disabled:opacity-60"
                        >
                          <StatusChip status={r.status} />
                          <span>
                            {updatingId === r.id ? "更新中…" : "切換"}
                          </span>
                        </button>
                      </td>
                      <td className="px-3 py-2 text-pink-100/80">
                        {r.notes || r.note || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

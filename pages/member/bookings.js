// pages/member/bookings.js
import { useEffect, useState } from "react";
import MemberLayout from "../../components/MemberLayout";

function formatDateLabel(dateStr, timeStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) {
    return `${dateStr} ${timeStr || ""}`.trim();
  }
  const datePart = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}/${String(d.getDate()).padStart(2, "0")}`;
  return `${datePart} ${timeStr || ""}`.trim();
}

function StatusBadge({ status }) {
  const s = status || "待確認";
  let classes =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px]";

  if (s === "已確認") {
    classes +=
      " border-amber-300 bg-amber-50 text-amber-800";
  } else if (s === "已完成") {
    classes +=
      " border-emerald-300 bg-emerald-50 text-emerald-800";
  } else {
    classes +=
      " border-pink-300 bg-pink-50 text-pink-800";
  }

  return <span className={classes}>{s}</span>;
}

export default function MemberBookingsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      try {
        if (typeof window === "undefined") return;
        const phone = localStorage.getItem("memberPhone");
        if (!phone) {
          setError("尚未取得會員電話，請重新登入後查看預約紀錄。");
          setLoading(false);
          return;
        }

        const resp = await fetch(
          `/api/members/bookings?phone=${encodeURIComponent(phone)}`
        );
        const data = await resp.json();

        if (!resp.ok) {
          setError(data.error || "讀取預約紀錄失敗。");
          setRecords([]);
        } else {
          setRecords(Array.isArray(data.records) ? data.records : []);
        }
      } catch (err) {
        console.error(err);
        setError("系統錯誤，請稍後再試。");
        setRecords([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <MemberLayout>
      <h2 className="text-lg md:text-xl font-semibold text-pink-900 mb-4">
        預約紀錄
      </h2>
      <p className="text-xs md:text-sm text-pink-700 mb-4">
        這裡可以看到您歷次的預約狀態：待確認、已確認、已完成。
      </p>

      {loading && (
        <p className="text-xs text-pink-700">預約紀錄讀取中…</p>
      )}

      {error && !loading && (
        <div className="mb-4 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-800">
          {error}
        </div>
      )}

      {!loading && !error && records.length === 0 && (
        <p className="text-xs text-pink-700">
          目前尚無預約紀錄。
        </p>
      )}

      {!loading && !error && records.length > 0 && (
        <div className="space-y-3">
          {records.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-pink-100 bg-pink-50/60 px-3 py-3 text-xs md:text-sm"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="font-medium text-pink-900">
                  {r.serviceType || "未填寫服務類型"}
                </div>
                <StatusBadge status={r.status} />
              </div>

              <div className="text-pink-800 mb-1">
                {formatDateLabel(r.date, r.time)}
              </div>

              {r.notes && (
                <div className="text-[11px] text-pink-700 mt-1">
                  備註：{r.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </MemberLayout>
  );
}

// pages/admin/bookings.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('zh-TW');
  } catch {
    return dateStr;
  }
}

export default function AdminBookingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');

  // 權限檢查：沒登入就退回 /admin/login
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const loggedIn = window.localStorage.getItem('adminLoggedIn');
    if (!loggedIn) {
      router.replace('/admin/login');
    }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const resp = await fetch('/api/admin/bookings');
        const data = await resp.json();
        if (!resp.ok) {
          setError(data.error || '讀取預約資料失敗。');
          setRecords([]);
        } else {
          setRecords(data.records || []);
        }
      } catch (err) {
        console.error(err);
        setError('系統錯誤，請稍後再試。');
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 統計邏輯
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parsed = records.map((r) => {
    const d = r.date ? new Date(r.date) : null;
    if (d && !Number.isNaN(d.getTime())) {
      d.setHours(0, 0, 0, 0);
    }
    return { ...r, _dateObj: d };
  });

  const totalCount = parsed.length;
  const todayCount = parsed.filter(
    (r) => r._dateObj && r._dateObj.getTime() === today.getTime()
  ).length;
  const upcomingCount = parsed.filter(
    (r) => r._dateObj && r._dateObj.getTime() > today.getTime()
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-black text-white flex flex-col">
      {/* 頂部列 */}
      <header className="w-full border-b border-pink-500/40 bg-gray-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex flex-col">
            <span className="text-xs text-pink-300/80">EnjoyCare Admin</span>
            <span className="text-lg font-bold text-pink-100">
              預約紀錄報表
            </span>
          </div>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-pink-500 text-white hover:bg-pink-400 shadow-lg shadow-pink-500/30"
          >
            返回管理總覽
          </button>
        </div>
      </header>

      {/* 主內容 */}
      <main className="flex-1 w-full">
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          {/* 統計卡片 */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-3xl bg-gray-950/80 border border-pink-500/50 p-4">
              <div className="text-xs text-pink-200/80 mb-1">今日預約數</div>
              <div className="text-3xl font-bold text-pink-100">{todayCount}</div>
              <div className="text-[11px] text-pink-300/80 mt-1">
                以「預約日期」等於今天為準
              </div>
            </div>

            <div className="rounded-3xl bg-gray-950/80 border border-pink-500/50 p-4">
              <div className="text-xs text-pink-200/80 mb-1">未來預約數</div>
              <div className="text-3xl font-bold text-pink-100">
                {upcomingCount}
              </div>
              <div className="text-[11px] text-pink-300/80 mt-1">
                預約日期晚於今天的預約
              </div>
            </div>

            <div className="rounded-3xl bg-gray-950/80 border border-pink-500/50 p-4">
              <div className="text-xs text-pink-200/80 mb-1">總預約筆數</div>
              <div className="text-3xl font-bold text-pink-100">
                {totalCount}
              </div>
              <div className="text-[11px] text-pink-300/80 mt-1">
                目前 API 回傳的所有預約筆數（最多 100 筆）
              </div>
            </div>
          </section>

          {/* 錯誤訊息 */}
          {error && (
            <div className="rounded-2xl border border-red-500/60 bg-red-900/40 px-4 py-3 text-xs text-red-50">
              {error}
            </div>
          )}

          {/* 預約列表 */}
          <section className="rounded-3xl bg-gray-950/80 border border-pink-500/40 p-4 md:p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base md:text-lg font-semibold text-pink-100">
                預約明細列表
              </h2>
              {loading && (
                <span className="text-[11px] text-pink-200/80">
                  讀取中…
                </span>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-pink-500/30 text-pink-200">
                    <th className="text-left py-2 pr-3">日期</th>
                    <th className="text-left py-2 pr-3">時間</th>
                    <th className="text-left py-2 pr-3">手機</th>
                    <th className="text-left py-2 pr-3">服務類型</th>
                    <th className="text-left py-2 pr-3">狀態</th>
                    <th className="text-left py-2 pr-3">備註 / 特殊需求</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 && !loading && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-6 text-center text-xs text-pink-200/80"
                      >
                        尚無預約資料。
                      </td>
                    </tr>
                  )}
                  {records.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-pink-500/10 hover:bg-gray-900/60"
                    >
                      <td className="py-2 pr-3 text-pink-50">
                        {formatDate(r.date)}
                      </td>
                      <td className="py-2 pr-3 text-pink-50">{r.time}</td>
                      <td className="py-2 pr-3 text-pink-100/90">{r.phone}</td>
                      <td className="py-2 pr-3 text-pink-100">
                        {r.serviceType}
                      </td>
                      <td className="py-2 pr-3">
                        <span className="inline-flex items-center rounded-full border border-pink-400/60 px-2 py-0.5 text-[11px] text-pink-100">
                          {r.status || '待確認'}
                        </span>
                      </td>
                      <td className="py-2 pr-3 text-pink-200/90">
                        {r.notes || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* 背景裝飾 */}
      <div className="pointer-events-none fixed inset-0 opacity-40">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-pink-700/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-fuchsia-700/30 rounded-full blur-3xl" />
      </div>
    </div>
  );
}

// pages/admin/bookings.js
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

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
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // 登入檢查
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const loggedIn = window.localStorage.getItem('adminLoggedIn');
    if (!loggedIn) router.replace('/admin/login');
  }, [router]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError('');

        // 1) 預約紀錄 + summary
        const bookingResp = await fetch('/api/admin/bookings');
        const bookingData = await bookingResp.json();

        if (!bookingResp.ok) {
          setError(bookingData.error || '讀取預約紀錄失敗。');
          setRecords([]);
        } else {
          setSummary({
            todayCount: bookingData.todayCount || 0,
            futureCount: bookingData.futureCount || 0,
            totalCount:
              bookingData.totalCount ||
              (bookingData.records ? bookingData.records.length : 0),
          });
          setRecords(bookingData.records || []);
        }

        // 2) 會員清單（拿來做 phone → name 對照）
        try {
          const memberResp = await fetch('/api/admin/members');
          const memberData = await memberResp.json();
          if (memberResp.ok && Array.isArray(memberData.records)) {
            const map = new Map();
            memberData.records.forEach((m) => {
              if (m.phone) {
                map.set(String(m.phone).trim(), m.name || '');
              }
            });
            setMemberMap(map);
          }
        } catch (e) {
          console.warn('讀取會員清單失敗（不影響預約列表顯示）', e);
        }
      } catch (err) {
        console.error(err);
        setError('系統錯誤，請稍後再試。');
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const enrichedRecords = useMemo(() => {
    return records.map((r) => {
      const phone = r.phone ? String(r.phone).trim() : '';
      const nameFromMember = phone ? memberMap.get(phone) : '';
      return {
        ...r,
        name: r.name || nameFromMember || '',
      };
    });
  }, [records, memberMap]);

  const nextStatus = (current) => {
    if (current === '待確認') return '已確認';
    if (current === '已確認') return '已完成';
    return '已完成';
  };

  const renderStatusChip = (status) => {
    let color =
      'border-pink-400/70 text-pink-100 bg-pink-500/10'; // 待確認
    if (status === '已確認') {
      color =
        'border-amber-300/70 text-amber-100 bg-amber-500/10';
    } else if (status === '已完成') {
      color =
        'border-emerald-400/70 text-emerald-100 bg-emerald-500/10';
    }

    return (
      <span
        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${color}`}
      >
        {status}
      </span>
    );
  };

  const handleToggleStatus = async (record) => {
    const current = record.status || '待確認';
    const newStatus = nextStatus(current);

    try {
      setUpdatingId(record.id);
      const resp = await fetch('/api/admin/update-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: record.id, status: newStatus }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        alert(data.error || '更新狀態失敗');
        return;
      }

      // 本地狀態更新
      setRecords((prev) =>
        prev.map((r) =>
          r.id === record.id ? { ...r, status: newStatus } : r
        )
      );
    } catch (err) {
      console.error(err);
      alert('系統錯誤，請稍後再試');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-black text-white flex flex-col">
      {/* 頂部 */}
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

      {/* 內容 */}
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
                預約日期晚於今天的預約
              </div>
            </div>

            <div className="rounded-3xl border border-pink-500/40 bg-gray-950/70 px-4 py-4 shadow-lg shadow-pink-500/30">
              <div className="text-xs text-pink-200/80 mb-1">總預約筆數</div>
              <div className="text-3xl font-bold text-pink-100 mb-1">
                {summary.totalCount}
              </div>
              <div className="text-[11px] text-pink-200/70">
                目前 API 回傳的所有預約總數（最多 100 筆）
              </div>
            </div>
          </section>

          {/* 預約明細列表 */}
          <section className="rounded-3xl bg-gray-950/80 border border-pink-500/40 p-4 md:p-6 shadow-xl shadow-pink-500/30">
            <h2 className="text-base md:text-lg font-semibold text-pink-100 mb-3">
              預約明細列表
            </h2>

            {loading && (
              <div className="text-xs text-pink-200/80 mb-3">讀取中…</div>
            )}

            {error && (
              <div className="mb-3 text-xs text-red-300 bg-red-900/40 border border-red-700/60 rounded-2xl px-3 py-2">
                {error}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-pink-500/30 text-pink-200">
                    <th className="text-left py-2 pr-3">日期</th>
                    <th className="text-left py-2 pr-3">時間</th>
                    <th className="text-left py-2 pr-3">姓名</th>
                    <th className="text-left py-2 pr-3">手機</th>
                    <th className="text-left py-2 pr-3">服務類型</th>
                    <th className="text-left py-2 pr-3">陪伴員</th>
                    <th className="text-left py-2 pr-3">狀態</th>
                    <th className="text-left py-2 pr-3">備註 / 特殊需求</th>
                  </tr>
                </thead>
                <tbody>
                  {enrichedRecords.length === 0 && !loading && !error && (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-6 text-center text-xs text-pink-200/80"
                      >
                        目前尚無預約紀錄。
                      </td>
                    </tr>
                  )}

                  {enrichedRecords.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-pink-500/10 hover:bg-gray-900/60"
                    >
                      <td className="py-2 pr-3 text-pink-50">
                        {r.date || '—'}
                      </td>
                      <td className="py-2 pr-3 text-pink-50">
                        {r.time || '—'}
                      </td>
                      <td className="py-2 pr-3 text-pink-50">
                        {r.name || '—'}
                      </td>
                      <td className="py-2 pr-3 text-pink-100/90">
                        {r.phone || '—'}
                      </td>
                      <td className="py-2 pr-3 text-pink-100/90">
                        {r.serviceType || '—'}
                      </td>
                      <td className="py-2 pr-3 text-pink-100/90">
                        {r.companionName || r.companion || '—'}
                      </td>
                      <td className="py-2 pr-3">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-full border border-pink-500/60 bg-pink-500/10 px-2 py-0.5 text-[11px] text-pink-100 hover:bg-pink-500/20 disabled:opacity-60"
                          onClick={() => handleToggleStatus(r)}
                          disabled={updatingId === r.id}
                        >
                          {renderStatusChip(r.status || '待確認')}
                          <span className="ml-1">
                            {updatingId === r.id ? '更新中…' : '切換'}
                          </span>
                        </button>
                      </td>
                      <td className="py-2 pr-3 text-pink-100/80">
                        {r.notes || r.note || '—'}
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

// pages/member/bookings.js
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

export default function MemberBookingsPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 讀會員登入資訊
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const loggedIn = window.localStorage.getItem('memberLoggedIn');
    const memberPhone = window.localStorage.getItem('memberPhone');

    if (!loggedIn || !memberPhone) {
      router.replace('/member/login');
      return;
    }

    setPhone(memberPhone);
  }, [router]);

  // 抓預約紀錄
  useEffect(() => {
    if (!phone) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const resp = await fetch(
          `/api/member/bookings?phone=${encodeURIComponent(phone)}`
        );
        const data = await resp.json();

        if (!resp.ok) {
          setError(data.error || '讀取預約紀錄失敗。');
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
  }, [phone]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-black text-white flex flex-col">
      {/* 上方標題 + 登出 */}
      <header className="w-full border-b border-pink-500/40 bg-gray-950/80 backdrop-blur">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex flex-col">
            <span className="text-xs text-pink-300/80">
              長輩專屬會員專區
            </span>
            <span className="text-lg font-bold text-pink-100">
              預約紀錄
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.localStorage.removeItem('memberLoggedIn');
                window.localStorage.removeItem('memberPhone');
                window.localStorage.removeItem('memberName');
              }
              router.replace('/member/login');
            }}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-pink-500 text-white hover:bg-pink-400"
          >
            登出
          </button>
        </div>
      </header>

      {/* 主畫面：左側選單 + 右側內容 */}
      <main className="flex-1 w-full">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-[220px,1fr] gap-6">
          {/* 左側選單 */}
          <aside className="space-y-2">
            <button
              type="button"
              onClick={() => router.push('/member/dashboard')}
              className="w-full text-left rounded-2xl border border-pink-500/40 px-4 py-3 text-sm bg-gray-950/80 hover:border-pink-300/80"
            >
              會員總覽
            </button>
            <button
              type="button"
              onClick={() => router.push('/member/booking')}
              className="w-full text-left rounded-2xl border border-pink-500/40 px-4 py-3 text-sm bg-gray-950/80 hover:border-pink-300/80"
            >
              預約服務
            </button>
            <button
              type="button"
              disabled
              className="w-full text-left rounded-2xl border border-pink-400 px-4 py-3 text-sm bg-pink-900/40"
            >
              預約紀錄
            </button>
            <button
              type="button"
              onClick={() => router.push('/member/transactions')}
              className="w-full text-left rounded-2xl border border-pink-500/40 px-4 py-3 text-sm bg-gray-950/80 hover:border-pink-300/80"
            >
              消費紀錄
            </button>
            <button
              type="button"
              onClick={() => router.push('/member/balance')}
              className="w-full text-left rounded-2xl border border-pink-500/40 px-4 py-3 text-sm bg-gray-950/80 hover:border-pink-300/80"
            >
              儲值金
            </button>
            <button
              type="button"
              onClick={() => router.push('/member/points')}
              className="w-full text-left rounded-2xl border border-pink-500/40 px-4 py-3 text-sm bg-gray-950/80 hover:border-pink-300/80"
            >
              點數
            </button>
          </aside>

          {/* 右側內容：預約紀錄卡片 */}
          <section className="rounded-3xl bg-gray-950/80 border border-pink-500/40 p-4 md:p-6 shadow-xl shadow-pink-500/30">
            <h2 className="text-base md:text-lg font-semibold text-pink-100 mb-2">
              預約紀錄
            </h2>
            <p className="text-xs text-pink-200/80 mb-4">
              可查看每次預約的日期、時間、服務項目與目前狀態。
            </p>

            {loading && (
              <div className="text-xs text-pink-200/80">讀取中…</div>
            )}

            {error && (
              <div className="mb-3 text-xs text-red-300 bg-red-900/40 border border-red-700/60 rounded-2xl px-3 py-2">
                {error}
              </div>
            )}

            {!loading && records.length === 0 && !error && (
              <div className="flex flex-col items-center justify-center py-10 text-pink-200/80 text-sm">
                <span className="text-3xl mb-2">📅</span>
                <span>目前還沒有預約紀錄</span>
              </div>
            )}

            {records.length > 0 && (
              <div className="space-y-3">
                {records.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-2xl border border-pink-500/30 bg-black/40 px-3 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                  >
                    <div>
                      <div className="text-sm text-pink-50 font-semibold">
                        {formatDate(r.date)}　{r.time || ''}
                      </div>
                      <div className="text-xs text-pink-200/90 mt-1">
                        服務類型：{r.serviceType || '—'}
                      </div>
                      {r.notes && (
                        <div className="text-xs text-pink-300/90 mt-1">
                          備註：{r.notes}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 self-end md:self-auto">
                      {renderStatusChip(r.status || '待確認')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

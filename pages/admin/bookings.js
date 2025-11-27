// pages/admin/bookings.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 權限檢查
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loggedIn = localStorage.getItem('adminLoggedIn');
      if (!loggedIn) {
        router.replace('/admin/login');
      }
    }
  }, [router]);

  // 載入所有預約
  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      setError('');
      try {
        const resp = await fetch('/api/admin/bookings');
        const data = await resp.json();
        if (!resp.ok || !data.success) {
          setError(data.error || '讀取預約資料失敗');
        } else {
          // 簡單依日期排序（字串排序即可；之後有需要再強化）
          const list = data.bookings || [];
          list.sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
          setBookings(list);
        }
      } catch (err) {
        console.error(err);
        setError('系統錯誤，無法取得預約資料');
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-rose-50 flex flex-col">
      <header className="w-full bg-white/80 border-b border-pink-100 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="text-pink-700 font-bold text-lg">
            管理者後台｜會員預約資料
          </div>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold border border-pink-300 text-pink-700 bg-pink-50 hover:bg-pink-100"
          >
            回管理者首頁
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg border border-pink-100 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-pink-900">
              所有預約紀錄
            </h2>
            {loading && (
              <span className="text-xs text-pink-500">載入中…</span>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500 mb-2">{error}</p>
          )}

          <div className="border border-pink-100 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-6 bg-pink-50 text-pink-800 text-xs md:text-sm font-semibold px-3 py-2">
              <div>日期</div>
              <div>時間</div>
              <div>會員姓名</div>
              <div>電話</div>
              <div>服務類型</div>
              <div>備註 / 狀態</div>
            </div>
            <div className="max-h-[520px] overflow-y-auto">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="grid grid-cols-6 text-xs md:text-sm px-3 py-2 border-t border-pink-50"
                >
                  <div className="truncate">{b.date || '—'}</div>
                  <div className="truncate">{b.time || '—'}</div>
                  <div className="truncate">{b.name || '—'}</div>
                  <div className="truncate">{b.phone || '—'}</div>
                  <div className="truncate">
                    {b.serviceType || '—'}
                  </div>
                  <div className="truncate">
                    {b.status || b.note || '—'}
                  </div>
                </div>
              ))}

              {bookings.length === 0 && !loading && (
                <div className="px-3 py-4 text-center text-xs text-pink-500">
                  目前尚無預約紀錄
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

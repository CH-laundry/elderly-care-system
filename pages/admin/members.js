// pages/admin/members.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminMembersPage() {
  const router = useRouter();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 登入檢查
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const loggedIn = window.localStorage.getItem('adminLoggedIn');
    if (!loggedIn) router.replace('/admin/login');
  }, [router]);

  // 抓會員資料
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const resp = await fetch('/api/admin/members');
        const data = await resp.json();

        if (!resp.ok) {
          setError(data.error || '讀取會員資料失敗。');
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-black text-white flex flex-col">
      <header className="w-full border-b border-pink-500/40 bg-gray-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex flex-col">
            <span className="text-xs text-pink-300/80">EnjoyCare Admin</span>
            <span className="text-lg font-bold text-pink-100">
              會員基本資料
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

      <main className="flex-1 w-full">
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          <section className="rounded-3xl bg-gray-950/80 border border-pink-500/40 p-4 md:p-5 shadow-xl shadow-pink-500/30">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base md:text-lg font-semibold text-pink-100">
                會員列表
              </h2>
              {loading && (
                <span className="text-[11px] text-pink-200/80">讀取中…</span>
              )}
            </div>

            {error && (
              <div className="mb-3 text-xs text-red-300 bg-red-900/40 border border-red-700/60 rounded-2xl px-3 py-2">
                {error}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-pink-500/30 text-pink-200">
                    <th className="text-left py-2 pr-3">姓名</th>
                    <th className="text-left py-2 pr-3">手機</th>
                    <th className="text-left py-2 pr-3">生日</th>
                    <th className="text-left py-2 pr-3">地址</th>
                    <th className="text-left py-2 pr-3">備註</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 && !loading && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-6 text-center text-xs text-pink-200/80"
                      >
                        尚無會員資料。
                      </td>
                    </tr>
                  )}

                  {records.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-pink-500/10 hover:bg-gray-900/60"
                    >
                      <td className="py-2 pr-3 text-pink-50">
                        {r.name || '—'}
                      </td>
                      <td className="py-2 pr-3 text-pink-100/90">
                        {r.phone || '—'}
                      </td>
                      <td className="py-2 pr-3 text-pink-100/90">
                        {r.birthday || '—'}
                      </td>
                      <td className="py-2 pr-3 text-pink-100/90">
                        {r.address || '—'}
                      </td>
                      <td className="py-2 pr-3 text-pink-100/80">
                        {r.note || '—'}
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

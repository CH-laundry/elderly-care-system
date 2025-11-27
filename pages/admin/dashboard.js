// pages/admin/dashboard.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loggedIn = localStorage.getItem('adminLoggedIn');
      if (!loggedIn) {
        router.replace('/admin/login');
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-rose-50 flex flex-col">
      <header className="w-full bg-white/80 border-b border-pink-100 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="text-pink-700 font-bold text-lg">
            管理者後台｜長輩照護系統
          </div>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.removeItem('adminLoggedIn');
              }
              router.push('/');
            }}
            className="px-4 py-2 rounded-full text-sm font-semibold border border-pink-300 text-pink-700 bg-pink-50 hover:bg-pink-100"
          >
            登出
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <section className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-pink-700">
              管理者總覽
            </h1>
            <p className="text-pink-500 text-sm md:text-base">
              可查看所有會員資料、儲值金／點數與預約紀錄
            </p>
          </section>

          {/* 功能選單卡片 */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => router.push('/admin/members')}
              className="bg-white rounded-3xl shadow-lg p-6 text-left border border-pink-100 hover:border-pink-300 hover:shadow-xl transition-all"
            >
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-lg font-bold text-pink-900 mb-2">
                會員基本資料
              </h3>
              <p className="text-sm text-pink-700 leading-relaxed">
                檢視所有會員的電話、姓名、儲值金、點數等資料，並可點選查看個人詳細紀錄。
              </p>
            </button>

            <button
              onClick={() => router.push('/admin/bookings')}
              className="bg-white rounded-3xl shadow-lg p-6 text-left border border-pink-100 hover:border-pink-300 hover:shadow-xl transition-all"
            >
              <div className="text-4xl mb-3">📅</div>
              <h3 className="text-lg font-bold text-pink-900 mb-2">
                會員預約資料
              </h3>
              <p className="text-sm text-pink-700 leading-relaxed">
                以時間排序查看所有預約紀錄，掌握當日與未來預約狀況。
              </p>
            </button>

            <div className="bg-white rounded-3xl shadow-lg p-6 text-left border border-pink-100 opacity-70">
              <div className="text-4xl mb-3">💳</div>
              <h3 className="text-lg font-bold text-pink-900 mb-2">
                消費與儲值紀錄（預留）
              </h3>
              <p className="text-sm text-pink-700 leading-relaxed">
                未來可擴充為查看每位會員的消費紀錄與儲值紀錄報表。
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

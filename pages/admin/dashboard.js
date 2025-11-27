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
      {/* 頂部列 */}
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

      {/* 主要內容 */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* 標題區 */}
          <section className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-pink-700">
              管理者總覽
            </h1>
            <p className="text-pink-500 text-sm md:text-base">
              可查看所有會員資料、儲值金／點數與預約、交易紀錄。
            </p>
          </section>

          {/* 功能選單：四顆大卡片 */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 會員基本資料 */}
            <button
              onClick={() => router.push('/admin/members')}
              className="bg-white rounded-3xl shadow-lg p-6 text-left border border-pink-100 hover:border-pink-300 hover:shadow-xl transition-all"
            >
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-lg font-bold text-pink-900 mb-2">
                會員基本資料
              </h3>
              <p className="text-sm text-pink-700 leading-relaxed">
                檢視所有會員的電話、姓名、儲值金與點數，點選個別會員可查看詳細資料與歷史預約紀錄。
              </p>
            </button>

            {/* 會員預約資料 */}
            <button
              onClick={() => router.push('/admin/bookings')}
              className="bg-white rounded-3xl shadow-lg p-6 text-left border border-pink-100 hover:border-pink-300 hover:shadow-xl transition-all"
            >
              <div className="text-4xl mb-3">📅</div>
              <h3 className="text-lg font-bold text-pink-900 mb-2">
                會員預約資料
              </h3>
              <p className="text-sm text-pink-700 leading-relaxed">
                以時間排序查看所有預約紀錄，掌握每日與未來預約量，方便安排人力。
              </p>
            </button>

            {/* 儲值金 / 消費紀錄報表 */}
            <button
              onClick={() => router.push('/admin/transactions')}
              className="bg-white rounded-3xl shadow-lg p-6 text-left border border-pink-100 hover:border-pink-300 hover:shadow-xl transition-all"
            >
              <div className="text-4xl mb-3">💳</div>
              <h3 className="text-lg font-bold text-pink-900 mb-2">
                儲值金／消費紀錄報表
              </h3>
              <p className="text-sm text-pink-700 leading-relaxed">
                查看每一筆儲值與扣款紀錄，支援依「儲值／消費」篩選，方便對帳與查詢爭議。
              </p>
            </button>

            {/* 預留功能位（未來可再設計） */}
            <div className="bg-white rounded-3xl shadow-lg p-6 text-left border border-pink-50 opacity-70">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-lg font-bold text-pink-900 mb-2">
                統計報表（預留）
              </h3>
              <p className="text-sm text-pink-700 leading-relaxed">
                未來可擴充為每月營收、會員成長、服務別使用量等視覺化圖表。
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

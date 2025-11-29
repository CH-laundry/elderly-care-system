// pages/admin/dashboard.js
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminLoggedIn');
      localStorage.removeItem('adminUser');
    }
    router.push('/admin/login');
  };

  const goToMembers = () => router.push('/admin/members');
  const goToBookings = () => router.push('/admin/bookings');
  const goToTransactions = () => router.push('/admin/transactions');
  const goToTopup = () => router.push('/admin/topup'); // ✅ 新增線上儲值頁面

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-black text-white flex flex-col">
      {/* 頂部列 */}
      <header className="w-full border-b border-pink-500/40 bg-gray-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex flex-col">
            <span className="text-xs text-pink-300/80">EnjoyCare Admin</span>
            <span className="text-lg font-bold text-pink-100">
              管理者後台總覽
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-pink-500 text-white hover:bg-pink-400 shadow-lg shadow-pink-500/30"
          >
            登出
          </button>
        </div>
      </header>

      {/* 主內容 */}
      <main className="flex-1 w-full">
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
          {/* 標題說明 */}
          <section className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-pink-100 tracking-wide">
              享老安心照護｜管理者控制台
            </h2>
            <p className="text-sm text-pink-200/80">
              可查看會員資料、預約紀錄、儲值與消費紀錄，並進行線上儲值管理。
            </p>
          </section>

          {/* 功能選單卡片 */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 會員基本資料 */}
            <button
              onClick={goToMembers}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-pink-500/40 shadow-xl hover:shadow-pink-500/50 transition"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-pink-500/10 transition" />
              <div className="relative flex items-center gap-4 p-5">
                <div className="w-12 h-12 rounded-xl bg-pink-900/60 flex items-center justify-center text-2xl">
                  <span role="img" aria-label="members">👥</span>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-pink-50">
                    會員基本資料
                  </h3>
                  <p className="text-xs text-pink-200/80 mt-1 leading-relaxed">
                    查看與管理所有會員的基本資料、聯絡方式與狀態。
                  </p>
                </div>
              </div>
            </button>

            {/* 會員預約資料 */}
            <button
              onClick={goToBookings}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-pink-500/40 shadow-xl hover:shadow-pink-500/50 transition"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-pink-500/10 transition" />
              <div className="relative flex items-center gap-4 p-5">
                <div className="w-12 h-12 rounded-xl bg-pink-900/60 flex items-center justify-center text-2xl">
                  <span role="img" aria-label="calendar">📅</span>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-pink-50">
                    會員預約資料
                  </h3>
                  <p className="text-xs text-pink-200/80 mt-1 leading-relaxed">
                    依日期檢視所有預約紀錄，掌握每日與未來預約量。
                  </p>
                </div>
              </div>
            </button>

            {/* 儲值金 / 消費紀錄報表 */}
            <button
              onClick={goToTransactions}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-pink-500/40 shadow-xl hover:shadow-pink-500/50 transition"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-pink-500/10 transition" />
              <div className="relative flex items-center gap-4 p-5">
                <div className="w-12 h-12 rounded-xl bg-pink-900/60 flex items-center justify-center text-2xl">
                  <span role="img" aria-label="transactions">📊</span>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-pink-50">
                    儲值金 / 消費紀錄
                  </h3>
                  <p className="text-xs text-pink-200/80 mt-1 leading-relaxed">
                    檢視每位會員的儲值、扣款與消費紀錄，作為結帳與對帳依據。
                  </p>
                </div>
              </div>
            </button>

            {/* 線上儲值入口（你要的新功能） */}
            <button
              onClick={goToTopup}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-pink-500/40 shadow-xl hover:shadow-pink-500/50 transition"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-pink-500/10 transition" />
              <div className="relative flex items-center gap-4 p-5">
                <div className="w-12 h-12 rounded-xl bg-pink-900/60 flex items-center justify-center text-2xl">
                  <span role="img" aria-label="topup">💳</span>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-pink-50">
                    線上儲值管理
                  </h3>
                  <p className="text-xs text-pink-200/80 mt-1 leading-relaxed">
                    管理會員儲值金，提供信用卡與 LINE Pay 儲值入口（可再串接金流 API）。
                  </p>
                </div>
              </div>
            </button>
          </section>
        </div>
      </main>

      {/* 背景漸層裝飾 */}
      <div className="pointer-events-none fixed inset-0 opacity-40">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-pink-700/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-fuchsia-700/30 rounded-full blur-3xl" />
      </div>
    </div>
  );
}

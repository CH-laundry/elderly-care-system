// pages/admin/dashboard.js
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const router = useRouter();

  // 管理者總覽首頁：暫時不在前端做登入強制檢查，避免被錯誤導回登入頁
  // 之後如果要加強權限控管，可以改成在伺服端 (API / middleware) 做驗證

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      // 如果之後有在 localStorage 紀錄登入狀態，可以在這裡一併清掉
      localStorage.removeItem('adminLoggedIn');
      localStorage.removeItem('adminUser');
    }
    router.push('/admin/login');
  };

  const goToMembers = () => router.push('/admin/members');
  const goToBookings = () => router.push('/admin/bookings');
  const goToTransactions = () => router.push('/admin/transactions');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-black text-white flex flex-col">
      {/* 頂部導覽列 */}
      <header className="w-full border-b border-pink-700/40 bg-black/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-wide text-pink-300">
              管理者後台｜長輩照護系統
            </h1>
            <p className="text-xs text-pink-200/60 mt-1">
              可查看所有會員資料、儲值金 / 點數與預約、交易紀錄。
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-1.5 rounded-full border border-pink-500/60 text-sm text-pink-100 hover:bg-pink-600/20 transition flex items-center gap-2"
          >
            <span>登出</span>
          </button>
        </div>
      </header>

      {/* 主內容 */}
      <main className="flex-1 w-full">
        <div className="max-w-6xl mx-auto px-4 py-10">
          {/* 標題區塊 */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-center tracking-wide text-pink-200">
              管理者總覽
            </h2>
            <p className="text-center text-sm text-pink-200/70 mt-2">
              可查看所有會員資料、儲值金 / 點數與預約、交易紀錄。
            </p>
          </section>

          {/* 功能選單卡片 */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 會員基本資料 */}
            <button
              onClick={goToMembers}
              className="group bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-pink-800/60 rounded-2xl p-5 text-left shadow-lg shadow-pink-900/40 hover:border-pink-400/80 hover:shadow-pink-500/50 transition relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-pink-500/5 transition" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-pink-900/50 flex items-center justify-center text-2xl">
                  <span role="img" aria-label="members">👥</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-pink-100">
                    會員基本資料
                  </h3>
                  <p className="text-xs text-pink-100/70 mt-1 leading-relaxed">
                    檢視所有會員電話、姓名、儲值金與點數，點選個別會員可查看詳盡資料與歷史預約紀錄。
                  </p>
                </div>
              </div>
            </button>

            {/* 會員預約資料 */}
            <button
              onClick={goToBookings}
              className="group bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-pink-800/60 rounded-2xl p-5 text-left shadow-lg shadow-pink-900/40 hover:border-pink-400/80 hover:shadow-pink-500/50 transition relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-pink-500/5 transition" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-pink-900/50 flex items-center justify-center text-2xl">
                  <span role="img" aria-label="calendar">📅</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-pink-100">
                    會員預約資料
                  </h3>
                  <p className="text-xs text-pink-100/70 mt-1 leading-relaxed">
                    按日期查看所有預約記錄，掌握每日與未來預約數量，方便安排人力與服務。
                  </p>
                </div>
              </div>
            </button>

            {/* 儲值金 / 消費紀錄報表 */}
            <button
              onClick={goToTransactions}
              className="group bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-pink-800/60 rounded-2xl p-5 text-left shadow-lg shadow-pink-900/40 hover:border-pink-400/80 hover:shadow-pink-500/50 transition relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-pink-500/5 transition" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-pink-900/50 flex items-center justify-center text-2xl">
                  <span role="img" aria-label="transactions">💳</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-pink-100">
                    儲值金 / 消費紀錄報表
                  </h3>
                  <p className="text-xs text-pink-100/70 mt-1 leading-relaxed">
                    查看每一筆儲值與扣款紀錄，支援依日期篩選與分類檢視，方便對帳與處理爭議。
                  </p>
                </div>
              </div>
            </button>

            {/* 統計報表（預留功能） */}
            <div className="group bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-pink-800/60 rounded-2xl p-5 text-left shadow-lg shadow-pink-900/40 relative overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-pink-500/5 transition" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-pink-900/50 flex items-center justify-center text-2xl">
                  <span role="img" aria-label="chart">📊</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-pink-100 flex items-center gap-2">
                    統計報表（預留）
                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-pink-500/60 text-pink-200/80">
                      即將開發
                    </span>
                  </h3>
                  <p className="text-xs text-pink-100/70 mt-1 leading-relaxed">
                    未來可以整合每月營收、會員成長、服務別使用量等視覺化圖表，讓你快速掌握營運狀況。
                  </p>
                </div>
              </div>
            </div>
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

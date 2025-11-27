// pages/admin/dashboard.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const router = useRouter();

  // 簡單後台登入檢查：沒登入就丟回 /admin/login
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loggedIn = localStorage.getItem('adminLoggedIn');
    if (loggedIn !== 'true') {
      router.replace('/admin/login');
    }
  }, [router]);

  const goTo = (path) => {
    router.push(path);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminLoggedIn');
    }
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-12">
        {/* 頂部標題區 */}
		<header className="mb-10">
          <p className="text-sm text-pink-400 mb-1">
            管理者後台｜長輩照護系統
          </p>

          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-pink-100">
              管理者總覽
            </h1>

            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 rounded-full border border-pink-500 text-sm text-pink-200 hover:bg-pink-600 hover:text-white transition-colors"
            >
              登出
            </button>
          </div>

          <p className="mt-2 text-pink-300 text-sm md:text-base">
            可查看所有會員資料、儲值金／點數與預約、交易紀錄。
          </p>
        </header>

        {/* 功能選單卡片 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 會員基本資料 */}
          <button
            type="button"
            onClick={() => goTo('/admin/members')}
            className="bg-[#1b111c] border border-pink-800/60 hover:border-pink-400/80 hover:bg-[#261226] transition-all rounded-3xl p-6 text-left shadow-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl" role="img" aria-label="members">
                👥
              </span>
              <h2 className="text-lg md:text-xl font-semibold text-pink-100">
                會員基本資料
              </h2>
            </div>
            <p className="text-sm text-pink-200 leading-relaxed">
              檢視所有會員電話、姓名、儲值金與點數，點選個別會員可查看詳細資料與歷史預約紀錄。
            </p>
          </button>

          {/* 會員預約資料 */}
          <button
            type="button"
            onClick={() => goTo('/admin/bookings')}
            className="bg-[#1b111c] border border-pink-800/60 hover:border-pink-400/80 hover:bg-[#261226] transition-all rounded-3xl p-6 text-left shadow-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl" role="img" aria-label="calendar">
                📅
              </span>
              <h2 className="text-lg md:text-xl font-semibold text-pink-100">
                會員預約資料
              </h2>
            </div>
            <p className="text-sm text-pink-200 leading-relaxed">
              按日期查看所有預約紀錄，掌握每日與未來數天的預約數量，方便安排人力與服務。
            </p>
          </button>

          {/* 儲值金／消費紀錄報表 */}
          <button
            type="button"
            onClick={() => goTo('/admin/transactions')}
            className="bg-[#1b111c] border border-pink-800/60 hover:border-pink-400/80 hover:bg-[#261226] transition-all rounded-3xl p-6 text-left shadow-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl" role="img" aria-label="wallet">
                💳
              </span>
              <h2 className="text-lg md:text-xl font-semibold text-pink-100">
                儲值金／消費紀錄報表
              </h2>
            </div>
            <p className="text-sm text-pink-200 leading-relaxed">
              集中查看每一筆儲值、扣款與消費紀錄，未來可再加上匯出報表與依日期、會員查詢。
            </p>
          </button>

          {/* 統計報表（預留功能） */}
          <div className="bg-[#130b14] border border-dashed border-pink-700/60 rounded-3xl p-6 text-left opacity-80">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl" role="img" aria-label="chart">
                📊
              </span>
              <h2 className="text-lg md:text-xl font-semibold text-pink-200">
                統計報表（預留）
              </h2>
            </div>
            <p className="text-sm text-pink-300 leading-relaxed">
              未來可視覺化每月營收、會員成長、服務別使用量等數據，做為決策與調整方案的依據。
            </p>
            <p className="mt-2 text-xs text-pink-500">
              目前僅為預留版位，尚未開放操作。
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

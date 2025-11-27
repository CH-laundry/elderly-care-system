// pages/admin/dashboard.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const router = useRouter();

  // 登入狀態檢查（只在瀏覽器端跑）
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
    router.replace('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-pink-100">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* 頁首 */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm text-pink-300 mb-1">
              管理者後台 | 長輩照護系統
            </p>
            <h1 className="text-3xl font-bold text-pink-200">管理者總覽</h1>
            <p className="text-sm text-pink-300 mt-1">
              可查看所有會員資料、儲值金／點數、預約紀錄與交易紀錄。
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="self-start md:self-auto px-6 py-2 rounded-full border border-pink-400 text-pink-100 hover:bg-pink-600/20 text-sm transition"
          >
            登出
          </button>
        </header>

        {/* 功能卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 會員基本資料 */}
          <button
            type="button"
            onClick={() => goTo('/admin/members')}
            className="group bg-gray-900/70 border border-pink-500/60 rounded-2xl p-6 text-left hover:border-pink-300 hover:bg-gray-900/90 transition"
          >
            <div className="text-3xl mb-2">👥</div>
            <h2 className="text-xl font-semibold text-pink-100 mb-1">
              會員基本資料
            </h2>
            <p className="text-sm text-pink-200">
              檢視所有會員電話、姓名、儲值金與點數，並可查看詳細資料與歷史紀錄。
            </p>
          </button>

          {/* 會員預約資料 */}
          <button
            type="button"
            onClick={() => goTo('/admin/bookings')}
            className="group bg-gray-900/70 border border-pink-500/60 rounded-2xl p-6 text-left hover:border-pink-300 hover:bg-gray-900/90 transition"
          >
            <div className="text-3xl mb-2">📅</div>
            <h2 className="text-xl font-semibold text-pink-100 mb-1">
              會員預約資料
            </h2>
            <p className="text-sm text-pink-200">
              按日期查看所有預約紀錄，掌握每日與未來時段預約量，方便安排人力。
            </p>
          </button>

          {/* 儲值金／消費紀錄報表 */}
          <button
            type="button"
            onClick={() => goTo('/admin/transactions')}
            className="group bg-gray-900/70 border border-pink-500/60 rounded-2xl p-6 text-left hover:border-pink-300 hover:bg-gray-900/90 transition"
          >
            <div className="text-3xl mb-2">💳</div>
            <h2 className="text-xl font-semibold text-pink-100 mb-1">
              儲值金／消費紀錄報表
            </h2>
            <p className="text-sm text-pink-200">
              查詢每一筆儲值與扣款紀錄，追蹤金額、付款方式與經手人，方便帳務對帳。
            </p>
          </button>

          {/* 統計報表預留位 */}
          <div className="bg-gray-900/40 border border-pink-500/40 rounded-2xl p-6">
            <div className="text-3xl mb-2">📊</div>
            <h2 className="text-xl font-semibold text-pink-100 mb-1">
              統計報表（預留）
            </h2>
            <p className="text-sm text-pink-200">
              未來可新增每月營收、會員成長、服務別使用量等視覺化圖表。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

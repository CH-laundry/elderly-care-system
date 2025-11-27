// pages/admin/dashboard.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

/**
 * 後台首頁：管理者總覽
 * 功能：
 * 1. 檢查是否已登入（localStorage）
 * 2. 提供四個入口：會員基本資料、會員預約資料、儲值金 / 消費紀錄報表、統計報表（預留）
 */

export default function AdminDashboard() {
  const router = useRouter();

  // ---- 登入狀態檢查（相容舊版本 key，避免你原本可以登入的被鎖住）----
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const possibleKeys = [
      'adminLoggedIn',      // 我之前常用這個
      'isAdminLoggedIn',
      'adminLogin',
      'adminAuthenticated',
    ];

    const isLoggedIn = possibleKeys.some(
      (key) => window.localStorage.getItem(key) === 'true'
    );

    if (!isLoggedIn) {
      router.replace('/admin/login');
    }
  }, [router]);

  // ---- 導向各後台功能 ----
  const goToMembers = () => router.push('/admin/members');
  const goToBookings = () => router.push('/admin/bookings');
  const goToTransactions = () => router.push('/admin/transactions');

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Head>
        <title>管理者後台｜長輩照護系統</title>
      </Head>

      {/* 頂部列 */}
      <header className="border-b border-pink-700/60 bg-black/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-lg sm:text-xl font-semibold tracking-wide">
            <span className="text-pink-400">管理者後台</span>
            <span className="mx-2 text-pink-600">｜</span>
            <span className="text-pink-200">長輩照護系統</span>
          </h1>

          <button
            className="text-sm px-4 py-1.5 rounded-full border border-pink-500 text-pink-200 hover:bg-pink-600/20 transition"
            onClick={() => {
              if (typeof window !== 'undefined') {
                // 登出時把可能的 key 都清掉
                ['adminLoggedIn', 'isAdminLoggedIn', 'adminLogin', 'adminAuthenticated']
                  .forEach((key) => window.localStorage.removeItem(key));
              }
              router.push('/admin/login');
            }}
          >
            登出
          </button>
        </div>
      </header>

      {/* 內容區 */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* 標題 */}
        <section className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-pink-300 mb-2">
            管理者總覽
          </h2>
          <p className="text-sm sm:text-base text-pink-200/80">
            可查看所有會員資料、儲值金 / 點數、預約紀錄、交易紀錄等。
          </p>
        </section>

        {/* 功能卡片區塊 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 會員基本資料 */}
          <button
            type="button"
            onClick={goToMembers}
            className="text-left rounded-2xl border border-pink-600/60 bg-gradient-to-br from-gray-900 to-black 
                       hover:from-pink-900/40 hover:to-black transition transform hover:-translate-y-1 
                       hover:shadow-[0_0_25px_rgba(236,72,153,0.4)] p-6"
          >
            <div className="text-4xl mb-3">👥</div>
            <h3 className="text-lg font-bold text-pink-200 mb-2">會員基本資料</h3>
            <p className="text-sm text-pink-100/80 leading-relaxed">
              檢視所有會員電話、姓名、儲值金與點數，點選個別會員可查看詳細資料與歷史紀錄。
            </p>
          </button>

          {/* 會員預約資料 */}
          <button
            type="button"
            onClick={goToBookings}
            className="text-left rounded-2xl border border-pink-600/60 bg-gradient-to-br from-gray-900 to-black 
                       hover:from-pink-900/40 hover:to-black transition transform hover:-translate-y-1 
                       hover:shadow-[0_0_25px_rgba(236,72,153,0.4)] p-6"
          >
            <div className="text-4xl mb-3">📅</div>
            <h3 className="text-lg font-bold text-pink-200 mb-2">會員預約資料</h3>
            <p className="text-sm text-pink-100/80 leading-relaxed">
              依日期查看所有預約紀錄，掌握每日與未來預約數量，方便安排人力與服務。
            </p>
          </button>

          {/* 儲值金 / 消費紀錄報表 */}
          <button
            type="button"
            onClick={goToTransactions}
            className="text-left rounded-2xl border border-pink-600/60 bg-gradient-to-br from-gray-900 to-black 
                       hover:from-pink-900/40 hover:to-black transition transform hover:-translate-y-1 
                       hover:shadow-[0_0_25px_rgba(236,72,153,0.4)] p-6"
          >
            <div className="text-4xl mb-3">💳</div>
            <h3 className="text-lg font-bold text-pink-200 mb-2">
              儲值金 / 消費紀錄報表
            </h3>
            <p className="text-sm text-pink-100/80 leading-relaxed">
              查看每一筆儲值與扣款紀錄，支援依日期、會員、金額篩選，方便對帳與紀錄管理。
            </p>
          </button>

          {/* 統計報表（預留） */}
          <div
            className="text-left rounded-2xl border border-pink-600/40 border-dashed 
                       bg-gradient-to-br from-gray-900/70 to-black/80 p-6"
          >
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-lg font-bold text-pink-200 mb-2">
              統計報表（預留）
            </h3>
            <p className="text-sm text-pink-100/80 leading-relaxed">
              未來可擴充為每月營收、會員成長、服務別使用量等視覺化圖表，作為營運決策參考。
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

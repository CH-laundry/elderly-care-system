// pages/admin/dashboard.js
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const loggedIn = window.localStorage.getItem("adminLoggedIn");
    if (!loggedIn) {
      router.replace("/admin/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-black text-white flex flex-col">
      {/* 上方列 */}
      <header className="w-full border-b border-pink-500/40 bg-gray-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex flex-col">
            <span className="text-xs text-pink-300/80">EnjoyCare Admin</span>
            <span className="text-lg font-bold text-pink-100">
              管理者後台總覽
            </span>
          </div>
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.localStorage.removeItem("adminLoggedIn");
              }
              router.replace("/admin/login");
            }}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-pink-500 text-white hover:bg-pink-400 shadow-lg shadow-pink-500/30"
          >
            登出
          </button>
        </div>
      </header>

      {/* 內容 */}
      <main className="flex-1 w-full">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
          <section className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-pink-100">
              享老安心照護｜管理者控制台
            </h1>
            <p className="text-xs md:text-sm text-pink-200/90">
              可查看會員資料、預約紀錄、儲值與消費紀錄，以及管理線上儲值與營業狀況。
            </p>
          </section>

          <section className="space-y-4">
            {/* 1. 會員基本資料（保留卡片，不導頁） */}
            <div className="rounded-3xl bg-gray-950/80 border border-pink-500/40 px-4 py-4 md:px-6 md:py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-pink-600 flex items-center justify-center text-2xl">
                  👤
                </div>
                <div className="flex-1">
                  <div className="text-base md:text-lg font-semibold text-pink-50">
                    會員基本資料
                  </div>
                  <div className="text-xs md:text-sm text-pink-200/90">
                    查看與管理所有會員的基本資料、聯絡方式與狀態。
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 會員預約資料 → /admin/bookings */}
            <button
              type="button"
              onClick={() => router.push("/admin/bookings")}
              className="w-full text-left rounded-3xl bg-gray-950/80 border border-pink-500/60 px-4 py-4 md:px-6 md:py-5 hover:bg-gray-900/80 hover:border-pink-300/80 transition shadow-lg shadow-pink-500/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-pink-500 flex items-center justify-center text-2xl">
                  📅
                </div>
                <div className="flex-1">
                  <div className="text-base md:text-lg font-semibold text-pink-50">
                    會員預約資料
                  </div>
                  <div className="text-xs md:text-sm text-pink-200/90">
                    依日期檢視所有預約紀錄，掌握每日與未來預約量。
                  </div>
                </div>
              </div>
            </button>

            {/* 3. 儲值金 / 消費紀錄（先純展示） */}
            <div className="rounded-3xl bg-gray-950/80 border border-pink-500/40 px-4 py-4 md:px-6 md:py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-pink-600 flex items-center justify-center text-2xl">
                  📊
                </div>
                <div className="flex-1">
                  <div className="text-base md:text-lg font-semibold text-pink-50">
                    儲值金 / 消費紀錄
                  </div>
                  <div className="text-xs md:text-sm text-pink-200/90">
                    檢視每位會員儲值明細與消費紀錄，作為結帳與對帳依據。
                  </div>
                </div>
              </div>
            </div>

            {/* 4. 線上儲值管理（未來串金流） */}
            <div className="rounded-3xl bg-gray-950/80 border border-pink-500/40 px-4 py-4 md:px-6 md:py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-pink-600 flex items-center justify-center text-2xl">
                  💳
                </div>
                <div className="flex-1">
                  <div className="text-base md:text-lg font-semibold text-pink-50">
                    線上儲值管理
                  </div>
                  <div className="text-xs md:text-sm text-pink-200/90">
                    管理會員儲值金，未來可接信用卡與 LINE Pay 儲值入口。
                  </div>
                </div>
              </div>
            </div>

            {/* 5. 營業報表（暫時只有卡片，不導頁） */}
            <div className="rounded-3xl bg-gray-950/80 border border-pink-500/40 px-4 py-4 md:px-6 md:py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-pink-600 flex items-center justify-center text-2xl">
                  📈
                </div>
                <div className="flex-1">
                  <div className="text-base md:text-lg font-semibold text-pink-50">
                    營業報表
                  </div>
                  <div className="text-xs md:text-sm text-pink-200/90">
                    彙總每日與每月營收、儲值與消費趨勢（之後再開啟此功能）。
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* 背景光暈 */}
      <div className="pointer-events-none fixed inset-0 opacity-40">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-pink-700/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-fuchsia-700/30 rounded-full blur-3xl" />
      </div>
    </div>
  );
}

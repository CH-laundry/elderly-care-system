// pages/member/transactions.js

import { useRouter } from 'next/router';

export default function MemberTransactionsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-pink-50">
      <header className="border-b border-pink-500/20 bg-black/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs text-pink-300/80">EnjoyCare Member</p>
            <h1 className="text-lg font-semibold tracking-wide">
              長輩專屬會員專區
            </h1>
            <p className="mt-1 text-xs text-pink-200/70">
              可查看預約、消費紀錄、儲值與點數資訊
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/member/login')}
            className="rounded-full bg-pink-500 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-pink-500/40 hover:bg-pink-400"
          >
            登出
          </button>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl gap-6 px-4 py-8">
        {/* 左側選單 */}
        <aside className="w-52 space-y-3">
          {/* 會員總覽 */}
          <button
            type="button"
            onClick={() => router.push('/member/dashboard')}
            className="w-full text-left rounded-2xl border border-pink-500/40 bg-gray-950/80 px-4 py-3 text-sm text-pink-50 hover:border-pink-300/80 hover:text-pink-100"
          >
            會員總覽
          </button>

          {/* 預約服務（填表） */}
          <button
            type="button"
            onClick={() => router.push('/member/booking')}
            className="w-full text-left rounded-2xl border border-pink-500/40 bg-gray-950/80 px-4 py-3 text-sm text-pink-50 hover:border-pink-300/80 hover:text-pink-100"
          >
            預約服務
          </button>

          {/* ✅ 新增：預約紀錄列表 */}
          <button
            type="button"
            onClick={() => router.push('/member/bookings')}
            className="w-full text-left rounded-2xl border border-pink-500/40 bg-gray-950/80 px-4 py-3 text-sm text-pink-50 hover:border-pink-300/80 hover:text-pink-100"
          >
            預約紀錄
          </button>

          {/* 消費紀錄（目前頁面，高亮） */}
          <button
            type="button"
            disabled
            className="w-full cursor-default text-left rounded-2xl border border-pink-400 bg-pink-900/40 px-4 py-3 text-sm font-semibold text-pink-100 shadow-inner shadow-pink-500/30"
          >
            消費紀錄
          </button>

          {/* 儲值金 / 點數：先保留選單，之後再做功能 */}
          <button
            type="button"
            onClick={() => {
              // 之後有對應頁面再改成 router.push('/member/balance')
              alert('儲值金功能即將開放');
            }}
            className="w-full text-left rounded-2xl border border-pink-500/40 bg-gray-950/80 px-4 py-3 text-sm text-pink-50 hover:border-pink-300/80 hover:text-pink-100"
          >
            儲值金
          </button>
          <button
            type="button"
            onClick={() => {
              // 之後有對應頁面再改成 router.push('/member/points')
              alert('點數功能即將開放');
            }}
            className="w-full text-left rounded-2xl border border-pink-500/40 bg-gray-950/80 px-4 py-3 text-sm text-pink-50 hover:border-pink-300/80 hover:text-pink-100"
          >
            點數
          </button>
        </aside>

        {/* 右側內容區：消費紀錄 */}
        <section className="flex-1">
          <div className="rounded-3xl border border-pink-500/30 bg-gray-950/80 p-6 shadow-[0_0_40px_rgba(236,72,153,0.25)]">
            <h2 className="text-xl font-semibold text-pink-100">消費紀錄</h2>
            <p className="mt-1 text-xs text-pink-200/70">
              目前可查看已完成服務的消費與扣款情況（之後可串接儲值金、點數）。
            </p>

            {/* 空狀態：暫時先顯示「還沒有交易紀錄」 */}
            <div className="mt-10 flex flex-col items-center justify-center py-16">
              <div className="mb-4 text-5xl">💰</div>
              <p className="text-sm text-pink-100">還沒有交易紀錄</p>
              <p className="mt-1 text-xs text-pink-200/70">
                完成預約服務並結帳後，會自動在這裡看到消費明細。
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

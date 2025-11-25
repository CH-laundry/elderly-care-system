// pages/index.js － 首頁封面（還原你原本那個版面）
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7fb]">
      {/* 上方導航列 */}
      <header className="w-full bg-white shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="text-pink-700 font-bold text-lg">
            享老安心照護預約系統
          </div>
          <div className="flex gap-2">
            <Link
              href="/login"
              className="px-4 py-2 rounded-full text-sm font-semibold border border-pink-300 text-pink-700 bg-pink-50 hover:bg-pink-100"
            >
              會員登入
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-full text-sm font-semibold bg-pink-500 text-white hover:bg-pink-600 shadow-sm"
            >
              新會員註冊
            </Link>
          </div>
        </div>
      </header>

      {/* 主要內容 */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* 大標題區塊 */}
          <section className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-pink-700">
              享老安心照護系統
            </h1>
            <p className="text-pink-600 text-base md:text-lg">
              溫柔陪伴、定期關懷，讓家人多一份安心
            </p>
            <p className="text-pink-500 text-sm">
              適合長輩操作的大按鈕介面
            </p>
          </section>

          {/* 三張功能卡片 */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <div className="text-5xl mb-4">🏡</div>
              <h3 className="text-lg font-bold text-pink-900 mb-2">
                專業照護服務
              </h3>
              <p className="text-sm text-pink-700 leading-relaxed">
                到府陪伴、醫院陪同、復健協助等多元服務
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-lg font-bold text-pink-900 mb-2">
                線上預約系統
              </h3>
              <p className="text-sm text-pink-700 leading-relaxed">
                簡單操作，輕鬆預約，專員快速回覆
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6">
              <div className="text-5xl mb-4">💝</div>
              <h3 className="text-lg font-bold text-pink-900 mb-2">
                溫馨貼心設計
              </h3>
              <p className="text-sm text-pink-700 leading-relaxed">
                大字體、清楚按鈕，長輩也能輕鬆使用
              </p>
            </div>
          </section>

          {/* 中間粉紅漸層 CTA 區塊 */}
          <section className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl shadow-xl px-6 py-10 md:px-10 md:py-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              立即開始使用
            </h2>
            <p className="text-white/90 mb-6 text-sm md:text-base">
              註冊會員後即可線上預約照護服務
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-3 rounded-2xl text-lg font-semibold bg-white text-pink-600 hover:bg-pink-50 shadow-lg"
              >
                立即註冊
              </Link>
              <Link
                href="/login"
                className="px-8 py-3 rounded-2xl text-lg font-semibold border-2 border-white text-white hover:bg-white/10"
              >
                會員登入
              </Link>
            </div>
          </section>

          {/* 服務流程卡片 */}
          <section className="bg-white rounded-3xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-pink-900 mb-6 text-center">
              服務流程
            </h3>
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <div className="font-semibold text-pink-900">註冊會員</div>
                  <div className="text-sm text-pink-700">
                    填寫基本資料，建立您的帳號
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <div className="font-semibold text-pink-900">選擇服務</div>
                  <div className="text-sm text-pink-700">
                    挑選適合的照護服務類型
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <div className="font-semibold text-pink-900">線上預約</div>
                  <div className="text-sm text-pink-700">
                    選擇日期時間，完成預約
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <div className="font-semibold text-pink-900">專員聯繫</div>
                  <div className="text-sm text-pink-700">
                    專員會儘快與您確認服務細節
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 底部管理者登入連結 */}
          <section className="text-center pt-4 pb-6">
            <Link
              href="/admin/login"
              className="text-sm text-pink-600 hover:underline"
            >
              管理者登入 →
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}

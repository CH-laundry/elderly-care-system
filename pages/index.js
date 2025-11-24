// pages/index.js - 修正後的首頁
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 上方導航 */}
      <header className="w-full bg-white/80 border-b border-pink-100 backdrop-blur-sm">
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
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full text-center space-y-8">
          {/* 標題區 */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-pink-700 mb-4">
              享老安心照護系統
            </h1>
            <p className="text-lg md:text-xl text-pink-600 mb-2">
              溫柔陪伴、定期關懷，讓家人多一份安心
            </p>
            <p className="text-pink-500">
              適合長輩操作的大按鈕介面
            </p>
          </div>

          {/* 特色卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/90 rounded-3xl shadow-xl p-6 border border-pink-100">
              <div className="text-5xl mb-4">🏡</div>
              <h3 className="text-lg font-bold text-pink-900 mb-2">
                專業照護服務
              </h3>
              <p className="text-sm text-pink-700">
                到府陪伴、醫院陪同、復健協助等多元服務
              </p>
            </div>

            <div className="bg-white/90 rounded-3xl shadow-xl p-6 border border-pink-100">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-lg font-bold text-pink-900 mb-2">
                線上預約系統
              </h3>
              <p className="text-sm text-pink-700">
                簡單操作，輕鬆預約，專員快速回覆
              </p>
            </div>

            <div className="bg-white/90 rounded-3xl shadow-xl p-6 border border-pink-100">
              <div className="text-5xl mb-4">💝</div>
              <h3 className="text-lg font-bold text-pink-900 mb-2">
                溫馨貼心設計
              </h3>
              <p className="text-sm text-pink-700">
                大字體、清楚按鈕，長輩也能輕鬆使用
              </p>
            </div>
          </div>

          {/* 行動呼籲 */}
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl shadow-2xl p-8 md:p-12 text-white mt-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              立即開始使用
            </h2>
            <p className="text-white/90 mb-6">
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
          </div>

          {/* 服務說明 */}
          <div className="bg-white/90 rounded-3xl shadow-xl p-8 border border-pink-100 text-left">
            <h3 className="text-xl font-bold text-pink-900 mb-4 text-center">
              服務流程
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <div className="font-semibold text-pink-900">註冊會員</div>
                  <div className="text-sm text-pink-700">填寫基本資料，建立您的帳號</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <div className="font-semibold text-pink-900">選擇服務</div>
                  <div className="text-sm text-pink-700">挑選適合的照護服務類型</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <div className="font-semibold text-pink-900">線上預約</div>
                  <div className="text-sm text-pink-700">選擇日期時間，完成預約</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <div className="font-semibold text-pink-900">專員聯繫</div>
                  <div className="text-sm text-pink-700">我們的專員會儘快與您確認服務細節</div>
                </div>
              </div>
            </div>
          </div>

          {/* 底部連結 */}
          <div className="text-center pt-8 border-t border-pink-100">
            <Link
              href="/admin/login"
              className="text-sm text-pink-600 hover:underline"
            >
              管理者登入 →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

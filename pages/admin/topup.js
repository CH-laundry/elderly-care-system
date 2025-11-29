// pages/admin/topup.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminTopupPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  // 簡單權限檢查：沒登入就導回管理者登入
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loggedIn = localStorage.getItem('adminLoggedIn');
      if (!loggedIn) {
        router.replace('/admin/login');
      }
    }
  }, [router]);

  const handleFakeSubmit = (method) => {
    if (!phone || !amount) {
      setMessage('請先輸入會員手機與儲值金額。');
      return;
    }
    // 這裡先不真正串金流，只顯示提示訊息
    setMessage(`【示意】已準備以「${method}」為手機 ${phone} 儲值 NT$${amount}。之後可在此串接信用卡 / LINE Pay API。`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-black text-white flex flex-col">
      {/* 頂部列 */}
      <header className="w-full border-b border-pink-500/40 bg-gray-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex flex-col">
            <span className="text-xs text-pink-300/80">EnjoyCare Admin</span>
            <span className="text-lg font-bold text-pink-100">
              線上儲值管理
            </span>
          </div>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-pink-500 text-white hover:bg-pink-400 shadow-lg shadow-pink-500/30"
          >
            返回總覽
          </button>
        </div>
      </header>

      {/* 主內容 */}
      <main className="flex-1 w-full">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
          {/* 說明 */}
          <section className="space-y-2">
            <h2 className="text-2xl font-bold text-pink-100">
              會員儲值金作業（示意版）
            </h2>
            <p className="text-sm text-pink-200/80">
              先提供「信用卡儲值」與「LINE Pay 儲值」兩種方式。之後你要接 ECPay、LINE Pay 等金流，只需要在這個頁面補上實際 API 呼叫即可。
            </p>
          </section>

          {/* 基本輸入欄位 */}
          <section className="bg-gray-950/60 border border-pink-500/40 rounded-3xl p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-pink-100 mb-1">
                  會員手機號碼
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="請輸入 09xxxxxxxx"
                  className="w-full rounded-xl border border-pink-500/40 bg-gray-900/70 text-pink-50 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-pink-100 mb-1">
                  儲值金額（NT$）
                </label>
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="例如 500、1000"
                  className="w-full rounded-xl border border-pink-500/40 bg-gray-900/70 text-pink-50 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
            </div>

            {message && (
              <p className="mt-2 text-xs text-pink-200 bg-pink-900/40 border border-pink-500/40 rounded-xl px-3 py-2">
                {message}
              </p>
            )}
          </section>

          {/* 兩種儲值方式卡片 */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 信用卡儲值 */}
            <button
              type="button"
              onClick={() => handleFakeSubmit('信用卡儲值')}
              className="group text-left bg-gradient-to-br from-pink-600 via-pink-500 to-rose-500 rounded-3xl p-5 shadow-xl hover:shadow-pink-500/60 transition border border-pink-400/80"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
                  💳
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    信用卡儲值
                  </h3>
                  <p className="text-xs text-pink-50/90">
                    適合一次性儲值較大金額，可串接金流平台（ECPay 等）。
                  </p>
                </div>
              </div>
              <p className="text-xs text-pink-50/80">
                之後可在此處呼叫實際「建立訂單 → 導轉刷卡頁 → 回傳交易結果」的 API。
              </p>
            </button>

            {/* LINE Pay 儲值 */}
            <button
              type="button"
              onClick={() => handleFakeSubmit('LINE Pay 儲值')}
              className="group text-left bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-3xl p-5 shadow-xl hover:shadow-emerald-500/60 transition border border-emerald-400/80"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
                  💚
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    LINE Pay 儲值
                  </h3>
                  <p className="text-xs text-emerald-50/90">
                    讓客戶直接用 LINE Pay 完成付款，適合搭配 LINE 官方帳號。
                  </p>
                </div>
              </div>
              <p className="text-xs text-emerald-50/80">
                未來你可以在這裡串 LINE Pay API（建立交易、回傳付款狀態，再寫入儲值金與交易紀錄）。
              </p>
            </button>
          </section>
        </div>
      </main>

      {/* 背景裝飾 */}
      <div className="pointer-events-none fixed inset-0 opacity-40">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-pink-700/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-emerald-700/30 rounded-full blur-3xl" />
      </div>
    </div>
  );
}

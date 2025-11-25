// pages/member/dashboard.js
import MemberLayout from '../../components/MemberLayout';

export default function MemberDashboard() {
  return (
    <MemberLayout>
      <div className="space-y-4">
        {/* 標題區 */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-800 text-xs font-semibold mb-2">
            <span>💖</span>
            <span>歡迎回來，會員！</span>
          </div>
          <h1 className="text-xl font-bold text-pink-900 mb-1">長輩安心照護總覽</h1>
          <p className="text-xs text-pink-700">
            在這裡可以快速查看儲值金、預約服務與消費紀錄。
          </p>
        </div>

        {/* 上方三個資訊卡 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-pink-100 bg-pink-50/80 p-3">
            <div className="text-xs text-pink-700 mb-1 flex items-center justify-between">
              <span>儲值金</span>
              <span className="text-[10px] bg-white/70 px-2 py-0.5 rounded-full border border-pink-100">
                目前金額
              </span>
            </div>
            <div className="text-2xl font-bold text-pink-900">$0</div>
          </div>

          <div className="rounded-2xl border border-pink-100 bg-white p-3">
            <div className="text-xs text-pink-700 mb-1">點數</div>
            <div className="text-2xl font-bold text-pink-900">0</div>
          </div>

          <div className="rounded-2xl border border-pink-100 bg-white p-3">
            <div className="text-xs text-pink-700 mb-1">預約狀態</div>
            <div className="text-[13px] text-pink-900">
              尚未建立預約
            </div>
          </div>
        </div>

        {/* 下面兩個區塊：預約 / 消費 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 預約服務 */}
          <div className="rounded-2xl border border-pink-100 bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">📅</span>
                <div>
                  <div className="text-sm font-semibold text-pink-900">預約服務</div>
                  <div className="text-xs text-pink-600">安排長輩日常照護與陪伴</div>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => (window.location.href = '/member/booking')}
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-pink-500 text-white text-xs font-semibold px-3 py-2 hover:bg-pink-600"
            >
              立即預約
            </button>
          </div>

          {/* 消費紀錄 */}
          <div className="rounded-2xl border border-pink-100 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">📜</span>
              <div>
                <div className="text-sm font-semibold text-pink-900">消費紀錄</div>
                <div className="text-xs text-pink-600">查看歷史費用與使用情形</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => (window.location.href = '/member/transactions')}
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-pink-100 text-pink-800 text-xs font-semibold px-3 py-2 hover:bg-pink-200"
            >
              查看明細
            </button>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}

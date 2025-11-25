// pages/member/booking.js
import { useState } from "react";
import MemberLayout from "../../components/MemberLayout";

export default function MemberBooking() {
  const [form, setForm] = useState({
    date: "",
    time: "",
    attendant: "",
    serviceType: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.date || !form.time || !form.serviceType) {
      setMessage("請先選好日期、時間與服務類型");
      return;
    }

    setSubmitting(true);
    try {
      const resp = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await resp.json();

      if (!resp.ok) {
        setMessage(data.error || "預約失敗，請稍後再試");
      } else {
        setMessage("預約已送出，我們會儘快與您聯繫確認。");
        // 簡單清空表單
        setForm({
          date: "",
          time: "",
          attendant: "",
          serviceType: "",
          notes: "",
        });
      }
    } catch (err) {
      console.error(err);
      setMessage("系統錯誤，請稍後再試");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MemberLayout>
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-pink-900 mb-1">開始預約</h2>
          <p className="text-xs text-pink-600">
            請先選擇希望的日期與時間，我們會安排適合的陪伴員與照護服務。
          </p>
        </div>

        {/* 簡單顯示目前儲值金與點數（假資料，之後可串 API） */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-pink-100 bg-pink-50/80 p-3">
            <div className="text-xs text-pink-700 mb-1">儲值金</div>
            <div className="text-2xl font-bold text-pink-900">$0</div>
          </div>
          <div className="rounded-2xl border border-pink-100 bg-pink-50/80 p-3">
            <div className="text-xs text-pink-700 mb-1">點數</div>
            <div className="text-2xl font-bold text-pink-900">0</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* 日期 */}
          <div>
            <label className="block text-sm font-medium text-pink-900 mb-1">
              預約日期 *
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full rounded-xl border border-pink-200 px-3 py-2 text-sm bg-pink-50/50 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400"
            />
          </div>

          {/* 時間 */}
          <div>
            <label className="block text-sm font-medium text-pink-900 mb-1">
              預約時間（05:00 ~ 22:00）*
            </label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="w-full rounded-xl border border-pink-200 px-3 py-2 text-sm bg-pink-50/50 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400"
            />
          </div>

          {/* ✅ 新增：預約陪伴員（下拉選單） */}
          <div>
            <label className="block text-sm font-medium text-pink-900 mb-1">
              預約陪伴員
            </label>
            <select
              name="attendant"
              value={form.attendant}
              onChange={handleChange}
              className="w-full rounded-xl border border-pink-200 px-3 py-2 text-sm bg-pink-50/50 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400"
            >
              <option value="">不指定（由系統安排）</option>
              <option value="指定陪伴員A">指定陪伴員 A</option>
              <option value="指定陪伴員B">指定陪伴員 B</option>
            </select>
          </div>

          {/* 服務類型：卡片式 */}
          <div>
            <label className="block text-sm font-medium text-pink-900 mb-2">
              服務類型 *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { value: "到府陪伴", label: "到府陪伴", desc: "到家陪伴、聊天、協助日常活動" },
                { value: "醫院陪同", label: "醫院陪同", desc: "門診、住院、回診之陪同服務" },
                { value: "復健協助", label: "復健協助", desc: "復健過程中的陪同與安全看顧" },
                { value: "家務整理", label: "家務整理", desc: "簡單打掃、整理環境與陪伴" },
                { value: "其他", label: "其他", desc: "客製化需求，可在下方備註說明" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, serviceType: item.value }))
                  }
                  className={
                    "text-left w-full rounded-2xl border-2 p-4 transition shadow-sm " +
                    (form.serviceType === item.value
                      ? "border-pink-500 bg-pink-50 text-pink-800"
                      : "border-pink-100 bg-white hover:border-pink-300 hover:bg-pink-50")
                  }
                >
                  <div className="font-semibold mb-1">{item.label}</div>
                  <div className="text-xs text-pink-700/80">{item.desc}</div>
                </button>
              ))}
            </div>
            {!form.serviceType && (
              <p className="text-xs text-pink-400 mt-1">
                請點選上方其中一項服務類型
              </p>
            )}
          </div>

          {/* 備註 */}
          <div>
            <label className="block text-sm font-medium text-pink-900 mb-1">
              備註 / 特殊需求
            </label>
            <textarea
              name="notes"
              rows={3}
              value={form.notes}
              onChange={handleChange}
              className="w-full rounded-xl border border-pink-200 px-3 py-2 text-sm bg-pink-50/50 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400"
              placeholder="可說明長輩的狀況、希望的照顧方式等。"
            />
          </div>

          {/* 提交按鈕與訊息 */}
          {message && (
            <p className="text-xs text-pink-700 bg-pink-50 border border-pink-100 rounded-xl px-3 py-2">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 inline-flex justify-center items-center rounded-2xl bg-pink-500 text-white font-semibold py-2.5 text-sm shadow-md shadow-pink-200 hover:bg-pink-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "送出中…" : "確認預約"}
          </button>
        </form>
      </div>
    </MemberLayout>
  );
}

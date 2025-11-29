// pages/member/booking.js
import { useState } from "react";
import MemberLayout from "../../components/MemberLayout";

const SERVICE_OPTIONS = [
  { value: "到府陪伴", label: "到府陪伴", desc: "到家陪伴、聊天、協助日常活動" },
  { value: "醫院陪同", label: "醫院陪同", desc: "門診、住院、回診之陪同服務" },
  { value: "復健協助", label: "復健協助", desc: "復健過程中的陪同與安全看顧" },
  { value: "家務整理", label: "家務整理", desc: "簡單打掃、整理環境與陪伴" },
  { value: "其他", label: "其他", desc: "客製化需求，可在下方備註說明" },
];

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
      setMessage("請先選好日期、時間與服務類型。");
      return;
    }

    // 從登入流程記錄的 localStorage 取得手機（多種 key 都試）
    let phone = "";
    if (typeof window !== "undefined") {
      phone =
        window.localStorage.getItem("memberPhone") ||
        window.localStorage.getItem("phone") ||
        window.localStorage.getItem("userPhone") ||
        "";
    }

    if (!phone) {
      setMessage("找不到會員手機，請先重新登入後再進行預約。");
      return;
    }

    setSubmitting(true);
    try {
      const resp = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          phone,
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        setMessage(data.error || "預約失敗，請稍後再試。");
        return;
      }

      setMessage("預約已送出，我們將儘快與您確認。");
      setForm({
        date: "",
        time: "",
        attendant: "",
        serviceType: "",
        notes: "",
      });
    } catch (err) {
      console.error(err);
      setMessage("系統錯誤，請稍後再試。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MemberLayout>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-pink-50">開始預約</h2>
          <p className="text-xs text-pink-200">
            請選擇日期、時間與服務內容，我們會安排合適的照護人員與服務。
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-gray-950/40 border border-pink-500/30 rounded-3xl p-4 md:p-6 shadow-xl"
        >
          <div>
            <label className="block text-sm font-medium text-pink-100 mb-1">
              預約日期 *
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full rounded-xl border border-pink-500/40 bg-gray-900/70 text-pink-50 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-100 mb-1">
              預約時間（05:00 ~ 22:00） *
            </label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              min="05:00"
              max="22:00"
              className="w-full rounded-xl border border-pink-500/40 bg-gray-900/70 text-pink-50 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-100 mb-1">
              預約陪伴員（可不選）
            </label>
            <select
              name="attendant"
              value={form.attendant}
              onChange={handleChange}
              className="w-full rounded-xl border border-pink-500/40 bg-gray-900/70 text-pink-50 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="">不指定（由系統安排）</option>
              <option value="指定陪伴員A">指定陪伴員 A</option>
              <option value="指定陪伴員B">指定陪伴員 B</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-100 mb-2">
              服務類型 *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICE_OPTIONS.map((item) => {
                const active = form.serviceType === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        serviceType: item.value,
                      }))
                    }
                    className={[
                      "text-left rounded-2xl border px-4 py-3 text-sm transition",
                      "bg-gray-900/70",
                      active
                        ? "border-pink-400 bg-pink-900/60 shadow-lg shadow-pink-500/30"
                        : "border-pink-500/30 hover:border-pink-300 hover:bg-gray-900",
                    ].join(" ")}
                  >
                    <div className="font-semibold text-pink-50 mb-1">
                      {item.label}
                    </div>
                    <div className="text-xs text-pink-200">{item.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-100 mb-1">
              備註 / 特殊需求
            </label>
            <textarea
              name="notes"
              rows={3}
              value={form.notes}
              onChange={handleChange}
              placeholder="可說明長輩狀況、需特別留意的事項等。"
              className="w-full rounded-xl border border-pink-500/40 bg-gray-900/70 text-pink-50 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {message && (
            <p className="text-xs text-pink-200 bg-pink-900/40 border border-pink-500/40 rounded-xl px-3 py-2">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 inline-flex justify-center items-center rounded-2xl px-4 py-2.5 text-sm font-semibold bg-pink-500 text-white hover:bg-pink-600 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-pink-500/30"
          >
            {submitting ? "送出中…" : "確認預約"}
          </button>
        </form>
      </div>
    </MemberLayout>
  );
}

// pages/member/booking.js
import { useEffect, useState } from "react";
import MemberLayout from "../../components/MemberLayout";

const SERVICE_OPTIONS = [
  "陪伴聊天",
  "陪同就醫",
  "外出散步",
  "居家關懷",
  "臨時照護",
];

export default function MemberBookingPage() {
  const [form, setForm] = useState({
    date: "",
    time: "",
    serviceType: "",
    attendant: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setMessage("");
    setError("");
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.date || !form.time || !form.serviceType) {
      setError("請至少填寫：日期、時間、服務類型。");
      return;
    }

    if (typeof window === "undefined") return;
    const phone = localStorage.getItem("memberPhone");

    if (!phone) {
      setError("尚未取得會員電話，請重新登入後再預約。");
      return;
    }

    try {
      setSubmitting(true);
      const resp = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: form.date,
          time: form.time,
          serviceType: form.serviceType,
          attendant: form.attendant,
          notes: form.notes,
          phone,
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        setError(data.error || "預約送出失敗，請稍後再試。");
        return;
      }

      setMessage("預約已送出，我們會儘快為您確認。");
      // 清空表單（保留 serviceType/attendant 也可以，看你習慣）
      setForm({
        date: "",
        time: "",
        serviceType: "",
        attendant: "",
        notes: "",
      });
    } catch (err) {
      console.error(err);
      setError("系統發生錯誤，請稍後再試。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MemberLayout>
      <h2 className="text-lg md:text-xl font-semibold text-pink-900 mb-4">
        預約陪伴服務
      </h2>
      <p className="text-xs md:text-sm text-pink-700 mb-4">
        請選擇服務時間與類型，我們確認後會以電話或簡訊與您聯繫。
      </p>

      {message && (
        <div className="mb-4 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs text-pink-800 mb-1">
              服務日期<span className="text-rose-500 ml-0.5">*</span>
            </label>
            <input
              type="date"
              className="w-full rounded-xl border border-pink-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300 bg-white"
              value={form.date}
              onChange={handleChange("date")}
              required
            />
          </div>

          <div>
            <label className="block text-xs text-pink-800 mb-1">
              服務時間<span className="text-rose-500 ml-0.5">*</span>
            </label>
            <input
              type="time"
              className="w-full rounded-xl border border-pink-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300 bg-white"
              value={form.time}
              onChange={handleChange("time")}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-pink-800 mb-1">
            服務類型<span className="text-rose-500 ml-0.5">*</span>
          </label>
          <select
            className="w-full rounded-xl border border-pink-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300 bg-white"
            value={form.serviceType}
            onChange={handleChange("serviceType")}
            required
          >
            <option value="">請選擇服務類型</option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-pink-800 mb-1">
            指定陪伴員（可留空）
          </label>
          <input
            type="text"
            className="w-full rounded-xl border border-pink-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300 bg-white"
            value={form.attendant}
            onChange={handleChange("attendant")}
            placeholder="若有指定照護人員可填寫姓名"
          />
        </div>

        <div>
          <label className="block text-xs text-pink-800 mb-1">備註</label>
          <textarea
            className="w-full rounded-xl border border-pink-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300 bg-white min-h-[80px]"
            value={form.notes}
            onChange={handleChange("notes")}
            placeholder="例如：是否需要輪椅、慢性病史、希望的注意事項…"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-full bg-pink-500 px-6 py-2 text-sm font-semibold text-white shadow-md shadow-pink-300 hover:bg-pink-600 disabled:opacity-60"
          >
            {submitting ? "送出中…" : "送出預約"}
          </button>
        </div>
      </form>
    </MemberLayout>
  );
}

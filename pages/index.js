// pages/index.js
import { useState } from 'react';

export default function Home() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    serviceType: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      // 只保留數字，允許連續輸入
      const digits = value.replace(/[^\d]/g, '').slice(0, 15); // 你要 10 碼就改成 10
      setForm((prev) => ({ ...prev, phone: digits }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!form.name || !form.phone) {
      setMessage({ type: 'error', text: '請輸入姓名與手機' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error('Request failed');
      }

      setMessage({ type: 'success', text: '已完成預約，稍後將由專人與您聯繫。' });
      setForm({
        name: '',
        phone: '',
        serviceType: '',
        notes: '',
      });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: '系統暫時無法服務，請稍後再試。' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-pink-100 to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-pink-700 mb-2">
            享老安心照護預約系統
          </h1>
          <p className="text-pink-800/80 text-sm md:text-base">
            溫柔陪伴、定期關懷，讓家人多一份安心。
          </p>
        </div>

        <div className="bg-white/90 rounded-3xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="md:w-1/2 space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-semibold">
              🏡 適合長輩操作的大按鈕介面
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-pink-800">
              線上留下資料，我們協助安排專人聯繫
            </h2>
            <p className="text-sm md:text-base text-pink-900/80 leading-relaxed">
              只需輸入基本資料與需求，
              專員會在上班時間內與您確認長照內容、到府服務時間與相關費用。
            </p>

            <ul className="text-sm text-pink-900/80 space-y-1">
              <li>・大字體、簡單欄位，長輩也能輕鬆填寫</li>
              <li>・資料將安全儲存在雲端 Airtable，不會外流</li>
              <li>・可搭配後台查看每位長輩與家屬的服務紀錄</li>
            </ul>
          </div>

          <div className="md:w-1/2">
            <form
              onSubmit={handleSubmit}
              className="space-y-4 bg-pink-50/80 rounded-2xl p-4 md:p-5 border border-pink-100"
            >
              <div>
                <label className="block text-sm font-medium text-pink-900 mb-1">
                  姓名（必填）
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-pink-200 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400"
                  placeholder="請輸入長輩或主要聯絡人姓名"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-pink-900 mb-1">
                  手機（必填）
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-pink-200 px-3 py-2 text-base tracking-widest focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400"
                  placeholder="請輸入手機號碼"
                />
                <p className="mt-1 text-[11px] text-pink-800/70">
                  系統已改為可連續輸入，只會自動移除非數字。
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-pink-900 mb-1">
                  服務需求
                </label>
                <select
                  name="serviceType"
                  value={form.serviceType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-pink-200 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white"
                >
                  <option value="">請選擇</option>
                  <option value="到府陪伴">到府陪伴</option>
                  <option value="醫院陪同">醫院陪同</option>
                  <option value="復健協助">復健協助</option>
                  <option value="家務整理">家務整理</option>
                  <option value="其他">其他 / 尚未確定</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-pink-900 mb-1">
                  備註說明
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-xl border border-pink-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400"
                  placeholder="可簡單說明長輩目前狀況、希望服務時間等。"
                />
              </div>

              {message && (
                <div
                  className={`text-sm rounded-xl px-3 py-2 ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl text-base font-semibold bg-pink-500 text-white shadow-md hover:bg-pink-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? '送出中…' : '送出預約資料'}
              </button>

              <p className="text-[11px] text-pink-800/60 text-center">
                送出後代表您同意本系統蒐集聯絡資料用於照護安排與服務紀錄。
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

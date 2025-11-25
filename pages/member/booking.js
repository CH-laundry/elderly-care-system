// pages/member/booking.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MemberLayout from '../../components/MemberLayout';

export default function MemberBooking() {
  const router = useRouter();
  const [memberData, setMemberData] = useState(null);
  const [form, setForm] = useState({
    date: '',
    time: '',
    serviceType: '',
    notes: '',
    paymentMethod: 'points', // points / balance
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // 生成時間選項（05:00 ~ 22:00，每 15 分鐘）
  const timeSlots = [];
  for (let hour = 5; hour <= 22; hour++) {
    for (let min of [0, 15, 30, 45]) {
      if (hour === 22 && min > 0) break;
      const timeStr = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
      timeSlots.push(timeStr);
    }
  }

  useEffect(() => {
    const phone = localStorage.getItem('memberPhone');
    if (!phone) {
      router.push('/login');
      return;
    }

    fetchMemberData(phone);
  }, [router]);

  const fetchMemberData = async (phone) => {
    try {
      const res = await fetch(`/api/members/${phone}`);
      const data = await res.json();
      if (data.member) {
        setMemberData(data.member);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!form.date || !form.time) {
      setMessage({ type: 'error', text: '請選擇日期和時間' });
      return;
    }

    // 檢查餘額或點數是否足夠（假設預約扣 10 點或 100 元）
    const POINTS_COST = 10;
    const BALANCE_COST = 100;

    if (form.paymentMethod === 'points') {
      if ((memberData?.Points || 0) < POINTS_COST) {
        setMessage({ type: 'error', text: `點數不足！需要 ${POINTS_COST} 點` });
        return;
      }
    } else {
      if ((memberData?.Balance || 0) < BALANCE_COST) {
        setMessage({ type: 'error', text: `儲值金不足！需要 $${BALANCE_COST}` });
        return;
      }
    }

    setLoading(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: memberData.Name,
          phone: memberData.Phone,
          date: form.date,
          time: form.time,
          serviceType: form.serviceType,
          notes: form.notes,
          paymentMethod: form.paymentMethod,
          amount: form.paymentMethod === 'points' ? POINTS_COST : BALANCE_COST,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '預約失敗');
      }

      setMessage({ type: 'success', text: '預約成功！已扣除費用，專員將盡快與您聯繫。' });
      
      // 重新載入會員資料
      fetchMemberData(memberData.Phone);

      // 清空表單
      setForm({
        date: '',
        time: '',
        serviceType: '',
        notes: '',
        paymentMethod: 'points',
      });

      // 3 秒後跳轉到預約紀錄
      setTimeout(() => {
        router.push('/member/bookings');
      }, 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // 取得今天的日期（用於限制不能選過去的日期）
  const today = new Date().toISOString().split('T')[0];

  return (
    <MemberLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-pink-700 mb-6">開始預約</h1>

        {/* 帳戶餘額顯示 */}
        <div className="bg-white/90 rounded-2xl shadow-lg p-4 mb-6 border border-pink-100">
          <div className="flex justify-around text-center">
            <div>
              <div className="text-sm text-pink-600 mb-1">可用點數</div>
              <div className="text-xl font-bold text-pink-700">
                {memberData?.Points || 0} 點
              </div>
            </div>
            <div className="border-l border-pink-200"></div>
            <div>
              <div className="text-sm text-pink-600 mb-1">儲值金</div>
              <div className="text-xl font-bold text-pink-700">
                ${memberData?.Balance || 0}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/90 rounded-3xl shadow-xl p-6 border border-pink-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-pink-900 mb-2">
                預約日期 *
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                min={today}
                className="w-full rounded-xl border border-pink-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-pink-900 mb-2">
                預約時間 * （05:00 ~ 22:00）
              </label>
              <select
                name="time"
                value={form.time}
                onChange={handleChange}
                className="w-full rounded-xl border border-pink-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                <option value="">請選擇時間</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-pink-900 mb-2">
                服務類型 *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { value: '到府陪伴', label: '到府陪伴', desc: '到家陪伴、聊天、協助日常活動' },
                  { value: '醫院陪同', label: '醫院陪同', desc: '門診、住院、回診之陪同服務' },
                  { value: '復健協助', label: '復健協助', desc: '復健過程中的陪同與安全看顧' },
                  { value: '家務整理', label: '家務整理', desc: '簡單打掃、整理環境與陪伴' },
                  { value: '其他', label: '其他', desc: '客製化需求，可在下方備註說明' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, serviceType: item.value }))
                    }
                    className={
                      'text-left w-full rounded-2xl border-2 p-4 transition shadow-sm ' +
                      (form.serviceType === item.value
                        ? 'border-pink-500 bg-pink-50 text-pink-800'
                        : 'border-pink-100 bg-white hover:border-pink-300 hover:bg-pink-50')
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


            <div>
              <label className="block text-sm font-medium text-pink-900 mb-2">
                付款方式 *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`border-2 rounded-xl p-4 cursor-pointer transition ${
                  form.paymentMethod === 'points'
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-pink-200 hover:border-pink-300'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="points"
                    checked={form.paymentMethod === 'points'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="font-medium text-pink-900">使用點數</span>
                  <div className="text-sm text-pink-600 mt-1">扣 10 點</div>
                </label>

                <label className={`border-2 rounded-xl p-4 cursor-pointer transition ${
                  form.paymentMethod === 'balance'
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-pink-200 hover:border-pink-300'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="balance"
                    checked={form.paymentMethod === 'balance'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="font-medium text-pink-900">使用儲值金</span>
                  <div className="text-sm text-pink-600 mt-1">扣 $100</div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-pink-900 mb-2">
                備註說明
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-xl border border-pink-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="可以說明特殊需求或注意事項"
              />
            </div>

            {message && (
              <div className={`rounded-xl px-4 py-3 ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl text-lg font-semibold bg-pink-500 text-white shadow-md hover:bg-pink-600 transition disabled:opacity-60"
            >
              {loading ? '處理中...' : '確認預約'}
            </button>
          </form>
        </div>
      </div>
    </MemberLayout>
  );
}

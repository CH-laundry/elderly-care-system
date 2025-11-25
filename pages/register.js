// pages/register.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const digits = value.replace(/[^\d]/g, '').slice(0, 10);
      setForm(prev => ({ ...prev, phone: digits }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.phone || !form.password || !form.confirmPassword) {
      setError('請填寫所有欄位');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('密碼與確認密碼不符');
      return;
    }

    if (form.password.length < 4) {
      setError('密碼至少需要 4 個字元');
      return;
    }

    if (form.phone.length !== 10) {
      setError('請輸入正確的 10 碼手機號碼');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '註冊失敗');
      }

      localStorage.setItem('memberPhone', form.phone);
      localStorage.setItem('memberName', form.name);

      router.push('/member/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #FFE5EC 0%, #FFC9D9 100%) !important', minHeight: '100vh' }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-pink-700 mb-2">新會員註冊</h1>
          <p className="text-pink-600">加入樂老安心照護系統</p>
        </div>

        <div className="bg-white/90 rounded-3xl shadow-xl p-8">
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded">
            <p className="text-sm text-green-700 font-medium mb-2">🎯 溫馨提示:</p>
            <ul className="text-xs text-green-600 space-y-1">
              <li>• 請輸入真實資料,方便後續服務聯繫</li>
              <li>• 手機號碼將用於服務通知</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-pink-900 mb-2">
                姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-pink-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="請輸入您的姓名"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-pink-900 mb-2">
                手機號碼 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                inputMode="numeric"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-pink-200 px-4 py-3 text-base tracking-widest focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="09xxxxxxxx"
                maxLength="10"
              />
              <p className="text-xs text-gray-500 mt-1">請輸入10碼手機號碼</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-pink-900 mb-2">
                設定密碼 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-pink-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="至少 4 個字元"
                minLength="4"
              />
              <p className="text-xs text-gray-500 mt-1">密碼至少4個字元</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-pink-900 mb-2">
                確認密碼 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-xl border border-pink-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="再次輸入密碼"
              />
              <p className="text-xs text-gray-500 mt-1">請再次輸入密碼確認</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl text-lg font-semibold bg-pink-500 text-white shadow-md hover:bg-pink-600 transition disabled:opacity-60"
            >
              {loading ? '註冊中...' : '完成註冊'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-pink-700">
            已經有帳號了？
            <Link href="/login" className="font-semibold hover:underline ml-1">
              立即登入
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-pink-600 hover:underline">
              ← 回首頁
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

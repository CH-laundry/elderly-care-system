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
      const digits = value.replace(/[^\d]/g, '').slice(0, 15);
      setForm(prev => ({ ...prev, phone: digits }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.phone || !form.password) {
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

      // 註冊成功，儲存登入狀態
      localStorage.setItem('memberPhone', form.phone);
      localStorage.setItem('memberName', form.name);

      // 跳轉到會員首頁
      router.push('/member/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-pink-700 mb-2">新會員註冊</h1>
          <p className="text-pink-600">加入享老安心照護系統</p>
        </div>

        <div className="bg-white/90 rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-pink-900 mb-2">
                姓名 *
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
                手機號碼 *
              </label>
              <input
                type="tel"
                inputMode="numeric"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-pink-200 px-4 py-3 text-base tracking-widest focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="09xxxxxxxx"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-pink-900 mb-2">
                設定密碼 *
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-pink-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="至少 4 個字元"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-pink-900 mb-2">
                確認密碼 *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-xl border border-pink-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="再次輸入密碼"
              />
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
            <Link
              href="/"
              className="text-sm text-pink-600 hover:underline"
            >
              ← 回首頁
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

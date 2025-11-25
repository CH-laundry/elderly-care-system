// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 手機號碼只保留數字
    if (name === 'phone') {
      const onlyNumber = value.replace(/[^\d]/g, '');
      setForm((prev) => ({ ...prev, [name]: onlyNumber }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.phone || !form.password) {
      setError('請輸入手機號碼和密碼');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '登入失敗');
      }

      // 登入成功：記錄會員手機，導到會員首頁
      if (typeof window !== 'undefined') {
        localStorage.setItem('memberPhone', form.phone);
      }
      router.push('/member/dashboard');
    } catch (err) {
      setError(err.message || '登入失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-100 via-pink-50 to-white px-4">
      <div className="w-full max-w-md">
        {/* LOGO 區 + 標題 */}
        <div className="mb-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-800 text-xs font-semibold">
            <span>👵👴</span>
            <span>寶貝長輩安心照護系統</span>
          </div>
        </div>

        {/* 主要卡片 */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg shadow-pink-100 border border-pink-100 px-6 py-6 sm:px-8 sm:py-7">
          <h1 className="text-2xl font-bold text-pink-900 mb-2 text-center">
            會員登入
          </h1>
          <p className="text-sm text-pink-700 text-center mb-4">
            歡迎回來，請使用手機號碼登入會員專區
          </p>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 手機號碼 */}
            <div>
              <label className="block text-sm font-medium text-pink-900 mb-1">
                手機號碼
              </label>
              <input
                type="tel"
                name="phone"
                maxLength={10}
                placeholder="例如：0912345678"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-pink-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-pink-50/60"
              />
            </div>

            {/* 密碼 */}
            <div>
              <label className="block text-sm font-medium text-pink-900 mb-1">
                密碼
              </label>
              <input
                type="password"
                name="password"
                placeholder="請輸入密碼"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-pink-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-pink-50/60"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex justify-center items-center gap-2 rounded-xl bg-pink-500 text-white font-semibold py-2.5 text-sm shadow-md shadow-pink-200 hover:bg-pink-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? '登入中…' : '登入'}
            </button>
          </form>

          {/* 底部連結 */}
          <div className="mt-4 text-center space-y-1">
            <p className="text-xs text-pink-800">
              還沒有帳號？{' '}
              <Link href="/register" className="text-pink-600 font-semibold hover:underline">
                立即註冊
              </Link>
            </p>
            <p className="text-xs">
              <Link href="/" className="text-pink-600 hover:underline">
                ← 回首頁
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

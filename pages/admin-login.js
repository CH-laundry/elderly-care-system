// pages/admin-login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.username || !form.password) {
      setError('請輸入帳號與密碼');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '登入失敗');
      }

      // 這裡先簡單導回首頁，之後可改成 /admin/dashboard
      router.push('/');
    } catch (err) {
      setError(err.message || '登入失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-100 via-pink-50 to-white px-4">
      <div className="w-full max-w-md bg-white/90 rounded-2xl border border-pink-100 shadow-lg shadow-pink-100 px-6 py-6 sm:px-8 sm:py-7">
        <h1 className="text-xl font-bold text-pink-900 mb-1 text-center">管理者登入</h1>
        <p className="text-xs text-pink-700 text-center mb-4">
          僅限系統管理員使用
        </p>

        {error && (
          <div className="mb-3 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-pink-900 mb-1">
              管理者帳號
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full rounded-xl border border-pink-200 px-3 py-2 text-sm bg-pink-50/60 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-pink-900 mb-1">
              密碼
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-pink-200 px-3 py-2 text-sm bg-pink-50/60 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-xl bg-pink-500 text-white text-sm font-semibold py-2.5 hover:bg-pink-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? '登入中…' : '登入'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/" className="text-xs text-pink-600 hover:underline">
            ← 回首頁
          </Link>
        </div>
      </div>
    </div>
  );
}

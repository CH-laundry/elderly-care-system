// pages/admin/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.username || !form.password) {
      setError('請輸入帳號和密碼');
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

      // 登入成功
      localStorage.setItem('adminAuth', 'true');
      router.push('/admin/dashboard');
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
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-pink-700 mb-2">管理者登入</h1>
          <p className="text-pink-600">享老安心照護後台</p>
        </div>

        <div className="bg-white/90 rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-pink-900 mb-2">
                帳號
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full rounded-xl border border-pink-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-pink-900 mb-2">
                密碼
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-pink-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="請輸入密碼"
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
              {loading ? '登入中...' : '登入後台'}
            </button>
          </form>

          <div className="mt-6 text-center">
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

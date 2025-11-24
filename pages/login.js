// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({
    phone: '',
    password: '',
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

      // 登入成功，儲存資料
      localStorage.setItem('memberPhone', data.member.Phone);
      localStorage.setItem('memberName', data.member.Name);

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
          <h1 className="text-3xl font-bold text-pink-700 mb-2">會員登入</h1>
          <p className="text-pink-600">歡迎回來！</p>
        </div>

        <div className="bg-white/90 rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-pink-900 mb-2">
                手機號碼
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
              {loading ? '登入中...' : '登入'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-pink-700">
            還沒有帳號？
            <Link href="/register" className="font-semibold hover:underline ml-1">
              立即註冊
            </Link>
          </div>

          <div className="mt-4 pt-4 border-t border-pink-100 text-center">
            <Link
              href="/admin/login"
              className="text-sm text-pink-600 hover:underline"
            >
              管理者登入 →
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

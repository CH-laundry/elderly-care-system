// pages/register.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    phone: '',
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage('');
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!form.phone || !form.name || !form.password || !form.confirmPassword) {
      setMessage('請完整填寫手機、姓名與密碼。');
      return;
    }

    if (form.password.length < 4) {
      setMessage('密碼至少需要 4 個字元。');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage('兩次輸入的密碼不一致，請確認。');
      return;
    }

    setSubmitting(true);
    try {
      const resp = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: form.phone,
          name: form.name,
          password: form.password,
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        setMessage(data.error || '註冊失敗，請稍後再試。');
        return;
      }

      setMessage('註冊成功，將為您導向登入頁面。');
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } catch (err) {
      console.error(err);
      setMessage('系統錯誤，請稍後再試。');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleClick = () => {
    alert('Google 登入功能將之後開放，現階段請先使用手機註冊 / 登入。');
  };

  const handleLineClick = () => {
    alert('LINE 一鍵登入功能將之後開放，現階段請先使用手機註冊 / 登入。');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-100 via-rose-50 to-pink-100">
      <div className="max-w-md w-full mx-4 bg-white/90 rounded-3xl shadow-2xl border border-pink-100 p-6 space-y-5">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-pink-700">註冊新會員</h1>
          <p className="text-xs text-pink-500">
            享老安心照護會員帳號，可線上預約與查看服務紀錄
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-pink-800 mb-1">
              手機號碼 *
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="請輸入 09 開頭手機號碼"
              className="w-full rounded-xl border border-pink-200 bg-pink-50 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-pink-800 mb-1">
              姓名 *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="請輸入您的姓名"
              className="w-full rounded-xl border border-pink-200 bg-pink-50 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-pink-800 mb-1">
              密碼（至少 4 個字）*
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-pink-200 bg-pink-50 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-pink-800 mb-1">
              確認密碼 *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-xl border border-pink-200 bg-pink-50 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {message && (
            <p className="text-xs text-pink-700 bg-pink-50 border border-pink-200 rounded-xl px-3 py-2">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-1 inline-flex justify-center items-center rounded-2xl px-4 py-2.5 text-sm font-semibold bg-pink-500 text-white hover:bg-pink-600 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-pink-400/40"
          >
            {submitting ? '送出中…' : '建立帳號'}
          </button>
        </form>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-pink-200" />
          <span className="text-[11px] text-pink-400">或使用其他方式登入</span>
          <div className="flex-1 h-px bg-pink-200" />
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={handleGoogleClick}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border border-pink-200 bg-white text-pink-700 text-sm font-semibold py-2.5 shadow-sm"
          >
            <span>使用 Google 帳號登入</span>
          </button>

          <button
            type="button"
            onClick={handleLineClick}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border border-green-400 bg-green-500 text-white text-sm font-semibold py-2.5 shadow-sm"
          >
            <span>使用 LINE 一鍵登入</span>
          </button>
        </div>
      </div>
    </div>
  );
}

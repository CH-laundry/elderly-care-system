// components/MemberLayout.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const memberMenus = [
  { href: '/member/dashboard', label: '會員總覽' },
  { href: '/member/booking', label: '預約服務' },
  { href: '/member/transactions', label: '消費紀錄' },
];

export default function MemberLayout({ children }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // 確認有登入的會員（用 localStorage 的手機）
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const phone = localStorage.getItem('memberPhone');
    if (!phone) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      {/* 頂部列 */}
      <header className="bg-white/80 backdrop-blur border-b border-pink-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">👵👴</span>
          <div className="leading-tight">
            <div className="font-semibold text-pink-900">寶貝長輩 會員專區</div>
            <div className="text-xs text-pink-600">可查看預約、消費與照護資訊</div>
          </div>
        </div>

        {/* RWD 手機版 menu 按鈕 */}
        <button
          className="sm:hidden text-pink-700 text-sm border border-pink-200 rounded-full px-3 py-1"
          onClick={() => setMenuOpen((v) => !v)}
        >
          功能選單
        </button>

        {/* 桌機版選單 */}
        <nav className="hidden sm:flex gap-3">
          {memberMenus.map((item) => {
            const active = router.pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  'px-3 py-1 rounded-full text-sm ' +
                  (active
                    ? 'bg-pink-500 text-white'
                    : 'text-pink-800 hover:bg-pink-100')
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* 手機版下拉選單 */}
      {menuOpen && (
        <nav className="sm:hidden bg-white border-b border-pink-100 px-4 py-2 space-y-1">
          {memberMenus.map((item) => {
            const active = router.pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  'block px-3 py-2 rounded-lg text-sm ' +
                  (active
                    ? 'bg-pink-500 text-white'
                    : 'text-pink-800 hover:bg-pink-50')
                }
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}

      {/* 主要內容區 */}
      <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

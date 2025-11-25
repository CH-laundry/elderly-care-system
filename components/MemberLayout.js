// components/MemberLayout.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const menus = [
  { href: '/member/dashboard', label: '會員總覽', icon: '🏠' },
  { href: '/member/booking', label: '預約服務', icon: '📅' },
  { href: '/member/transactions', label: '消費紀錄', icon: '📜' },
];

export default function MemberLayout({ children }) {
  const router = useRouter();

  // 沒有登入就導回登入頁
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const phone = localStorage.getItem('memberPhone');
    if (!phone) router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-pink-50 to-white">
      {/* 上方 Bar */}
      <header className="border-b border-pink-100 bg-white/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👵👴</span>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-pink-900">寶貝長輩 會員專區</div>
              <div className="text-xs text-pink-600">查看預約、消費與照護服務</div>
            </div>
          </div>
          <Link href="/" className="text-xs text-pink-700 hover:underline">
            ← 回首頁
          </Link>
        </div>
      </header>

      {/* 內容區 */}
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6 flex flex-col sm:flex-row gap-4">
        {/* 側邊選單 */}
        <aside className="w-full sm:w-52">
          <div className="bg-white/90 rounded-2xl border border-pink-100 shadow-sm shadow-pink-100 p-3">
            <div className="text-xs font-semibold text-pink-800 mb-2">
              功能選單
            </div>
            <nav className="space-y-1">
              {menus.map((item) => {
                const active = router.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      'flex items-center gap-2 px-3 py-2 rounded-xl text-xs ' +
                      (active
                        ? 'bg-pink-500 text-white shadow'
                        : 'text-pink-900 hover:bg-pink-50')
                    }
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* 右側主要內容 */}
        <main className="flex-1">
          <div className="bg-white/90 rounded-2xl border border-pink-100 shadow-sm shadow-pink-100 p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

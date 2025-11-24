// components/AdminLayout.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (!auth) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/');
  };

  const menuItems = [
    { name: '首頁', path: '/admin/dashboard', icon: '🏠' },
    { name: '客戶管理', path: '/admin/customers', icon: '👥' },
    { name: '消費紀錄', path: '/admin/transactions', icon: '💰' },
    { name: '所有預約', path: '/admin/bookings', icon: '📋' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* 頂部導航 */}
      <header className="bg-gradient-to-r from-pink-600 to-rose-600 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="font-bold text-lg flex items-center gap-2">
            <span className="text-2xl">🔐</span>
            管理者後台
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30"
            >
              選單
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded-full text-sm font-semibold bg-white/20 hover:bg-white/30"
            >
              登出
            </button>
          </div>
        </div>

        {/* 手機版選單 */}
        {menuOpen && (
          <div className="sm:hidden bg-pink-700/50 backdrop-blur px-4 py-3">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm ${
                    router.pathname === item.path
                      ? 'bg-white/30 font-semibold'
                      : 'hover:bg-white/20'
                  }`}
                >
                  {item.icon} {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <div className="flex-1 flex">
        {/* 側邊欄（桌面版） */}
        <aside className="hidden sm:block w-64 bg-white/80 border-r border-pink-100 p-4">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-4 py-3 rounded-xl text-sm ${
                  router.pathname === item.path
                    ? 'bg-pink-100 text-pink-700 font-semibold shadow-sm'
                    : 'text-pink-600 hover:bg-pink-50'
                }`}
              >
                <span className="text-lg mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* 主要內容區 */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

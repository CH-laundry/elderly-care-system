// components/MemberLayout.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const MENU_ITEMS = [
  { key: "dashboard", label: "會員總覽", icon: "👤", href: "/member/dashboard" },
  { key: "booking", label: "預約服務", icon: "📅", href: "/member/booking" },
  { key: "bookings", label: "預約紀錄", icon: "📂", href: "/member/bookings" },
  { key: "transactions", label: "消費紀錄", icon: "📜", href: "/member/transactions" },
  { key: "balance", label: "儲值金", icon: "💰", href: "/member/dashboard?tab=balance" },
  { key: "points", label: "點數", icon: "⭐", href: "/member/dashboard?tab=points" },
];

export default function MemberLayout({ children }) {
  const router = useRouter();
  const [activeKey, setActiveKey] = useState("dashboard");

  // 登入檢查：沒有 memberPhone 就導回登入頁
  useEffect(() => {
    if (typeof window === "undefined") return;
    const phone = localStorage.getItem("memberPhone");
    if (!phone && router.pathname.startsWith("/member")) {
      router.replace("/login");
    }
  }, [router]);

  // 根據路徑 & tab 決定左側哪個選單要亮
  useEffect(() => {
    const path = router.pathname;
    const tab = router.query?.tab;

    if (path.startsWith("/member/bookings")) {
      setActiveKey("bookings");
    } else if (path.startsWith("/member/booking")) {
      setActiveKey("booking");
    } else if (path.startsWith("/member/transactions")) {
      setActiveKey("transactions");
    } else if (path.startsWith("/member/dashboard")) {
      if (tab === "balance") setActiveKey("balance");
      else if (tab === "points") setActiveKey("points");
      else setActiveKey("dashboard");
    }
  }, [router.pathname, router.query]);

  const handleMenuClick = (item) => {
    router.push(item.href);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("memberPhone");
      localStorage.removeItem("memberName");
    }
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-pink-100">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 頂部標題列 */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-pink-800">
              長輩專屬會員專區
            </h1>
            <p className="text-xs md:text-sm text-pink-600 mt-1">
              可查看預約、消費紀錄、儲值與點數資訊
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 rounded-full text-xs md:text-sm font-semibold bg-white/90 text-pink-700 border border-pink-200 hover:bg-pink-50 hover:border-pink-400 shadow-sm"
          >
            登出
          </button>
        </header>

        <div className="grid md:grid-cols-[260px,1fr] gap-6 items-start">
          {/* 左側選單 */}
          <nav className="md:sticky md:top-6">
            <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
              {MENU_ITEMS.map((item) => {
                const active = activeKey === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleMenuClick(item)}
                    className={
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm md:text-base font-medium shadow-sm border transition " +
                      (active
                        ? "bg-pink-500 text-white border-pink-500 shadow-md"
                        : "bg-white/90 text-pink-800 border-pink-100 hover:bg-pink-50 hover:border-pink-300")
                    }
                  >
                    <span className="text-xl md:text-2xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* 右側主要內容 */}
          <main className="bg-white/95 rounded-3xl shadow-xl p-4 md:p-8 border border-pink-100">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

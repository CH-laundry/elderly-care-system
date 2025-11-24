// pages/admin/dashboard.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '../../components/AdminLayout';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: '總會員數',
      value: stats.totalMembers,
      icon: '👥',
      color: 'from-blue-400 to-blue-500',
      link: '/admin/customers',
    },
    {
      title: '總預約數',
      value: stats.totalBookings,
      icon: '📅',
      color: 'from-green-400 to-green-500',
      link: '/admin/bookings',
    },
    {
      title: '待確認預約',
      value: stats.pendingBookings,
      icon: '⏰',
      color: 'from-yellow-400 to-yellow-500',
      link: '/admin/bookings',
    },
    {
      title: '總營收',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: '💰',
      color: 'from-pink-400 to-pink-500',
      link: '/admin/transactions',
    },
  ];

  const quickActions = [
    {
      title: '客戶管理',
      desc: '查看和編輯客戶資料',
      icon: '👥',
      path: '/admin/customers',
      color: 'bg-blue-500',
    },
    {
      title: '消費紀錄',
      desc: '查看所有交易紀錄',
      icon: '💰',
      path: '/admin/transactions',
      color: 'bg-green-500',
    },
    {
      title: '所有預約',
      desc: '管理預約狀態',
      icon: '📋',
      path: '/admin/bookings',
      color: 'bg-purple-500',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-pink-700 mb-2">管理者控制台</h1>
          <p className="text-pink-600">享老安心照護系統</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-pink-600">載入中...</div>
          </div>
        ) : (
          <>
            {/* 統計卡片 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((card, index) => (
                <Link key={index} href={card.link}>
                  <div className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer`}>
                    <div className="text-4xl mb-3">{card.icon}</div>
                    <div className="text-sm text-white/90 mb-1">{card.title}</div>
                    <div className="text-3xl font-bold text-white">{card.value}</div>
                  </div>
                </Link>
              ))}
            </div>

            {/* 快速操作 */}
            <div>
              <h2 className="text-xl font-bold text-pink-700 mb-4">快速操作</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.path}>
                    <div className="bg-white/90 rounded-2xl p-6 shadow-lg hover:shadow-xl transition border border-pink-100 cursor-pointer">
                      <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center text-2xl mb-3`}>
                        {action.icon}
                      </div>
                      <h3 className="font-bold text-pink-900 mb-1">{action.title}</h3>
                      <p className="text-sm text-pink-600">{action.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 系統資訊 */}
            <div className="bg-pink-50 border border-pink-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="text-2xl">ℹ️</div>
                <div>
                  <h3 className="font-semibold text-pink-900 mb-1">系統資訊</h3>
                  <p className="text-sm text-pink-700">
                    後台帳號：admin / 密碼請見環境變數 ADMIN_PASSWORD
                    <br />
                    資料庫：Airtable
                    <br />
                    部署平台：Vercel
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

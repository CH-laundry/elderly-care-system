// pages/member/dashboard.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import MemberLayout from '../../components/MemberLayout';

export default function MemberDashboard() {
  const router = useRouter();
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const phone = localStorage.getItem('memberPhone');
    if (!phone) {
      router.push('/login');
      return;
    }

    fetchMemberData(phone);
  }, [router]);

  const fetchMemberData = async (phone) => {
    try {
      const res = await fetch(`/api/members/${phone}`);
      const data = await res.json();
      if (data.member) {
        setMemberData(data.member);
      }
    } catch (error) {
      console.error('Error fetching member data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MemberLayout>
        <div className="text-center py-12">
          <div className="text-pink-600">載入中...</div>
        </div>
      </MemberLayout>
    );
  }

  const menuCards = [
    {
      title: '開始預約',
      desc: '預約照護服務',
      icon: '📅',
      path: '/member/booking',
      color: 'from-pink-400 to-pink-500',
    },
    {
      title: '預約紀錄',
      desc: '查看我的預約',
      icon: '📋',
      path: '/member/bookings',
      color: 'from-purple-400 to-purple-500',
    },
    {
      title: '消費紀錄',
      desc: '查看交易明細',
      icon: '💰',
      path: '/member/transactions',
      color: 'from-rose-400 to-rose-500',
    },
    {
      title: '個人資料',
      desc: '修改個人資訊',
      icon: '👤',
      path: '/member/profile',
      color: 'from-fuchsia-400 to-fuchsia-500',
    },
  ];

  return (
    <MemberLayout>
      <div className="space-y-6">
        {/* 歡迎標題 */}
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-pink-700 mb-2">
            歡迎回來，{memberData?.Name || '會員'}！
          </h1>
          <p className="text-pink-600 text-sm">享老安心照護系統</p>
        </div>

        {/* 帳戶資訊卡片 */}
        <div className="bg-white/90 rounded-3xl shadow-xl p-6 border border-pink-100">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl">
              <div className="text-3xl mb-2">💳</div>
              <div className="text-sm text-pink-700 mb-1">儲值金</div>
              <div className="text-2xl font-bold text-pink-900">
                ${memberData?.Balance || 0}
              </div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-sm text-purple-700 mb-1">點數</div>
              <div className="text-2xl font-bold text-purple-900">
                {memberData?.Points || 0}
              </div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl">
              <div className="text-3xl mb-2">📱</div>
              <div className="text-sm text-rose-700 mb-1">手機號碼</div>
              <div className="text-lg font-bold text-rose-900">
                {memberData?.Phone || '-'}
              </div>
            </div>
          </div>
        </div>

        {/* 功能選單 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {menuCards.map((card) => (
            <Link
              key={card.path}
              href={card.path}
              className="group"
            >
              <div className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1`}>
                <div className="text-4xl mb-3">{card.icon}</div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {card.title}
                </h3>
                <p className="text-sm text-white/90">{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* 溫馨提示 */}
        <div className="bg-pink-50 border border-pink-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💝</div>
            <div>
              <h3 className="font-semibold text-pink-900 mb-1">溫馨提醒</h3>
              <p className="text-sm text-pink-700">
                預約服務後，專員將在 24 小時內與您聯繫確認詳細時間與服務內容。
                如有緊急需求，請直接撥打客服專線。
              </p>
            </div>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}

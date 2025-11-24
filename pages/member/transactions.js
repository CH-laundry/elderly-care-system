// pages/member/transactions.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MemberLayout from '../../components/MemberLayout';

export default function MemberTransactions() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const phone = localStorage.getItem('memberPhone');
    if (!phone) {
      router.push('/login');
      return;
    }

    fetchTransactions(phone);
  }, [router]);

  const fetchTransactions = async (phone) => {
    try {
      const res = await fetch(`/api/transactions/list?phone=${phone}`);
      const data = await res.json();
      if (data.transactions) {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case '儲值':
        return 'text-green-700';
      case '消費':
      case '預約':
        return 'text-red-700';
      default:
        return 'text-pink-700';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case '儲值':
        return '💰';
      case '消費':
        return '🛒';
      case '預約':
        return '📅';
      default:
        return '💳';
    }
  };

  return (
    <MemberLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-pink-700 mb-6">消費紀錄</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-pink-600">載入中...</div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-white/90 rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">💰</div>
            <p className="text-pink-700">還沒有交易紀錄</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((txn, index) => (
              <div
                key={txn.id || index}
                className="bg-white/90 rounded-2xl shadow-lg p-5 border border-pink-100 hover:shadow-xl transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{getTypeIcon(txn.Type)}</div>
                    <div>
                      <div className="font-semibold text-pink-900 mb-1">
                        {txn.Type}
                      </div>
                      {txn.Note && (
                        <div className="text-sm text-pink-600">{txn.Note}</div>
                      )}
                      <div className="text-xs text-pink-500 mt-1">
                        {txn.CreatedAt
                          ? new Date(txn.CreatedAt).toLocaleString('zh-TW')
                          : '-'}
                      </div>
                    </div>
                  </div>
                  <div className={`text-xl font-bold ${getTypeColor(txn.Type)}`}>
                    {txn.Amount >= 0 ? '+' : ''}
                    {typeof txn.Amount === 'number'
                      ? txn.Amount.toLocaleString()
                      : txn.Amount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MemberLayout>
  );
}

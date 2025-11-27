// pages/admin/transactions.js
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, 儲值, 消費, 預約, 調整
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/transactions');

      // 如果 API 回傳未登入、沒有權限之類，這裡先擋住，不要讓程式爆掉
      if (!res.ok) {
        console.error('取得交易紀錄失敗，狀態碼：', res.status);
        // 不在這裡 redirect，避免你說的「被丟回登入頁」
        // 只是在畫面上顯示錯誤
        setError('無法取得交易紀錄，請確認是否已登入管理者帳號。');
        setTransactions([]);
        return;
      }

      const data = await res.json();
      if (Array.isArray(data.transactions)) {
        setTransactions(data.transactions);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.error('fetchTransactions error:', err);
      setError('載入交易紀錄時發生錯誤。');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions =
    filter === 'all'
      ? transactions
      : transactions.filter((t) => t.Type === filter);

  const getTypeColor = (type) => {
    switch (type) {
      case '儲值':
        return 'bg-green-100 text-green-700';
      case '消費':
        return 'bg-red-100 text-red-700';
      case '預約':
        return 'bg-blue-100 text-blue-700';
      case '調整':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
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
      case '調整':
        return '⚙️';
      default:
        return '💳';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 標題 + 篩選器 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-pink-700">
            儲值金／消費紀錄
          </h1>

          {/* 篩選器 */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['all', '儲值', '消費', '預約', '調整'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
                  filter === type
                    ? 'bg-pink-500 text-white'
                    : 'bg-white border border-pink-200 text-pink-700 hover:bg-pink-50'
                }`}
              >
                {type === 'all' ? '全部' : type}
                {type !== 'all' && (
                  <span className="ml-1">
                    ({transactions.filter((t) => t.Type === type).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 錯誤訊息 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
            {error}
          </div>
        )}

        {/* 內容區 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-pink-600">載入中...</div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="bg-white/90 rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">💰</div>
            <p className="text-pink-700">
              {error ? '目前無法顯示交易紀錄' : '沒有交易紀錄'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((txn, index) => (
              <div
                key={txn.id || index}
                className="bg-white/90 rounded-2xl shadow-lg p-5 border border-pink-100 hover:shadow-xl transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-3xl">{getTypeIcon(txn.Type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(
                            txn.Type
                          )}`}
                        >
                          {txn.Type}
                        </span>
                          <span className="text-sm font-semibold text-pink-900">
                          {txn.Phone}
                        </span>
                      </div>
                      {txn.Note && (
                        <div className="text-sm text-pink-700">
                          {txn.Note}
                        </div>
                      )}
                      <div className="text-xs text-pink-500 mt-1">
                        {txn.CreatedAt
                          ? new Date(txn.CreatedAt).toLocaleString('zh-TW')
                          : '-'}
                        {txn.Operator && ` · ${txn.Operator}`}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-xl font-bold text-right ${
                      (txn.Amount || 0) >= 0
                        ? 'text-green-700'
                        : 'text-red-700'
                    }`}
                  >
                    {(txn.Amount || 0) >= 0 ? '+' : ''}
                    {typeof txn.Amount === 'number'
                      ? txn.Amount.toLocaleString()
                      : txn.Amount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center text-sm text-pink-600">
          共 {filteredTransactions.length} 筆紀錄
        </div>
      </div>
    </AdminLayout>
  );
}

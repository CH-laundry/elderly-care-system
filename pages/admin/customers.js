// pages/admin/customers.js
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editForm, setEditForm] = useState({
    balance: 0,
    points: 0,
    note: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/admin/customers');
      const data = await res.json();
      if (data.customers) {
        setCustomers(data.customers);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setEditForm({
      balance: customer.Balance || 0,
      points: customer.Points || 0,
      note: '',
    });
    setMessage(null);
  };

  const handleCancel = () => {
    setEditingCustomer(null);
    setEditForm({ balance: 0, points: 0, note: '' });
    setMessage(null);
  };

  const handleSave = async () => {
    setMessage(null);
    setSaving(true);

    try {
      const res = await fetch('/api/admin/update-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: editingCustomer.Phone,
          recordId: editingCustomer.id,
          balance: editForm.balance,
          points: editForm.points,
          note: editForm.note,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '更新失敗');
      }

      setMessage({ type: 'success', text: '更新成功！' });
      
      // 重新載入客戶列表
      await fetchCustomers();
      
      // 2 秒後關閉編輯視窗
      setTimeout(() => {
        handleCancel();
      }, 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-pink-700">客戶管理</h1>
          <div className="text-sm text-pink-600">
            共 {customers.length} 位客戶
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-pink-600">載入中...</div>
          </div>
        ) : customers.length === 0 ? (
          <div className="bg-white/90 rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-pink-700">尚無客戶資料</p>
          </div>
        ) : (
          <div className="bg-white/90 rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-pink-100 border-b border-pink-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-pink-900">
                      姓名
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-pink-900">
                      手機號碼
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-pink-900">
                      儲值金
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-pink-900">
                      點數
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-pink-900">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-100">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-pink-50">
                      <td className="px-4 py-3 text-sm text-pink-900">
                        {customer.Name}
                      </td>
                      <td className="px-4 py-3 text-sm text-pink-900">
                        {customer.Phone}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-pink-900 font-semibold">
                        ${(customer.Balance || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-pink-900 font-semibold">
                        {customer.Points || 0}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleEdit(customer)}
                          className="px-4 py-1.5 rounded-full text-sm font-semibold bg-pink-500 text-white hover:bg-pink-600"
                        >
                          編輯
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 編輯視窗 */}
        {editingCustomer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full">
              <h2 className="text-xl font-bold text-pink-700 mb-4">
                編輯客戶資料
              </h2>

              <div className="space-y-4 mb-6">
                <div className="bg-pink-50 rounded-xl p-3">
                  <div className="text-sm text-pink-600">客戶姓名</div>
                  <div className="font-semibold text-pink-900">
                    {editingCustomer.Name}
                  </div>
                </div>

                <div className="bg-pink-50 rounded-xl p-3">
                  <div className="text-sm text-pink-600">手機號碼</div>
                  <div className="font-semibold text-pink-900">
                    {editingCustomer.Phone}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-pink-900 mb-2">
                    儲值金（元）
                  </label>
                  <input
                    type="number"
                    value={editForm.balance}
                    onChange={(e) => setEditForm(prev => ({ ...prev, balance: parseFloat(e.target.value) || 0 }))}
                    className="w-full rounded-xl border border-pink-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-pink-900 mb-2">
                    點數
                  </label>
                  <input
                    type="number"
                    value={editForm.points}
                    onChange={(e) => setEditForm(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                    className="w-full rounded-xl border border-pink-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-pink-900 mb-2">
                    備註說明
                  </label>
                  <textarea
                    value={editForm.note}
                    onChange={(e) => setEditForm(prev => ({ ...prev, note: e.target.value }))}
                    rows={3}
                    className="w-full rounded-xl border border-pink-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="此次修改的原因（選填）"
                  />
                </div>
              </div>

              {message && (
                <div className={`rounded-xl px-4 py-3 mb-4 ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex-1 py-3 rounded-2xl text-base font-semibold border border-pink-300 text-pink-700 hover:bg-pink-50 disabled:opacity-60"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 rounded-2xl text-base font-semibold bg-pink-500 text-white hover:bg-pink-600 disabled:opacity-60"
                >
                  {saving ? '儲存中...' : '儲存變更'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

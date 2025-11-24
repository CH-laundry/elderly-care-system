// pages/admin/index.js
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [activeTab, setActiveTab] = useState('customers'); // 'customers' | 'transactions'
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/bookings');
      if (!res.ok) throw new Error('取得資料失敗');
      const data = await res.json();
      setRecords(data.records || []);
    } catch (err) {
      console.error(err);
      setError('讀取 Airtable 資料失敗，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFieldChange = (id, field, value) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, fields: { ...r.fields, [field]: value } } : r
      )
    );
  };

  const handleSave = async (record) => {
    setSavingId(record.id);
    setError(null);

    const fields = {
      Name: record.fields.Name || '',
      Phone: record.fields.Phone || '',
      Notes: record.fields.Notes || '',
      Balance: record.fields.Balance
        ? Number(record.fields.Balance)
        : 0,
      Points: record.fields.Points ? Number(record.fields.Points) : 0,
    };

    try {
      const res = await fetch(`/api/bookings/${record.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields }),
      });
      if (!res.ok) throw new Error('更新失敗');
      await fetchData();
    } catch (err) {
      console.error(err);
      setError('儲存失敗，請確認欄位格式或稍後再試。');
    } finally {
      setSavingId(null);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString('zh-TW', {
      hour12: false,
    });
  };

  return (
    <div className="min-h-screen bg-pink-50 px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-pink-800">
              後台管理介面
            </h1>
            <p className="text-sm text-pink-800/70">
              檢視與管理長輩／家屬資料、儲值金與點數紀錄（資料來源：Airtable）。
            </p>
          </div>
        </header>

        <div className="bg-white rounded-3xl shadow-md p-4 md:p-6">
          <div className="flex gap-2 mb-4 border-b border-pink-100 pb-2">
            <button
              onClick={() => setActiveTab('customers')}
              className={`px-4 py-2 rounded-2xl text-sm font-semibold ${
                activeTab === 'customers'
                  ? 'bg-pink-500 text-white'
                  : 'bg-pink-50 text-pink-700'
              }`}
            >
              客戶資料
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-4 py-2 rounded-2xl text-sm font-semibold ${
                activeTab === 'transactions'
                  ? 'bg-pink-500 text-white'
                  : 'bg-pink-50 text-pink-700'
              }`}
            >
              消費紀錄
            </button>
          </div>

          {error && (
            <div className="mb-3 text-sm bg-red-50 text-red-700 border border-red-200 rounded-xl px-3 py-2">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-10 text-center text-pink-700">資料載入中…</div>
          ) : records.length === 0 ? (
            <div className="py-10 text-center text-pink-700">
              目前尚無任何紀錄。
            </div>
          ) : activeTab === 'customers' ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-pink-50 text-pink-900">
                    <th className="px-3 py-2 text-left">姓名</th>
                    <th className="px-3 py-2 text-left">手機</th>
                    <th className="px-3 py-2 text-left">備註</th>
                    <th className="px-3 py-2 text-right">儲值金</th>
                    <th className="px-3 py-2 text-right">點數</th>
                    <th className="px-3 py-2 text-left">建立時間</th>
                    <th className="px-3 py-2 text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-pink-50 hover:bg-pink-50/60"
                    >
                      <td className="px-3 py-2">
                        <input
                          className="w-full border border-pink-200 rounded-lg px-2 py-1 text-sm"
                          value={r.fields.Name || ''}
                          onChange={(e) =>
                            handleFieldChange(r.id, 'Name', e.target.value)
                          }
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          className="w-full border border-pink-200 rounded-lg px-2 py-1 text-sm"
                          value={r.fields.Phone || ''}
                          onChange={(e) =>
                            handleFieldChange(
                              r.id,
                              'Phone',
                              e.target.value.replace(/[^\d]/g, '')
                            )
                          }
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          className="w-full border border-pink-200 rounded-lg px-2 py-1 text-sm"
                          value={r.fields.Notes || ''}
                          onChange={(e) =>
                            handleFieldChange(r.id, 'Notes', e.target.value)
                          }
                        />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <input
                          className="w-24 text-right border border-pink-200 rounded-lg px-2 py-1 text-sm"
                          value={
                            r.fields.Balance !== undefined &&
                            r.fields.Balance !== null
                              ? r.fields.Balance
                              : 0
                          }
                          onChange={(e) =>
                            handleFieldChange(
                              r.id,
                              'Balance',
                              e.target.value.replace(/[^\d.]/g, '')
                            )
                          }
                        />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <input
                          className="w-20 text-right border border-pink-200 rounded-lg px-2 py-1 text-sm"
                          value={
                            r.fields.Points !== undefined &&
                            r.fields.Points !== null
                              ? r.fields.Points
                              : 0
                          }
                          onChange={(e) =>
                            handleFieldChange(
                              r.id,
                              'Points',
                              e.target.value.replace(/[^\d]/g, '')
                            )
                          }
                        />
                      </td>
                      <td className="px-3 py-2 text-xs text-pink-800/70">
                        {r.fields.CreatedAt
                          ? formatDate(r.fields.CreatedAt)
                          : ''}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => handleSave(r)}
                          disabled={savingId === r.id}
                          className="px-3 py-1 rounded-full text-xs font-semibold bg-pink-500 text-white hover:bg-pink-600 disabled:opacity-60"
                        >
                          {savingId === r.id ? '儲存中…' : '儲存'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // transactions tab
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-pink-50 text-pink-900">
                    <th className="px-3 py-2 text-left">姓名</th>
                    <th className="px-3 py-2 text-left">手機</th>
                    <th className="px-3 py-2 text-left">服務類型</th>
                    <th className="px-3 py-2 text-right">消費金額</th>
                    <th className="px-3 py-2 text-left">建立時間</th>
                    <th className="px-3 py-2 text-left">備註</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-pink-50 hover:bg-pink-50/60"
                    >
                      <td className="px-3 py-2">{r.fields.Name || ''}</td>
                      <td className="px-3 py-2">{r.fields.Phone || ''}</td>
                      <td className="px-3 py-2">
                        {r.fields.ServiceType || ''}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {r.fields.Amount || ''}
                      </td>
                      <td className="px-3 py-2 text-xs text-pink-800/70">
                        {r.fields.CreatedAt
                          ? formatDate(r.fields.CreatedAt)
                          : ''}
                      </td>
                      <td className="px-3 py-2">
                        {r.fields.Notes || ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// pages/admin/bookings.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('zh-TW');
  } catch {
    return dateStr;
  }
}

export default function AdminBookingsPage() {
  const router = useRouter();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // 確認是否已登入後台
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const loggedIn = window.localStorage.getItem('adminLoggedIn') === 'true';
    if (!loggedIn) {
      router.replace('/admin/login');
    }
  }, [router]);

  // 讀取預約資料
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const resp = await fetch('/api/admin/bookings');
        const data = await resp.json();

        if (!resp.ok) {
          setError(data.error || '讀取預約資料失敗。');
          setRecords([]);
          return;
        }

        setRecords(data.records || []);
      } catch (err) {
        console.error(err);
        setError('讀取預約資料失敗。');
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parsed = records.map((r) => {
    const d = r.date ? new Date(r.date) : null;
    if (d && !Number.isNaN(d.getTime())) {
      d.setHours(0, 0, 0, 0);
    }
    return { ...r, _dateObj: d };
  });

  const totalCount = parsed.length;
  const todayCount = parsed.filter(
    (r) => r._dateObj && r._dateObj.getTime() === today.getTime()
  ).length;
  const upcomingCount = parsed.filter(
    (r) => r._dateObj && r._dateObj.getTime() > today.getTime()
  ).length;

  // 點擊「狀態」切換：待確認 → 已確認 → 已完成
  const handleStatusClick = async (record) => {
    const current = record.status || '待確認';
    let nextStatus = current;

    if (current === '待確認') {
      nextStatus = '已確認';
    } else if (current === '已確認') {
      nextStatus = '已完成';
    } else if (current === '已完成') {
      // 目前不支援退回狀態，維持已完成
      nextStatus = '已完成';
    }

    if (nextStatus === current) return;

    try {
      setUpdatingId(record.id);
      setError('');

      const resp = await fetch('/api/admin/update-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: record.id,
          status: nextStatus,
        }),
      });

      const data = await resp.json();

      if (!resp.ok || !data.success) {
        throw new Error(data.error || '更新失敗');
      }

      // 本地狀態同步更新
      setRecords((prev) =>
        prev.map((r) =>
          r.id === record.id ? { ...r, status: nextStatus } : r
        )
      );
    } catch (err) {
      console.error(err);
      setError(err.message || '更新失敗');
    } finally {
      setUpdatingId(null);
    }
  };

  const renderStatusChip = (record) => {
    const current = record.status || '待確認';

    let colorClass =
      'border-pink-400/60 text-pink-100 bg-pink-500/10 hover:bg-pink-500/20';
    if (current === '已確認') {
      colorClass =
        'border-amber-300/70 text-amber-100 bg-amber-500/10 hover:bg-amber-500/20';
    } else if (current === '已完成') {
      colorClass =
        'border-emerald-400/70 text-emerald-100 bg-emerald-500/10 hover:bg-emerald-500/20';
    }

    const disabled = updatingId === record.id;

    return (
      <button
        type="button"
        onClick={() => handleStatusClick(record)}
        disabled={disabled}
        className={[
          'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] transition',
          colorClass,
          disabled ? 'opacity-60 cursor-wait' : 'cursor-pointer',
        ].join(' ')}
      >
        {disabled ? '更新中…' : current}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-black text-white flex flex-col">
      <header className="w-full border-b border-pink-500/40 bg-gray-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex flex-col">
            <span className="text-xs text-pink-300/80">EnjoyCare Admin</span>
            <span className="text-lg font-bold text-pink-100">
              預約紀錄報表
            </span>
          </div>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-pink-500 text-white hover:bg-pink-400"
          >
            返回管理總覽
          </button>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          {/* Summary cards */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-3xl border border-pink-500/40 bg-gray-950/70 px-

// pages/admin/bookings.js
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminBookingsPage() {
  const router = useRouter();
  const [summary, setSummary] = useState({
    todayCount: 0,
    futureCount: 0,
    totalCount: 0,
  });
  const [records, setRecords] = useState([]);
  const [memberMap, setMemberMap] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // 登入檢查
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const loggedIn = window.localStorage.getItem('adminLoggedIn');
    if (!loggedIn) router.replace('/admin/login');
  }, [router]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError('');

        // 1) 預約紀錄 + summary
        const bookingResp = await fetch('/api/admin/bookings');
        const bookingData = await bookingResp.json();

        if (!bookingResp.ok) {
          setError(bookingData.error || '讀取預約紀錄失敗。');
          setRecords([]);
        } else {
          setSummary({
            todayCount: bookingData.todayCount || 0,
            futureCount: bookingData.futureCount || 0,
            totalCount:
              bookingData.totalCount ||
              (bookingData.records ? bookingData.records.length : 0),
          });
          setRecords(bookingData.records || []);
        }

        // 2) 會員清單（拿來做 phone → name 對照）
        try {
          const memberResp = await fetch('/api/admin/members');
          const memberData = await memberResp.json();
          if (memberResp.ok && Array.isArray(memberData.records)) {
            const map = new Map();
            memberData.records.forEach((m) => {
              if (m.phone) {
                map.set(String(m.phone).trim(), m.name || '');
              }
            });
            setMemberMap(map);
          }
        } catch (e) {
          console.warn('讀取會員清單失敗（不影響預約列表顯示）', e);
        }
      } catch (err) {
        console.error(err);
        setError('系統錯誤，請稍後再試。');
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const enrichedRecords = useMemo(() => {
    return records.map((r) => {
      const phone = r.phone ? String(r.phone).trim() : '';
      const nameFromMember = phone ? memberMap.get(phone) : '';
      return {
        ...r,
        name: r.name || nameFromMember || '',
      };
    });
  }, [records, memberMap]);

  const nextStatus = (current) => {
    if (current === '待確認') return '已確認';
    if (current === '已確認') return '已完成';
    return '已完成';
  };

  const renderStatusChip = (status) => {
    let color =
      'border-pink-400/70 text-pink-100 bg-pink-500/10'; // 待確認
    if (status === '已確認') {
      color =
        'border-amber-300/70 text-amber-100 bg-amber-500/10';
    } else if (status === '已完成') {
      color =
        'border-emerald-400/70 text-emerald-100 bg-emerald-500/10';
    }

    return (
      <span
        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${color}`}
      >
        {status}
      </span>
    );
  };

  const handleToggleStatus = async (record) => {
    const current = record.status || '待確認';
    const newStatus = nextStatus(current);

    try {
      setUpdatingId(record.id);
      const resp = await fetch('/api/admin/update-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: record.id, status: newStatus }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        alert(data.error || '更新狀態失敗');
        return;
      }

      // 本地狀態更新
      setRecords((prev) =>
        prev.map((r) =>
          r.id === record.id ? { ...r, status: newStatus } : r
        )
      );
    } catch (err) {
      console.error(err);
      alert('系統錯誤，請稍後再試');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 vi

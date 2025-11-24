// pages/api/admin/stats.js
import { getAllMembers, getAllBookings, getAllTransactions } from '../../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const [members, bookings, transactions] = await Promise.all([
      getAllMembers(),
      getAllBookings(),
      getAllTransactions(),
    ]);

    // 計算待確認預約
    const pendingBookings = bookings.filter(
      b => b.Status === '待確認' || !b.Status
    ).length;

    // 計算總營收（所有消費和預約的金額）
    const totalRevenue = transactions
      .filter(t => t.Type === '消費' || t.Type === '預約')
      .reduce((sum, t) => sum + Math.abs(t.Amount || 0), 0);

    const stats = {
      totalMembers: members.length,
      totalBookings: bookings.length,
      pendingBookings,
      totalRevenue,
    };

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return res.status(500).json({ error: '取得統計失敗' });
  }
}

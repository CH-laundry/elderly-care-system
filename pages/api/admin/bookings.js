// pages/api/admin/bookings.js
import { getAllBookings } from '../../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const bookings = await getAllBookings();
    return res.status(200).json({ success: true, bookings });
  } catch (err) {
    console.error('admin/bookings error:', err);
    return res.status(500).json({ error: '取得預約資料失敗' });
  }
}

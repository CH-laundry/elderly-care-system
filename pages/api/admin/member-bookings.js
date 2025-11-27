// pages/api/admin/member-bookings.js
import { getBookingsByPhone } from '../../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone } = req.query;

  if (!phone) {
    return res.status(400).json({ error: '缺少 phone 參數' });
  }

  try {
    const bookings = await getBookingsByPhone(phone);
    return res.status(200).json({ success: true, bookings });
  } catch (err) {
    console.error('admin/member-bookings error:', err);
    return res.status(500).json({ error: '取得會員預約資料失敗' });
  }
}

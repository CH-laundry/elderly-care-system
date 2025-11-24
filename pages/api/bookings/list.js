// pages/api/bookings/list.js
import { getBookingsByPhone } from '../../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone } = req.query;

  if (!phone) {
    return res.status(400).json({ error: '缺少手機號碼' });
  }

  try {
    const bookings = await getBookingsByPhone(phone);

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    return res.status(500).json({ error: '取得預約紀錄失敗' });
  }
}

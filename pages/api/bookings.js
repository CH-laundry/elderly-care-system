// pages/api/bookings.js
import { createBooking, getMemberByPhone } from '../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { date, time, serviceType, notes, phone } = req.body || {};

    // 1) 必要欄位檢查
    if (!phone) {
      return res
        .status(400)
        .json({ error: '找不到會員手機，請先重新登入再預約。' });
    }

    if (!date || !time || !serviceType) {
      return res
        .status(400)
        .json({ error: '請填寫完整的預約日期、時間與服務類型。' });
    }

    // 2) 依手機找會員
    const member = await getMemberByPhone(phone);
    if (!member) {
      return res
        .status(404)
        .json({ error: '查無此會員，請確認是否已註冊或重新登入。' });
    }

    // 3) 建立預約紀錄（姓名直接用會員資料）
    const booking = await createBooking({
      memberId: member.id,
      name: member.Name || member.name || '',
      phone: member.Phone || phone,
      date,
      time,
      serviceType,
      notes,
      status: '待確認',
    });

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error('Booking error:', error);
    return res.status(500).json({ error: '預約失敗，請稍後再試。' });
  }
}

// pages/api/bookings.js
import {
  createBooking,
  getMemberByPhone,
  updateMember,
  createTransaction,
} from '../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, date, time, serviceType, notes, paymentMethod, amount } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: '請輸入姓名和手機' });
  }

  if (!date || !time) {
    return res.status(400).json({ error: '請選擇日期和時間' });
  }

  try {
    // 如果有付款方式，先扣款
    if (paymentMethod && amount) {
      const member = await getMemberByPhone(phone);
      
      if (!member) {
        return res.status(404).json({ error: '找不到會員資料' });
      }

      // 檢查餘額
      if (paymentMethod === 'points') {
        if ((member.Points || 0) < amount) {
          return res.status(400).json({ error: '點數不足' });
        }
        // 扣除點數
        await updateMember(member.id, {
          Points: (member.Points || 0) - amount,
        });
      } else if (paymentMethod === 'balance') {
        if ((member.Balance || 0) < amount) {
          return res.status(400).json({ error: '儲值金不足' });
        }
        // 扣除儲值金
        await updateMember(member.id, {
          Balance: (member.Balance || 0) - amount,
        });
      }

      // 建立交易記錄
      await createTransaction({
        phone,
        type: '預約',
        amount: -amount,
        note: `預約服務 - ${date} ${time}`,
        operator: '系統',
      });
    }

    // 建立預約記錄
    const booking = await createBooking({
      name,
      phone,
      date,
      time,
      serviceType: serviceType || '',
      notes: notes || '',
      status: '待確認',
    });

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error('Booking error:', error);
    return res.status(500).json({ error: '預約失敗，請稍後再試' });
  }
}

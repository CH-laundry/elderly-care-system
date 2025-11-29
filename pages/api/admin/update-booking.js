// pages/api/admin/update-booking.js
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const BOOKINGS_TABLE_ID = process.env.BOOKINGS_TABLE_ID;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { bookingId, status } = req.body;

  if (!bookingId || !status) {
    return res.status(400).json({ error: '缺少必要資料' });
  }

  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${BOOKINGS_TABLE_ID}/${bookingId}`;

    const res2 = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          // 要跟 Airtable 表格裡的欄位名稱一致：中文「狀態」
          狀態: status,
        },
      }),
    });

    if (!res2.ok) {
      const text = await res2.text();
      console.error('Update booking Airtable error:', res2.status, text);
      throw new Error('更新失敗');
    }

    return res.status(200).json({
      success: true,
      message: '狀態更新成功',
    });
  } catch (error) {
    console.error('Update booking error:', error);
    return res.status(500).json({ error: '更新失敗' });
  }
}

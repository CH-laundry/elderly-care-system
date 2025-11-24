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
          Status: status,
        },
      }),
    });

    if (!res2.ok) {
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

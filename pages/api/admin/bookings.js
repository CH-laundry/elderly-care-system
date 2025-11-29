// pages/api/admin/bookings.js
// 管理者用：讀取 Airtable 預約紀錄資料

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableId = process.env.BOOKINGS_TABLE_ID;

    if (!apiKey || !baseId || !tableId) {
      return res.status(500).json({
        error: 'Airtable 參數未設定完整（AIRTABLE_API_KEY / AIRTABLE_BASE_ID / BOOKINGS_TABLE_ID）。',
      });
    }

    const url = new URL(`https://api.airtable.com/v0/${baseId}/${tableId}`);
    url.searchParams.set('pageSize', '100');
    url.searchParams.set('sort[0][field]', '預約日期');
    url.searchParams.set('sort[0][direction]', 'desc');

    const airtableResp = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!airtableResp.ok) {
      const text = await airtableResp.text();
      console.error('Admin bookings Airtable error:', airtableResp.status, text);
      return res.status(500).json({ error: '讀取預約紀錄失敗。' });
    }

    const data = await airtableResp.json();

    const records = (data.records || []).map((r) => ({
      id: r.id,
      phone: r.fields['手機'] || '',
      date: r.fields['預約日期'] || '',
      time: r.fields['預約時間'] || '',
      serviceType: r.fields['服務類型'] || '',
      attendant: r.fields['指定陪伴員'] || '',
      status: r.fields['狀態'] || '',
      notes: r.fields['備註'] || '',
      source: r.fields['建立來源'] || '',
      createdTime: r.createdTime,
    }));

    return res.status(200).json({ records });
  } catch (err) {
    console.error('Admin bookings API error:', err);
    return res.status(500).json({ error: '系統錯誤，請稍後再試。' });
  }
}

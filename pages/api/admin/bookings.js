// pages/api/admin/bookings.js
// 管理者用：讀取 Airtable 預約紀錄資料（後台報表）

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
        error:
          'Airtable 參數未設定完整（AIRTABLE_API_KEY / AIRTABLE_BASE_ID / BOOKINGS_TABLE_ID）。',
      });
    }

    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(
      tableId
    )}?maxRecords=100&view=Grid%20view&sort[0][field]=預約日期&sort[0][direction]=asc`;

    const airtableResp = await fetch(url, {
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
      // 之後你在 Airtable 新增「姓名」或「會員姓名 / 暱稱」，這裡會自動帶出
      name: r.fields['姓名'] || r.fields['會員姓名'] || r.fields['暱稱'] || '',
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

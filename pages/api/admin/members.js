// pages/api/admin/members.js
// 管理者用：讀取 Airtable 會員資料列表

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableId = process.env.MEMBERS_TABLE_ID; // 你之前建立的會員表 ID

    if (!apiKey || !baseId || !tableId) {
      return res.status(500).json({
        error:
          'Airtable 參數未設定完整（AIRTABLE_API_KEY / AIRTABLE_BASE_ID / MEMBERS_TABLE_ID）。',
      });
    }

    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(
      tableId
    )}?maxRecords=100&view=Grid%20view&sort[0][field]=手機&sort[0][direction]=asc`;

    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error('Admin members Airtable error:', resp.status, text);
      return res.status(500).json({ error: '讀取會員資料失敗。' });
    }

    const data = await resp.json();

    const records = (data.records || []).map((r) => ({
      id: r.id,
      // 這裡用多種欄位名做 fallback，避免欄位叫「姓名」或「會員姓名」之類就抓不到
      name:
        r.fields['姓名'] ||
        r.fields['會員姓名'] ||
        r.fields['暱稱'] ||
        r.fields['Name'] ||
        '',
      phone: r.fields['手機'] || '',
      birthday: r.fields['生日'] || '',
      address: r.fields['地址'] || '',
      note: r.fields['備註'] || '',
      createdTime: r.createdTime,
    }));

    return res.status(200).json({ records });
  } catch (err) {
    console.error('Admin members API error:', err);
    return res.status(500).json({ error: '系統錯誤，請稍後再試。' });
  }
}

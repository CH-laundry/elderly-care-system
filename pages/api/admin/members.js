// pages/api/admin/members.js
// 管理者用：讀取 Airtable「會員基本資料」列表，並提供 phone/name 等欄位

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    // 你原本用的 MEMBERS_TABLE_ID 直接沿用
    const tableId =
      process.env.MEMBERS_TABLE_ID || process.env.MEMBERS_TABLE || '';

    if (!apiKey || !baseId || !tableId) {
      return res.status(500).json({
        error:
          'Airtable 參數未設定完整（AIRTABLE_API_KEY / AIRTABLE_BASE_ID / MEMBERS_TABLE_ID）。',
      });
    }

    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(
      tableId
    )}?maxRecords=200`;

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

    const records = (data.records || []).map((r) => {
      const f = r.fields || {};

      // 儘量多種欄位名稱都 cover 到
      const name =
        f['姓名'] ||
        f['會員姓名'] ||
        f['姓名／暱稱'] ||
        f['Name'] ||
        f['姓名(必填)'] ||
        '';

      const phone =
        f['手機'] ||
        f['手機號碼'] ||
        f['電話'] ||
        f['Phone'] ||
        f['聯絡電話'] ||
        '';

      return {
        id: r.id,
        name,
        phone,
        birthday: f['生日'] || f['Birth'] || '',
        address: f['地址'] || f['住址'] || '',
        note: f['備註'] || f['備註/說明'] || '',
        createdTime: r.createdTime,
      };
    });

    return res.status(200).json({ records });
  } catch (err) {
    console.error('Admin members API error:', err);
    return res.status(500).json({ error: '系統錯誤，請稍後再試。' });
  }
}

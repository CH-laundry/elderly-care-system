// pages/api/member/bookings.js
// 會員端：依手機號碼讀取該會員的預約紀錄

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone } = req.query;

  if (!phone) {
    return res.status(400).json({ error: '缺少手機號碼' });
  }

  try {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableId = process.env.BOOKINGS_TABLE_ID; // 跟後台預約表同一張

    if (!apiKey || !baseId || !tableId) {
      return res.status(500).json({
        error:
          'Airtable 參數未設定完整（AIRTABLE_API_KEY / AIRTABLE_BASE_ID / BOOKINGS_TABLE_ID）。',
      });
    }

    const filterFormula = `{手機} = '${phone}'`;
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(
      tableId
    )}?maxRecords=50&view=Grid%20view&filterByFormula=${encodeURIComponent(
      filterFormula
    )}&sort[0][field]=預約日期&sort[0][direction]=desc`;

    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error('Member bookings Airtable error:', resp.status, text);
      return res.status(500).json({ error: '讀取預約紀錄失敗。' });
    }

    const data = await resp.json();

    const records = (data.records || []).map((r) => ({
      id: r.id,
      date: r.fields['預約日期'] || '',
      time: r.fields['預約時間'] || '',
      serviceType: r.fields['服務類型'] || '',
      status: r.fields['狀態'] || '待確認',
      notes: r.fields['備註'] || '',
    }));

    return res.status(200).json({ records });
  } catch (err) {
    console.error('Member bookings API error:', err);
    return res.status(500).json({ error: '系統錯誤，請稍後再試。' });
  }
}

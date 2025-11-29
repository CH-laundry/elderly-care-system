// pages/api/bookings.js
// 會員預約 API：直接寫入 Airtable「預約紀錄」表

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { date, time, serviceType, attendant, notes, phone } = req.body || {};

    // 1) 基本欄位檢查
    if (!date || !time || !serviceType) {
      return res.status(400).json({ error: '請填寫完整的預約日期、時間與服務類型。' });
    }

    if (!phone) {
      return res.status(400).json({ error: '找不到會員手機，請先重新登入後再預約。' });
    }

    // 2) 讀取 Airtable 環境變數
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableId = process.env.BOOKINGS_TABLE_ID; // 你之前已經設定過的 tblXXXXXXXX

    if (!apiKey || !baseId || !tableId) {
      console.error('Airtable env missing', {
        hasKey: !!apiKey,
        hasBase: !!baseId,
        hasTable: !!tableId,
      });
      return res.status(500).json({
        error: '伺服器尚未設定完整的 Airtable 參數（AIRTABLE_API_KEY / AIRTABLE_BASE_ID / BOOKINGS_TABLE_ID）。',
      });
    }

    // 3) 準備寫入欄位（欄位名稱你可以照抄去 Airtable 建欄位）
    const fields = {
      手機: phone,
      預約日期: date,
      預約時間: time,
      服務類型: serviceType,
      指定陪伴員: attendant || '',
      備註: notes || '',
      狀態: '待確認',
      建立來源: '官網預約',
    };

    // 4) 呼叫 Airtable REST API，直接寫入預約紀錄表
    const airtableResp = await fetch(
      `https://api.airtable.com/v0/${baseId}/${tableId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
          // 注意：Airtable 會自動建立不存在的欄位，所以欄位名稱打對就好
        body: JSON.stringify({ fields }),
      }
    );

    if (!airtableResp.ok) {
      const text = await airtableResp.text();
      console.error('Airtable booking error:', airtableResp.status, text);
      return res.status(500).json({ error: '預約寫入資料庫失敗，請稍後再試。' });
    }

    const data = await airtableResp.json();

    return res.status(200).json({
      success: true,
      booking: data,
    });
  } catch (err) {
    console.error('Booking API error:', err);
    return res.status(500).json({ error: '預約失敗，請稍後再試。' });
  }
}

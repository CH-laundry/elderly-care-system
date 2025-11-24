// pages/api/airtable.js

export default async function handler(req, res) {
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const BASE_ID = process.env.AIRTABLE_BASE_ID;
  const MEMBERS_TABLE_ID = process.env.MEMBERS_TABLE_ID;
  const BOOKINGS_TABLE_ID = process.env.BOOKINGS_TABLE_ID; // 新增：預約紀錄表

  const { method } = req;
  const { action } = req.query;

  // 基本檢查
  if (!AIRTABLE_API_KEY || !BASE_ID || !MEMBERS_TABLE_ID) {
    return res.status(500).json({
      error: '缺少 Airtable 設定，請確認環境變數 AIRTABLE_API_KEY / AIRTABLE_BASE_ID / MEMBERS_TABLE_ID',
    });
  }

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  const baseUrl = `https://api.airtable.com/v0/${BASE_ID}`;

  const airtableFetch = async (path, options = {}) => {
    const response = await fetch(`${baseUrl}/${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    const text = await response.text();
    let json;
    try {
      json = text ? JSON.parse(text) : {};
    } catch (e) {
      throw new Error(`Airtable 回應解析失敗: ${text}`);
    }

    if (!response.ok) {
      const msg = json?.error?.message || response.statusText;
      throw new Error(`Airtable API 錯誤: ${msg}`);
    }

    return json;
  };

  const mapMember = (record) => {
    const f = record.fields || {};
    return {
      id: record.id,
      name: f['姓名'] || f['Name'] || '',
      phone: f['手機'] || f['Phone'] || '',
      points: f['服務點數'] ?? f['Points'] ?? 0,
      balance: f['儲值金'] ?? f['Balance'] ?? 0,
    };
  };

  try {
    // 1) 取得系統設定（暫時用固定值，你之後要從 Airtable 調整再升級）
    if (action === 'getSettings' && method === 'GET') {
      return res.status(200).json({
        settings: {
          brandName: '享老生活',
          systemTitle: '陪伴服務系統',
          staffTitle: '陪伴員',
          companions: ['小美陪伴員', '阿明陪伴員', '志工佩佩'],
          services: ['陪同就醫', '聊天陪伴', '散步運動', '家務協助'],
        },
      });
    }

    // 2) 會員登入（手機）
    if (action === 'login' && method === 'POST') {
      const { phone } = req.body || {};
      if (!phone) {
        return res.status(400).json({ success: false, error: '缺少手機號碼' });
      }

      const filter = encodeURIComponent(`{手機}='${phone}'`);
      const data = await airtableFetch(
        `${MEMBERS_TABLE_ID}?filterByFormula=${filter}&maxRecords=1`
      );

      if (!data.records || data.records.length === 0) {
        return res.status(200).json({
          success: false,
          error: '查無此會員，請先註冊或洽櫃台',
        });
      }

      const user = mapMember(data.records[0]);
      return res.status(200).json({ success: true, user });
    }

    // 3) 會員註冊
    if (action === 'register' && method === 'POST') {
      const { name, phone } = req.body || {};
      if (!name || !phone) {
        return res.status(400).json({ success: false, error: '姓名與手機必填' });
      }

      // 檢查是否已存在
      const filter = encodeURIComponent(`{手機}='${phone}'`);
      const existing = await airtableFetch(
        `${MEMBERS_TABLE_ID}?filterByFormula=${filter}&maxRecords=1`
      );

      if (existing.records && existing.records.length > 0) {
        return res.status(200).json({
          success: false,
          error: '此手機已註冊，請直接登入',
        });
      }

      const createRes = await airtableFetch(MEMBERS_TABLE_ID, {
        method: 'POST',
        body: JSON.stringify({
          records: [
            {
              fields: {
                姓名: name,
                手機: phone,
                服務點數: 0,
                儲值金: 0,
              },
            },
          ],
        }),
      });

      const user = mapMember(createRes.records[0]);
      return res.status(200).json({ success: true, user });
    }

    // 4) 建立預約
    if (action === 'createBooking' && method === 'POST') {
      if (!BOOKINGS_TABLE_ID) {
        return res.status(500).json({
          success: false,
          error: '尚未設定 BOOKINGS_TABLE_ID，請到 Vercel 新增預約紀錄表的 Table ID',
        });
      }

      const {
        userId,
        userName,
        userPhone,
        companion,
        services,
        date,
        time,
      } = req.body || {};

      if (!userId || !companion || !services || !date || !time) {
        return res.status(400).json({
          success: false,
          error: '預約欄位不足，請確認陪伴員 / 服務 / 日期 / 時間',
        });
      }

      const fields = {
        會員ID: userId,
        姓名: userName || '',
        手機: userPhone || '',
        陪伴員: companion,
        服務項目: Array.isArray(services) ? services.join('、') : services,
        日期: date,
        時間: time,
        狀態: '待確認',
      };

      const createRes = await airtableFetch(BOOKINGS_TABLE_ID, {
        method: 'POST',
        body: JSON.stringify({
          records: [{ fields }],
        }),
      });

      const record = createRes.records[0];

      return res.status(200).json({
        success: true,
        bookingId: record.id,
      });
    }

    // 5) 取得會員的預約紀錄
    if (action === 'listBookings' && method === 'GET') {
      if (!BOOKINGS_TABLE_ID) {
        return res.status(500).json({
          success: false,
          error: '尚未設定 BOOKINGS_TABLE_ID，請到 Vercel 新增預約紀錄表的 Table ID',
        });
      }

      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ success: false, error: '缺少 userId' });
      }

      const filter = encodeURIComponent(`{會員ID}='${userId}'`);
      const data = await airtableFetch(
        `${BOOKINGS_TABLE_ID}?filterByFormula=${filter}&sort[0][field]=日期&sort[0][direction]=asc`
      );

      const bookings =
        data.records?.map((r) => {
          const f = r.fields || {};
          return {
            id: r.id,
            date: f['日期'] || '',
            time: f['時間'] || '',
            companion: f['陪伴員'] || '',
            services: f['服務項目'] || '',
            status: f['狀態'] || '',
          };
        }) || [];

      return res.status(200).json({ success: true, bookings });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
}

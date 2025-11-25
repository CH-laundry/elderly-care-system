// pages/api/auth/register.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, password } = req.body;

  if (!name || !phone || !password) {
    return res.status(400).json({ error: '請填寫所有欄位' });
  }

  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const membersTableId = process.env.MEMBERS_TABLE_ID;

  if (!apiKey || !baseId || !membersTableId) {
    console.error('Airtable env missing', {
      apiKey: !!apiKey,
      baseId: !!baseId,
      membersTableId: !!membersTableId,
    });
    return res.status(500).json({ error: '系統設定錯誤，請聯絡管理者' });
  }

  const baseUrl = `https://api.airtable.com/v0/${baseId}/${membersTableId}`;

  try {
    // 1) 先檢查手機是否已註冊
    const filterFormula = `SEARCH('${phone}','{電話}')`;
    const checkResp = await fetch(
      `${baseUrl}?filterByFormula=${encodeURIComponent(filterFormula)}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const checkData = await checkResp.json();

    if (checkData.records && checkData.records.length > 0) {
      return res.status(400).json({ error: '此手機號碼已經註冊過了' });
    }

    // 2) 建立新會員
    const createResp = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              電話: phone,
              姓名: name,
              密碼: password,
              儲值金: 0,
              點數: 0,
            },
          },
        ],
      }),
    });

    const createData = await createResp.json();

    if (!createResp.ok) {
      console.error('Airtable create error', createData);
      return res.status(500).json({ error: '註冊失敗，請稍後再試' });
    }

    const fields = createData.records[0].fields;

    return res.status(200).json({
      success: true,
      member: {
        Phone: fields.電話,
        Name: fields.姓名,
        Balance: fields.儲值金 || 0,
        Points: fields.點數 || 0,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: '註冊失敗，請稍後再試' });
  }
}

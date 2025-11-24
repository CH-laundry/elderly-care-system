export default async function handler(req, res) {
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const BASE_ID = process.env.AIRTABLE_BASE_ID;
  const MEMBERS_TABLE_ID = process.env.MEMBERS_TABLE_ID || 'tbluG6fc6DYXov4AJ';
  
  const { action } = req.query;
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 載入系統設定
    if (action === 'getSettings') {
      const response = await fetch(
        `https://api.airtable.com/v0/${BASE_ID}/系統設定`,
        {
          headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`
          }
        }
      );
      
      const data = await response.json();
      
      const settings = {
        brandName: '享老生活',
        systemTitle: '會員服務系統',
        staffTitle: '陪伴員',
        companions: [],
        services: []
      };
      
      if (data.records) {
        data.records.forEach(record => {
          const key = record.fields['設定名稱'];
          const value = record.fields['設定值'];
          
          if (key === '品牌名稱') settings.brandName = value;
          else if (key === '系統標題') settings.systemTitle = value;
          else if (key === '服務人員稱呼') settings.staffTitle = value;
          else if (key && key.startsWith('陪伴員-')) settings.companions.push(value);
          else if (key && key.startsWith('服務-')) settings.services.push(value);
        });
      }
      
      return res.status(200).json({ settings });
    }
    
    // 登入
    if (action === 'login' && req.method === 'POST') {
      const { phone } = req.body;
      
      const response = await fetch(
        `https://api.airtable.com/v0/${BASE_ID}/${MEMBERS_TABLE_ID}`,
        {
          headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`
          }
        }
      );
      
      const data = await response.json();
      
      if (!data.records || data.records.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: '資料庫中沒有會員資料' 
        });
      }
      
      // 找到符合電話的會員
      const memberRecord = data.records.find(record => {
        const fields = record.fields;
        const firstFieldValue = Object.values(fields)[0];
        if (!firstFieldValue) return false;
        
        const cleanPhone = String(firstFieldValue).replace(/[\s\(\)\-:]/g, '');
        const inputClean = phone.replace(/[\s\(\)\-:]/g, '');
        
        return cleanPhone === inputClean;
      });
      
      if (memberRecord) {
        const fields = memberRecord.fields;
        const allFields = Object.entries(fields);
        
        const name = allFields.find(([key]) => 
          key.includes('姓名') || key.includes('name') || key.includes('Name')
        )?.[1] || allFields[2]?.[1] || '會員';
        
        const points = allFields.find(([key]) => 
          key.includes('點數') || key.includes('point')
        )?.[1] || 0;
        
        const balance = allFields.find(([key]) => 
          key.includes('儲值') || key.includes('balance')
        )?.[1] || 0;
        
        const cleanBalance = typeof balance === 'string' ? 
          parseInt(balance.replace(/[^\d]/g, '')) || 0 : balance;
        
        return res.status(200).json({
          success: true,
          user: {
            id: memberRecord.id,
            phone: phone,
            name: String(name),
            points: typeof points === 'number' ? points : parseInt(points) || 0,
            balance: cleanBalance
          }
        });
      } else {
        return res.status(404).json({ 
          success: false, 
          error: `找不到電話 ${phone} 的會員資料` 
        });
      }
    }
    
    // 建立預約
    if (action === 'createBooking' && req.method === 'POST') {
      const { userId, companion, services, date, time } = req.body;
      
      const response = await fetch(
        `https://api.airtable.com/v0/${BASE_ID}/預約記錄`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fields: {
              '會員電話': [userId],
              '預約日期': date,
              '服務時間': time,
              '服務項目': services.join(', '),
              '陪伴員': companion,
              '預約狀態': '已預約'
            }
          })
        }
      );
      
      if (response.ok) {
        return res.status(200).json({ success: true });
      } else {
        const error = await response.json();
        return res.status(500).json({ success: false, error: error.error });
      }
    }
    
    return res.status(400).json({ error: 'Invalid action' });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Server error' 
    });
  }
}

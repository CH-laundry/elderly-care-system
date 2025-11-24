// pages/api/auth/register.js
import { getMemberByPhone, createMember } from '../../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, password } = req.body;

  if (!name || !phone || !password) {
    return res.status(400).json({ error: '請填寫所有欄位' });
  }

  try {
    // 檢查手機號碼是否已註冊
    const existing = await getMemberByPhone(phone);
    if (existing) {
      return res.status(400).json({ error: '此手機號碼已經註冊過了' });
    }

    // 建立新會員
    const member = await createMember({
      name,
      phone,
      password,
    });

    return res.status(200).json({
      success: true,
      member: {
        Phone: member.Phone,
        Name: member.Name,
        Balance: member.Balance,
        Points: member.Points,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: '註冊失敗，請稍後再試' });
  }
}

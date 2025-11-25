// pages/api/auth/login.js
import { getMemberByPhone } from '../../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ error: '請輸入手機號碼和密碼' });
  }

  try {
    // 從 Airtable 查詢會員
    const member = await getMemberByPhone(phone);

    if (!member) {
      return res.status(401).json({ error: '手機號碼或密碼錯誤' });
    }

    // 驗證密碼
    if (member.Password !== password) {
      return res.status(401).json({ error: '手機號碼或密碼錯誤' });
    }

    // 登入成功
    return res.status(200).json({
      success: true,
      member: {
        Phone: member.Phone,
        Name: member.Name,
        Balance: member.Balance || 0,
        Points: member.Points || 0,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: '登入失敗，請稍後再試' });
  }
}

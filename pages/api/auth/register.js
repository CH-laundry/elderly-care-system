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
    // 1️⃣ 先看這支手機有沒有註冊過
    const existing = await getMemberByPhone(phone);
    if (existing) {
      return res
        .status(400)
        .json({ error: '此手機號碼已註冊，請直接登入' });
    }

    // 2️⃣ 建立新會員（寫進 Airtable 的 Members 表）
    const member = await createMember({
      name,
      phone,
      password, // 目前先純文字，有需要之後再加密
    });

    // 3️⃣ 回傳給前端
    return res.status(200).json({
      success: true,
      member: {
        Phone: member.Phone,
        Name: member.Name,
        Balance: member.Balance ?? 0,
        Points: member.Points ?? 0,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res
      .status(500)
      .json({ error: '註冊失敗，請稍後再試' });
  }
}

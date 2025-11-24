// pages/api/members/update.js
import { getMemberByPhone, updateMember } from '../../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, name, password, newPassword } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ error: '請提供手機號碼和密碼' });
  }

  try {
    const member = await getMemberByPhone(phone);

    if (!member) {
      return res.status(404).json({ error: '找不到會員資料' });
    }

    // 驗證密碼
    if (member.Password !== password) {
      return res.status(401).json({ error: '密碼錯誤' });
    }

    // 準備更新的資料
    const updates = {};
    
    if (name && name !== member.Name) {
      updates.Name = name;
    }

    if (newPassword) {
      updates.Password = newPassword;
    }

    // 如果有要更新的資料
    if (Object.keys(updates).length > 0) {
      await updateMember(member.id, updates);
    }

    return res.status(200).json({
      success: true,
      message: '資料更新成功',
    });
  } catch (error) {
    console.error('Update member error:', error);
    return res.status(500).json({ error: '更新失敗' });
  }
}

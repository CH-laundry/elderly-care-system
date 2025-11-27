// pages/api/admin/members.js
import { getAllMembers } from '../../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const members = await getAllMembers();
    return res.status(200).json({ success: true, members });
  } catch (err) {
    console.error('admin/members error:', err);
    return res.status(500).json({ error: '取得會員資料失敗' });
  }
}

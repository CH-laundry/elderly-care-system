// pages/api/admin/transactions.js
import { getAllTransactions } from '../../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const transactions = await getAllTransactions();
    return res.status(200).json({ success: true, transactions });
  } catch (err) {
    console.error('admin/transactions error:', err);
    return res.status(500).json({ error: '取得儲值／消費紀錄失敗' });
  }
}

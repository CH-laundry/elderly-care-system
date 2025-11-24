// pages/api/admin/update-balance.js
import { updateMember, createTransaction, getMemberByPhone } from '../../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, recordId, balance, points, note } = req.body;

  if (!phone || !recordId) {
    return res.status(400).json({ error: '缺少必要資料' });
  }

  try {
    // 取得舊資料用於計算差額
    const oldMember = await getMemberByPhone(phone);
    
    if (!oldMember) {
      return res.status(404).json({ error: '找不到客戶' });
    }

    const oldBalance = oldMember.Balance || 0;
    const oldPoints = oldMember.Points || 0;
    const balanceDiff = balance - oldBalance;
    const pointsDiff = points - oldPoints;

    // 更新會員資料
    await updateMember(recordId, {
      Balance: balance,
      Points: points,
    });

    // 如果有餘額變動，建立交易記錄
    if (balanceDiff !== 0) {
      await createTransaction({
        phone,
        type: balanceDiff > 0 ? '儲值' : '調整',
        amount: balanceDiff,
        note: note || `管理者調整儲值金：${balanceDiff > 0 ? '+' : ''}${balanceDiff}`,
        operator: '管理者',
      });
    }

    // 如果有點數變動，建立交易記錄
    if (pointsDiff !== 0) {
      await createTransaction({
        phone,
        type: '調整',
        amount: pointsDiff,
        note: note || `管理者調整點數：${pointsDiff > 0 ? '+' : ''}${pointsDiff}`,
        operator: '管理者',
      });
    }

    return res.status(200).json({
      success: true,
      message: '更新成功',
    });
  } catch (error) {
    console.error('Update balance error:', error);
    return res.status(500).json({ error: '更新失敗' });
  }
}

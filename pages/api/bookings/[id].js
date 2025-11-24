// pages/api/bookings/[id].js
import { updateBooking } from '../../../lib/airtable';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ error: '缺少 id' });
    return;
  }

  if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const { fields } = req.body || {};
      if (!fields) {
        res.status(400).json({ error: '缺少 fields' });
        return;
      }

      const record = await updateBooking(id, fields);
      res.status(200).json(record);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: '更新紀錄失敗' });
    }
    return;
  }

  res.setHeader('Allow', 'PUT, PATCH');
  res.status(405).end('Method Not Allowed');
}

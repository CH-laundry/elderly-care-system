// pages/api/bookings/index.js
import { listBookings, createBooking } from '../../../lib/airtable';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const records = await listBookings();
      res.status(200).json({ records });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: '取得資料失敗' });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const { name, phone, serviceType, notes, amount } = req.body || {};

      if (!name || !phone) {
        res.status(400).json({ error: '姓名與手機為必填' });
        return;
      }

      const now = new Date().toISOString();

      const fields = {
        Name: name,
        Phone: phone,
        ServiceType: serviceType || '',
        Notes: notes || '',
        Amount: amount ? Number(amount) : null,
        Balance: 0,
        Points: 0,
        CreatedAt: now,
      };

      const record = await createBooking(fields);
      res.status(201).json(record);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: '建立紀錄失敗' });
    }
    return;
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).end('Method Not Allowed');
}

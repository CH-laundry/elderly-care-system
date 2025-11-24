// lib/airtable.js
const API_KEY = process.env.AIRTABLE_API_KEY;
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const BOOKINGS_TABLE_ID = process.env.BOOKINGS_TABLE_ID;

if (!API_KEY || !BASE_ID || !BOOKINGS_TABLE_ID) {
  console.warn(
    '⚠ Airtable 環境變數缺少：請確認 AIRTABLE_API_KEY, AIRTABLE_BASE_ID, BOOKINGS_TABLE_ID 都有設定'
  );
}

const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}/${BOOKINGS_TABLE_ID}`;

async function airtableRequest(path = '', options = {}) {
  const url = path ? `${BASE_URL}/${path}` : BASE_URL;

  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Airtable API 錯誤:', res.status, text);
    throw new Error(`Airtable API Error ${res.status}`);
  }

  return res.json();
}

// 取得全部紀錄
export async function listBookings() {
  const data = await airtableRequest('', {
    method: 'GET',
  });
  return data.records || [];
}

// 新增一筆紀錄（註冊 / 消費）
export async function createBooking(fields) {
  const data = await airtableRequest('', {
    method: 'POST',
    body: JSON.stringify({ fields }),
  });
  return data;
}

// 更新某筆紀錄
export async function updateBooking(id, fields) {
  const data = await airtableRequest(id, {
    method: 'PATCH',
    body: JSON.stringify({ fields }),
  });
  return data;
}

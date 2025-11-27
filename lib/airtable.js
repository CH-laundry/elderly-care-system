// lib/airtable.js
// Airtable 連接工具（乾淨版）

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const MEMBERS_TABLE_ID = process.env.MEMBERS_TABLE_ID;
const BOOKINGS_TABLE_ID = process.env.BOOKINGS_TABLE_ID;
const TRANSACTIONS_TABLE_ID = process.env.TRANSACTIONS_TABLE_ID;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('❌ Airtable 環境變數缺少 AIRTABLE_API_KEY 或 AIRTABLE_BASE_ID');
}

const BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

const baseHeaders = {
  Authorization: `Bearer ${AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json',
};

// 共用小工具：包一層 fetch，方便除錯
async function airtableFetch(path, options = {}) {
  const url = `${BASE_URL}/${path}`;
  const headers = { ...baseHeaders, ...(options.headers || {}) };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const text = await res.text();
    console.error('❌ Airtable Error:', res.status, text);
    throw new Error(`Airtable request failed: ${res.status}`);
  }

  return res.json();
}

// ------------- 會員相關 -------------

// 依手機號碼找會員（Phone / 電話 都支援）
export async function getMemberByPhone(phone) {
  try {
    // 先抓整張表，再在程式裡面過濾，避免欄位名稱不一致
    const data = await airtableFetch(MEMBERS_TABLE_ID);

    if (!data.records || data.records.length === 0) return null;

    const record = data.records.find((r) => {
      const f = r.fields || {};
      return f.Phone === phone || f['電話'] === phone;
    });

    if (!record) return null;

    const f = record.fields || {};
    const name = f.Name || f['姓名'] || '';
    const phoneField = f.Phone || f['電話'] || '';
    const balance = f.Balance ?? f['儲值金'] ?? 0;
    const points = f.Points ?? f['點數'] ?? 0;
    const password = f.Password || f['密碼'] || '';

    return {
      id: record.id,

      // 後端／舊程式常用的大寫 key
      Name: name,
      Phone: phoneField,
      Balance: balance,
      Points: points,
      Password: password,

      // 方便前端使用的小寫版本
      name,
      phone: phoneField,
      balance,
      points,
      password,

      rawFields: f,
    };
  } catch (err) {
    console.error('getMemberByPhone error:', err);
    return null;
  }
}

// 建立新會員（給前台註冊用）
export async function createMember(memberData) {
  try {
    const body = {
      fields: {
        // 這裡一律寫入英文字欄位，Airtable 裡如果還有中文欄位就當備用
        Phone: memberData.phone,
        Name: memberData.name,
        Password: memberData.password,
        Balance: 0,
        Points: 0,
      },
    };

    const data = await airtableFetch(MEMBERS_TABLE_ID, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return { id: data.id, ...(data.fields || {}) };
  } catch (err) {
    console.error('createMember error:', err);
    throw err;
  }
}

// 更新會員資料（儲值 / 扣款 / 修改姓名… 都用這個）
export async function updateMember(recordId, updates) {
  try {
    const body = { fields: updates };

    const data = await airtableFetch(`${MEMBERS_TABLE_ID}/${recordId}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });

    return { id: data.id, ...(data.fields || {}) };
  } catch (err) {
    console.error('updateMember error:', err);
    throw err;
  }
}

// 後台用：取得所有會員列表
export async function getAllMembers() {
  try {
    const data = await airtableFetch(MEMBERS_TABLE_ID);

    if (!data.records) return [];

    return data.records.map((r) => {
      const f = r.fields || {};

      const name = f.Name || f['姓名'] || '';
      const phone = f.Phone || f['電話'] || '';
      const balance = f.Balance ?? f['儲值金'] ?? 0;
      const points = f.Points ?? f['點數'] ?? 0;

      // 這裡刻意同時回傳「大寫 key」跟「小寫 key」
      // 讓以前寫好的 API / 前端都可以吃
      return {
        id: r.id,

        // 給目前後台頁面使用的欄位
        Name: name,
        Phone: phone,
        Balance: balance,
        Points: points,

        // 也給小寫，避免之後你改前端比較好寫
        name,
        phone,
        balance,
        points,

        rawFields: f,
      };
    });
  } catch (err) {
    console.error('getAllMembers error:', err);
    return [];
  }
}

// ------------- 預約相關 -------------

// 建立預約
export async function createBooking(bookingData) {
  try {
    const body = {
      fields: {
        Name: bookingData.name,
        Phone: bookingData.phone,
        ServiceType:
          bookingData.serviceType ||
          bookingData['服務類型'] ||
          bookingData['服務項目'] ||
          '',
        Notes: bookingData.notes || '',
        Date: bookingData.date,
        Time: bookingData.time,
        Status: bookingData.status || '待確認',
      },
    };

    const data = await airtableFetch(BOOKINGS_TABLE_ID, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return { id: data.id, ...(data.fields || {}) };
  } catch (err) {
    console.error('createBooking error:', err);
    throw err;
  }
}

// 依手機取得該會員所有預約
export async function getBookingsByPhone(phone) {
  try {
    const url = `${BOOKINGS_TABLE_ID}?filterByFormula={Phone}='${phone}'&sort[0][field]=CreatedAt&sort[0][direction]=desc`;
    const data = await airtableFetch(url);

    return data.records.map((r) => ({ id: r.id, ...(r.fields || {}) }));
  } catch (err) {
    console.error('getBookingsByPhone error:', err);
    return [];
  }
}

// 後台用：取得所有預約
export async function getAllBookings() {
  try {
    const url = `${BOOKINGS_TABLE_ID}?sort[0][field]=CreatedAt&sort[0][direction]=desc`;
    const data = await airtableFetch(url);

    if (!data.records) return [];

    return data.records.map((r) => {
      const f = r.fields || {};

      const name = f.Name || f['姓名'] || '';
      const phone = f.Phone || f['電話'] || '';
      const date = f.Date || f['預約日期'] || '';
      const time = f.Time || f['預約時間'] || '';
      const serviceType =
        f.ServiceType || f['服務類型'] || f['服務項目'] || '';
      const status = f.Status || f['狀態'] || '';
      const note = f.Notes || f.Note || f['備註'] || '';

      return {
        id: r.id,
        name,
        phone,
        date,
        time,
        serviceType,
        status,
        note,
        rawFields: f,
      };
    });
  } catch (err) {
    console.error('getAllBookings error:', err);
    return [];
  }
}

// ------------- 交易 / 儲值金相關 -------------

// 建立交易記錄（儲值 / 消費 / 調整…）
export async function createTransaction(transactionData) {
  try {
    const body = {
      fields: {
        Phone: transactionData.phone,
        Type: transactionData.type, // 儲值 / 消費 / 調整 / 預約
        Amount: transactionData.amount,
        Note: transactionData.note || '',
        Operator: transactionData.operator || '系統',
      },
    };

    const data = await airtableFetch(TRANSACTIONS_TABLE_ID, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return { id: data.id, ...(data.fields || {}) };
  } catch (err) {
    console.error('createTransaction error:', err);
    throw err;
  }
}

// 依手機取得某會員的所有交易
export async function getTransactionsByPhone(phone) {
  try {
    const url = `${TRANSACTIONS_TABLE_ID}?filterByFormula={Phone}='${phone}'&sort[0][field]=CreatedAt&sort[0][direction]=desc`;
    const data = await airtableFetch(url);

    return data.records.map((r) => ({ id: r.id, ...(r.fields || {}) }));
  } catch (err) {
    console.error('getTransactionsByPhone error:', err);
    return [];
  }
}

// 後台報表用：取得所有交易紀錄
// 回傳格式刻意對齊你 transactions 頁面正在用的欄位：Type / Phone / Note / Amount / Operator / CreatedAt
export async function getAllTransactions() {
  try {
    const url = `${TRANSACTIONS_TABLE_ID}?sort[0][field]=CreatedAt&sort[0][direction]=desc`;
    const data = await airtableFetch(url);

    if (!data.records) return [];

    return data.records.map((r) => {
      const f = r.fields || {};

      const type = f.Type || f['類型'] || f['交易類型'] || '';
      const phone = f.Phone || f['電話'] || '';
      const note = f.Note || f['備註'] || '';
      const amount = f.Amount ?? f['金額'] ?? 0;
      const operator = f.Operator || f['經手人'] || '';
      const createdAt =
        f.CreatedAt || f['日期'] || f['時間'] || r.createdTime;

      return {
        id: r.id,
        Type: type,
        Phone: phone,
        Note: note,
        Amount: amount,
        Operator: operator,
        CreatedAt: createdAt,
      };
    });
  } catch (err) {
    console.error('getAllTransactions error:', err);
    return [];
  }
}

// ------------- default export（避免舊程式壞掉） -------------

const airtableClient = {
  getMemberByPhone,
  createMember,
  updateMember,
  getAllMembers,
  createBooking,
  getBookingsByPhone,
  getAllBookings,
  createTransaction,
  getTransactionsByPhone,
  getAllTransactions,
};

export default airtableClient;

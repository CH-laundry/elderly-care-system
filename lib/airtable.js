// lib/airtable.js
// Airtable 連接工具（會員 / 預約 / 消費紀錄）
// ✅ 整合版：避免重複宣告、錯誤變數、函式互相覆蓋

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const MEMBERS_TABLE_ID = process.env.MEMBERS_TABLE_ID;
const BOOKINGS_TABLE_ID = process.env.BOOKINGS_TABLE_ID;
const TRANSACTIONS_TABLE_ID = process.env.TRANSACTIONS_TABLE_ID;

const BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

const headers = {
  Authorization: `Bearer ${AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json',
};

// 共用錯誤處理
function handleAirtableError(res, data) {
  if (!res.ok) {
    console.error('Airtable error:', data);
    throw new Error(data?.error?.message || 'Airtable request failed');
  }
}

// 共用欄位安全取得（支援多種欄位名稱）
function safeGetField(fields, names) {
  for (const name of names) {
    if (fields[name] !== undefined && fields[name] !== null && fields[name] !== '') {
      return fields[name];
    }
  }
  return '';
}

//-------------------------
// 會員相關
//-------------------------

// 依手機取得單一會員（登入 / 會員中心）
export async function getMemberByPhone(phone) {
  if (!MEMBERS_TABLE_ID) {
    console.error('MEMBERS_TABLE_ID 未設定');
    return null;
  }

  const filter = encodeURIComponent(
    `OR({Phone} = '${phone}', {電話} = '${phone}', {手機} = '${phone}')`
  );

  const res = await fetch(
    `${BASE_URL}/${MEMBERS_TABLE_ID}?filterByFormula=${filter}`,
    { headers }
  );

  const data = await res.json();
  handleAirtableError(res, data);

  if (!data.records || data.records.length === 0) return null;

  const record = data.records[0];
  const f = record.fields || {};

  return {
    id: record.id,
    phone: safeGetField(f, ['Phone', '電話', '手機']),
    name: safeGetField(f, ['Name', '姓名']),
    email: safeGetField(f, ['Email', '電子郵件']),
    address: safeGetField(f, ['Address', '地址']),
    points: Number(safeGetField(f, ['Points', '點數']) || 0),
    balance: Number(safeGetField(f, ['Balance', '儲值金', '儲值金額']) || 0),
    level: safeGetField(f, ['Level', '會員等級']) || '一般會員',
    remark: safeGetField(f, ['Remark', '備註']),
    rawFields: f,
  };
}

// 新增會員
export async function createMember({ name, phone, email, address }) {
  if (!MEMBERS_TABLE_ID) throw new Error('MEMBERS_TABLE_ID 未設定');

  const body = {
    fields: {
      Name: name,
      Phone: phone,
      Email: email || '',
      Address: address || '',
    },
  };

  const res = await fetch(`${BASE_URL}/${MEMBERS_TABLE_ID}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json();
  handleAirtableError(res, data);
  return { id: data.id, ...data.fields };
}

// 更新會員
export async function updateMember(memberId, fieldsToUpdate) {
  if (!MEMBERS_TABLE_ID) throw new Error('MEMBERS_TABLE_ID 未設定');

  const body = {
    fields: {
      ...fieldsToUpdate,
    },
  };

  const res = await fetch(`${BASE_URL}/${MEMBERS_TABLE_ID}/${memberId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json();
  handleAirtableError(res, data);
  return { id: data.id, ...data.fields };
}

// 取得所有會員（後台報表用：已整理欄位）
export async function getAllMembers() {
  if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY || !MEMBERS_TABLE_ID) {
    console.error('環境變數未設定完整 (會員)');
    return [];
  }

  let records = [];
  let offset;

  try {
    do {
      const url = new URL(`${BASE_URL}/${MEMBERS_TABLE_ID}`);
      const params = url.searchParams;
      params.set('pageSize', '100');
      if (offset) params.set('offset', offset);

      const res = await fetch(url.toString(), { headers });
      const data = await res.json();
      handleAirtableError(res, data);

      records = records.concat(data.records || []);
      offset = data.offset;
    } while (offset);

    return records.map((record) => {
      const f = record.fields || {};

      const phone = safeGetField(f, ['Phone', '電話', '手機']);
      const name = safeGetField(f, ['Name', '姓名']);
      const points = Number(
        safeGetField(f, ['Points', '點數', '點數累積']) || 0
      );
      const balance = Number(
        safeGetField(f, ['Balance', '儲值金', '儲值金額']) || 0
      );

      return {
        id: record.id,
        phone,
        name,
        points,
        balance,
        rawFields: f,
      };
    });
  } catch (err) {
    console.error('getAllMembers error:', err);
    throw err;
  }
}

//-------------------------
// 預約相關
//-------------------------

// 新增預約
export async function createBooking(bookingData) {
  if (!BOOKINGS_TABLE_ID) throw new Error('BOOKINGS_TABLE_ID 未設定');

  const body = {
    fields: {
      ...bookingData,
    },
  };

  const res = await fetch(`${BASE_URL}/${BOOKINGS_TABLE_ID}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json();
  handleAirtableError(res, data);
  return { id: data.id, ...data.fields };
}

// 依手機取得該會員所有預約（會員前台用，回傳原始欄位）
export async function getBookingsByPhone(phone) {
  if (!BOOKINGS_TABLE_ID) {
    console.error('BOOKINGS_TABLE_ID 未設定');
    return [];
  }

  const filter = encodeURIComponent(
    `OR({Phone} = '${phone}', {電話} = '${phone}', {手機} = '${phone}')`
  );

  const res = await fetch(
    `${BASE_URL}/${BOOKINGS_TABLE_ID}?filterByFormula=${filter}`,
    { headers }
  );

  const data = await res.json();
  handleAirtableError(res, data);

  return (data.records || []).map((r) => ({
    id: r.id,
    ...r.fields,
  }));
}

// 取得所有預約（後台用：含排序 & 轉成統一欄位）
export async function getAllBookings() {
  if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY || !BOOKINGS_TABLE_ID) {
    console.error('環境變數未設定完整 (預約)');
    return [];
  }

  let records = [];
  let offset;

  try {
    do {
      const url = new URL(`${BASE_URL}/${BOOKINGS_TABLE_ID}`);
      const params = url.searchParams;
      params.set('pageSize', '100');
      // 先依日期，再依時間排序，方便後台看
      params.set('sort[0][field]', 'Date');
      params.set('sort[0][direction]', 'asc');
      params.set('sort[1][field]', 'Time');
      params.set('sort[1][direction]', 'asc');
      if (offset) params.set('offset', offset);

      const res = await fetch(url.toString(), { headers });
      const data = await res.json();
      handleAirtableError(res, data);

      records = records.concat(data.records || []);
      offset = data.offset;
    } while (offset);

    return records.map((record) => {
      const f = record.fields || {};

      const phone = safeGetField(f, ['Phone', '電話', '手機']);
      const name = safeGetField(f, ['Name', '姓名', '客戶名稱']);
      const date = safeGetField(f, ['Date', '日期']);
      const time = safeGetField(f, ['Time', '時間']);
      const serviceType = safeGetField(f, ['ServiceType', '服務內容', '服務項目']);
      const status = safeGetField(f, ['Status', '狀態']);
      const note = safeGetField(f, ['Note', '備註']);

      return {
        id: record.id,
        phone,
        name,
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
    throw err;
  }
}

//-------------------------
// 消費紀錄 / 交易（Transactions）
//-------------------------

// 新增一筆交易紀錄（儲值 / 消費 / 調整）
export async function createTransaction(transactionData) {
  if (!TRANSACTIONS_TABLE_ID) throw new Error('TRANSACTIONS_TABLE_ID 未設定');

  const body = {
    fields: {
      ...transactionData,
    },
  };

  const res = await fetch(`${BASE_URL}/${TRANSACTIONS_TABLE_ID}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json();
  handleAirtableError(res, data);
  return { id: data.id, ...data.fields };
}

// 依手機取得該會員所有交易（會員前台用，回傳原始欄位）
export async function getTransactionsByPhone(phone) {
  if (!TRANSACTIONS_TABLE_ID) {
    console.error('TRANSACTIONS_TABLE_ID 未設定');
    return [];
  }

  const filter = encodeURIComponent(
    `OR({Phone} = '${phone}', {電話} = '${phone}', {手機} = '${phone}')`
  );

  const res = await fetch(
    `${BASE_URL}/${TRANSACTIONS_TABLE_ID}?filterByFormula=${filter}`,
    { headers }
  );

  const data = await res.json();
  handleAirtableError(res, data);

  return (data.records || []).map((r) => ({
    id: r.id,
    ...r.fields,
  }));
}

// 取得所有交易（後台報表用：整理過欄位 + 排序）
export async function getAllTransactions() {
  if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY || !TRANSACTIONS_TABLE_ID) {
    console.error('環境變數未設定完整 (交易)');
    return [];
  }

  let records = [];
  let offset;

  try {
    do {
      const url = new URL(`${BASE_URL}/${TRANSACTIONS_TABLE_ID}`);
      const params = url.searchParams;
      params.set('pageSize', '100');
      // 依建立時間由新到舊
      params.set('sort[0][field]', 'CreatedAt');
      params.set('sort[0][direction]', 'desc');
      if (offset) params.set('offset', offset);

      const res = await fetch(url.toString(), { headers });
      const data = await res.json();
      handleAirtableError(res, data);

      records = records.concat(data.records || []);
      offset = data.offset;
    } while (offset);

    return records.map((record) => {
      const f = record.fields || {};

      const phone = safeGetField(f, ['Phone', '電話', '手機']);
      const name = safeGetField(f, ['Name', '姓名', '客戶名稱']);
      const type = safeGetField(f, ['Type', '交易類型', '類型']);
      const amount = Number(safeGetField(f, ['Amount', '金額']) || 0);
      const note = safeGetField(f, ['Note', '備註']);
      const operator = safeGetField(f, ['Operator', '操作人員', '經辦']);
      const createdAt = f['CreatedAt'] || record.createdTime;

      return {
        id: record.id,
        phone,
        name,
        type,
        amount,
        note,
        operator,
        createdAt,
        rawFields: f,
      };
    });
  } catch (err) {
    console.error('getAllTransactions error:', err);
    throw err;
  }
}

// lib/airtable.js
// Airtable 連接與資料操作（會員 / 預約 / 交易）

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const MEMBERS_TABLE_ID = process.env.MEMBERS_TABLE_ID;
const BOOKINGS_TABLE_ID = process.env.BOOKINGS_TABLE_ID;
const TRANSACTIONS_TABLE_ID = process.env.TRANSACTIONS_TABLE_ID;

const BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

const headers = {
  Authorization: `Bearer ${AIRTABLE_API_KEY}`,
  "Content-Type": "application/json",
};

function assertEnv(tableId, name) {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !tableId) {
    console.error(
      `[Airtable] 缺少環境變數：AIRTABLE_API_KEY / AIRTABLE_BASE_ID / ${name}`
    );
    return false;
  }
  return true;
}

async function airtableGet(tableId, params = {}) {
  if (!assertEnv(tableId, "TABLE_ID")) return [];

  const url = new URL(`${BASE_URL}/${tableId}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.append(key, value);
    }
  });

  const res = await fetch(url.toString(), { headers });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("[Airtable] GET 失敗", res.status, text);
    throw new Error(`Airtable GET failed: ${res.status}`);
  }

  const data = await res.json();
  return data.records || [];
}

async function airtableCreate(tableId, fields) {
  if (!assertEnv(tableId, "TABLE_ID")) return null;

  const res = await fetch(`${BASE_URL}/${tableId}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ fields }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("[Airtable] CREATE 失敗", res.status, text);
    throw new Error(`Airtable CREATE failed: ${res.status}`);
  }

  const data = await res.json();
  return data;
}

/* ========= 會員相關 ========= */

export async function createMember({
  name,
  phone,
  birthday,
  gender,
  address,
  emergencyContactName,
  emergencyContactPhone,
  note,
  balance = 0,
  points = 0,
}) {
  try {
    const fields = {
      Name: name,
      Phone: phone,
      Birthday: birthday || "",
      Gender: gender || "",
      Address: address || "",
      EmergencyContactName: emergencyContactName || "",
      EmergencyContactPhone: emergencyContactPhone || "",
      Note: note || "",
      Balance: balance,
      Points: points,
      CreatedAt: new Date().toISOString(),
    };

    const rec = await airtableCreate(MEMBERS_TABLE_ID, fields);
    return {
      id: rec.id,
      ...rec.fields,
    };
  } catch (err) {
    console.error("createMember error:", err);
    throw err;
  }
}

export async function getMemberByPhone(phone) {
  try {
    const filterByFormula = `Phone='${String(phone).replace(/'/g, "\\'")}'`;
    const records = await airtableGet(MEMBERS_TABLE_ID, {
      filterByFormula,
      maxRecords: 1,
    });

    if (!records.length) return null;

    const r = records[0];
    return {
      id: r.id,
      ...r.fields,
    };
  } catch (err) {
    console.error("getMemberByPhone error:", err);
    throw err;
  }
}

export async function getAllMembers() {
  try {
    const records = await airtableGet(MEMBERS_TABLE_ID, {
      pageSize: 100,
    });

    return records.map((r) => {
      const {
        Name = "",
        Phone = "",
        Birthday = "",
        Gender = "",
        Address = "",
        EmergencyContactName = "",
        EmergencyContactPhone = "",
        Note = "",
        Balance = 0,
        Points = 0,
        CreatedAt = "",
      } = r.fields || {};

      return {
        id: r.id,
        Name,
        Phone,
        Birthday,
        Gender,
        Address,
        EmergencyContactName,
        EmergencyContactPhone,
        Note,
        Balance,
        Points,
        CreatedAt,
      };
    });
  } catch (err) {
    console.error("getAllMembers error:", err);
    return [];
  }
}

/* ========= 預約相關 ========= */

export async function createBooking({
  date,
  time,
  name,
  phone,
  serviceType,
  note,
  status = "預約中",
}) {
  try {
    const fields = {
      Date: date,
      Time: time,
      Name: name,
      Phone: phone,
      ServiceType: serviceType,
      Note: note || "",
      Status: status,
      CreatedAt: new Date().toISOString(),
    };

    const rec = await airtableCreate(BOOKINGS_TABLE_ID, fields);
    return {
      id: rec.id,
      ...rec.fields,
    };
  } catch (err) {
    console.error("createBooking error:", err);
    throw err;
  }
}

export async function getBookingsByPhone(phone) {
  try {
    const filterByFormula = `Phone='${String(phone).replace(/'/g, "\\'")}'`;
    const records = await airtableGet(BOOKINGS_TABLE_ID, {
      filterByFormula,
      pageSize: 100,
    });

    return records.map((r) => {
      const {
        Date = "",
        Time = "",
        Name = "",
        Phone = "",
        ServiceType = "",
        Note = "",
        Status = "",
        CreatedAt = "",
      } = r.fields || {};

      return {
        id: r.id,
        Date,
        Time,
        Name,
        Phone,
        ServiceType,
        Note,
        Status,
        CreatedAt,
      };
    });
  } catch (err) {
    console.error("getBookingsByPhone error:", err);
    return [];
  }
}

export async function getAllBookings() {
  try {
    const records = await airtableGet(BOOKINGS_TABLE_ID, {
      pageSize: 100,
    });

    return records.map((r) => {
      const {
        Date = "",
        Time = "",
        Name = "",
        Phone = "",
        ServiceType = "",
        Note = "",
        Status = "",
        CreatedAt = "",
      } = r.fields || {};

      return {
        id: r.id,
        Date,
        Time,
        Name,
        Phone,
        ServiceType,
        Note,
        Status,
        CreatedAt,
      };
    });
  } catch (err) {
    console.error("getAllBookings error:", err);
    return [];
  }
}

/* ========= 儲值 / 消費 / 交易相關 ========= */

export async function createTransaction({
  type,
  phone,
  amount,
  note,
  operator,
}) {
  try {
    const fields = {
      Type: type, // 儲值／消費／預約／調整
      Phone: phone,
      Amount: amount,
      Note: note || "",
      Operator: operator || "",
      CreatedAt: new Date().toISOString(),
    };

    const rec = await airtableCreate(TRANSACTIONS_TABLE_ID, fields);
    return {
      id: rec.id,
      ...rec.fields,
    };
  } catch (err) {
    console.error("createTransaction error:", err);
    throw err;
  }
}

export async function getAllTransactions({ type, phone } = {}) {
  try {
    let filterParts = [];
    if (type) {
      filterParts.push(`Type='${String(type).replace(/'/g, "\\'")}'`);
    }
    if (phone) {
      filterParts.push(`Phone='${String(phone).replace(/'/g, "\\'")}'`);
    }

    const filterByFormula =
      filterParts.length > 1
        ? `AND(${filterParts.join(",")})`
        : filterParts[0] || undefined;

    const records = await airtableGet(TRANSACTIONS_TABLE_ID, {
      filterByFormula,
      pageSize: 100,
    });

    return records.map((r) => {
      const {
        Type = "",
        Phone = "",
        Note = "",
        Amount = 0,
        Operator = "",
        CreatedAt = "",
      } = r.fields || {};

      return {
        id: r.id,
        Type,
        Phone,
        Note,
        Amount,
        Operator,
        CreatedAt,
      };
    });
  } catch (err) {
    console.error("getAllTransactions error:", err);
    return [];
  }
}

// 同時輸出一個預設物件，給 require() 使用
const airtableClient = {
  createMember,
  getMemberByPhone,
  getAllMembers,
  createBooking,
  getBookingsByPhone,
  getAllBookings,
  createTransaction,
  getAllTransactions,
};

export default airtableClient;

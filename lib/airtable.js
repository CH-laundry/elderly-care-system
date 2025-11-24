// lib/airtable.js
// Airtable 連接工具

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

// ========== 會員相關 ==========

// 透過手機號碼查詢會員
export async function getMemberByPhone(phone) {
  try {
    const url = `${BASE_URL}/${MEMBERS_TABLE_ID}?filterByFormula={Phone}='${phone}'`;
    const res = await fetch(url, { headers });
    const data = await res.json();
    
    if (data.records && data.records.length > 0) {
      return {
        id: data.records[0].id,
        ...data.records[0].fields,
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting member:', error);
    return null;
  }
}

// 建立新會員
export async function createMember(memberData) {
  try {
    const res = await fetch(`${BASE_URL}/${MEMBERS_TABLE_ID}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        fields: {
          Phone: memberData.phone,
          Name: memberData.name,
          Password: memberData.password,
          Balance: 0,
          Points: 0,
        },
      }),
    });
    const data = await res.json();
    return { id: data.id, ...data.fields };
  } catch (error) {
    console.error('Error creating member:', error);
    throw error;
  }
}

// 更新會員資料
export async function updateMember(recordId, updates) {
  try {
    const res = await fetch(`${BASE_URL}/${MEMBERS_TABLE_ID}/${recordId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ fields: updates }),
    });
    const data = await res.json();
    return { id: data.id, ...data.fields };
  } catch (error) {
    console.error('Error updating member:', error);
    throw error;
  }
}

// 取得所有會員
export async function getAllMembers() {
  try {
    const res = await fetch(`${BASE_URL}/${MEMBERS_TABLE_ID}`, { headers });
    const data = await res.json();
    return data.records.map(r => ({ id: r.id, ...r.fields }));
  } catch (error) {
    console.error('Error getting all members:', error);
    return [];
  }
}

// ========== 預約相關 ==========

// 建立預約
export async function createBooking(bookingData) {
  try {
    const res = await fetch(`${BASE_URL}/${BOOKINGS_TABLE_ID}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        fields: {
          Name: bookingData.name,
          Phone: bookingData.phone,
          ServiceType: bookingData.serviceType || '',
          Notes: bookingData.notes || '',
          Date: bookingData.date,
          Time: bookingData.time,
          Status: bookingData.status || '待確認',
        },
      }),
    });
    const data = await res.json();
    return { id: data.id, ...data.fields };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

// 取得會員的預約記錄
export async function getBookingsByPhone(phone) {
  try {
    const url = `${BASE_URL}/${BOOKINGS_TABLE_ID}?filterByFormula={Phone}='${phone}'&sort[0][field]=CreatedAt&sort[0][direction]=desc`;
    const res = await fetch(url, { headers });
    const data = await res.json();
    return data.records.map(r => ({ id: r.id, ...r.fields }));
  } catch (error) {
    console.error('Error getting bookings:', error);
    return [];
  }
}

// 取得所有預約
export async function getAllBookings() {
  try {
    const res = await fetch(`${BASE_URL}/${BOOKINGS_TABLE_ID}?sort[0][field]=CreatedAt&sort[0][direction]=desc`, { headers });
    const data = await res.json();
    return data.records.map(r => ({ id: r.id, ...r.fields }));
  } catch (error) {
    console.error('Error getting all bookings:', error);
    return [];
  }
}

// ========== 交易相關 ==========

// 建立交易記錄
export async function createTransaction(transactionData) {
  try {
    const res = await fetch(`${BASE_URL}/${TRANSACTIONS_TABLE_ID}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        fields: {
          Phone: transactionData.phone,
          Type: transactionData.type, // 儲值/消費/預約
          Amount: transactionData.amount,
          Note: transactionData.note || '',
          Operator: transactionData.operator || '系統',
        },
      }),
    });
    const data = await res.json();
    return { id: data.id, ...data.fields };
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
}

// 取得會員的交易記錄
export async function getTransactionsByPhone(phone) {
  try {
    const url = `${BASE_URL}/${TRANSACTIONS_TABLE_ID}?filterByFormula={Phone}='${phone}'&sort[0][field]=CreatedAt&sort[0][direction]=desc`;
    const res = await fetch(url, { headers });
    const data = await res.json();
    return data.records.map(r => ({ id: r.id, ...r.fields }));
  } catch (error) {
    console.error('Error getting transactions:', error);
    return [];
  }
}

// 取得所有交易記錄
export async function getAllTransactions() {
  try {
    const res = await fetch(`${BASE_URL}/${TRANSACTIONS_TABLE_ID}?sort[0][field]=CreatedAt&sort[0][direction]=desc`, { headers });
    const data = await res.json();
    return data.records.map(r => ({ id: r.id, ...r.fields }));
  } catch (error) {
    console.error('Error getting all transactions:', error);
    return [];
  }
}

// pages/api/bookings.js
// 會員預約 API：寫入 Airtable「預約紀錄」表

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { date, time, serviceType, attendant, notes, phone } = req.body || {};

    // 基本檢查
    if (!date || !time || !serviceType) {
      return res.status(400).json({
        error: "請填寫完整的預約日期、時間與服務類型。",
      });
    }

    if (!phone) {
      return res.status(400).json({
        error: "找不到會員手機，請先重新登入後再預約。",
      });
    }

    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableId = process.env.BOOKINGS_TABLE_ID; // 「預約紀錄」表 tblXXXX

    if (!apiKey || !baseId || !tableId) {
      return res.status(500).json({
        error:
          "伺服器尚未設定完整的 Airtable 參數（AIRTABLE_API_KEY / AIRTABLE_BASE_ID / BOOKINGS_TABLE_ID）。",
      });
    }

    // === 這裡就是實際寫入到 Airtable 的欄位 ===
    const fields = {
      手機: phone,                 // Single line text
      預約日期: date,              // Date（或文字都可以）
      預約時間: time,              // Single line text
      服務類型: serviceType,       // Single select 或文字
      指定陪伴員: attendant || "", // Single select 或文字
      備註: notes || "",           // Long text / 文字
      狀態: "待確認",              // Single select / 文字
      建立來源: "官網預約",        // Single select / 文字
    };

    const airtableResp = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableId)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields }),
      }
    );

    if (!airtableResp.ok) {
      let msg = "預約寫入資料庫失敗，請稍後再試。";

      try {
        const errJson = await airtableResp.json();
        console.error("Airtable booking error:", errJson);

        const raw = errJson?.error?.message || "";
        if (raw) {
          // 把 Airtable 原始訊息一起顯示
          msg = `預約失敗：${raw}`;

          // 特別針對你現在遇到的錯誤，加上中文說明
          if (raw.includes("array of record IDs")) {
            msg =
              "預約失敗：Airtable 欄位型態錯誤（有欄位是「連結到其他資料表」）。" +
              "請到「預約紀錄」表檢查「手機、預約日期、預約時間、服務類型、指定陪伴員、備註、狀態、建立來源」這幾欄，" +
              "確認它們的欄位類型是『文字 / 日期 / 單選』，而不是『連結到其他資料表』。";
          }
        }
      } catch (e) {
        const text = await airtableResp.text().catch(() => "");
        console.error("Airtable booking raw error:", text);
      }

      return res.status(500).json({ error: msg });
    }

    const data = await airtableResp.json();

    return res.status(200).json({
      success: true,
      booking: data,
    });
  } catch (err) {
    console.error("Booking API error:", err);
    return res.status(500).json({ error: "預約失敗，請稍後再試。" });
  }
}

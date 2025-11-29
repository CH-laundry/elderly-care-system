 // pages/api/auth/google/callback.js
export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('缺少 code');
  }

  // TODO: 在這裡加上：
  // 1) 拿 code 跟 Google 換 token
  // 2) 用 token 去拿 userinfo（email）
  // 3) 找 / 建 會員（寫進 Airtable）
  // 4) 設定 localStorage（這一步會在前端做 redirect 時處理）
  // 現階段先確認導回首頁，測試整個 OAuth redirect 是否通。 

  res.writeHead(302, { Location: '/login' });
  res.end();
}

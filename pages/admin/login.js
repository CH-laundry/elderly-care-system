// pages/api/admin/login.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  // 管理員帳號密碼
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'aaaa';

  if (!username || !password) {
    return res.status(400).json({ error: '請輸入帳號和密碼' });
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.status(200).json({
      success: true,
      role: 'admin',
      username: 'admin'
    });
  }

  return res.status(401).json({ error: '帳號或密碼錯誤' });
}

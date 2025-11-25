// pages/api/admin/login.js
export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, password } = req.body;

  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "aaaa"; // 依照你要求的密碼

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.status(200).json({ success: true });
  }

  return res
    .status(401)
    .json({ success: false, message: "帳號或密碼錯誤" });
}

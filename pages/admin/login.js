// pages/admin/login.js
import { useState } from "react";
import { useRouter } from "next/router";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const resp = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await resp.json();

      if (!resp.ok || !data.success) {
        setError(data.message || "登入失敗，請確認帳號密碼");
      } else {
        if (typeof window !== "undefined") {
          localStorage.setItem("adminLoggedIn", "1");
        }
        // 先直接導到會員儀表板，看得到畫面就好
        router.push("/member/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("系統錯誤，請稍後再試");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background:
          "linear-gradient(to bottom, #ffe4ef 0%, #ffeef5 40%, #ffffff 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "rgba(255,255,255,0.96)",
          borderRadius: "16px",
          padding: "32px 24px",
          boxShadow:
            "0 10px 25px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,192,203,0.4)",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            marginBottom: "4px",
            color: "#b91c1c",
          }}
        >
          管理者登入
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#555",
            marginBottom: "20px",
          }}
        >
          僅供內部人員使用，用來管理預約與會員資料。
        </p>

        <form onSubmit={handleSubmit}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              marginBottom: "6px",
            }}
          >
            管理者帳號
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              marginBottom: "12px",
            }}
            placeholder="admin"
          />

          <label
            style={{
              display: "block",
              fontSize: "14px",
              marginBottom: "6px",
            }}
          >
            密碼
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              marginBottom: "8px",
            }}
            placeholder="aaaa"
          />

          {error && (
            <p
              style={{
                fontSize: "13px",
                color: "#b91c1c",
                marginBottom: "8px",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "8px",
              padding: "10px 12px",
              borderRadius: "999px",
              border: "none",
              fontWeight: 600,
              fontSize: "15px",
              cursor: "pointer",
              background:
                "linear-gradient(90deg, #f97393 0%, #fb7185 40%, #ec4899 100%)",
              color: "#fff",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "登入中…" : "登入"}
          </button>
        </form>

        <p
          style={{
            fontSize: "12px",
            color: "#888",
            marginTop: "16px",
          }}
        >
          預設帳號：admin　密碼：aaaa
        </p>
      </div>
    </div>
  );
}

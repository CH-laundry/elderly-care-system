// pages/admin/dashboard.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AdminDashboard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const flag = localStorage.getItem("adminLoggedIn");
    if (!flag) {
      router.replace("/admin/login");
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) {
    return null;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        background:
          "linear-gradient(to bottom, #ffe4ef 0%, #ffeef5 40%, #ffffff 100%)",
      }}
    >
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          backgroundColor: "rgba(255,255,255,0.96)",
          borderRadius: "24px",
          padding: "24px 20px 32px",
          boxShadow:
            "0 15px 35px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,192,203,0.5)",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#be123c",
              }}
            >
              管理者後台
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "#9f1239",
                marginTop: "4px",
              }}
            >
              目前版本僅提供預約與會員資料檢視，之後可再擴充。
            </div>
          </div>
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.removeItem("adminLoggedIn");
              }
              router.push("/");
            }}
            style={{
              padding: "8px 16px",
              borderRadius: "999px",
              border: "none",
              backgroundColor: "#fb7185",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            登出
          </button>
        </header>

        <div
          style={{
            display: "grid",
            gap: "16px",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              borderRadius: "18px",
              padding: "16px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
            }}
          >
            <div style={{ fontSize: "13px", color: "#b91c1c" }}>
              今日預約概況
            </div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: 700,
                marginTop: "8px",
                color: "#7f1d1d",
              }}
            >
              --
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#9f1239",
                marginTop: "4px",
              }}
            >
              之後可以接 API 顯示實際預約數量
            </div>
          </div>

          <div
            style={{
              borderRadius: "18px",
              padding: "16px",
              backgroundColor: "#eff6ff",
              border: "1px solid #bfdbfe",
            }}
          >
            <div style={{ fontSize: "13px", color: "#1d4ed8" }}>
              會員數量
            </div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: 700,
                marginTop: "8px",
                color: "#1e3a8a",
              }}
            >
              --
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#1d4ed8",
                marginTop: "4px",
              }}
            >
              未來可以串 Airtable 顯示會員總數
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "12px",
            fontSize: "13px",
            color: "#6b7280",
          }}
        >
          ⬆ 目前只是簡易版後台，主要是讓「管理者登入流程」先走得通，不會被會員登入規則擋住。
        </div>
      </div>
    </div>
  );
}

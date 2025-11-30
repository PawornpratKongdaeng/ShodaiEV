// app/admin/login/page.tsx
"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // อ่าน callback จาก query string ด้วย window.location (ฝั่ง client ล้วน)
  const [callback, setCallback] = useState<string>("/admin?key=shodai-admin-2025-Sa180930@");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const url = new URL(window.location.href);
      const cb = url.searchParams.get("callback");
      if (cb) setCallback(cb);
    } catch {
      // เผื่อ error ก็ปล่อยไป ใช้ /admin ตามเดิม
    }
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message || "เข้าสู่ระบบไม่สำเร็จ");
        return;
      }

      router.push(callback || "/admin");
    } catch (err) {
      console.error("admin login error:", err);
      setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">
            Admin Login
          </h1>
          <p className="text-sm text-slate-500 mb-6 text-center">
            เข้าสู่ระบบจัดการเว็บไซต์ ShodaiEV
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                ชื่อผู้ใช้
              </label>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm 
                           focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Shodaievadmin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                รหัสผ่าน
              </label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm 
                           focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="รหัสผ่านผู้ดูแลระบบ"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 
                         text-white font-semibold py-2.5 text-sm 
                         hover:from-orange-600 hover:to-amber-600 
                         disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {submitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>

          <p className="mt-4 text-xs text-slate-400 text-center">
            ใช้สำหรับผู้ดูแลระบบเท่านั้น
          </p>
        </div>
      </div>
    </main>
  );
}

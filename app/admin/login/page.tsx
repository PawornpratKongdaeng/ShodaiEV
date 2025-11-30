"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        let msg = "เข้าสู่ระบบไม่สำเร็จ";

        try {
          const data = await res.json();
          if (data?.message) msg = data.message;
        } catch {
          // ignore parse error
        }

        setError(msg);
        return;
      }

      // consume body กัน warning
      await res.json().catch(() => {});

      // ✅ Login ผ่าน → เด้งไปหน้า Admin ตรง ๆ
      router.replace("/admin?key=shodai-admin-2025-Sa180930@");
    } catch (err) {
      console.error("login error", err);
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
          Admin Login
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mb-6">
          กรุณาเข้าสู่ระบบเพื่อจัดการหน้าเว็บ ShodaiEV
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Username
            </label>
            <input
              type="text"
              autoComplete="username"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="เช่น Shodaievadmin"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="รหัสผ่านของ Admin"
            />
          </div>

          {error && (
            <div className="text-xs sm:text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
      </div>
    </div>
  );
}

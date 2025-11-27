// app/admin/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, pass }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
        setSubmitting(false);
        return;
      }

      router.push("/admin");
    } catch (err) {
      setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)] px-4">
      <div className="w-full max-w-md bg-white/90 border border-[var(--color-primary-soft)] rounded-2xl shadow-md p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-[var(--color-text)]">
          เข้าสู่ระบบแอดมิน
        </h1>
        <p className="text-sm text-slate-500 text-center mb-6">
          สำหรับจัดการข้อมูลหน้าเว็บ ShodaiEV
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">
              Username
            </label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
              placeholder="เช่น ShodaiEV"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">
              Password
            </label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
              placeholder="รหัสผ่านแอดมิน"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-accent)] text-white font-semibold py-2.5 text-sm shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // callback ที่ middleware ส่งมา เช่น /admin
  const callback = searchParams.get("callback") || "/admin";

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

      // แค่ consume body เฉย ๆ (กัน warning)
      await res.json().catch(() => {});

      // ถ้า login ผ่าน → middleware จะอ่าน cookie แล้วอนุญาตให้เข้า /admin
      router.replace(callback);
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
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center text-xl font-bold">
            QD
          </div>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
            Admin Login
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            เข้าสู่ระบบเพื่อจัดการคอนเทนต์หน้าเว็บ ShodaiEV
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Username
            </label>
            <input
              type="text"
              autoComplete="username"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent bg-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=""
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
            />
          </div>

          {error && (
            <div className="text-xs sm:text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-sky-200"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                กำลังเข้าสู่ระบบ...
              </>
            ) : (
              <>เข้าสู่ระบบ</>
            )}
          </button>

          <p className="text-[11px] text-slate-400 text-center mt-2">
            หลังเข้าสู่ระบบสำเร็จ ระบบจะพาไปที่ {callback}
          </p>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-900">
              กำลังโหลดหน้าเข้าสู่ระบบ...
            </p>
          </div>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  // เช็ค user/pass ตาม logic
  const ok = username === "admin" && password === "1234";
  if (!ok) {
    return NextResponse.json(
      { ok: false, message: "Username หรือ Password ไม่ถูกต้อง" },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });

  res.cookies.set("admin_auth", "some-token", {
    httpOnly: true,
    secure: true,          // บน Vercel ต้องเป็น true (https)
    sameSite: "lax",
    path: "/admin",
    maxAge: 60 * 60 * 24,  // 1 วัน
  });

  return res;
}

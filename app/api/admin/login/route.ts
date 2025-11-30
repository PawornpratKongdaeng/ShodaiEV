import { NextRequest, NextResponse } from "next/server";

// 🔐 ข้อมูลล็อกอินแบบ Hard-coded ตามที่สั่ง
const ADMIN_USER = "Shodaievadmin";
const ADMIN_PASSWORD = "Sa18093019@";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body ?? {};

    if (!username || !password) {
      return NextResponse.json(
        { message: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน" },
        { status: 400 }
      );
    }

    if (username !== ADMIN_USER || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    // สร้าง response + ตั้ง cookie session
    const res = NextResponse.json({ message: "ok" });

    res.cookies.set("admin_session", "active", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/admin?key=shodai-admin-2025-Sa180930@",
      maxAge: 60 * 60 * 8, // 8 ชั่วโมง
    });

    return res;
  } catch (error) {
    console.error("admin login error:", error);
    return NextResponse.json(
      { message: "รูปแบบข้อมูลไม่ถูกต้อง" },
      { status: 400 }
    );
  }
}

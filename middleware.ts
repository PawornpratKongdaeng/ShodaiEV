// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE = "admin_auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ทำงานเฉพาะ route ที่ขึ้นต้นด้วย /admin เท่านั้น
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // --- ปล่อยทุก path ที่เป็นหน้า login ผ่านหมด ---
  // /admin/login
  // /admin/login/ 
  const isLoginPath =
    pathname === "/admin/login" ||
    pathname === "/admin/login/";

  if (isLoginPath) {
    return NextResponse.next();
  }

  // ถ้ามี path แปลก ๆ ที่เริ่มด้วย /admin/login (เช่น /admin/login/callback)
  // ก็ไม่ควรเอามาเช็ค cookie เดี๋ยวมัน loop
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // --- จากนี้คือหน้า admin จริง ๆ ที่ต้องล็อกอิน ---
  const token = req.cookies.get(ADMIN_COOKIE)?.value;

  if (!token) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callback", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

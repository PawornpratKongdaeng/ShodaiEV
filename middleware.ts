// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  const isAdmin = pathname.startsWith("/admin");
  const isLogin = pathname === "/admin/login";

  const hasAuth = !!req.cookies.get("admin_auth")?.value;

  // ถ้ายังไม่ล็อกอิน และกำลังเข้า /admin (แต่ไม่ใช่ /admin/login)
  if (isAdmin && !isLogin && !hasAuth) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("callback", pathname);
    return NextResponse.redirect(url);
  }

  // ถ้าล็อกอินแล้ว แต่ดันเข้าหน้า login → เด้งไป /admin
  if (isLogin && hasAuth) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    url.searchParams.delete("callback");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// ให้ middleware ทำงานแค่ /admin/*
export const config = {
  matcher: ["/admin/:path*"],
};

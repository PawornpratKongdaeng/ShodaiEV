// app/api/admin/config/route.ts
import { NextRequest, NextResponse } from "next/server";
import { loadSiteData, saveSiteData, type SiteConfig } from "@/lib/server/siteData";

export const runtime = "nodejs";

export async function GET() {
  try {
    const data = await loadSiteData();
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Cannot load config" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SiteConfig;
    await saveSiteData(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Cannot save config" },
      { status: 500 }
    );
  }
}

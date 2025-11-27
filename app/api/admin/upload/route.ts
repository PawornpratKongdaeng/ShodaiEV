// app/api/admin/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs"; // ใช้ node ก็ได้ edge ก็ได้

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { ok: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    const filename = `shodaiev/${Date.now()}-${file.name}`;

    // ✅ ส่ง file ตรง ๆ เข้า put ได้เลย
    const blob = await put(filename, file, {
      access: "public",
    });

    return NextResponse.json(
      {
        ok: true,
        url: blob.url,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { ok: false, error: "Upload failed" },
      { status: 500 }
    );
  }
}

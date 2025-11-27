// app/api/admin/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "edge"; // หรือ "nodejs" ได้ทั้งคู่

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

    // แปลงไฟล์เป็น buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // ตั้งชื่อไฟล์บน Blob
    const filename = `shodaiev/${Date.now()}-${file.name}`;

    // อัปขึ้น Blob
    const blob = await put(filename, buffer, {
      access: "public", // ให้ได้ URL เอาไปใช้หน้าเว็บได้เลย
    });

    // blob.url = URL จริงของรูป
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

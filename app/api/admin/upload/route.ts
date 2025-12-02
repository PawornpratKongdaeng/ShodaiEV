// app/api/admin/upload/route.ts
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/server/r2";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { ok: false, error: "No file received" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const safeName = file.name.replace(/\s+/g, "_");
    const key = `uploads/${Date.now()}-${safeName}`;

    await r2Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type || "image/jpeg",
      })
    );

    const publicUrl = `${R2_PUBLIC_URL}/${key}`;

    return NextResponse.json({ ok: true, url: publicUrl });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { ok: false, error: error?.message ?? "Upload failed" },
      { status: 500 }
    );
  }
}

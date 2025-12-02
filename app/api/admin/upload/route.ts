import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, BUCKET_NAME } from "./../../../../lib/server/r2";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ ok: false, error: "No file received" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const key = `uploads/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

    await r2Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const publicUrl = `${process.env.CLOUDFLARE_PUBLIC_BASE_URL}/${key}`;

    return NextResponse.json({ ok: true, url: publicUrl });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

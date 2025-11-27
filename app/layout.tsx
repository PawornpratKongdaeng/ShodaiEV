// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { loadSiteData, defaultTheme } from "@/lib/server/siteData";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://shodaiev.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "ShodaiEV | ซ่อมรถไฟฟ้า 2 ล้อ 3 ล้อ บริการถึงบ้าน",
    template: "%s | ShodaiEV",
  },
  description:
    "ShodaiEV ให้บริการซ่อมรถไฟฟ้า มอเตอร์ไซค์ไฟฟ้า รถสามล้อไฟฟ้า สกู๊ตเตอร์ บริการถึงบ้านในพื้นที่ให้บริการ",
  keywords: [
    "ซ่อมรถไฟฟ้า",
    "มอเตอร์ไซค์ไฟฟ้า",
    "3 ล้อไฟฟ้า",
    "ซ่อมสกู๊ตเตอร์ไฟฟ้า",
    "บริการถึงบ้าน",
    "ShodaiEV",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "ShodaiEV ซ่อมรถไฟฟ้าและจำหน่ายอะไหล่",
    description:
      "บริการซ่อมมอเตอร์ไซค์ไฟฟ้า รถสามล้อไฟฟ้า สกู๊ตเตอร์ไฟฟ้า ",
    siteName: "ShodaiEV",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShodaiEV ซ่อมรถไฟฟ้าและจำหน่ายอะไหล่",
    description:
      "บริการซ่อมมอเตอร์ไซค์ไฟฟ้า รถสามล้อไฟฟ้า สกู๊ตเตอร์ไฟฟ้",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await loadSiteData();
  const theme = data.theme ?? defaultTheme;

  return (
    <html lang="th">
      <body
        style={{
          ["--color-primary" as any]: theme.primary,
          ["--color-primary-soft" as any]: theme.primarySoft,
          ["--color-accent" as any]: theme.accent,
          ["--color-bg" as any]: theme.background,
          ["--color-surface" as any]: theme.surface,
          ["--color-text" as any]: theme.text,
        }}
        className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]"
      >
        {children}
      </body>
    </html>
  );
}

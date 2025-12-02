// app/page/products/page.tsx
import type { Metadata } from "next";
import { loadSiteData, defaultTheme } from "@/lib/server/siteData";
import Header from "@/app/components/user/Header";
import ThemeVars from "@/app/components/user/ThemeVars";
import Image from "next/image";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://shodaiev.com";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "บริการทั้งหมด | ShodaiEV",
  description:
    "รวมบริการซ่อมรถไฟฟ้า มอเตอร์ไซค์ไฟฟ้า รถสามล้อไฟฟ้า และสกู๊ตเตอร์ไฟฟ้าของ ShodaiEV",
  alternates: {
    canonical: `${SITE_URL}/page/products`,
  },
};

export default async function ServicePage() {
  const data = await loadSiteData();
  const theme = data.theme ?? defaultTheme;

  const topics = Array.isArray(data.topics) ? data.topics : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <ThemeVars theme={theme} />

      <Header phone={data.phone ?? ""} line={data.line ?? ""} />

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-orange-100 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 pt-20 sm:pt-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-200 rounded-full blur-3xl opacity-30 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24 text-center">
          <div className="inline-block mb-6 px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-full border border-orange-200 shadow-sm">
            <span className="text-orange-600 font-semibold text-sm flex items-center gap-2">
              ⚡ บริการครบวงจร
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-red-500 to-amber-600 bg-clip-text text-transparent leading-tight">
            บริการของเรา
          </h1>

          <p className="text-slate-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            เลือกบริการที่ตรงกับความต้องการของคุณ
            <br />
            <span className="text-orange-600 font-medium">
              พร้อมทีมช่างมืออาชีพดูแลทุกปัญหา
            </span>
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-orange-600 mb-1">
                {topics.length}+
              </div>
              <div className="text-sm text-slate-600">บริการหลัก</div>
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        {topics.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              กำลังเตรียมบริการ
            </h3>
            <p className="text-slate-600 text-lg">
              กรุณารอติดตามเร็วๆ นี้
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                บริการที่เรามีให้
              </h2>
              <p className="text-slate-600 text-base">
                เลือกบริการที่คุณต้องการ แล้วคลิกเพื่อดูรายละเอียดเพิ่มเติม
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((t: any) => (
                <a
                  key={t.id}
                  href={`/page/product/${encodeURIComponent(t.id)}`}
                  className="group relative block bg-white rounded-3xl border border-slate-200 hover:border-orange-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 overflow-hidden"
                >
                  <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-3xl bg-slate-100">
                    {t.thumbnailUrl ? (
                      <Image
                        src={t.thumbnailUrl}
                        alt={t.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-4xl">✨</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-orange-600 transition">
                      {t.title}
                    </h2>

                    <p className="text-slate-600 text-sm line-clamp-3 mb-5">
                      {t.summary || t.detail || "รายละเอียดบริการจะแสดงที่นี่"}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-sm font-semibold text-orange-600">
                        ดูรายละเอียด
                      </span>
                      <span className="text-orange-600 text-xl">→</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

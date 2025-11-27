import type { Metadata } from "next";
import { loadSiteData } from "@/lib/server/siteData";
import Header from "../../components/user/Header";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://shodaiev.com";
  export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "บริการทั้งหมด | ShodaiEV",
  description:
    "รวมบริการซ่อมรถไฟฟ้า มอเตอร์ไซค์ไฟฟ้า รถสามล้อไฟฟ้า และสกู๊ตเตอร์ไฟฟ้าของ ShodaiEV",
  alternates: {
    canonical: `${SITE_URL}/page/product`,
  },
};

export default async function ServicePage() {
  const data = await loadSiteData();
  const topics = Array.isArray(data.topics) ? data.topics : [];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Header phone={data.phone ?? ""} line={data.line ?? ""} />

      <div className="relative overflow-hidden border-b border-[var(--color-primary-soft)] bg-[var(--color-surface)] pt-20 sm:pt-24">
        <div className="absolute inset-0 bg-gradient-to-r from-red-50 via-amber-50 to-orange-50" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16 md:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
            บริการของเรา
          </h1>
          <p className="text-amber-700 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            เลือกบริการที่ตรงกับความต้องการของคุณ
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {topics.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-[var(--color-surface)]">
              <span className="text-3xl sm:text-4xl">📦</span>
            </div>
            <p className="text-base sm:text-lg text-[var(--color-text)]/80">
              ยังไม่มีหัวข้อบริการในขณะนี้
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((t: any) => (
              <a
                key={t.id}
                href={`/page/product/${encodeURIComponent(t.id)}`}
                className="group relative block bg-[var(--color-bg)] rounded-2xl border border-[var(--color-primary-soft)] hover:border-[var(--color-primary)] transition-all duration-300 hover:shadow-md hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent to-[var(--color-primary-soft)]/50 opacity-0 group-hover:opacity-100 transition-all duration-300" />

                <div className="relative flex flex-col h-full">
                  <div className="w-full aspect-[4/3] overflow-hidden rounded-t-2xl bg-[var(--color-surface)]">
                    {t.thumbnailUrl ? (
                      <img
                        src={t.thumbnailUrl}
                        alt={t.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl">✨</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-all line-clamp-2">
                      {t.title}
                    </h2>

                    <p className="text-[var(--color-text)]/70 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-3 sm:mb-4 flex-1">
                      {t.summary || t.detail || "ไม่มีคำอธิบาย"}
                    </p>

                    <div className="flex items-center text-[11px] sm:text-xs text-[var(--color-primary)] font-medium group-hover:gap-2 transition-all mt-auto">
                      <span>ดูเพิ่มเติม</span>
                      <span className="group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

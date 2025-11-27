// app/page/product/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadSiteData } from "@/lib/server/siteData";
import type {
  TopicItem,
  ServiceDetailItem,
  SiteConfig,
} from "@/lib/server/siteData";
import Header from "@/app/components/user/Header";
import type { Metadata } from "next";
import Script from "next/script";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://shodaiev.com";

type ProductDetailPageParams = {
  id: string;
};

type ProductDetailPageProps = {
  params: Promise<ProductDetailPageParams>;
};

export const dynamic = "force-dynamic";
export async function generateMetadata(
  props: { params: ProductDetailPageParams }
): Promise<Metadata> {
  const { id } = props.params;
  const decodedId = decodeURIComponent(id);

  const data: SiteConfig = await loadSiteData();
  const topics: TopicItem[] = Array.isArray(data.topics)
    ? (data.topics as TopicItem[])
    : [];
  const details: ServiceDetailItem[] = Array.isArray(
    data.serviceDetails
  )
    ? (data.serviceDetails as ServiceDetailItem[])
    : [];

  const topic = topics.find((t) => t.id === decodedId);
  if (!topic) {
    return {
      title: "ไม่พบบริการ | ShodaiEV",
    };
  }

  const detail = details.find((d) => d.topicId === topic.id) ?? null;

  const prefix = data.seoServiceDetailTitlePrefix || "";
  const suffix = data.seoServiceDetailDescriptionSuffix || "";

  const title = `${prefix}${detail?.title || topic.title}`;
  const desc =
    detail?.description ||
    topic.detail ||
    topic.summary ||
    "รายละเอียดบริการจาก ShodaiEV";

  const canonicalUrl = `${SITE_URL}/page/product/${encodeURIComponent(
    topic.id
  )}`;

  const ogImage = detail?.images?.[0] || data.heroImageUrl || "";

  return {
    title,
    description: desc + suffix,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: desc + suffix,
      url: canonicalUrl,
      type: "article",
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630, alt: title }]
        : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  const data = await loadSiteData();

  const topics: TopicItem[] = Array.isArray(data.topics)
    ? (data.topics as TopicItem[])
    : [];

  const details: ServiceDetailItem[] = Array.isArray(data.serviceDetails)
    ? (data.serviceDetails as ServiceDetailItem[])
    : [];

  const topic = topics.find((t) => t.id === decodedId);

  if (!topic) {
    return notFound();
  }

  const detail = details.find((d) => d.topicId === topic.id) ?? null;

  const title = detail?.title || topic.title;
  const summary = topic.summary ?? "";
  const description = detail?.description || topic.detail || "";
  const images = detail?.images ?? [];
  const sections = detail?.sections ?? [];

  const THUMB_LIMIT = 5;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    description:
      description ||
      summary ||
      "บริการจาก ShodaiEV",
    provider: {
      "@type": "LocalBusiness",
      name: data.businessName || "ShodaiEV",
      telephone: data.phone || "",
    },
    areaServed: data.businessAddress || undefined,
    url: `${SITE_URL}/page/product/${encodeURIComponent(topic.id)}`,
    image: images.length > 0 ? images : undefined,
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] pb-10">
      <Script
        id="ld-service-detail"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceJsonLd),
        }}
      />

      <Header phone={data.phone ?? ""} line={data.line ?? ""} />

      {/* HERO / BREADCRUMB */}
      <section className="bg-[var(--color-surface)] py-8 sm:py-10 md:py-12 px-4 sm:px-6 border-b border-[var(--color-primary-soft)]">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-[var(--color-text)]/70">
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <Link href="/" className="hover:text-[var(--color-primary)]">
                หน้าแรก
              </Link>
              <span>/</span>
              <Link
                href="/page/product"
                className="hover:text-[var(--color-primary)]"
              >
                บริการทั้งหมด
              </Link>
              <span>/</span>
              <span className="line-clamp-1 max-w-[180px] sm:max-w-xs md:max-w-md">
                {topic.title}
              </span>
            </div>

            <span className="px-3 py-1 rounded-full border border-[var(--color-primary-soft)] text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[var(--color-primary)] bg-[var(--color-bg)]">
              Service Detail
            </span>
          </div>

          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--color-accent), var(--color-primary), var(--color-primary-soft))",
            }}
          >
            {title || topic.title}
          </h1>

          {summary && (
            <p className="text-sm md:text-base text-[var(--color-text)]/80 max-w-3xl">
              {summary}
            </p>
          )}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-8 sm:py-10 px-4 sm:px-6 bg-[var(--color-bg)]">
        <div className="max-w-5xl mx-auto grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          {/* LEFT: IMAGES */}
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-semibold mb-2">
              รูปภาพตัวอย่างงาน / บริการ
            </h2>

            {images.length === 0 && (
              <div className="border border-dashed border-[var(--color-primary-soft)] rounded-xl p-6 flex items-center justify-center text-sm text-[var(--color-text)]/80 bg-[var(--color-surface)]">
                ยังไม่มีการอัปโหลดรูปภาพสำหรับหัวข้อนี้
              </div>
            )}

            {images.length > 0 && (
              <div className="space-y-4">
                {/* main image */}
                <div className="overflow-hidden rounded-xl border border-[var(--color-primary-soft)] bg-[var(--color-surface)] cursor-pointer">
                  <a href="#img-0">
                    <img
                      src={images[0]}
                      alt={title}
                      className="w-full max-h-[420px] sm:max-h-[500px] object-cover hover:scale-[1.03] transition-transform"
                    />
                  </a>
                </div>

                {/* thumbnails */}
                {images.length > 1 &&
                  (() => {
                    const thumbImages = images.slice(1, 1 + THUMB_LIMIT);
                    const extraCount = Math.max(
                      0,
                      images.length - 1 - THUMB_LIMIT
                    );

                    return (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {thumbImages.map((url, idx) => {
                          const globalIndex = idx + 1;
                          const isLastThumb =
                            idx === thumbImages.length - 1 && extraCount > 0;

                          return (
                            <a
                              key={`${url}-${idx}`}
                              href={`#img-${globalIndex}`}
                              className="relative overflow-hidden rounded-lg border border-[var(--color-primary-soft)] bg-[var(--color-surface)]"
                            >
                              <img
                                src={url}
                                alt="service-detail"
                                className={`w-full h-24 sm:h-28 md:h-32 object-cover hover:scale-105 transition-transform ${
                                  isLastThumb ? "opacity-60" : ""
                                }`}
                              />
                              {isLastThumb && extraCount > 0 && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-white text-[11px] sm:text-xs md:text-sm font-semibold">
                                  +{extraCount}
                                </div>
                              )}
                            </a>
                          );
                        })}
                      </div>
                    );
                  })()}
              </div>
            )}
          </div>

          {/* RIGHT: DETAIL */}
          <aside className="space-y-7">
            <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-primary-soft)] p-4 sm:p-5 shadow-sm">
              <h2 className="text-base sm:text-lg font-semibold mb-2">
                รายละเอียดบริการ
              </h2>
              <div className="text-sm leading-relaxed text-[var(--color-text)]/80 whitespace-pre-line">
                {description || "ยังไม่มีรายละเอียดสำหรับหัวข้อนี้"}
              </div>
            </div>

            {(topic.detail || topic.summary) && (
              <div className="rounded-xl p-4 text-xs sm:text-sm space-y-2 border border-[var(--color-primary-soft)] bg-[var(--color-surface)] text-[var(--color-text)]">
                <p className="font-semibold text-[var(--color-primary)]">
                  ข้อมูลจากหัวข้อ Service Topics
                </p>
                {topic.detail && (
                  <p className="whitespace-pre-line">{topic.detail}</p>
                )}
                {topic.summary && !topic.detail && (
                  <p>{topic.summary}</p>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Link
                href="/page/product"
                className="btn btn-outline btn-sm border-[var(--color-primary-soft)] text-[var(--color-primary)] hover:bg-[var(--color-surface)]"
              >
                ← กลับไปหน้ารวมบริการ
              </Link>
              <Link
                href="/#contact"
                className="btn btn-sm text-white border-none"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, var(--color-accent), var(--color-primary))",
                }}
              >
                สนใจบริการนี้ ติดต่อเรา
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* SECTION DETAILS */}
      {sections.length > 0 && (
        <section className="pb-10 px-4 sm:px-6 bg-[var(--color-bg)]">
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-semibold">
                รายละเอียดแยกตามหมวดงานในบริการนี้
              </h2>
              <span className="text-[11px] sm:text-xs px-3 py-1 rounded-full bg-[var(--color-surface)] text-[var(--color-text)]/80 border border-[var(--color-primary-soft)]">
                มี {sections.length} หมวดงาน
              </span>
            </div>

            <div className="space-y-4">
              {sections.map((sec, idx) => {
                const secImages = sec.images ?? [];
                return (
                  <article
                    key={sec.id || idx}
                    className="bg-[var(--color-bg)] border border-[var(--color-primary-soft)] rounded-xl p-4 sm:p-5 shadow-sm flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-primary)] mb-1">
                          หมวดงาน #{idx + 1}
                        </p>
                        <h3 className="text-base sm:text-lg font-semibold">
                          {sec.title || `หัวข้อย่อยที่ ${idx + 1}`}
                        </h3>
                      </div>
                    </div>

                    {sec.description && (
                      <p className="text-xs sm:text-sm text-[var(--color-text)]/80 whitespace-pre-line">
                        {sec.description}
                      </p>
                    )}

                    {secImages.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[11px] sm:text-xs text-[var(--color-primary)] font-medium">
                          รูปตัวอย่างงานหมวดนี้ ({secImages.length})
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {secImages.map((url, i) => (
                            <a
                              key={`${sec.id || idx}-${url}-${i}`}
                              href={`#sec-${idx}-${i}`}
                              className="overflow-hidden rounded-lg border border-[var(--color-primary-soft)] bg-[var(--color-surface)] cursor-pointer"
                            >
                              <img
                                src={url}
                                alt={`${sec.title || "sub-service"}-${i + 1}`}
                                className="w-full h-24 sm:h-28 object-cover hover:scale-105 transition-transform"
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* LIGHTBOX หลัก */}
      {images.map((url, index) => {
        const prevIndex = index === 0 ? images.length - 1 : index - 1;
        const nextIndex = index === images.length - 1 ? 0 : index + 1;

        return (
          <div
            key={`lightbox-${index}`}
            id={`img-${index}`}
            className="fixed inset-0 bg-black/80 z-[999] opacity-0 pointer-events-none flex items-center justify-center transition-opacity target:opacity-100 target:pointer-events-auto"
          >
            <div className="relative max-w-6xl w-full px-4">
              <div className="flex justify-end mb-2">
                <a
                  href="#_"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white text-lg"
                >
                  ✕
                </a>
              </div>

              <div className="relative bg-black/70 rounded-xl overflow-hidden border border-white/10">
                <a
                  href={`#img-${prevIndex}`}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center text-xl sm:text-2xl z-10"
                >
                  ‹
                </a>

                <img
                  src={url}
                  alt={`service-image-${index}`}
                  className="w-full max-h-[85vh] object-contain bg-black"
                />

                <a
                  href={`#img-${nextIndex}`}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center text-xl sm:text-2xl z-10"
                >
                  ›
                </a>
              </div>

              <p className="mt-2 text-center text-[11px] sm:text-xs text-slate-200">
                รูปที่ {index + 1} / {images.length}
              </p>
            </div>
          </div>
        );
      })}

      {/* LIGHTBOX per section */}
      {sections.length > 0 &&
        sections.map((sec, sIdx) => {
          const secImages = sec.images ?? [];
          return secImages.map((url, i) => {
            if (secImages.length === 0) return null;

            const prevIndex = i === 0 ? secImages.length - 1 : i - 1;
            const nextIndex =
              i === secImages.length - 1 ? 0 : i + 1;

            return (
              <div
                key={`sec-lightbox-${sIdx}-${i}`}
                id={`sec-${sIdx}-${i}`}
                className="fixed inset-0 bg-black/80 z-[999] opacity-0 pointer-events-none flex items-center justify-center transition-opacity target:opacity-100 target:pointer-events-auto"
              >
                <div className="relative max-w-6xl w-full px-4">
                  <div className="flex justify-end mb-2">
                    <a
                      href="#_"
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white text-lg"
                    >
                      ✕
                    </a>
                  </div>

                  <div className="relative bg-black/70 rounded-xl overflow-hidden border border-white/10">
                    <a
                      href={`#sec-${sIdx}-${prevIndex}`}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center text-xl sm:text-2xl z-10"
                    >
                      ‹
                    </a>

                    <img
                      src={url}
                      alt={`${sec.title || "sub-service"}-full-${i + 1}`}
                      className="w-full max-h-[85vh] object-contain bg-black"
                    />

                    <a
                      href={`#sec-${sIdx}-${nextIndex}`}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center text-xl sm:text-2xl z-10"
                    >
                      ›
                    </a>
                  </div>

                  <p className="mt-2 text-center text-[11px] sm:text-xs text-slate-200">
                    {sec.title || `หมวดงานที่ ${sIdx + 1}`} — รูปที่{" "}
                    {i + 1} / {secImages.length}
                  </p>
                </div>
              </div>
            );
          });
        })}
    </main>
  );
}

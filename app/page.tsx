// app/page.tsx
import Header from "./components/user/Header";
import Hero from "./components/user/Hero";
import ContactSection from "./components/user/Contact";
import ProductsSection from "./components/user/Products";
import ServiceGallery from "./components/user/ServiceGallery";
import { loadSiteData, type SiteConfig } from "@/lib/server/siteData";
import Link from "next/link";
import type { Metadata } from "next";
import Script from "next/script";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://shodaiev.com";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "ShodaiEV | ซ่อมรถไฟฟ้า 2 ล้อ 3 ล้อ บริการถึงบ้าน",
  description:
    "ShodaiEV รับซ่อมมอเตอร์ไซค์ไฟฟ้า รถสามล้อไฟฟ้า สกู๊ตเตอร์ไฟฟ้า พร้อมบริการถึงบ้าน ติดต่อได้ทางโทรศัพท์ ไลน์ และเฟซบุ๊ก",
  alternates: {
    canonical: SITE_URL,
  },
};

export default async function HomePage() {
  const data: SiteConfig = await loadSiteData();

  const businessName = data.businessName || "ShodaiEV";
  const businessAddress =
    data.businessAddress || "ตำแหน่งตามลิงก์ Google Maps ที่ให้ไว้";
  const telephone = data.phone || "";
  const mapUrl = data.mapUrl || "";
  const lat = data.businessGeoLat;
  const lng = data.businessGeoLat; // ✅ แก้ตรงนี้
  const ogImage = data.heroImageUrl || "";

  const jsonLdLocalBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: businessName,
    description:
      data.seoDescriptionHome ||
      "บริการซ่อมรถไฟฟ้า มอเตอร์ไซค์ไฟฟ้า และสามล้อไฟฟ้า",
    telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress: businessAddress,
    },
    image: ogImage ? [ogImage] : undefined,
    url: SITE_URL,
    geo:
      lat && lng
        ? {
            "@type": "GeoCoordinates",
            latitude: lat,
            longitude: lng,
          }
        : undefined,
    sameAs: [
      data.facebook ? "https://www.facebook.com/shodaiev/" : undefined,
      data.lineUrl || undefined,
      mapUrl || undefined,
    ].filter(Boolean),
  };

  return (
    <main className="bg-[var(--color-bg)] text-[var(--color-text)]">
      <Script
        id="ld-local-business"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdLocalBusiness),
        }}
      />

      <Header phone={data.phone ?? ""} line={data.line ?? ""} />

      <h1 className="sr-only">
        {data.seoTitleHome ||
          "ShodaiEV บริการซ่อมรถไฟฟ้า มอเตอร์ไซค์ไฟฟ้า และสามล้อไฟฟ้า บริการถึงบ้าน"}
      </h1>

      <Hero imageUrl={data.heroImageUrl ?? ""} />

      <ServiceGallery images={data.homeGallery ?? []} />

      <ProductsSection products={data.products ?? []} />

      <section className="py-20 bg-amber-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              บริการของเรา
            </h2>
            <p className="text-amber-700 text-lg max-w-2xl mx-auto mb-8">
              เลือกบริการที่ตรงกับความต้องการของคุณ
            </p>
          </div>

          <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl border border-orange-200 shadow-sm">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-100 to-amber-100 flex items-center justify-center">
              <span className="text-4xl">✨</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900">
              สำรวจบริการของเรา
            </h3>
            <p className="text-amber-700 mb-8">
              ดูรายละเอียดบริการทั้งหมดที่เรามีให้
            </p>
            <Link
              href="/page/products" // ✅ แก้ path
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 transition-all shadow-md shadow-orange-200 hover:shadow-lg hover:translate-y-[1px]"
            >
              <span>ดูบริการทั้งหมด</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <ContactSection
        phone={data.phone ?? ""}
        line={data.line ?? ""}
        lineUrl={data.lineUrl ?? ""}
        facebook={data.facebook ?? ""}
        mapUrl={data.mapUrl ?? ""}
      />
    </main>
  );
}

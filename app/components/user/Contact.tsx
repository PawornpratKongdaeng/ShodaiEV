"use client";

import Image from "next/image";

type ContactProps = {
  phone?: string;
  line?: string;
  lineUrl?: string;
  facebook?: string;
  mapUrl?: string;
};

export default function Contact({
  phone = "",
  line = "",
  lineUrl = "",
  facebook = "",
  mapUrl = "",
}: ContactProps) {
  const hasPhone = !!phone;
  const hasLine = !!line;
  const hasFacebook = !!facebook;
  const hasMap = !!mapUrl;

  if (!hasPhone && !hasLine && !hasFacebook && !hasMap) return null;

  return (
    <section
      id="contact"
      className="py-16 sm:py-20 lg:py-24 bg-[var(--color-surface)] px-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto grid gap-8 lg:gap-12 lg:grid-cols-2 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-text)] leading-tight">
            ShodaiEV
            <span
              className="mt-3 block bg-clip-text text-transparent text-xl sm:text-2xl lg:text-3xl leading-snug"
              style={{
                backgroundImage:
                  "linear-gradient(to right, var(--color-accent), var(--color-primary), var(--color-primary-soft))",
              }}
            >
              ติดต่อเราได้ที่
              <br />
              ช่องทางนี้ได้เลย!
              <br />
              เราพร้อมให้บริการคุณเสมอ
            </span>
          </h2>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {hasPhone && (
            <a
  href={`tel:${phone}`}
  onClick={() => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "conversion", {
        send_to: "AW-11024557003/JyihCJW3m4waEMvH9Ygp",
      });
    }
  }}
>
              <div className="flex items-center">
                <span className="text-lg sm:text-xl">📞</span>
                <span className="ml-3 sm:ml-4 text-sm sm:text-base text-[var(--color-text)] break-all">
                  {phone}
                </span>
              </div>
            </a>
          )}

          {hasLine && (
            <a
              href={lineUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-2xl bg-[var(--color-bg)] p-4 sm:p-5 border border-[var(--color-primary-soft)] hover:border-[var(--color-primary)] shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center">
                <Image
  src="/LINE_Brand_icon.png"
  alt="LINE"
  width={24}
  height={24}
  className="w-6 h-6"
  loading="lazy"
/>
                <span className="ml-3 sm:ml-4 text-sm sm:text-base text-[var(--color-text)] break-all">
                  {line}
                </span>
              </div>
            </a>
          )}

          {hasFacebook && (
            <a
              href={facebook || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-2xl bg-[var(--color-bg)] p-4 sm:p-5 border border-[var(--color-primary-soft)] hover:border-[var(--color-primary)] shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center">
                <Image
  src="/facebook.png"
  alt="Facebook"
  width={24}
  height={24}
  className="w-6 h-6"
  loading="lazy"
/>
                <span className="ml-3 sm:ml-4 text-sm sm:text-base text-[var(--color-text)] break-all">
                  {facebook}
                </span>
              </div>
            </a>
          )}

          {hasMap && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-2xl bg-[var(--color-bg)] p-4 sm:p-5 border border-[var(--color-primary-soft)] hover:border-[var(--color-primary)] shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center">
                <span className="text-lg sm:text-xl">📍</span>
                <span className="ml-3 sm:ml-4 text-sm sm:text-base text-[var(--color-text)]">
                  เปิดตำแหน่งร้านบน Google Maps
                </span>
              </div>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

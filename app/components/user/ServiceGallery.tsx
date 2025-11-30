"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

type ServiceGalleryProps = {
  images: string[];
};

export default function ServiceGallery({ images = [] }: ServiceGalleryProps) {
  if (!images || images.length === 0) return null;

  const pageSize = 3;
  const total = images.length;

  // index ของรูปเริ่มต้นของหน้า current
  const [start, setStart] = useState(0);

  // ถ้ามีรูป <= 3 ให้เลื่อนทีละ 1, ถ้ามีมากกว่า 3 ให้เลื่อนทีละ 3
  const step = total <= pageSize ? 1 : pageSize;

  // รูปที่แสดงในหน้าปัจจุบัน (วนรอบ)
  const visibleCount = Math.min(pageSize, total);
  const currentSet = Array.from({ length: visibleCount }, (_, i) => {
    const idx = (start + i) % total;
    return { url: images[idx], idx };
  });

  const goPrev = () => {
    setStart((s) => (s - step + total) % total);
  };

  const goNext = () => {
    setStart((s) => (s + step) % total);
  };

  // ---------- Lightbox ----------
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const prevImage = useCallback(() => {
    if (lightboxIndex === null || total <= 1) return;
    setLightboxIndex((i) => (i! === 0 ? total - 1 : i! - 1));
  }, [lightboxIndex, total]);

  const nextImage = useCallback(() => {
    if (lightboxIndex === null || total <= 1) return;
    setLightboxIndex((i) => (i! === total - 1 ? 0 : i! + 1));
  }, [lightboxIndex, total]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, closeLightbox, prevImage, nextImage]);

  const currentImage =
    lightboxIndex !== null ? images[lightboxIndex] : null;

  // แสดงเป็น “หน้า x / y”
  const totalPages = Math.ceil(total / pageSize);
  const currentPage =
    total <= pageSize ? 1 : Math.floor(start / pageSize) + 1;

  return (
    <section className="py-16 sm:py-20 bg-[var(--color-bg)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 sm:mb-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            รูปผลงานตัวอย่าง
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            ดูผลงานการซ่อมที่เคยให้บริการลูกค้า
          </p>
        </div>

        {/* MAIN GALLERY */}
        <div className="relative flex items-center">
          {/* ปุ่มซ้าย */}
          <button
            onClick={goPrev}
            type="button"
            className="mr-2 sm:mr-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white text-lg transition z-10"
          >
            ‹
          </button>

          {/* รูป 3 รูป */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              {currentSet.map(({ url, idx }) => (
                <button
                  key={idx}
                  type="button"
                  className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition"
                  onClick={() => openLightbox(idx)}
                >
                  <Image
                    src={url}
                    alt={`gallery-${idx}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ปุ่มขวา */}
          <button
            onClick={goNext}
            type="button"
            className="ml-2 sm:ml-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white text-lg transition z-10"
          >
            ›
          </button>
        </div>

        {/* ตัวบอกหน้า */}
        <div className="text-center mt-6 text-slate-500 text-sm">
          หน้า {currentPage} / {totalPages}
        </div>
      </div>

      {/* LIGHTBOX */}
      {currentImage && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="absolute inset-0 z-0" onClick={closeLightbox} />

          <div className="relative z-10 w-[96vw] max-w-[520px] sm:max-w-5xl h-[88vh] max-h-[92vh] bg-black rounded-2xl shadow-xl border border-white/20 flex flex-col overflow-hidden">
            {/* ปุ่มปิด */}
            <button
              onClick={closeLightbox}
              type="button"
              className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/35 text-white text-lg"
            >
              ✕
            </button>

            {/* ปุ่มซ้าย/ขวา */}
            {total > 1 && (
              <>
                <button
                  onClick={prevImage}
                  type="button"
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/35 text-white text-xl"
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  type="button"
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/35 text-white text-xl"
                >
                  ›
                </button>
              </>
            )}

            {/* รูปใหญ่ */}
            <div className="flex-1 flex items-center justify-center px-3 sm:px-6 pb-4 pt-12">
              <div className="relative w-full h-full">
                <Image
                  src={currentImage}
                  alt="preview"
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
            </div>

            <p className="pb-3 text-center text-white/70 text-xs sm:text-sm">
              {lightboxIndex !== null ? lightboxIndex + 1 : 0} / {total}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

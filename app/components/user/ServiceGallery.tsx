"use client";

import { useState } from "react";
import Image from "next/image";

type GalleryProps = {
  images: string[];
};

export default function ServiceGallery({ images }: GalleryProps) {
  const total = images.length;
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1); // 🔍 ระดับซูม

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    setZoom(1); // รีเซ็ตซูมทุกครั้งที่เปิด
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setLightboxIndex(null);
    setZoom(1); // รีเซ็ตซูม
  };

  const currentImage =
    lightboxIndex !== null && images[lightboxIndex]
      ? images[lightboxIndex]
      : null;

  const prevImage = () => {
    if (lightboxIndex === null || total === 0) return;
    setLightboxIndex((prev) => {
      if (prev === null) return 0;
      return prev === 0 ? total - 1 : prev - 1;
    });
    setZoom(1); // เวลาเปลี่ยนรูปให้กลับมา 1x
  };

  const nextImage = () => {
    if (lightboxIndex === null || total === 0) return;
    setLightboxIndex((prev) => {
      if (prev === null) return 0;
      return prev === total - 1 ? 0 : prev + 1;
    });
    setZoom(1); // เวลาเปลี่ยนรูปให้กลับมา 1x
  };

  // 🔍 toggle ซูม: 1x -> 2x -> 1x
  const toggleZoom = () => {
    setZoom((z) => (z === 1 ? 2 : 1));
  };

  return (
    <section className="py-12 sm:py-16 bg-[var(--color-bg)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-6 sm:mb-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
            รูปผลงานตัวอย่าง
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            ดูผลงานการซ่อมที่เคยให้บริการลูกค้า
          </p>
        </div>

        <div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-6">
            {images.map((url, idx) => (
              <button
                key={`${url}-${idx}`}
                type="button"
                className="relative w-full aspect-[3/5] rounded-lg sm:rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition"
                onClick={() => openLightbox(idx)}
              >
                <Image
                  src={url}
                  alt={`gallery-${idx}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 720px) 33vw, 16vw"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLightboxOpen && currentImage && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center">
          {/* คลิกพื้นหลังดำเพื่อปิด */}
          <div className="absolute inset-0 z-0" onClick={closeLightbox} />

          <div className="relative z-10 w-[96vw] max-w-[480px] sm:max-w-4xl h-[82vh] max-h-[90vh] bg-black rounded-2xl shadow-xl border border-white/20 flex flex-col overflow-hidden">
            {/* ปุ่มปิด */}
            <button
              onClick={closeLightbox}
              type="button"
              className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/35 text-white text-base sm:text-lg"
            >
              ✕
            </button>

            {/* ปุ่มก่อนหน้า / ถัดไป */}
            {total > 1 && (
              <>
                <button
                  onClick={prevImage}
                  type="button"
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/35 text-white text-lg sm:text-xl"
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  type="button"
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/35 text-white text-lg sm:text-xl"
                >
                  ›
                </button>
              </>
            )}

            {/* รูปหลัก + ซูม */}
            <div className="flex-1 flex items-center justify-center px-3 sm:px-6 pb-3 pt-10 sm:pt-12">
              <div
                className="relative w-full h-full overflow-hidden cursor-zoom-in"
                onClick={toggleZoom} // 👈 คลิกเพื่อซูม / ย่อ
              >
                <Image
                  src={currentImage}
                  alt="preview"
                  fill
                  className="object-contain transition-transform duration-300"
                  style={{ transform: `scale(${zoom})` }}
                  sizes="100vw"
                  loading="lazy"
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

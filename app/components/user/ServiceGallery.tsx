"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";

type ServiceGalleryProps = {
  images?: string[];
};

export default function ServiceGallery({ images = [] }: ServiceGalleryProps) {
  const validImages = useMemo(() => images.filter(Boolean), [images]);

  if (validImages.length === 0) return null;

  const total = validImages.length;
  const pageSize = 3;
  const [start, setStart] = useState(0);

  const step = total <= pageSize ? 1 : pageSize;
  const visibleCount = Math.min(pageSize, total);

  const currentSet = useMemo(
    () =>
      Array.from({ length: visibleCount }, (_, i) => {
        const idx = (start + i) % total;
        return { url: validImages[idx], idx };
      }),
    [visibleCount, start, total, validImages]
  );

  const goPrev = useCallback(() => {
    setStart((s) => (s - step + total) % total);
  }, [step, total]);

  const goNext = useCallback(() => {
    setStart((s) => (s + step) % total);
  }, [step, total]);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    if (index < 0 || index >= total) return;
    setLightboxIndex(index);
  };

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const prevImage = useCallback(() => {
    setLightboxIndex((i) => {
      if (i === null || total <= 1) return i;
      return i === 0 ? total - 1 : i - 1;
    });
  }, [total]);

  const nextImage = useCallback(() => {
    setLightboxIndex((i) => {
      if (i === null || total <= 1) return i;
      return i === total - 1 ? 0 : i + 1;
    });
  }, [total]);

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

  const isLightboxOpen =
    lightboxIndex !== null &&
    lightboxIndex >= 0 &&
    lightboxIndex < total &&
    !!validImages[lightboxIndex];

  const currentImage =
    isLightboxOpen && lightboxIndex !== null
      ? validImages[lightboxIndex]
      : null;

  const totalPages = Math.ceil(total / pageSize) || 1;
  const currentPage =
    total <= pageSize ? 1 : Math.floor(start / pageSize) + 1;

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

        <div className="relative flex items-center">
          {total > 1 && (
            <button
              onClick={goPrev}
              type="button"
              className="hidden sm:flex mr-4 w-9 h-9 items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white text-lg transition z-10"
            >
              ‹
            </button>
          )}

          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {currentSet.map(({ url, idx }) => (
                <button
                  key={`${url}-${idx}`}
                  type="button"
                  className="relative w-full aspect-[3/4] rounded-lg sm:rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition"
                  onClick={() => openLightbox(idx)}
                >
                  <Image
                    src={url}
                    alt={`gallery-${idx}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 33vw"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>

          {total > 1 && (
            <button
              onClick={goNext}
              type="button"
              className="hidden sm:flex ml-4 w-9 h-9 items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white text-lg transition z-10"
            >
              ›
            </button>
          )}
        </div>

        <div className="text-center mt-4 text-slate-500 text-xs sm:text-sm">
          หน้า {currentPage} / {totalPages}
        </div>
      </div>

      {isLightboxOpen && currentImage && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="absolute inset-0 z-0" onClick={closeLightbox} />

          <div className="relative z-10 w-[96vw] max-w-[480px] sm:max-w-4xl h-[82vh] max-h-[90vh] bg-black rounded-2xl shadow-xl border border-white/20 flex flex-col overflow-hidden">
            <button
              onClick={closeLightbox}
              type="button"
              className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/35 text-white text-base sm:text-lg"
            >
              ✕
            </button>

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

            <div className="flex-1 flex items-center justify-center px-3 sm:px-6 pb-3 pt-10 sm:pt-12">
              <div className="relative w-full h-full">
                <Image
                  src={currentImage}
                  alt="preview"
                  fill
                  className="object-contain"
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

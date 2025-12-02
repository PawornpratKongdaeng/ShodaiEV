"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

type HeroProps = {
  imageUrl: string | string[];
};

export default function Hero({ imageUrl }: HeroProps) {
  const imageUrls = useMemo(
    () =>
      (Array.isArray(imageUrl) ? imageUrl : imageUrl ? [imageUrl] : []).filter(
        Boolean
      ),
    [imageUrl]
  );

  if (imageUrls.length === 0) return null;

  const total = imageUrls.length;
  const [index, setIndex] = useState(0);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i === 0 ? total - 1 : i - 1));
  }, [total]);

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext, total]);

  return (
    <section className="w-full h-auto object-cover bg-[var(--color-bg)] pt-0 sm:pt-0">
      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {imageUrls.map((src, i) => (
            <div key={src + i} className="w-full flex-shrink-0">
              <div className="relative w-full h-[260px] sm:h-[320px] md:h-[380px] lg:h-[460px] xl:h-[520px]">
                <img
                  src={src}
                  alt="ShodaiEV Banner"
                  className="w-full h-full object-cover"
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
            </div>
          ))}
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-10
                         w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center
                         rounded-full bg-black/40 hover:bg-black/60 text-white text-lg"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-10
                         w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center
                         rounded-full bg-black/40 hover:bg-black/60 text-white text-lg"
            >
              ›
            </button>

            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
              {imageUrls.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full border border-white/70 transition
                    ${index === i ? "bg-white" : "bg-white/30"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

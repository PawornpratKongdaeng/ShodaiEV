"use client";

import type { ProductItem } from "@/lib/server/siteData";
import Image from "next/image";

type ProductsSectionProps = {
  products: ProductItem[];
};

export default function ProductsSection({ products }: ProductsSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section id="products" className="py-14 sm:py-16 bg-white px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-5 sm:mb-7">
          สินค้าแนะนำ
        </h2>

        <div className="grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <article
              key={p.id}
              className="bg-white rounded-xl border border-orange-200 hover:border-orange-500 shadow-sm hover:shadow-md transition-all"
            >
              {p.imageUrl && (
                <figure className="h-32 sm:h-40 md:h-44 overflow-hidden rounded-t-xl">
                  <div className="relative w-full h-full">
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
                      loading="lazy"
                    />
                  </div>
                </figure>
              )}

              <div className="p-3 sm:p-4">
                <h3 className="text-slate-900 text-sm sm:text-base font-semibold line-clamp-2">
                  {p.name || "สินค้า"}
                </h3>
                {p.description && (
                  <p className="text-[11px] sm:text-xs text-slate-600 mt-1 line-clamp-3">
                    {p.description}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

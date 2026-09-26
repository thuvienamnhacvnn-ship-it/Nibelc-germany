"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Ảnh lớn kèm cột ảnh nhỏ bên trái — theo bộ mẫu mới (màn 03).
 * Ảnh lấy từ bốn slot KIT của ngành tương ứng, không thêm ảnh mới.
 */
export function JobGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex gap-3">
      <ul className="hidden w-[96px] shrink-0 flex-col gap-3 sm:flex">
        {images.map((src, i) => (
          <li key={src}>
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${alt} ${i + 1}`}
              aria-current={i === active}
              className={`relative block h-[72px] w-full overflow-hidden rounded-lg ring-2 transition ${
                i === active ? "ring-[var(--nb-orange)]" : "ring-transparent hover:ring-white/40"
              }`}
            >
              <Image src={src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          </li>
        ))}
      </ul>

      <div className="relative aspect-[16/10] min-w-0 flex-1 overflow-hidden rounded-2xl sm:aspect-[16/9]">
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={i === active ? alt : ""}
            fill
            priority={i === 0}
            sizes="(min-width:1024px) 760px, 100vw"
            className={`object-cover transition-opacity duration-500 motion-reduce:transition-none ${i === active ? "opacity-100" : "opacity-0"}`}
          />
        ))}
      </div>
    </div>
  );
}

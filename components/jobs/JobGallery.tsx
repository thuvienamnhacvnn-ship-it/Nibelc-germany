"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

/** Thư viện ảnh nơi làm việc của một đơn hàng. */
export function JobGallery({ anh, ten }: { anh: string[]; ten: string }) {
  const [mo, setMo] = useState(0);
  const chinh = anh[mo] ?? anh[0]!;

  return (
    <div>
      <motion.span
        key={chinh}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="relative block aspect-[16/9] overflow-hidden rounded-[14px] border border-[var(--nb-line-soft)] lg:rounded-2xl lg:border-[var(--s-line,var(--nb-line-soft))]"
      >
        <Image src={chinh} alt={ten} fill priority sizes="(min-width:1024px) 62vw, 100vw" className="object-cover" />
      </motion.span>

      {anh.length > 1 && (
        <ul className="nb-no-scrollbar mt-3 flex gap-2.5 overflow-x-auto pb-1">
          {anh.map((a, i) => (
            <li key={a}>
              <button
                type="button"
                onClick={() => setMo(i)}
                aria-label={`Ảnh ${i + 1}`}
                aria-pressed={i === mo}
                className={`relative block h-[64px] w-[92px] shrink-0 overflow-hidden rounded-[8px] border transition ${
                  i === mo ? "border-[var(--nb-gold)] lg:border-2 lg:border-[var(--s-ink,var(--nb-gold))]" : "border-[var(--nb-line-soft)] hover:border-[var(--nb-line)] lg:border-[var(--s-line,var(--nb-line-soft))]"
                }`}
              >
                <Image src={a} alt="" fill sizes="92px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

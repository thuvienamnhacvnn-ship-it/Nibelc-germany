"use client";

import { useState } from "react";
import type { ReactNode } from "react";

/**
 * Dải tab của bộ KIT: nhãn nằm trên một đường kẻ mảnh, tab đang mở có nền
 * vàng nhạt và gạch vàng bên dưới. Nội dung đổi ngay, không tải lại trang.
 */
export function Tabs({ items }: { items: { key: string; label: string; body: ReactNode }[] }) {
  const [mo, setMo] = useState(items[0]?.key ?? "");
  const hien = items.find((i) => i.key === mo) ?? items[0];

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto border-b border-white/12 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((i) => {
          const on = i.key === hien?.key;
          return (
            <button
              key={i.key}
              type="button"
              onClick={() => setMo(i.key)}
              aria-current={on ? "true" : undefined}
              className={`relative shrink-0 rounded-t-lg px-5 py-3.5 text-[14px] font-semibold whitespace-nowrap transition ${
                on ? "bg-[var(--nb-gold)]/12 text-[var(--nb-gold)]" : "text-white/55 hover:text-white/85"
              }`}
            >
              {i.label}
              {on && <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-[var(--nb-gold)]" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
      <div className="pt-8">{hien?.body}</div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * Thẻ tab của trang chi tiết đơn hàng (theo bộ mẫu mới của Sếp).
 * Chỉ là lớp trình bày: nội dung từng tab do trang truyền vào, dữ liệu vẫn
 * đọc từ `content/jobs-current.ts`.
 */
export function JobTabs({ tabs }: { tabs: { id: string; label: string; icon?: string; content: React.ReactNode }[] }) {
  const [open, setOpen] = useState(tabs[0]?.id ?? "");

  return (
    <div>
      <div role="tablist" aria-label="Details" className="flex gap-1 overflow-x-auto border-b border-[#e3e9f1] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((t) => {
          const active = t.id === open;
          return (
            <button
              key={t.id}
              role="tab"
              type="button"
              id={`tab-${t.id}`}
              aria-selected={active}
              aria-controls={`panel-${t.id}`}
              onClick={() => setOpen(t.id)}
              className={`relative flex shrink-0 items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap transition ${
                active ? "text-[var(--nb-blue-dark)]" : "text-[#5b6b80] hover:text-[#10284d]"
              }`}
            >
              {t.icon && <Icon name={t.icon} className="h-4 w-4" strokeWidth={1.9} />}
              {t.label}
              {active && <span className="absolute inset-x-2 -bottom-px h-[3px] rounded-full bg-[var(--nb-orange)]" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`panel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          hidden={t.id !== open}
          className="pt-6"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ROUTES, type Locale } from "@/content/locales";

/**
 * Ô tìm trên banner — theo màn 01 của bộ mẫu mới.
 *
 * Không có máy tìm kiếm riêng, nên ô này dẫn thẳng sang trang đơn hàng kèm từ
 * khoá trên địa chỉ (`?q=`); trang đó lọc trong ba đơn đang có. Không hứa hẹn
 * kết quả nào ngoài dữ liệu thật.
 */

const WORDS: Record<Locale, { placeholder: string; submit: string }> = {
  de: { placeholder: "Stelle, Branche oder Ort suchen …", submit: "Suchen" },
  en: { placeholder: "Search position, industry or city …", submit: "Search" },
  vi: { placeholder: "Tìm đơn hàng theo nghề, ngành hoặc nơi làm …", submit: "Tìm" },
};

export function HeroSearch({ locale }: { locale: Locale }) {
  const w = WORDS[locale];
  const router = useRouter();
  const [q, setQ] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const base = ROUTES.jobs[locale];
        router.push((q.trim() ? `${base}?q=${encodeURIComponent(q.trim())}` : base) as never);
      }}
      role="search"
      className="flex w-full max-w-[560px] items-center gap-2 rounded-2xl bg-white/95 p-2 shadow-[0_18px_40px_-18px_rgba(6,26,54,.8)] backdrop-blur"
    >
      <label className="flex min-w-0 flex-1 items-center gap-2 pl-3">
        <Icon name="search" className="h-5 w-5 shrink-0 text-[#5b6b80]" strokeWidth={2} />
        <span className="sr-only">{w.submit}</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={w.placeholder}
          className="h-11 w-full min-w-0 bg-transparent text-[15px] text-[#10284d] outline-none placeholder:text-[#8a99ad]"
        />
      </label>
      <button
        type="submit"
        className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-[var(--nb-orange)] px-5 font-semibold text-white hover:bg-[var(--nb-orange-dark)]"
      >
        {w.submit}
      </button>
    </form>
  );
}

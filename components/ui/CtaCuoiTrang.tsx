"use client";

import { ArrowRight, Phone } from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import { LEGAL } from "@/data/company";
import { useT } from "@/lib/i18n/client";
import { home } from "@/lib/i18n/dict/home";

/**
 * CTA cuối trang con — khối navy nối thẳng footer navy (thân trang sáng ở trên).
 * CHỈ máy tính (hidden lg:block): khổ điện thoại do phiên mobile giữ, không thêm khối.
 * Chữ dùng lại câu đã có trên web (trang liên hệ, nút "Bắt đầu hành trình cùng NIBELC"),
 * không viết câu mới. Bản en/de ở lib/i18n/dict/home.ts (khoá `cta`).
 *
 * Client component (useT) để dùng được ở cả trang server lẫn client.
 */
export function CtaCuoiTrang() {
  const tx = useT(home).cta;
  const tel = LEGAL.phone.replace(/\s/g, "");
  return (
    <section className="nb-toi hidden border-b border-white/10 lg:block">
      <div className="nb-wrap flex items-center justify-between gap-10 py-16">
        <div className="max-w-[640px]">
          <p className="nb-eyebrow">{tx.nhan}</p>
          <h2 className="nb-display mt-3 text-[32px] leading-tight text-white">{tx.tieuDe}</h2>
          <p className="mt-3 text-[16px] leading-[1.7]">{tx.mo}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <a href={`tel:${tel}`} aria-label={tx.goi(LEGAL.phone)} className="nb-btn-ghost h-12 px-6 text-[15px]">
            <Phone size={16} />
            {LEGAL.phone}
          </a>
          <NavLink href="/lien-he" className="nb-btn h-12 px-7 text-[15px]">
            {tx.dangKy}
            <ArrowRight size={16} />
          </NavLink>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { LANGS, TEN_NGON_NGU, lh, type Lang } from "@/lib/i18n/config";
import { useDuongDan, useLang, useT } from "@/lib/i18n/client";
import { common } from "@/lib/i18n/dict/common";
import { useChuyenTrang } from "@/components/layout/PageTransition";

/**
 * NÚT CHỌN NGÔN NGỮ — giữ nguyên trang đang xem, chỉ đổi tiền tố (/, /en, /de),
 * chạy qua hiệu ứng chuyển trang. Giữ cả ?query (vd bộ lọc đơn hàng).
 *
 * Tên ngôn ngữ viết bằng chính ngôn ngữ đó và mang thuộc tính lang riêng —
 * trình đọc màn hình đọc đúng giọng, script kiểm lẫn ngôn ngữ bỏ qua.
 *
 *   kieu="menu"  → nút tròn + danh sách thả xuống (Header máy tính)
 *   kieu="hang"  → ba nút VI · EN · DE nằm ngang (Footer, mọi khổ màn)
 */
export function ChonNgonNgu({ kieu = "menu", className = "" }: { kieu?: "menu" | "hang"; className?: string }) {
  const lang = useLang();
  const tx = useT(common);
  const duongDan = useDuongDan();
  const chuyenTrang = useChuyenTrang();
  const [mo, setMo] = useState(false);
  const hop = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mo) return;
    const ngoai = (e: PointerEvent) => {
      if (hop.current && !hop.current.contains(e.target as Node)) setMo(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMo(false);
    document.addEventListener("pointerdown", ngoai);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", ngoai);
      document.removeEventListener("keydown", esc);
    };
  }, [mo]);

  function doi(l: Lang) {
    setMo(false);
    if (l === lang) return;
    // Truyền href ĐÃ có tiền tố của ngôn ngữ mới. PageTransition nhận ra tiền
    // tố khác trang hiện tại thì dựng lại cả khung (Header/Footer/<html lang>).
    chuyenTrang(lh(`${duongDan}${window.location.search}`, l));
  }

  if (kieu === "hang") {
    return (
      <div role="group" aria-label={tx.chonNgonNgu} className={`flex items-center gap-1.5 ${className}`}>
        <Globe size={14} className="mr-1 text-[var(--nb-gold)]" aria-hidden="true" />
        {LANGS.map((l) => {
          const on = l === lang;
          return (
            <button
              key={l}
              type="button"
              onClick={() => doi(l)}
              aria-pressed={on}
              aria-label={TEN_NGON_NGU[l].ten}
              lang={l}
              className={`h-8 min-w-[40px] rounded-full border px-2.5 text-[12.5px] font-semibold transition ${
                on
                  ? "border-[var(--nb-gold)] bg-[var(--nb-gold)] text-[var(--nb-navy-900)]"
                  : "border-[var(--nb-line-soft)] text-[var(--nb-text-dim)] hover:border-[var(--nb-line)] hover:text-[var(--nb-gold-soft)]"
              }`}
            >
              {TEN_NGON_NGU[l].ma}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={hop} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setMo((v) => !v)}
        aria-label={tx.chonNgonNgu}
        aria-haspopup="menu"
        aria-expanded={mo}
        className="flex h-9 items-center gap-1.5 rounded-full border border-[var(--nb-line-soft)] px-3 text-[13px] font-medium text-[var(--nb-text-dim)] transition hover:border-[var(--nb-line)] hover:text-[var(--nb-gold-soft)]"
      >
        <Globe size={15} />
        {TEN_NGON_NGU[lang].ma}
        <ChevronDown size={13} className={`transition-transform ${mo ? "rotate-180" : ""}`} />
      </button>

      {mo && (
        <ul
          role="menu"
          aria-label={tx.chonNgonNgu}
          className="absolute right-0 top-[calc(100%+8px)] z-10 min-w-[170px] overflow-hidden rounded-xl border border-[var(--nb-line-soft)] bg-[var(--nb-navy-800)] py-1.5 shadow-[0_18px_40px_-12px_rgba(3,12,26,.7)]"
        >
          {LANGS.map((l) => {
            const on = l === lang;
            return (
              <li key={l} role="none">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={on}
                  lang={l}
                  onClick={() => doi(l)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13.5px] transition ${
                    on ? "text-[var(--nb-gold-soft)]" : "text-[var(--nb-text-dim)] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="w-6 text-[12px] font-semibold">{TEN_NGON_NGU[l].ma}</span>
                  <span className="flex-1">{TEN_NGON_NGU[l].ten}</span>
                  {on && <Check size={14} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Globe, MoreHorizontal } from "lucide-react";
import { MenuDayDu } from "@/components/layout/MenuDayDu";

/**
 * ĐỈNH BANNER — hai nút nổi ở hai góc trên của banner, CHỈ khổ điện thoại.
 *
 * Sếp chốt: ngôn ngữ ở góc TRÁI, ba chấm mở menu ở góc PHẢI.
 *
 * Đây KHÔNG phải header. Nó `absolute` trong banner nên trôi theo trang lúc
 * cuộn, đúng luật Sếp đặt: "bỏ nền và logo ở header khi lướt trang chủ".
 * Không có tấm nền chạy ngang, chỉ hai viên tròn — nền banner vẫn nhìn xuyên
 * qua. Mỗi viên 44px để ngón tay bấm trúng.
 *
 * Dùng chung cho cả trang chủ (Hero) lẫn trang phụ (PageHero), vì menu đáy
 * chỉ chứa được năm mục còn trang thì nhiều hơn thế.
 */

/**
 * NGÔN NGỮ — trạng thái thật tính tới 02/10/2026.
 *
 * Trang mới chỉ có bản tiếng Việt. Chưa có hệ thống đa ngữ nào phía sau:
 * không route theo ngôn ngữ, không file dịch, nội dung nằm thẳng trong
 * component. Nút "VI" ở header bản máy tính cũng là nút chết từ trước, bấm
 * không ra gì.
 *
 * Nên ở đây hai thứ tiếng kia hiện ra nhưng KHOÁ, kèm chữ "Sắp có". Cho bấm
 * được rồi chẳng đổi gì mới là lừa người đọc. Khi nào dựng xong i18n và dịch
 * xong nội dung thì mở `dung: true` là chạy.
 */
const NGON_NGU = [
  { ma: "vi", ten: "Tiếng Việt", goi: "VI", dung: true },
  { ma: "de", ten: "Deutsch", goi: "DE", dung: false },
  { ma: "en", ten: "English", goi: "EN", dung: false },
] as const;

export function DinhBanner() {
  const [moMenu, setMoMenu] = useState(false);
  const [moNgonNgu, setMoNgonNgu] = useState(false);
  const boc = useRef<HTMLDivElement>(null);

  /* Bấm ra ngoài hoặc Esc thì đóng khay ngôn ngữ. Khay nhỏ nên không khoá
     cuộn nền — khoá cuộn chỉ dành cho tấm menu chiếm cả màn hình. */
  useEffect(() => {
    if (!moNgonNgu) return;
    const ngoai = (e: MouseEvent) => {
      if (boc.current && !boc.current.contains(e.target as Node)) setMoNgonNgu(false);
    };
    const phim = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoNgonNgu(false);
    };
    document.addEventListener("mousedown", ngoai);
    window.addEventListener("keydown", phim);
    return () => {
      document.removeEventListener("mousedown", ngoai);
      window.removeEventListener("keydown", phim);
    };
  }, [moNgonNgu]);

  const hienTai = NGON_NGU.find((n) => n.dung) ?? NGON_NGU[0];

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-start justify-between px-3 pt-3 lg:hidden">
        {/* ---------- TRÁI: ngôn ngữ ---------- */}
        <div ref={boc} className="pointer-events-auto relative">
          <button
            type="button"
            onClick={() => setMoNgonNgu((v) => !v)}
            aria-expanded={moNgonNgu}
            aria-haspopup="listbox"
            aria-label={`Ngôn ngữ: ${hienTai.ten}. Đổi ngôn ngữ`}
            className="flex h-11 items-center gap-1.5 rounded-full border border-[var(--nb-gold)]/60 bg-[var(--nb-navy-900)]/55 px-3.5 text-[13.5px] font-semibold text-white backdrop-blur-md transition active:scale-95"
          >
            <Globe size={16} className="shrink-0 text-[var(--nb-gold-strong)]" />
            {hienTai.goi}
            <ChevronDown
              size={14}
              className={`shrink-0 text-white/70 transition-transform duration-250 ${moNgonNgu ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {moNgonNgu && (
              <motion.ul
                role="listbox"
                aria-label="Chọn ngôn ngữ"
                className="absolute top-[calc(100%+8px)] left-0 w-[196px] overflow-hidden rounded-2xl border border-[var(--nb-line)] bg-[var(--nb-navy-800)]/97 py-1.5 backdrop-blur-xl"
                style={{ boxShadow: "0 26px 54px -24px rgba(0,0,0,.95)" }}
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
              >
                {NGON_NGU.map((n) => {
                  const dangDung = n.ma === hienTai.ma;
                  return (
                    <li key={n.ma} role="option" aria-selected={dangDung} aria-disabled={!n.dung}>
                      <button
                        type="button"
                        disabled={!n.dung}
                        onClick={() => setMoNgonNgu(false)}
                        className={`flex min-h-[44px] w-full items-center gap-2.5 px-3.5 text-left text-[14px] ${
                          n.dung
                            ? "text-white"
                            : "cursor-not-allowed text-[var(--nb-text-mute)]"
                        }`}
                      >
                        <span className="w-7 shrink-0 text-[12.5px] font-bold tracking-[0.04em] text-[var(--nb-gold-soft)]">
                          {n.goi}
                        </span>
                        <span className="min-w-0 flex-1 truncate leading-[1.4]">{n.ten}</span>
                        {dangDung ? (
                          <Check size={16} className="shrink-0 text-[var(--nb-gold-strong)]" />
                        ) : (
                          <span className="shrink-0 rounded-full border border-[var(--nb-line-soft)] px-2 py-0.5 text-[11px] leading-[1.5]">
                            Sắp có
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* ---------- PHẢI: ba chấm mở menu ---------- */}
        <button
          type="button"
          onClick={() => setMoMenu(true)}
          aria-label="Mở menu"
          aria-expanded={moMenu}
          className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-[var(--nb-gold)]/60 bg-[var(--nb-navy-900)]/55 text-white backdrop-blur-md transition active:scale-95"
        >
          <MoreHorizontal size={20} />
        </button>
      </div>

      <MenuDayDu mo={moMenu} dong={() => setMoMenu(false)} />
    </>
  );
}

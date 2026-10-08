"use client";

import { useEffect, useState } from "react";
import { LogoDong } from "@/components/home/LogoDong";
import { motion } from "framer-motion";
import { Headphones, Search, X } from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import { NAV } from "@/data/nav";
import { useChuyenTrang } from "@/components/layout/PageTransition";
import { ChonNgonNgu } from "@/components/layout/ChonNgonNgu";
import { useDuongDan, useLang, useLh, useT } from "@/lib/i18n/client";
import { common } from "@/lib/i18n/dict/common";

/**
 * HEADER TOÀN CỤC
 *
 * Mỏng, nền navy, blur rất nhẹ khi cuộn. Mục đang mở có gạch vàng chạy dưới
 * chân — dùng layoutId của Framer Motion nên gạch trượt từ mục này sang mục
 * kia thay vì nhảy.
 */

export function Header() {
  const pathname = useDuongDan();
  const lang = useLang();
  const tx = useT(common);
  const [daCuon, setDaCuon] = useState(false);
  const [moTim, setMoTim] = useState(false);

  useEffect(() => {
    const f = () => setDaCuon(window.scrollY > 12);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  function dangMo(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        // Điện thoại bỏ header ở MỌI trang, kể cả trang chủ: logo đã nằm
        // trong banner, điều hướng dồn vào menu đáy. Cuộn xuống là không còn
        // nền lẫn logo nào bám trên đỉnh màn hình.
        "hidden lg:block"
      } ${
        daCuon
          ? "bg-[var(--nb-navy-800)]/92 backdrop-blur-md"
          : // Điện thoại: để trống hẳn cho logo nổi thẳng trên banner, không
            // có dải mờ cắt ngang ảnh. Màn rộng vẫn cần nền vì có cả hàng menu.
            "bg-transparent lg:bg-[var(--nb-navy-800)]/70"
      }`}
      style={{ height: "var(--nb-header)" }}
    >
      {/* Trên điện thoại: logo đứng GIỮA, nút chức năng dạt sang phải. Dùng
          một ô trống cùng bề ngang bên trái để logo cân đúng tâm màn hình. */}
      <div className="nb-wrap flex h-full items-center gap-8">
        <span className="h-9 w-9 shrink-0 lg:hidden" aria-hidden="true" />
        <NavLink
          href="/"
          aria-label={tx.logoAria}
          className="mx-auto shrink-0 lg:mx-0"
        >
          {/* Sếp 08/10: logo 3D động thay logo cũ ở mọi trang. Hộp 164px →
              cao 52px, phần hình ~42px, lọt trong header 72px. */}
          <LogoDong ban="nho" className="w-[164px]" />
        </NavLink>

        <nav aria-label={tx.menuChinh} className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex">
          {NAV.map((m) => {
            const on = dangMo(m.href);
            return (
              <NavLink
                key={m.href}
                href={m.href}
                aria-current={on ? "page" : undefined}
                className={`relative px-3.5 py-2 text-[14.5px] font-medium whitespace-nowrap transition-colors ${
                  on ? "text-[var(--nb-gold-soft)]" : "text-[var(--nb-text-dim)] hover:text-white"
                }`}
              >
                {m.label[lang]}
                {on && (
                  <motion.span
                    layoutId="nav-gach"
                    className="absolute inset-x-3 -bottom-[3px] h-[2px] rounded-full"
                    style={{
                      background: "linear-gradient(90deg, transparent, var(--nb-gold-strong), transparent)",
                      boxShadow: "0 0 10px rgba(224,172,61,.6)",
                    }}
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2.5 lg:ml-auto">
          <button
            type="button"
            onClick={() => setMoTim((v) => !v)}
            aria-label={moTim ? tx.dongTim : tx.moTim}
            aria-expanded={moTim}
            className="grid h-9 w-9 place-items-center rounded-full border border-[var(--nb-line-soft)] text-[var(--nb-text-dim)] transition hover:border-[var(--nb-line)] hover:text-[var(--nb-gold-soft)]"
          >
            {moTim ? <X size={16} /> : <Search size={16} />}
          </button>

          <ChonNgonNgu className="hidden xl:block" />

          <span className="hidden lg:contents">
            <NavLink href="/lien-he" className="nb-btn h-9 px-4 text-[13.5px]">
              <Headphones size={15} />
              {tx.tuVanNgay}
            </NavLink>
          </span>
        </div>
      </div>

      {/* Hộp tìm kiếm kéo xuống từ header */}
      <motion.div
        initial={false}
        animate={{ height: moTim ? 68 : 0, opacity: moTim ? 1 : 0 }}
        transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
        className="overflow-hidden border-t border-[var(--nb-line-soft)] bg-[var(--nb-navy-800)]/95 backdrop-blur-md"
      >
        <div className="nb-wrap flex h-[68px] items-center">
          <TimNhanh dong={() => setMoTim(false)} />
        </div>
      </motion.div>
    </header>
  );
}

/** Ô tìm nhanh trong header — dùng chung bộ tìm với trang chủ */
function TimNhanh({ dong }: { dong: () => void }) {
  const chuyen = useChuyenTrang();
  const tx = useT(common);
  const lhx = useLh();
  const [tu, setTu] = useState("");
  return (
    <form
      className="flex w-full items-center gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        dong();
        chuyen(lhx(`/don-hang${tu.trim() ? `?q=${encodeURIComponent(tu.trim())}` : ""}`));
      }}
    >
      <Search size={17} className="shrink-0 text-[var(--nb-gold)]" />
      <input
        autoFocus
        value={tu}
        onChange={(e) => setTu(e.target.value)}
        placeholder={tx.timGoiY}
        className="h-10 flex-1 bg-transparent text-[15px] text-white outline-none placeholder:text-[var(--nb-text-mute)]"
        aria-label={tx.timAria}
      />
      <button type="submit" className="nb-btn-ghost h-9 px-4 text-[13.5px]">
        {tx.nutTim}
      </button>
    </form>
  );
}

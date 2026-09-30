"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe, Headphones, Search, X } from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import { NAV } from "@/data/nav";
import { useChuyenTrang } from "@/components/layout/PageTransition";

/**
 * HEADER TOÀN CỤC
 *
 * Mỏng, nền navy, blur rất nhẹ khi cuộn. Mục đang mở có gạch vàng chạy dưới
 * chân — dùng layoutId của Framer Motion nên gạch trượt từ mục này sang mục
 * kia thay vì nhảy.
 */

export function Header() {
  const pathname = usePathname();
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
        daCuon ? "bg-[var(--nb-navy-800)]/92 backdrop-blur-md" : "bg-[var(--nb-navy-800)]/70"
      }`}
      style={{ height: "var(--nb-header)" }}
    >
      <div className="nb-wrap flex h-full items-center gap-8">
        <NavLink href="/" aria-label="NIBELC GROUP — về trang chủ" className="shrink-0">
          <Image
            src="/assets/brand/nibelc-logo.svg"
            alt="NIBELC GROUP"
            width={200}
            height={44}
            priority
            className="h-8 w-auto"
          />
        </NavLink>

        <nav aria-label="Menu chính" className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex">
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
                {m.label}
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

        <div className="ml-auto flex shrink-0 items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMoTim((v) => !v)}
            aria-label={moTim ? "Đóng tìm kiếm" : "Mở tìm kiếm"}
            aria-expanded={moTim}
            className="grid h-9 w-9 place-items-center rounded-full border border-[var(--nb-line-soft)] text-[var(--nb-text-dim)] transition hover:border-[var(--nb-line)] hover:text-[var(--nb-gold-soft)]"
          >
            {moTim ? <X size={16} /> : <Search size={16} />}
          </button>

          <button
            type="button"
            aria-label="Chọn ngôn ngữ"
            className="hidden h-9 items-center gap-1.5 rounded-full border border-[var(--nb-line-soft)] px-3 text-[13px] font-medium text-[var(--nb-text-dim)] transition hover:border-[var(--nb-line)] hover:text-[var(--nb-gold-soft)] xl:flex"
          >
            <Globe size={15} />
            VI
          </button>

          <NavLink href="/lien-he" className="nb-btn h-9 px-4 text-[13.5px]">
            <Headphones size={15} />
            Tư vấn ngay
          </NavLink>
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
  const [tu, setTu] = useState("");
  return (
    <form
      className="flex w-full items-center gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        dong();
        chuyen(`/don-hang${tu.trim() ? `?q=${encodeURIComponent(tu.trim())}` : ""}`);
      }}
    >
      <Search size={17} className="shrink-0 text-[var(--nb-gold)]" />
      <input
        autoFocus
        value={tu}
        onChange={(e) => setTu(e.target.value)}
        placeholder="Tìm kiếm đơn hàng, ngành nghề, địa điểm..."
        className="h-10 flex-1 bg-transparent text-[15px] text-white outline-none placeholder:text-[var(--nb-text-mute)]"
        aria-label="Tìm kiếm"
      />
      <button type="submit" className="nb-btn-ghost h-9 px-4 text-[13.5px]">
        Tìm
      </button>
    </form>
  );
}

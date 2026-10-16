"use client";

import { useEffect, useState } from "react";
import { LogoDong } from "@/components/home/LogoDong";
import { motion } from "framer-motion";
import { Headphones, Search } from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import { NAV } from "@/data/nav";
import { DoiChuDe } from "./DoiChuDe";
import { WebsiteNetworkMenu } from "./WebsiteNetworkMenu";
import { ChonNgonNgu } from "@/components/layout/ChonNgonNgu";
import { useDuongDan, useLang, useT } from "@/lib/i18n/client";
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
      <div className="nb-wrap flex h-full items-center gap-4 xl:gap-8">
        <span className="h-9 w-9 shrink-0 lg:hidden" aria-hidden="true" />
        <NavLink
          href="/"
          aria-label={tx.logoAria}
          className="mx-auto shrink-0 lg:mx-0"
        >
          {/* Sếp 08/10: logo 3D động thay logo cũ ở mọi trang. Hộp 164px →
              cao 52px, phần hình ~42px, lọt trong header 72px. */}
          <LogoDong ban="nho" className="w-[128px] xl:w-[164px]" />
        </NavLink>

        <nav aria-label={tx.menuChinh} className="hidden min-w-0 flex-1 items-center justify-center gap-0 lg:flex xl:gap-1">
          {NAV.map((m) => {
            const on = dangMo(m.href);
            return (
              <NavLink
                key={m.href}
                href={m.href}
                aria-current={on ? "page" : undefined}
                className={`relative px-2 py-2 text-[13.5px] font-medium xl:px-3 xl:text-[14.5px] 2xl:px-3.5 whitespace-nowrap transition-colors ${
                  on ? "text-[var(--nb-accent-text)]" : "text-[var(--nb-text-dim)] hover:text-[var(--nb-heading)]"
                }`}
              >
                {m.label[lang]}
                {on && (
                  <motion.span
                    layoutId="nav-gach"
                    className="absolute inset-x-3 -bottom-[3px] h-[2px] rounded-full"
                    style={{
                      background: "linear-gradient(90deg, transparent, var(--nb-gold-strong), transparent)",
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
            onClick={() => window.dispatchEvent(new Event("nb:command"))}
            aria-label={tx.moTim}
            aria-haspopup="dialog"
            aria-keyshortcuts="Control+k Meta+k"
            className="grid h-9 w-9 place-items-center rounded-full border border-[var(--nb-line-soft)] text-[var(--nb-text-dim)] transition hover:border-[var(--nb-line)] hover:text-[var(--nb-accent-text)]"
          >
            <Search size={16} />
          </button>

          <ChonNgonNgu />
          <DoiChuDe />

          <span className="nb-header-cta hidden lg:contents">
            <NavLink data-magnetic href="/lien-he" className="nb-btn h-9 px-4 text-[13.5px]">
              <Headphones size={15} />
              {tx.tuVanNgay}
            </NavLink>
          </span>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-full z-[70]"><div className="nb-wrap flex justify-end"><WebsiteNetworkMenu /></div></div>
    </header>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { LEGAL } from "@/content/legal";

/**
 * KHUNG CHUNG V2 — nền sáng theo poster A2.
 *
 * Thanh trên: dải ba màu cờ Đức mảnh · logo · menu · chọn ngôn ngữ · nút đỏ.
 * Thanh dưới cho điện thoại: 5 ô bám ngón tay.
 * Chân trang: nền xanh đậm, thông tin pháp nhân và liên hệ.
 */

export const MENU: { ma: string; ten: string; href: string; icon: string }[] = [
  { ma: "trang-chu", ten: "Trang chủ", href: "/", icon: "home" },
  { ma: "don-hang", ten: "Đơn hàng", href: "/don-hang", icon: "briefcase" },
  { ma: "du-hoc-nghe", ten: "Du học nghề", href: "/du-hoc-nghe", icon: "cap" },
  { ma: "lo-trinh", ten: "Lộ trình", href: "/lo-trinh", icon: "doc" },
  { ma: "cam-nang", ten: "Cẩm nang", href: "/cam-nang", icon: "book" },
  { ma: "ve-chung-toi", ten: "Về chúng tôi", href: "/ve-chung-toi", icon: "handshake" },
];

const TAB_DAY = ["trang-chu", "don-hang", "du-hoc-nghe", "lo-trinh", "ve-chung-toi"];

export function Shell({ trang, children }: { trang: string; children: ReactNode }) {
  const [moMenu, setMoMenu] = useState(false);
  const tel = LEGAL.phone.replace(/\s/g, "");

  return (
    <div className="nb2 min-h-screen">
      {/* dải cờ Đức mảnh trên cùng */}
      <div className="v2-co-duc h-[3px] w-full" aria-hidden="true" />

      <header className="sticky top-0 z-50 border-b border-[var(--v2-vien)] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[66px] max-w-[1480px] items-center gap-6 px-5 lg:h-[74px] lg:px-8">
          <Link href="/" aria-label="NIBELC" className="shrink-0">
            <Image src="/nibelc-logo.svg" alt="NIBELC GmbH" width={1201} height={376} priority className="h-8 w-auto lg:h-10" />
          </Link>

          <nav aria-label="Menu chính" className="hidden min-w-0 flex-1 items-center gap-1 lg:flex">
            {MENU.map((m) => {
              const on = m.ma === trang;
              return (
                <Link
                  key={m.ma}
                  href={m.href as Route}
                  aria-current={on ? "page" : undefined}
                  className={`relative rounded-lg px-3.5 py-2 text-[14.5px] font-semibold whitespace-nowrap transition ${
                    on ? "text-[var(--v2-xanh)]" : "text-[var(--v2-chu-nhat)] hover:text-[var(--v2-xanh)]"
                  }`}
                >
                  {m.ten}
                  {on && <span className="absolute inset-x-3.5 -bottom-[1px] h-[3px] rounded-t-full bg-[var(--v2-vang)]" aria-hidden="true" />}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-3">
            <a href={`tel:${tel}`} className="hidden items-center gap-2 text-[14px] font-bold text-[var(--v2-xanh)] xl:flex">
              <span className="v2-icon-tron h-8 w-8">
                <Icon name="phone" className="h-4 w-4" strokeWidth={2} />
              </span>
              {LEGAL.phone}
            </a>
            <Link href={"/lien-he" as Route} className="v2-nut h-10 px-5 text-[14px] max-lg:hidden">
              Liên hệ ngay
              <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2.2} />
            </Link>
            <button
              type="button"
              onClick={() => setMoMenu((v) => !v)}
              aria-expanded={moMenu}
              aria-label="Menu"
              className="text-[var(--v2-xanh)] lg:hidden"
            >
              <Icon name={moMenu ? "close" : "burger"} className="h-7 w-7" strokeWidth={2} />
            </button>
          </div>
        </div>

        {moMenu && (
          <nav className="border-t border-[var(--v2-vien)] bg-white lg:hidden">
            <ul className="mx-auto max-w-[1480px] px-5 py-2">
              {MENU.map((m) => (
                <li key={m.ma}>
                  <Link
                    href={m.href as Route}
                    onClick={() => setMoMenu(false)}
                    className={`flex items-center gap-3 border-b border-[var(--v2-vien)] py-3.5 text-[15.5px] font-semibold last:border-0 ${
                      m.ma === trang ? "text-[var(--v2-xanh)]" : "text-[var(--v2-chu)]"
                    }`}
                  >
                    <Icon name={m.icon} className="h-5 w-5 text-[var(--v2-vang)]" strokeWidth={1.9} />
                    {m.ten}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      <main id="noi-dung" className="pb-[76px] lg:pb-0">
        {children}
      </main>

      {/* ---------------- CHÂN TRANG ---------------- */}
      <footer className="bg-[var(--v2-xanh)] text-white">
        <div className="mx-auto grid max-w-[1480px] gap-9 px-5 py-12 lg:grid-cols-[1.3fr_1fr_1fr] lg:px-8 lg:py-14">
          <div>
            <Image src="/nibelc-logo-dark.svg" alt="NIBELC GmbH" width={1201} height={376} className="h-10 w-auto" />
            <p className="mt-5 text-[14.5px] leading-[1.75] text-white/70">
              {LEGAL.name}
              <br />
              {LEGAL.street}
              <br />
              {LEGAL.postalCode} {LEGAL.city}, {LEGAL.country}
            </p>
            <p className="mt-5 text-[13px] tracking-[0.12em] text-[var(--v2-vang-sang)] uppercase">
              Kết nối con người — Kiến tạo cơ hội
            </p>
          </div>

          <nav aria-label="Menu chân trang">
            <p className="text-[12px] font-bold tracking-[0.2em] text-[var(--v2-vang-sang)] uppercase">NIBELC</p>
            <ul className="mt-4 space-y-2.5">
              {MENU.map((m) => (
                <li key={m.ma}>
                  <Link href={m.href as Route} className="text-[14.5px] text-white/70 transition hover:text-white">
                    {m.ten}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[12px] font-bold tracking-[0.2em] text-[var(--v2-vang-sang)] uppercase">Liên hệ</p>
            <ul className="mt-4 space-y-3">
              <li>
                <a href={`tel:${tel}`} className="flex items-center gap-3 text-[14.5px] text-white/75 transition hover:text-white">
                  <Icon name="phone" className="h-4 w-4 text-[var(--v2-vang-sang)]" strokeWidth={1.9} />
                  {LEGAL.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${LEGAL.email}`} className="flex items-center gap-3 text-[14.5px] break-all text-white/75 transition hover:text-white">
                  <Icon name="mail" className="h-4 w-4 shrink-0 text-[var(--v2-vang-sang)]" strokeWidth={1.9} />
                  {LEGAL.email}
                </a>
              </li>
              <li>
                <Link href={"/datenschutz" as Route} className="flex items-center gap-3 text-[14.5px] text-white/75 transition hover:text-white">
                  <Icon name="shield" className="h-4 w-4 text-[var(--v2-vang-sang)]" strokeWidth={1.9} />
                  Datenschutz
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="v2-co-duc h-[3px] w-full" aria-hidden="true" />
        <p className="mx-auto max-w-[1480px] px-5 py-4 text-[12.5px] text-white/45 lg:px-8">
          © {new Date().getFullYear()} {LEGAL.name}
        </p>
      </footer>

      {/* ---------------- THANH ĐÁY CHO ĐIỆN THOẠI ---------------- */}
      <nav
        aria-label="Menu dưới"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--v2-vien)] bg-white/97 backdrop-blur lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="flex">
          {MENU.filter((m) => TAB_DAY.includes(m.ma)).map((m) => {
            const on = m.ma === trang;
            return (
              <li key={m.ma} className="min-w-0 flex-1">
                <Link
                  href={m.href as Route}
                  aria-current={on ? "page" : undefined}
                  className={`flex flex-col items-center gap-1 px-1 pt-2.5 pb-2 text-[10.5px] leading-tight font-semibold ${
                    on ? "text-[var(--v2-xanh)]" : "text-[var(--v2-chu-nhat)]"
                  }`}
                >
                  <Icon name={m.icon} className="h-[21px] w-[21px]" strokeWidth={on ? 2.1 : 1.7} />
                  <span className="w-full truncate text-center">{m.ten}</span>
                  {on && <span className="h-[3px] w-6 rounded-full bg-[var(--v2-vang)]" aria-hidden="true" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

"use client";

import Link from "next/link";
import type { Route } from "next";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { LOCALES, ROUTES, type Locale, type PageKey } from "@/content/locales";
import { mainMenu, requestLabel } from "@/content/nav-menu";

/**
 * THANH MENU VÀNG Ở ĐÁY — dùng cho MỌI TRANG PHỤ.
 *
 * Quy cách lấy đúng từ thanh menu của trang chủ: viên thuốc bo tròn hai đầu,
 * nền vàng gradient, mỗi mục một icon kèm tên, mục đang mở đảo màu (nền đen
 * chữ vàng), cuối thanh là nút đổi ngôn ngữ và nút gọi hành động.
 *
 * Khác trang chủ đúng một điểm: trang chủ không cuộn nên thanh nằm cố định ở
 * đáy banner; trang phụ có cuộn nên thanh GHIM theo màn hình để lúc nào cũng
 * thấy. Trang chủ vẫn dùng thanh riêng của nó, file này không đụng tới.
 */

const MENU_ICON: Partial<Record<PageKey, string>> = {
  home: "home",
  employers: "building",
  candidates: "users",
  industries: "grid",
  process: "doc",
  knowledge: "book",
  about: "handshake",
};

export function SubMenuBar({ locale, page }: { locale: Locale; page: PageKey }) {
  const menu = mainMenu(locale);
  const [moLang, setMoLang] = useState(false);

  return (
    <nav
      aria-label="Menu chính"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 hidden justify-center px-6 pb-5 lg:flex"
    >
      <ul className="nb-menu-bar pointer-events-auto flex h-[64px] items-stretch gap-[2px] rounded-[32px] p-[6px] xl:h-[68px] xl:rounded-[34px]">
        {menu.map((m) => {
          const on = m.page === page;
          return (
            <li key={m.label} className="flex">
              <Link
                href={m.href as Route}
                aria-current={on ? "page" : undefined}
                className={`flex items-center gap-2 rounded-[26px] px-3.5 text-[14px] font-bold whitespace-nowrap transition xl:gap-2.5 xl:px-[17px] xl:text-[15px] ${
                  on ? "nb-menu-on" : "nb-menu-off"
                }`}
              >
                <Icon name={MENU_ICON[m.page] ?? "grid"} className="h-[17px] w-[17px] xl:h-[18px] xl:w-[18px]" strokeWidth={1.9} />
                {m.label}
              </Link>
            </li>
          );
        })}

        <li className="flex">
          <div className="relative flex">
            <button
              type="button"
              onClick={() => setMoLang((v) => !v)}
              aria-expanded={moLang}
              className="nb-menu-off flex items-center gap-1.5 rounded-[26px] px-3 text-[14px] font-bold xl:px-3.5 xl:text-[15px]"
            >
              <Icon name="globe" className="h-[16px] w-[16px] xl:h-[17px] xl:w-[17px]" strokeWidth={1.9} />
              {locale.toUpperCase()}
            </button>
            {moLang && (
              <ul className="absolute bottom-full left-1/2 mb-3 min-w-[9.5rem] -translate-x-1/2 overflow-hidden rounded-xl bg-white text-[14px] text-[var(--nb-ink)] shadow-xl">
                {LOCALES.map((l) => (
                  <li key={l}>
                    <Link
                      href={ROUTES[page][l] as Route}
                      hrefLang={l}
                      onClick={() => setMoLang(false)}
                      className={`block px-4 py-2.5 hover:bg-[#f2f5f9] ${l === locale ? "font-bold" : ""}`}
                    >
                      {l === "de" ? "Deutsch" : l === "en" ? "English" : "Tiếng Việt"}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </li>

        <li className="flex">
          <Link
            href={ROUTES.request[locale] as Route}
            className="nb-menu-cta flex items-center gap-2 rounded-[26px] px-4 text-[14px] font-extrabold whitespace-nowrap xl:px-[19px] xl:text-[15px]"
          >
            {requestLabel(locale)}
            <Icon name="arrowRight" className="h-[16px] w-[16px] xl:h-[17px] xl:w-[17px]" strokeWidth={2.2} />
          </Link>
        </li>
      </ul>
    </nav>
  );
}

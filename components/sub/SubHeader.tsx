"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { LOCALES, ROUTES, type Locale, type PageKey } from "@/content/locales";
import { mainMenu, requestLabel } from "@/content/nav-menu";

/**
 * THANH ĐẦU TRANG CỦA CÁC TRANG PHỤ — theo bộ KIT navy–vàng.
 *
 * Trang chủ KHÔNG dùng component này (nó có thanh menu vàng riêng ở đáy
 * banner), nên mọi thay đổi ở đây không đụng tới trang chủ.
 *
 * Menu lấy từ cây menu chính `content/nav-menu.ts` để cả web chỉ có một cây
 * duy nhất; KIT vẽ sáu mục, ta giữ đủ bảy mục như thanh vàng trang chủ để
 * người xem không thấy menu đổi khi chuyển trang.
 */
export function SubHeader({ locale, page }: { locale: Locale; page: PageKey }) {
  const menu = mainMenu(locale);
  const [moLang, setMoLang] = useState(false);

  return (
    <header className="nb-sub-header sticky top-0 z-50 max-lg:hidden">
      <div className="mx-auto flex h-[68px] max-w-[1560px] items-center gap-8 px-8 xl:h-[74px] xl:px-12">
        <Link href={ROUTES.home[locale] as Route} aria-label="NIBELC" className="shrink-0">
          <Image src="/nibelc-logo-dark.svg" alt="NIBELC GmbH" width={1201} height={376} priority className="h-8 w-auto xl:h-9" />
        </Link>

        <nav aria-label="Menu chính" className="flex h-full min-w-0 flex-1 items-center gap-1">
          {menu.map((m) => {
            const on = m.page === page;
            return (
              <Link
                key={m.label}
                href={m.href as Route}
                aria-current={on ? "page" : undefined}
                className={`relative flex h-full items-center rounded-lg px-3 text-[13.5px] font-semibold whitespace-nowrap transition xl:text-[14.5px] ${
                  on ? "text-[var(--nb-gold)]" : "text-white/70 hover:text-white"
                }`}
              >
                {m.label}
                {on && (
                  <span
                    className="absolute inset-x-3 bottom-[14px] h-[2px] rounded-full bg-[var(--nb-gold)]"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-4">
          <Link
            href={ROUTES.jobs[locale] as Route}
            aria-label={locale === "vi" ? "Tìm đơn hàng" : locale === "en" ? "Search jobs" : "Stellen suchen"}
            className="text-white/70 transition hover:text-[var(--nb-gold)]"
          >
            <Icon name="search" className="h-[19px] w-[19px]" strokeWidth={1.9} />
          </Link>

          <span className="h-5 w-px bg-white/20" aria-hidden="true" />

          <div className="relative">
            <button
              type="button"
              onClick={() => setMoLang((v) => !v)}
              aria-expanded={moLang}
              className="flex items-center gap-2 text-[13.5px] font-semibold text-white/85 transition hover:text-white"
            >
              <span className="inline-block h-[18px] w-[18px] overflow-hidden rounded-full ring-1 ring-white/35" aria-hidden="true">
                {(locale === "vi" ? ["#da251d", "#da251d", "#da251d"] : locale === "en" ? ["#012169", "#fff", "#c8102e"] : ["#111", "#dd0000", "#ffce00"]).map((c, i) => (
                  <span key={i} className="block h-1/3 w-full" style={{ background: c }} />
                ))}
              </span>
              {locale.toUpperCase()}
              <Icon name="chevronDown" className="h-3.5 w-3.5" strokeWidth={2.2} />
            </button>
            {moLang && (
              <ul className="absolute right-0 top-full z-50 mt-3 min-w-[9rem] overflow-hidden rounded-xl bg-white text-sm text-[var(--nb-ink)] shadow-xl">
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

          <Link href={ROUTES.request[locale] as Route} className="nb-sub-cta h-10 px-5 text-[13.5px]">
            {requestLabel(locale)}
            <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2.2} />
          </Link>
        </div>
      </div>
    </header>
  );
}

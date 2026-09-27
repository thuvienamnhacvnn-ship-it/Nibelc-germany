"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/Icon";
import { LEGAL } from "@/content/legal";
import { LOCALES, ROUTES, type Locale, type PageKey } from "@/content/locales";
import { contactLabel, mainMenu, requestLabel } from "@/content/nav-menu";

/**
 * MENU ĐÁY cho điện thoại — kiểu ứng dụng.
 *
 * Năm ô: Trang chủ · Ngành nghề · [nút tròn cam nhô lên: gửi yêu cầu] ·
 * Đơn hàng · Menu. Nút giữa to và nổi hẳn lên khỏi thanh để ngón cái bấm
 * trúng ngay; ô đang mở được tô màu và có chấm nhỏ bên dưới.
 *
 * "Menu" mở tấm trượt từ đáy lên (bottom sheet) chứa toàn bộ menu chính,
 * menu con mở gập, phần chọn ngôn ngữ và hai nút gọi / gửi thư. Tấm trượt
 * render qua portal vì header có `backdrop-blur` — thuộc tính đó biến mọi
 * `position: fixed` bên trong thành neo theo header.
 */

const TABS: { page: PageKey; icon: string }[] = [
  { page: "home", icon: "home" },
  { page: "industries", icon: "grid" },
  { page: "jobs", icon: "briefcase" },
];

/** Nhãn ngắn — nhãn menu chính quá dài cho ô rộng ~70px */
const TAB_LABEL: Record<Locale, Record<string, string>> = {
  de: { home: "Start", industries: "Branchen", jobs: "Stellen", menu: "Menü", call: "Anrufen" },
  en: { home: "Home", industries: "Industries", jobs: "Jobs", menu: "Menu", call: "Call" },
  vi: { home: "Trang chủ", industries: "Ngành", jobs: "Đơn hàng", menu: "Menu", call: "Gọi điện" },
};

export function MobileTabBar({ locale, page }: { locale: Locale; page: PageKey }) {
  const [open, setOpen] = useState(false);
  const [sub, setSub] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const menu = mainMenu(locale);
  const labels = Object.fromEntries(menu.map((m) => [m.page, m.label])) as Record<PageKey, string>;
  void labels;
  const tel = LEGAL.phone.replace(/\s/g, "");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const tab = (t: { page: PageKey; icon: string }) => {
    const active = page === t.page;
    return (
      <Link
        key={t.page}
        href={ROUTES[t.page][locale] as Route}
        aria-current={active ? "page" : undefined}
        className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] font-semibold ${
          active ? "text-[var(--nb-blue-dark)]" : "text-[#5b6b80]"
        }`}
      >
        <Icon name={t.icon} className="h-[22px] w-[22px]" strokeWidth={active ? 2.1 : 1.7} />
        <span className="max-w-[74px] truncate">{TAB_LABEL[locale][t.page]}</span>
        <span className={`h-1 w-1 rounded-full ${active ? "bg-[var(--nb-orange)]" : "bg-transparent"}`} aria-hidden="true" />
      </Link>
    );
  };

  return (
    <>
      <nav
        aria-label={labels.home}
        className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="relative mx-3 mb-2 flex items-stretch rounded-2xl bg-white/95 shadow-[0_10px_30px_-10px_rgba(15,35,64,.45)] ring-1 ring-[#e3e9f1] backdrop-blur">
          {tab(TABS[0]!)}
          {tab(TABS[1]!)}

          {/* nút chính, nhô lên khỏi thanh */}
          <div className="flex w-[84px] shrink-0 justify-center">
            <Link
              href={ROUTES.request[locale] as Route}
              className="-mt-6 flex h-16 w-16 flex-col items-center justify-center gap-0.5 rounded-full bg-[var(--nb-orange)] text-white shadow-[0_10px_24px_-6px_rgba(255,106,19,.75)] ring-4 ring-white active:scale-95"
            >
              <Icon name="send" className="h-6 w-6" strokeWidth={1.9} />
              <span className="text-[9px] font-bold">{requestLabel(locale).split(" ")[0]}</span>
            </Link>
          </div>

          {tab(TABS[2]!)}

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] font-semibold text-[#5b6b80]"
          >
            <Icon name="burger" className="h-[22px] w-[22px]" strokeWidth={1.9} />
            <span>{TAB_LABEL[locale].menu}</span>
            <span className="h-1 w-1" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {open &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="schließen"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-[#0a2748]/55 backdrop-blur-[2px]"
            />

            <div className="absolute inset-x-0 bottom-0 max-h-[86vh] overflow-y-auto rounded-t-3xl bg-white pb-6 text-[var(--nb-ink)] shadow-[0_-10px_40px_-10px_rgba(15,35,64,.5)]">
              <div className="sticky top-0 z-10 flex items-center gap-3 bg-white px-5 pt-3 pb-3">
                <span className="mx-auto h-1.5 w-12 rounded-full bg-[#d6dee8]" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="schließen"
                  className="absolute right-4 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--nb-strip)]"
                >
                  <Icon name="close" className="h-5 w-5" strokeWidth={2} />
                </button>
              </div>

              <nav aria-label={labels.home} className="px-4">
                <ul className="divide-y divide-[var(--nb-line)]">
                  {menu.map((m) => (
                    <li key={m.label} className="py-1">
                      <div className="flex items-center">
                        <Link
                          href={m.href as Route}
                          onClick={() => setOpen(false)}
                          className={`flex flex-1 items-center gap-3 py-3 font-semibold ${
                            m.page === page ? "text-[var(--nb-blue-dark)]" : ""
                          }`}
                        >
                          {m.label}
                        </Link>
                        {m.children && (
                          <button
                            type="button"
                            aria-label={m.label}
                            aria-expanded={sub === m.label}
                            onClick={() => setSub(sub === m.label ? null : m.label)}
                            className="p-3 text-[var(--nb-muted)]"
                          >
                            <Icon
                              name="chevronDown"
                              className={`h-5 w-5 transition ${sub === m.label ? "rotate-180" : ""}`}
                              strokeWidth={2}
                            />
                          </button>
                        )}
                      </div>
                      {m.children && sub === m.label && (
                        <ul className="pb-3 pl-3">
                          {m.children.map((c) => (
                            <li key={c.label + c.href}>
                              <Link href={c.href as Route} onClick={() => setOpen(false)} className="block py-2 text-sm">
                                {c.label}
                                {c.desc && <span className="block text-xs text-[var(--nb-muted)]">{c.desc}</span>}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-5 grid grid-cols-2 gap-3 px-4">
                <a
                  href={`tel:${tel}`}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--nb-strip)] font-semibold"
                >
                  <Icon name="phone" className="h-5 w-5 text-[#1f4f9f]" strokeWidth={1.8} />
                  {TAB_LABEL[locale].call}
                </a>
                <Link
                  href={ROUTES.contact[locale] as Route}
                  onClick={() => setOpen(false)}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--nb-strip)] font-semibold"
                >
                  <Icon name="mail" className="h-5 w-5 text-[#1f4f9f]" strokeWidth={1.8} />
                  {contactLabel(locale)}
                </Link>
              </div>

              <ul className="mt-4 flex gap-2 px-4">
                {LOCALES.map((l) => (
                  <li key={l} className="flex-1">
                    <Link
                      href={ROUTES[page][l] as Route}
                      hrefLang={l}
                      onClick={() => setOpen(false)}
                      className={`block rounded-xl border py-2 text-center text-sm ${
                        l === locale
                          ? "border-[var(--nb-blue-dark)] font-bold text-[var(--nb-blue-dark)]"
                          : "border-[var(--nb-line)]"
                      }`}
                    >
                      {l === "de" ? "Deutsch" : l === "en" ? "English" : "Tiếng Việt"}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

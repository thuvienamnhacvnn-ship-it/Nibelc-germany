"use client";

import Link from "next/link";
import type { Route } from "next";
import { Icon } from "@/components/ui/Icon";
import { ROUTES, type Locale, type PageKey } from "@/content/locales";

/**
 * MENU ĐÁY cho điện thoại — dựng theo ảnh mẫu Sếp gửi 27/09/2026.
 *
 * Sáu ô, nền xanh đêm, ô đang mở tô vàng và có vệt sáng phía trên:
 *   Trang chủ · Đơn hàng · Ngành nghề · Quy trình · Cho doanh nghiệp · Liên hệ
 *
 * Trước đây thanh này có năm ô, nền trắng và một nút tròn cam nhô lên kèm tấm
 * trượt "Menu". Bản mẫu mới bỏ cả hai: sáu điểm đến chính đã nằm hết trên
 * thanh nên không còn gì phải giấu trong tấm trượt, và bớt được một lớp
 * `createPortal` cùng phần khoá cuộn trang.
 */

const TABS: { page: PageKey; icon: string }[] = [
  { page: "home", icon: "home" },
  { page: "jobs", icon: "briefcase" },
  { page: "industries", icon: "grid" },
  { page: "process", icon: "doc" },
  { page: "employers", icon: "building" },
  { page: "contact", icon: "phone" },
];

/** Nhãn ngắn hai dòng — nhãn menu chính quá dài cho ô rộng ~60px */
const LABEL: Record<Locale, Record<string, [string, string?]>> = {
  de: {
    home: ["Start"],
    jobs: ["Stellen"],
    industries: ["Branchen"],
    process: ["Prozess"],
    employers: ["Für", "Betriebe"],
    contact: ["Kontakt"],
  },
  en: {
    home: ["Home"],
    jobs: ["Jobs"],
    industries: ["Industries"],
    process: ["Process"],
    employers: ["For", "employers"],
    contact: ["Contact"],
  },
  vi: {
    home: ["Trang chủ"],
    jobs: ["Đơn hàng"],
    industries: ["Ngành nghề"],
    process: ["Quy trình"],
    employers: ["Doanh", "nghiệp"],
    contact: ["Liên hệ"],
  },
};

/** Trang con dùng chung ô với trang cha để ô sáng đúng chỗ */
const SAME_TAB: Partial<Record<PageKey, PageKey>> = {
  candidates: "jobs",
  services: "employers",
  request: "employers",
  knowledge: "process",
  about: "contact",
};

export function MobileTabBar({ locale, page }: { locale: Locale; page: PageKey }) {
  const current = SAME_TAB[page] ?? page;

  return (
    <nav
      aria-label={LABEL[locale].home![0]}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--nb-gold-line)] bg-[#061225]/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex items-stretch">
        {TABS.map((t) => {
          const active = current === t.page;
          const [a, b] = LABEL[locale][t.page]!;
          return (
            <li key={t.page} className="min-w-0 flex-1">
              <Link
                href={ROUTES[t.page][locale] as Route}
                aria-current={active ? "page" : undefined}
                className={`relative flex h-full flex-col items-center justify-center gap-1 px-0.5 pt-2.5 pb-2 text-center text-[10px] leading-[1.15] font-semibold ${
                  active ? "text-[var(--nb-gold)]" : "text-white/65"
                }`}
              >
                {active && (
                  <span
                    className="absolute inset-x-2 top-0 h-[2px] rounded-full bg-[var(--nb-gold)]"
                    aria-hidden="true"
                  />
                )}
                <Icon name={t.icon} className="h-[21px] w-[21px]" strokeWidth={active ? 2 : 1.7} />
                <span className="block w-full truncate">
                  {a}
                  {b && <span className="block truncate font-normal">{b}</span>}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

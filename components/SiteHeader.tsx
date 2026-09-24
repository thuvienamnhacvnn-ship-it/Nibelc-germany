import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { Icon } from "@/components/ui/Icon";
import { MobileMenu } from "@/components/nav/MobileMenu";
import { NavDropdown } from "@/components/nav/NavDropdown";
import { LOCALES, ROUTES, type Locale, type PageKey } from "@/content/locales";
import { navFor, requestLabel, submenuFor } from "@/content/nav-menu";

/**
 * HEADER CHUẨN — một khối duy nhất cho mọi trang.
 *
 * Trước đây mỗi trang dựng header theo đúng ảnh mẫu của nó: cao 101 / 67 / 84 /
 * 63 / 60 / 78, logo 66 / 50 / 68 / 52, nav bắt đầu ở 387…572. Hậu quả là bấm
 * sang trang khác thì thanh menu nhảy chỗ và đổi cỡ. Nay mọi trang dùng đúng
 * kích thước dưới đây; ảnh mẫu chỉ còn quyết định MÀU NỀN của header.
 *
 * Số đo (1 --u = 1px ảnh mẫu 1672 rộng):
 *   cao 78 · lề hai bên 34 · logo cao 52 · vạch ngăn + tên chương trình hai dòng
 *   nav cỡ chữ 14, cách nhau 26, căn giữa phần còn lại
 *   bên phải: chọn ngôn ngữ + nút "Anfrage starten"
 */

export function SiteHeader({
  locale,
  page,
  variant = "light",
  langHrefs,
}: {
  locale: Locale;
  page: PageKey;
  /** Chỉ đổi màu nền, không đổi kích thước hay bố cục */
  variant?: "navy" | "light";
  /** Trang chi tiết ngành giữ nguyên slug khi đổi ngôn ngữ */
  langHrefs?: Record<Locale, string>;
}) {
  const navy = variant === "navy";
  const nav = navFor(locale, page);
  const hrefs = langHrefs ?? (Object.fromEntries(LOCALES.map((l) => [l, ROUTES[page][l]])) as Record<Locale, string>);

  return (
    <header
      className={`sticky top-0 z-50 ${
        navy ? "bg-[var(--nb-navy)] text-white" : "bg-white/95 text-[var(--nb-ink)] shadow-[0_1px_0_rgba(15,35,64,.08)] backdrop-blur"
      }`}
    >
      <div className="mx-auto flex h-16 items-center px-4 lg:h-[calc(78*var(--u))] lg:px-[calc(34*var(--u))]">
        <Link href={ROUTES.home[locale] as Route} className="flex shrink-0 items-center" aria-label="NIBELC">
          <Image
            src="/nibelc-logo.svg"
            alt="NIBELC GmbH"
            width={1201}
            height={376}
            priority
            className={`h-9 w-auto lg:h-[calc(52*var(--u))] ${navy ? "brightness-0 invert" : ""}`}
          />
          <span
            className={`mx-[calc(18*var(--u))] hidden h-[calc(42*var(--u))] w-px lg:block ${navy ? "bg-white/30" : "bg-[var(--nb-line)]"}`}
            aria-hidden="true"
          />
          <span className="hidden leading-tight lg:block">
            <span className="block text-[calc(18*var(--u))] leading-[calc(22*var(--u))] font-bold whitespace-nowrap">
              TalentBridge <span className={navy ? "font-normal text-white/85" : "font-normal text-[#3a4a5e]"}>Deutschland</span>
            </span>
            <span className={`block text-[calc(13*var(--u))] leading-[calc(18*var(--u))] ${navy ? "text-white/70" : "text-[#5b6b80]"}`}>
              Fachkräfte. Zukunft. Gemeinsam.
            </span>
          </span>
        </Link>

        <nav
          aria-label="Hauptnavigation"
          /* ml cố định (không phải mx-auto) để chữ đậm của mục đang mở không
             làm thanh menu xê dịch vài px khi đổi trang */
          className="ml-[calc(56*var(--u))] hidden h-full items-center gap-[calc(26*var(--u))] lg:flex"
        >
          {nav.map((item) => {
            const sub = submenuFor(locale, item.href);
            if (sub?.length) {
              return (
                <NavDropdown
                  key={item.label}
                  label={item.label}
                  href={item.href}
                  items={sub}
                  columns={sub.length > 5 ? 2 : 1}
                  active={item.active}
                  navy={navy}
                  fontSize={14}
                  underlineGap={13}
                />
              );
            }
            return (
              <Link
                key={item.label}
                href={item.href as Route}
                aria-current={item.active ? "page" : undefined}
                className={`relative flex h-full items-center text-[calc(14*var(--u))] whitespace-nowrap ${
                  item.active ? (navy ? "text-white" : "text-[var(--nb-blue-dark)]") : navy ? "text-white/90 hover:text-white" : "hover:text-[var(--nb-blue-dark)]"
                }`}
              >
                {item.label}
                {item.active && (
                  <span
                    className={`absolute inset-x-[calc(-4*var(--u))] top-[calc(50%+13*var(--u))] h-[calc(3*var(--u))] rounded-full ${
                      navy ? "bg-[var(--nb-orange)]" : "bg-[var(--nb-blue-dark)]"
                    }`}
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-[calc(22*var(--u))] max-lg:gap-2">
          <details className="relative max-lg:hidden">
            <summary className="flex cursor-pointer list-none items-center gap-[calc(7*var(--u))] text-[calc(14*var(--u))] [&::-webkit-details-marker]:hidden">
              <Icon name="globe" className="h-[calc(19*var(--u))] w-[calc(19*var(--u))]" strokeWidth={1.8} />
              {locale.toUpperCase()}
              <Icon name="chevronDown" className="h-[calc(14*var(--u))] w-[calc(14*var(--u))]" strokeWidth={2} />
            </summary>
            <ul className="absolute right-0 mt-2 min-w-[7rem] overflow-hidden rounded-lg bg-white py-1 text-sm text-[var(--nb-ink)] shadow-lg ring-1 ring-black/5">
              {LOCALES.map((l) => (
                <li key={l}>
                  <Link
                    href={hrefs[l] as Route}
                    hrefLang={l}
                    className={`block px-4 py-2 hover:bg-[var(--nb-strip)] ${l === locale ? "font-bold" : ""}`}
                  >
                    {l === "de" ? "Deutsch" : l === "en" ? "English" : "Tiếng Việt"}
                  </Link>
                </li>
              ))}
            </ul>
          </details>

          <Link
            href={ROUTES.request[locale] as Route}
            className="inline-flex items-center gap-2 rounded-md bg-[var(--nb-orange)] px-3 py-2 text-sm font-semibold whitespace-nowrap text-white hover:bg-[var(--nb-orange-dark)] max-lg:hidden lg:h-[calc(44*var(--u))] lg:gap-[calc(10*var(--u))] lg:rounded-[calc(7*var(--u))] lg:px-[calc(22*var(--u))] lg:py-0 lg:text-[calc(15*var(--u))]"
          >
            {requestLabel(locale)}
            <Icon name="arrowRight" className="h-4 w-4 lg:h-[calc(17*var(--u))] lg:w-[calc(17*var(--u))]" strokeWidth={2} />
          </Link>

          <MobileMenu locale={locale} navy={navy} langHrefs={hrefs} cta={{ label: requestLabel(locale), href: ROUTES.request[locale] }} />
        </div>
      </div>
    </header>
  );
}

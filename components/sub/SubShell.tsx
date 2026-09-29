import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { SubHeader } from "@/components/sub/SubHeader";
import { Breadcrumb, Eyebrow } from "@/components/sub/bits";
import { MobileTabBar } from "@/components/nav/MobileTabBar";
import { Icon } from "@/components/ui/Icon";
import { LEGAL } from "@/content/legal";
import { LEGAL_ROUTES, ROUTES, type Locale, type PageKey } from "@/content/locales";
import { mainMenu, contactLabel } from "@/content/nav-menu";

/**
 * KHUNG CHUNG CHO MỌI TRANG PHỤ — bộ KIT navy–vàng.
 *
 * Gồm: thanh đầu trang tối (desktop) + thanh trên gọn cho điện thoại + banner
 * điện ảnh (ảnh gốc của trang, phủ gradient navy) + phần thân do từng trang tự
 * dựng + chân trang tối.
 *
 * TRANG CHỦ KHÔNG DÙNG FILE NÀY. Trang chủ có khung riêng trong
 * `components/home/stage/` và không được sửa.
 */
export function SubShell({
  locale,
  page,
  eyebrow,
  title,
  titleGold,
  lead,
  hero,
  heroFocus = "50% 45%",
  breadcrumb,
  heroExtra,
  heroTall = false,
  children,
}: {
  locale: Locale;
  page: PageKey;
  eyebrow: string;
  /** Phần tiêu đề màu trắng */
  title: string;
  /** Phần tiêu đề tô vàng, xuống dòng dưới */
  titleGold?: string;
  lead?: string;
  hero: string;
  heroFocus?: string;
  breadcrumb?: { label: string; href?: string }[];
  /** Khối tuỳ ý nằm dưới phần chữ của banner (số liệu, nút, ô tìm…) */
  heroExtra?: ReactNode;
  /** Banner cao hơn — dùng cho trang chi tiết đơn hàng và chi tiết ngành */
  heroTall?: boolean;
  children: ReactNode;
}) {
  const menu = mainMenu(locale);

  return (
    <div className="nb-sub">
      <SubHeader locale={locale} page={page} />

      {/* Thanh trên cho điện thoại: chỉ logo, gọn gàng — menu đã có ở thanh đáy */}
      <div className="flex h-14 items-center justify-center border-b border-white/10 bg-[var(--nb-sub-navy)] lg:hidden">
        <Link href={ROUTES.home[locale] as Route} aria-label="NIBELC">
          <Image src="/nibelc-logo-dark.svg" alt="NIBELC GmbH" width={1201} height={376} priority className="h-7 w-auto" />
        </Link>
      </div>

      <main id="inhalt">
        {/* ---------------- BANNER ĐIỆN ẢNH ---------------- */}
        <section className={`relative isolate overflow-hidden ${heroTall ? "min-h-[520px] lg:min-h-[620px]" : "min-h-[400px] lg:min-h-[460px]"}`}>
          <Image
            src={hero}
            alt=""
            fill
            priority
            quality={88}
            sizes="100vw"
            className="-z-10 object-cover"
            style={{ objectPosition: heroFocus }}
          />
          {/* Phủ navy: đậm bên trái cho chữ đọc rõ, nhạt dần sang phải để giữ ảnh */}
          <span
            className="absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(90deg, rgba(6,23,43,.96) 0, rgba(6,23,43,.86) 34%, rgba(6,23,43,.5) 62%, rgba(6,23,43,.3) 100%), linear-gradient(180deg, rgba(6,23,43,.5) 0, rgba(6,23,43,0) 26%, rgba(6,23,43,.35) 78%, rgba(6,23,43,.9) 100%)",
            }}
            aria-hidden="true"
          />

          <div className="mx-auto flex max-w-[1560px] flex-col justify-center px-6 py-14 lg:px-12 lg:py-20" style={{ minHeight: "inherit" }}>
            {breadcrumb && <div className="mb-6">{<Breadcrumb items={breadcrumb} />}</div>}
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="mt-5 max-w-[19ch] text-[34px] leading-[1.08] font-bold tracking-[-0.025em] text-white lg:text-[58px]">
              {title}
              {titleGold && (
                <>
                  <br />
                  <span className="nb-sub-gold">{titleGold}</span>
                </>
              )}
            </h1>
            {lead && <p className="mt-5 max-w-[58ch] text-[16px] leading-[1.65] text-white/75 lg:text-[19px]">{lead}</p>}
            {heroExtra && <div className="mt-9">{heroExtra}</div>}
          </div>
        </section>

        {children}
      </main>

      {/* ---------------- CHÂN TRANG ---------------- */}
      <footer className="border-t border-white/10 bg-[var(--nb-sub-navy-2)]">
        <div className="mx-auto grid max-w-[1560px] gap-10 px-6 py-12 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-12 lg:py-16">
          <div>
            <Image src="/nibelc-logo-dark.svg" alt="NIBELC GmbH" width={1201} height={376} className="h-9 w-auto" />
            <p className="mt-5 max-w-[42ch] text-[14px] leading-[1.7] text-white/55">{LEGAL.name}</p>
            <p className="mt-1 text-[14px] leading-[1.7] text-white/55">
              {LEGAL.street}
              <br />
              {LEGAL.postalCode} {LEGAL.city}, {LEGAL.country}
            </p>
          </div>

          <nav aria-label="Menu chân trang">
            <p className="text-[12px] font-bold tracking-[0.2em] text-[var(--nb-gold)] uppercase">NIBELC</p>
            <ul className="mt-5 space-y-2.5">
              {menu.map((m) => (
                <li key={m.label}>
                  <Link href={m.href as Route} className="text-[14.5px] text-white/65 transition hover:text-[var(--nb-gold)]">
                    {m.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[12px] font-bold tracking-[0.2em] text-[var(--nb-gold)] uppercase">{contactLabel(locale)}</p>
            <ul className="mt-5 space-y-3">
              <li>
                <a href={`tel:${LEGAL.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 text-[14.5px] text-white/65 transition hover:text-[var(--nb-gold)]">
                  <Icon name="phone" className="h-4 w-4 text-[var(--nb-gold)]" strokeWidth={1.8} />
                  {LEGAL.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${LEGAL.email}`} className="flex items-center gap-3 text-[14.5px] text-white/65 transition hover:text-[var(--nb-gold)]">
                  <Icon name="mail" className="h-4 w-4 text-[var(--nb-gold)]" strokeWidth={1.8} />
                  {LEGAL.email}
                </a>
              </li>
              <li>
                <Link href={LEGAL_ROUTES.datenschutz as Route} className="flex items-center gap-3 text-[14.5px] text-white/65 transition hover:text-[var(--nb-gold)]">
                  <Icon name="shield" className="h-4 w-4 text-[var(--nb-gold)]" strokeWidth={1.8} />
                  Datenschutz
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <p className="mx-auto max-w-[1560px] px-6 py-5 text-[12.5px] text-white/40 lg:px-12">
            © {new Date().getFullYear()} {LEGAL.name}
          </p>
        </div>
      </footer>

      <MobileTabBar locale={locale} page={page} />
    </div>
  );
}

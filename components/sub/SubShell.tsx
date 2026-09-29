import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { SubFooter } from "@/components/sub/SubFooter";
import { SubMenuBar } from "@/components/sub/SubMenuBar";
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
  heroSplit = false,
  heroPoints,
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
  /** Banner CHIA ĐÔI theo bộ KIT: chữ bên trái, ảnh chân dung bên phải.
   *  Dùng cho màn 06 và 07 — ảnh không tràn sau chữ mà đứng hẳn một cột. */
  heroSplit?: boolean;
  /** Bốn dòng icon + nhãn nằm trong cột chữ của banner chia đôi */
  heroPoints?: { icon: string; label: string }[];
  children: ReactNode;
}) {
  const menu = mainMenu(locale);

  return (
    <div className="nb-sub">
      {/* Không có thanh menu trên đầu: cả web dùng thanh menu vàng ở đáy, đúng
          như trang chủ. Logo đứng ngay trên tiêu đề của banner. */}

      {/* Thanh trên cho điện thoại: chỉ logo */}
      <div className="flex h-14 items-center justify-center border-b border-white/10 bg-[var(--nb-sub-navy)] lg:hidden">
        <Link href={ROUTES.home[locale] as Route} aria-label="NIBELC">
          <Image src="/nibelc-logo-dark.svg" alt="NIBELC GmbH" width={1201} height={376} priority className="h-7 w-auto" />
        </Link>
      </div>

      <main id="inhalt">
        {/* ---------------- BANNER ĐIỆN ẢNH ---------------- */}
        {heroSplit ? (
          /* Bố cục chia đôi theo KIT màn 06 và 07: cột chữ bên trái, ảnh bên
             phải. Ảnh không nằm sau chữ nên chân dung không bị chữ đè lên. */
          <section className="relative bg-[var(--nb-sub-navy)]">
            <div className="mx-auto grid max-w-[1560px] items-stretch lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]">
              <div className="order-2 px-6 py-12 lg:order-1 lg:py-20 lg:pr-12 lg:pl-12">
                <Link href={ROUTES.home[locale] as Route} aria-label="NIBELC" className="mb-7 hidden lg:block">
                  <Image src="/nibelc-logo-dark.svg" alt="NIBELC GmbH" width={1201} height={376} priority className="h-10 w-auto" />
                </Link>
                {breadcrumb && <div className="mb-6">{<Breadcrumb items={breadcrumb} />}</div>}
                <Eyebrow>{eyebrow}</Eyebrow>
                <h1 className="mt-5 max-w-[17ch] text-[32px] leading-[1.1] font-bold tracking-[-0.025em] text-white lg:text-[50px]">
                  {title}
                  {titleGold && (
                    <>
                      <br />
                      <span className="nb-sub-gold">{titleGold}</span>
                    </>
                  )}
                </h1>
                {lead && <p className="mt-5 max-w-[52ch] text-[15.5px] leading-[1.7] text-white/70 lg:text-[17px]">{lead}</p>}

                {heroPoints && (
                  <ul className="mt-9 space-y-4">
                    {heroPoints.map((p) => (
                      <li key={p.label} className="flex items-center gap-4">
                        <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl border border-[var(--nb-gold-line)] bg-[var(--nb-gold)]/8 text-[var(--nb-gold)]">
                          <Icon name={p.icon} className="h-[22px] w-[22px]" strokeWidth={1.7} />
                        </span>
                        <span className="text-[15.5px] leading-[1.45] font-medium text-white/85 lg:text-[16.5px]">{p.label}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {heroExtra && <div className="mt-9">{heroExtra}</div>}
              </div>

              <div className="relative order-1 min-h-[280px] lg:order-2 lg:min-h-[620px]">
                <Image
                  src={hero}
                  alt=""
                  fill
                  priority
                  quality={88}
                  sizes="(min-width:1024px) 50vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: heroFocus }}
                />
                {/* mép trái ảnh tan dần vào nền navy cho liền khối */}
                <span
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(6,23,43,1) 0, rgba(6,23,43,.55) 14%, rgba(6,23,43,0) 36%), linear-gradient(180deg, rgba(6,23,43,.45) 0, rgba(6,23,43,0) 22%, rgba(6,23,43,0) 72%, rgba(6,23,43,.7) 100%)",
                  }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </section>
        ) : (
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
            <span
              className="absolute inset-0 -z-10"
              style={{
                background:
                  "linear-gradient(90deg, rgba(6,23,43,.96) 0, rgba(6,23,43,.86) 34%, rgba(6,23,43,.5) 62%, rgba(6,23,43,.3) 100%), linear-gradient(180deg, rgba(6,23,43,.5) 0, rgba(6,23,43,0) 26%, rgba(6,23,43,.35) 78%, rgba(6,23,43,.9) 100%)",
              }}
              aria-hidden="true"
            />

            <div className="mx-auto flex max-w-[1560px] flex-col justify-center px-6 py-14 lg:px-12 lg:py-20" style={{ minHeight: "inherit" }}>
              <Link href={ROUTES.home[locale] as Route} aria-label="NIBELC" className="mb-7 hidden lg:block">
                <Image src="/nibelc-logo-dark.svg" alt="NIBELC GmbH" width={1201} height={376} priority className="h-10 w-auto" />
              </Link>
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
        )}

        {children}
      </main>

      <SubFooter locale={locale} />
      <SubMenuBar locale={locale} page={page} />

      <MobileTabBar locale={locale} page={page} />
    </div>
  );
}

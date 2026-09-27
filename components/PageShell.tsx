import Image from "next/image";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { LegalStrip } from "@/components/LegalStrip";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileTabBar } from "@/components/nav/MobileTabBar";
import { ROUTES, type Locale, type PageKey } from "@/content/locales";
import { navFor, requestLabel } from "@/content/nav-menu";

/**
 * Khung cho các trang ngoài sáu trang bị khoá bố cục (Über uns, Leistungen,
 * Wissen, Kontakt, Personalbedarf). Header và chân trang giống nhau, phần
 * thân do từng trang tự dựng.
 */
export function PageShell({
  locale,
  page,
  eyebrow,
  title,
  lead,
  hero,
  heroAlt,
  heroFocus = "50% 50%",
  children,
}: {
  locale: Locale;
  page: PageKey;
  eyebrow: string;
  title: string;
  lead?: string;
  hero?: string;
  heroAlt?: string;
  heroFocus?: string;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader locale={locale} page={page} />

      <main id="inhalt" className="bg-white">
        {/* Banner hai cột: chữ bên trái trên nền sáng, ảnh bên phải để
            nguyên — không phủ lớp màu nào lên ảnh. */}
        <section className="bg-[#eef3f9]">
          <div className="flex flex-col lg:flex-row lg:items-stretch">
            <div className="order-2 mx-auto w-full max-w-[1400px] px-6 py-10 lg:order-1 lg:mx-0 lg:ml-auto lg:max-w-none lg:basis-[52%] lg:py-16 lg:pr-10 lg:pl-10 xl:pl-[max(2.5rem,calc((100vw-1400px)/2+2.5rem))]">
              <p className="text-xs font-semibold tracking-[0.2em] text-[#1f4f9f] uppercase">{eyebrow}</p>
              <h1 className="mt-3 max-w-[20ch] text-[30px] leading-[1.15] font-extrabold tracking-[-0.02em] break-words text-[#10284d] [hyphens:auto] sm:text-4xl lg:text-5xl lg:leading-[1.08]">
                {title}
              </h1>
              {lead && <p className="mt-4 max-w-[52ch] text-lg text-[#2a3d58]">{lead}</p>}
            </div>

            {hero && (
              <div className="relative order-1 aspect-[390/230] w-full lg:order-2 lg:aspect-auto lg:min-h-[360px] lg:basis-[48%]">
                <Image
                  src={hero}
                  alt={heroAlt ?? ""}
                  fill
                  sizes="(min-width:1024px) 48vw, 100vw"
                  priority
                  className="object-cover"
                  style={{ objectPosition: heroFocus }}
                />
              </div>
            )}
          </div>
        </section>

        {children}
      </main>

      {/* Chân trang đầy đủ chỉ còn ở "Über uns"; trang khác chỉ có dải pháp lý. */}
      {page === "about" ? <SiteFooter locale={locale} /> : <LegalStrip locale={locale} />}
      <MobileTabBar locale={locale} page={page} />
    </>
  );
}

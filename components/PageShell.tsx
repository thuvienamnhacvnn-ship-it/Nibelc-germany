import Image from "next/image";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
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
          <div className="lg:flex lg:items-stretch">
            <div className="mx-auto w-full max-w-[1400px] px-6 py-12 lg:mx-0 lg:ml-auto lg:max-w-none lg:basis-[52%] lg:py-16 lg:pr-10 lg:pl-10 xl:pl-[max(2.5rem,calc((100vw-1400px)/2+2.5rem))]">
              <p className="text-xs font-semibold tracking-[0.2em] text-[#1f4f9f] uppercase">{eyebrow}</p>
              <h1 className="mt-3 max-w-[20ch] text-4xl font-extrabold tracking-[-0.02em] text-[#10284d] lg:text-5xl lg:leading-[1.08]">
                {title}
              </h1>
              {lead && <p className="mt-4 max-w-[52ch] text-lg text-[#2a3d58]">{lead}</p>}
            </div>

            {hero && (
              <div className="relative aspect-[16/10] w-full lg:aspect-auto lg:min-h-[360px] lg:basis-[48%]">
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

      <SiteFooter locale={locale} />
    </>
  );
}

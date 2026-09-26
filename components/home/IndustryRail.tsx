import Link from "next/link";
import type { Route } from "next";
import { Icon } from "@/components/ui/Icon";
import { activeIndustries, industryName } from "@/content/industries";
import { industryPath, type Locale } from "@/content/locales";

/**
 * Dải ngành nghề dưới hero — theo màn 01 của bộ mẫu mới (hàng ô có icon).
 * Tên ngành và icon đọc từ registry, không gõ tay.
 */

const TITLE: Record<Locale, string> = {
  de: "Branchen, in denen wir vermitteln",
  en: "Industries we place workers in",
  vi: "Ngành nghề đang tuyển",
};

export function IndustryRail({ locale }: { locale: Locale }) {
  return (
    <section className="bg-[#061a35] py-7 text-white lg:py-9">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <h2 className="text-xs font-bold tracking-[0.2em] text-[#8fc0ff] uppercase">{TITLE[locale]}</h2>

        <ul className="mt-4 flex snap-x gap-3 overflow-x-auto pb-1 [scrollbar-width:none] lg:grid lg:grid-cols-7 lg:gap-4 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
          {activeIndustries().map((i) => (
            <li key={i.slug} className="w-[136px] shrink-0 snap-start lg:w-auto">
              <Link
                href={industryPath(locale, i.slug) as Route}
                className="group flex h-full flex-col items-center gap-2 rounded-xl bg-white/[.07] px-3 py-4 text-center ring-1 ring-white/10 transition hover:bg-[var(--nb-orange)] hover:ring-[var(--nb-orange)]"
              >
                <Icon name={i.icon} className="h-7 w-7 text-[#ffc15e] transition group-hover:text-white" strokeWidth={1.7} />
                <span className="text-[12px] leading-[1.25] font-semibold">{industryName(i, locale)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

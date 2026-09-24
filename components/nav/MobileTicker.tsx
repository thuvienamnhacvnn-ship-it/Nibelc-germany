import Link from "next/link";
import type { Route } from "next";
import { Icon } from "@/components/ui/Icon";
import { JOBS_COPY, JOB_ORDERS } from "@/content/jobs-current";
import { ROUTES, type Locale } from "@/content/locales";

/**
 * Dải chữ chạy trên cùng header điện thoại — thứ duy nhất nằm trên logo.
 * Nội dung là các đơn hàng đang tuyển; bấm vào là sang trang đơn hàng.
 */
export function MobileTicker({ locale }: { locale: Locale }) {
  const t = JOBS_COPY[locale];
  const items = JOB_ORDERS.map((j) => `${j.title[locale]} · ${j.slots} ${t.slots}`);

  return (
    <Link
      href={ROUTES.jobs[locale] as Route}
      aria-label={t.tickerCta}
      className="relative flex h-8 items-center gap-2 overflow-hidden bg-[#0b3a80] px-3 text-white lg:hidden"
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--nb-orange)] opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--nb-orange)]" />
      </span>
      <span className="flex-1 overflow-hidden">
        <span className="nb-ticker flex w-max items-center gap-6 whitespace-nowrap">
          {[0, 1].map((round) => (
            <span key={round} className="flex items-center gap-6" aria-hidden={round === 1}>
              {items.map((it) => (
                <span key={round + it} className="flex items-center gap-2 text-[12px]">
                  <Icon name="briefcase" className="h-3.5 w-3.5 shrink-0 text-[#ffc15e]" strokeWidth={1.9} />
                  {it}
                </span>
              ))}
            </span>
          ))}
        </span>
      </span>
      <Icon name="arrowRight" className="h-4 w-4 shrink-0 text-white/80" strokeWidth={2} />
    </Link>
  );
}

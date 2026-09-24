import Link from "next/link";
import type { Route } from "next";
import { Icon } from "@/components/ui/Icon";
import { JOBS_COPY, JOB_ORDERS, totalSlots } from "@/content/jobs-current";
import { ROUTES, type Locale } from "@/content/locales";

/**
 * Dải "đơn hàng đang chạy" ở trang chủ.
 *
 * Chạy ngang liên tục, bấm vào là sang trang danh sách đơn hàng. Danh sách
 * được lặp hai lần để vòng chạy nối liền, bản thứ hai ẩn với trình đọc màn
 * hình. Người bật "giảm chuyển động" thì dải đứng yên (xem globals.css),
 * rê chuột hoặc chạm vào cũng dừng để đọc.
 */
export function JobTicker({ locale }: { locale: Locale }) {
  const t = JOBS_COPY[locale];
  const href = ROUTES.jobs[locale] as Route;

  const items = JOB_ORDERS.map((j) => ({
    key: j.id,
    text: j.title[locale],
    slots: `${j.slots} ${t.slots}`,
  }));

  return (
    <section className="bg-[#0b3a80] text-white">
      <div className="flex items-center gap-4 px-4 py-2.5 lg:px-[calc(45*var(--u))]">
        <span className="flex shrink-0 items-center gap-2 text-xs font-bold tracking-[0.1em] uppercase lg:text-[calc(13*var(--u))]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--nb-orange)] opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--nb-orange)]" />
          </span>
          {t.tickerLabel}
        </span>

        <Link href={href} className="group relative flex-1 overflow-hidden" aria-label={t.tickerCta}>
          <span className="nb-ticker flex w-max items-center gap-8 whitespace-nowrap group-hover:[animation-play-state:paused]">
            {[0, 1].map((round) => (
              <span key={round} className="flex items-center gap-8" aria-hidden={round === 1}>
                {items.map((it) => (
                  <span key={round + it.key} className="flex items-center gap-2.5 text-sm lg:text-[calc(15*var(--u))]">
                    <Icon name="briefcase" className="h-4 w-4 shrink-0 text-[#ffc15e]" strokeWidth={1.8} />
                    <b className="font-semibold">{it.text}</b>
                    <span className="rounded-full bg-[var(--nb-orange)] px-2.5 py-0.5 text-xs font-bold lg:text-[calc(13*var(--u))]">
                      {it.slots}
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </span>
        </Link>

        <Link
          href={href}
          className="hidden shrink-0 items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold hover:bg-white/25 sm:flex lg:text-[calc(14*var(--u))]"
        >
          {t.tickerCta}
          <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-[#0b3a80]">{totalSlots()}</span>
          <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>
    </section>
  );
}

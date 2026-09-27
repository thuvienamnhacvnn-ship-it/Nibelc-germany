import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { HeroSearch } from "@/components/home/HeroSearch";
import { Icon } from "@/components/ui/Icon";
import { HOME_BANNER } from "@/content/industry-assets";
import { JOB_ORDERS, JOBS_COPY, totalSlots } from "@/content/jobs-current";
import { HOME, ROUTES, type Locale } from "@/content/locales";

/**
 * Banner trang chủ theo bộ mẫu mới (màn 01): một tấm ảnh lớn phủ tối, chữ
 * dồn về bên trái, ô tìm ngay dưới, và ba con số đọc từ dữ liệu thật.
 *
 * Bản cũ (hai lớp ảnh + vòng cung + bốn huy hiệu) đã bỏ hẳn — đó là thứ làm
 * trang chủ trông y như trước.
 */

const WORDS: Record<Locale, { jobs: string; slots: string; industries: string }> = {
  de: { jobs: "offene Stellen", slots: "Plätze insgesamt", industries: "Branchen" },
  en: { jobs: "open positions", slots: "places in total", industries: "industries" },
  vi: { jobs: "đơn hàng đang tuyển", slots: "suất tuyển", industries: "ngành nghề" },
};

export function HeroJobs({ locale, industryCount }: { locale: Locale; industryCount: number }) {
  const t = HOME[locale];
  const w = WORDS[locale];
  const c = JOBS_COPY[locale];

  const stats: [string, string][] = [
    [`${JOB_ORDERS.length}`, w.jobs],
    [`${totalSlots()}`, w.slots],
    [`${industryCount}`, w.industries],
  ];

  return (
    <section className="relative isolate overflow-hidden bg-[var(--nb-navy-deep)] text-white">
      {/* ảnh nền */}
      <div className="absolute inset-0 -z-10">
        <Image src={HOME_BANNER.background} alt="" fill priority sizes="100vw" className="object-cover object-[60%_40%]" />
        <span
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(10,31,61,.96) 0%, rgba(10,31,61,.88) 38%, rgba(10,31,61,.45) 70%, rgba(10,31,61,.35) 100%)",
          }}
          aria-hidden="true"
        />
        <span className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--nb-navy-deep)] to-transparent" aria-hidden="true" />
      </div>

      <div className="mx-auto max-w-[1400px] px-5 py-14 lg:px-10 lg:py-24">
        <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.24em] text-[var(--nb-gold)] uppercase lg:text-xs">
          <span className="h-px w-8 bg-[var(--nb-gold)]" aria-hidden="true" />
          {c.eyebrow}
        </p>

        <h1 className="mt-5 max-w-[16ch] text-[38px] leading-[1.06] font-extrabold tracking-[-0.03em] text-white lg:text-[68px]">
          {t.h1a} {t.h1b}
          <span className="block text-[var(--nb-gold)]">{t.h1accent}.</span>
        </h1>

        <p className="mt-5 max-w-[52ch] text-base text-white/80 lg:text-lg">{t.sub}</p>

        <div className="mt-7">
          <HeroSearch locale={locale} />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href={ROUTES.jobs[locale] as Route}
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-[var(--nb-gold)] px-6 font-bold text-[#231a05] hover:bg-[var(--nb-gold-dark)]"
          >
            {c.tickerCta}
            <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2.2} />
          </Link>
          <Link
            href={ROUTES.request[locale] as Route}
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/35 px-6 font-semibold text-white hover:bg-white/10"
          >
            {t.ctaPrimary}
          </Link>
        </div>

        <ul className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-6">
          {stats.map(([n, label]) => (
            <li key={label}>
              <b className="block text-[30px] leading-none font-extrabold text-[var(--nb-gold)] lg:text-[38px]">{n}</b>
              <span className="mt-1 block text-sm text-white/70">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

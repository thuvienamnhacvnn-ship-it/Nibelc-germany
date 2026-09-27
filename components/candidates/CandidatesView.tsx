import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { LegalStrip } from "@/components/LegalStrip";
import { MobileTabBar } from "@/components/nav/MobileTabBar";
import { Icon } from "@/components/ui/Icon";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { JOB_ORDERS, JOBS_COPY, totalSlots } from "@/content/jobs-current";
import { ROUTES, jobPath, type Locale } from "@/content/locales";
import { CANDIDATES } from "@/content/page-candidates";

/**
 * Trang dành cho người lao động — dựng theo bộ mẫu mới ("Dành cho người lao
 * động Việt Nam"): đầu trang navy có ảnh, danh sách việc cần làm với icon
 * vàng, các đơn hàng đang tuyển và nút tư vấn.
 *
 * Chữ vẫn từ `content/page-candidates.ts`. Dải số liệu của bản cũ đã bỏ:
 * ba trong bốn ô là số chưa được duyệt (CẦN ĐIỀN 05) nên luôn trống ở
 * production; thay vào đó là số đơn hàng và số suất — dữ liệu thật.
 */
export function CandidatesView({ locale }: { locale: Locale }) {
  const t = CANDIDATES[locale];
  const c = JOBS_COPY[locale];

  return (
    <>
      <SiteHeader locale={locale} page="process" />

      <main id="inhalt" className="bg-white">
        {/* ---------------- ĐẦU TRANG ---------------- */}
        <section className="relative isolate overflow-hidden bg-[var(--nb-navy-deep)] text-white">
          <div className="absolute inset-0 -z-10">
            <Image
              src={INDUSTRY_ASSETS["akademische-fachkraefte"]!.hero}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[55%_40%]"
            />
            <span
              className="absolute inset-0"
              style={{ background: "linear-gradient(90deg, rgba(10,31,61,.96), rgba(10,31,61,.86) 45%, rgba(10,31,61,.5))" }}
              aria-hidden="true"
            />
          </div>

          <div className="mx-auto max-w-[1400px] px-5 py-12 lg:px-10 lg:py-20">
            <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.24em] text-[var(--nb-gold)] uppercase lg:text-xs">
              <span className="h-px w-8 bg-[var(--nb-gold)]" aria-hidden="true" />
              {t.eyebrow}
            </p>
            <h1 className="mt-4 max-w-[18ch] text-[32px] leading-[1.08] font-extrabold tracking-[-0.025em] text-white lg:text-[54px]">
              {t.h1a}
              <span className="block">
                <span className="text-[var(--nb-gold)]">{t.h1accent}</span>
                {t.h1rest}
              </span>
            </h1>
            <p className="mt-4 max-w-[58ch] whitespace-pre-line text-white/80 lg:text-lg">{t.sub}</p>

            <p className="mt-7 flex flex-wrap gap-3">
              <Link
                href={ROUTES.jobs[locale] as Route}
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-[var(--nb-gold)] px-7 font-bold text-[#231a05] hover:bg-[var(--nb-gold-dark)]"
              >
                {c.tickerCta}
                <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2.2} />
              </Link>
              <Link
                href={ROUTES.process[locale] as Route}
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/35 px-7 font-semibold hover:bg-white/10"
              >
                {t.secondary[0]}
              </Link>
            </p>

            <ul className="mt-9 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/15 pt-6">
              {t.trust.map(([a, b], i) => (
                <li key={a} className="flex items-center gap-3">
                  <Icon name={["briefcase", "shield", "handshake"][i]!} className="h-7 w-7 shrink-0 text-[var(--nb-gold)]" strokeWidth={1.7} />
                  <span className="text-sm text-white/80">
                    <b className="block font-semibold text-white">{a}</b>
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- ĐƠN HÀNG ĐANG TUYỂN ---------------- */}
        <section className="mx-auto max-w-[1400px] px-5 py-12 lg:px-10 lg:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#10284d] lg:text-3xl">{c.title}</h2>
              <p className="mt-2 text-sm text-[#5b6b80]">
                {JOB_ORDERS.length} × {c.eyebrow} · {totalSlots()} {c.slots}
              </p>
            </div>
            <Link href={ROUTES.jobs[locale] as Route} className="flex items-center gap-2 font-semibold text-[#1647a8] hover:underline">
              {c.tickerCta}
              <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>

          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {JOB_ORDERS.map((j) => (
              <li key={j.id}>
                <Link
                  href={jobPath(locale, j.id) as Route}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-[#e3e9f1] hover:ring-[var(--nb-gold)]"
                >
                  <span className="relative block h-[150px] overflow-hidden">
                    <Image
                      src={INDUSTRY_ASSETS[j.industry]?.hero ?? INDUSTRY_ASSETS["gartenbau-gaertner"]!.hero}
                      alt=""
                      fill
                      sizes="(min-width:1024px) 30vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                    />
                    <span className="absolute right-3 bottom-3 rounded-full bg-[var(--nb-gold)] px-3 py-1 text-xs font-bold text-[#231a05]">
                      {j.slots} {c.slots}
                    </span>
                  </span>
                  <span className="flex flex-1 flex-col p-5">
                    <b className="block font-bold text-[#10284d]">{j.title[locale]}</b>
                    <span className="mt-1 block text-sm text-[#5b6b80]">{j.locations.join(" · ")}</span>
                    <span className="mt-3 flex items-center gap-2 text-sm font-bold text-[#10284d]">
                      <Icon name="chart" className="h-4 w-4 text-[#1f4f9f]" strokeWidth={1.9} />
                      {j.salary.from.toLocaleString("de-DE")} – {j.salary.to.toLocaleString("de-DE")} €
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------- TÁM CHỦ ĐỀ ---------------- */}
        <section className="bg-[#f7f9fc] py-12 lg:py-16">
          <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
            <h2 className="text-2xl font-bold text-[#10284d] lg:text-3xl">{t.secondary[1]}</h2>
            <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {t.topics.map((x) => (
                <li key={x.title} className="rounded-2xl bg-white p-5 ring-1 ring-[#e3e9f1]">
                  <Icon name={x.icon} className="h-8 w-8 text-[var(--nb-gold)]" strokeWidth={1.7} />
                  <h3 className="mt-3 font-bold text-[#10284d]">{x.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#5b6b80]">{x.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- KẾT ---------------- */}
        <section className="bg-[var(--nb-navy-deep)] py-12 text-white lg:py-16">
          <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-5 px-5 text-center lg:px-10">
            <p className="max-w-[60ch] text-xl font-semibold text-white italic lg:text-2xl">{t.quote}</p>
            <p className="text-sm text-white/60">{t.quoteBy}</p>
            <Link
              href={ROUTES.contact[locale] as Route}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-[var(--nb-gold)] px-7 font-bold text-[#231a05] hover:bg-[var(--nb-gold-dark)]"
            >
              {t.cta}
              <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2.2} />
            </Link>
          </div>
        </section>
      </main>

      <LegalStrip locale={locale} />
      <MobileTabBar locale={locale} page="process" />
    </>
  );
}

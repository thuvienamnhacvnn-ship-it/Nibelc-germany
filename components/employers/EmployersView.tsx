import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { LegalStrip } from "@/components/LegalStrip";
import { MobileTabBar } from "@/components/nav/MobileTabBar";
import { Icon } from "@/components/ui/Icon";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { activeIndustries, industryName } from "@/content/industries";
import { JOB_ORDERS, JOBS_COPY, totalSlots } from "@/content/jobs-current";
import { LEGAL } from "@/content/legal";
import { ROUTES, industryPath, type Locale } from "@/content/locales";
import { EMPLOYERS } from "@/content/page-employers";

/**
 * Trang dành cho doanh nghiệp — dựng theo bộ mẫu mới ("Dành cho doanh
 * nghiệp"): đầu trang navy với ảnh, danh sách điểm mạnh có icon vàng, sáu
 * bước, khối tuân thủ, các ngành và nút gọi hành động.
 *
 * Toàn bộ chữ vẫn từ `content/page-employers.ts`; bảng điều khiển minh hoạ
 * của bản cũ đã bỏ vì nó chỉ là ảnh mô phỏng.
 */
const STEP_ICON = ["users", "search", "doc", "shield", "plane", "home"];

export function EmployersView({ locale }: { locale: Locale }) {
  const t = EMPLOYERS[locale];
  const c = JOBS_COPY[locale];
  const tel = LEGAL.phone.replace(/\s/g, "");

  return (
    <>
      <SiteHeader locale={locale} page="employers" variant="navy" />

      <main id="inhalt" className="bg-white">
        {/* ---------------- ĐẦU TRANG ---------------- */}
        <section className="relative isolate overflow-hidden bg-[var(--nb-navy-deep)] text-white">
          <div className="absolute inset-0 -z-10">
            <Image
              src={INDUSTRY_ASSETS["produktion-maschinen-anlagen"]!.hero}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[60%_40%]"
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
              {t.h1a} <span className="text-[var(--nb-gold)]">{t.h1b}</span>
            </h1>
            <p className="mt-4 max-w-[58ch] text-white/80 lg:text-lg">{t.sub}</p>

            <p className="mt-7 flex flex-wrap gap-3">
              <Link
                href={ROUTES.request[locale] as Route}
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-[var(--nb-gold)] px-7 font-bold text-[#231a05] hover:bg-[var(--nb-gold-dark)]"
              >
                {t.cta}
                <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2.2} />
              </Link>
              <a
                href={`tel:${tel}`}
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/35 px-7 font-semibold hover:bg-white/10"
              >
                <Icon name="phone" className="h-4 w-4" strokeWidth={1.9} />
                {LEGAL.phone}
              </a>
            </p>

            <ul className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-6">
              {[
                [`${JOB_ORDERS.length}`, c.eyebrow],
                [`${totalSlots()}`, c.slots],
                [`${activeIndustries().length}`, t.industriesLabel],
              ].map(([n, label]) => (
                <li key={label}>
                  <b className="block text-[28px] leading-none font-extrabold text-[var(--nb-gold)] lg:text-[34px]">{n}</b>
                  <span className="mt-1 block text-sm text-white/70">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- DỊCH VỤ ---------------- */}
        <section className="mx-auto max-w-[1400px] px-5 py-12 lg:px-10 lg:py-16">
          <h2 className="text-xs font-bold tracking-[0.2em] text-[#1f4f9f] uppercase">{t.servicesLabel}</h2>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.services.map((s, i) => (
              <li key={s.title} className="rounded-2xl bg-white p-6 ring-1 ring-[#e3e9f1]">
                <Icon name={["search", "doc", "plane", "home"][i]!} className="h-8 w-8 text-[var(--nb-gold)]" strokeWidth={1.7} />
                <h3 className="mt-4 text-lg font-bold text-[#10284d]">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#5b6b80]">{s.text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------- SÁU BƯỚC ---------------- */}
        <section className="bg-[#f7f9fc] py-12 lg:py-16">
          <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
            <h2 className="text-2xl font-bold text-[#10284d] lg:text-3xl">{t.stepsLabel}</h2>
            <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {t.steps.map((s, i) => (
                <li key={s.title} className="flex gap-4 rounded-2xl bg-white p-5 ring-1 ring-[#e3e9f1]">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--nb-navy-deep)] font-extrabold text-[var(--nb-gold)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="flex items-center gap-2 font-bold text-[#10284d]">
                      <Icon name={STEP_ICON[i]!} className="h-4 w-4 text-[#1f4f9f]" strokeWidth={1.9} />
                      {s.title}
                    </span>
                    <span className="mt-1 block text-sm text-[#5b6b80]">{s.text}</span>
                  </span>
                </li>
              ))}
            </ol>

            {/* tuân thủ */}
            <div className="mt-8 rounded-2xl bg-white p-6 ring-1 ring-[#e3e9f1] lg:p-7">
              <h3 className="flex items-center gap-2 font-bold text-[#10284d]">
                <Icon name="shield" className="h-5 w-5 text-[#1f4f9f]" strokeWidth={1.8} />
                {t.complianceTitle}
              </h3>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {t.compliance.map((x) => (
                  <li key={x} className="flex gap-2 text-sm text-[#2a3d58]">
                    <Icon name="checkCircle" className="mt-0.5 h-4 w-4 shrink-0 text-[#16a34a]" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------------- NGÀNH ---------------- */}
        <section className="mx-auto max-w-[1400px] px-5 py-12 lg:px-10 lg:py-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-[#10284d] lg:text-3xl">{t.industriesLabel}</h2>
            <Link href={ROUTES.industries[locale] as Route} className="flex items-center gap-2 font-semibold text-[#1647a8] hover:underline">
              {t.allIndustries}
              <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>

          <ul className="mt-6 flex flex-wrap gap-3">
            {activeIndustries().map((i) => (
              <li key={i.slug}>
                <Link
                  href={industryPath(locale, i.slug) as Route}
                  className="flex items-center gap-2 rounded-full bg-[var(--nb-strip)] px-5 py-2.5 text-sm font-semibold text-[#10284d] ring-1 ring-[#dbe4f0] hover:ring-[var(--nb-gold)]"
                >
                  <Icon name={i.icon} className="h-4 w-4 text-[#1f4f9f]" strokeWidth={1.8} />
                  {industryName(i, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------- TƯ VẤN ---------------- */}
        <section className="bg-[var(--nb-navy-deep)] py-12 text-white lg:py-16">
          <div className="mx-auto flex max-w-[1400px] flex-col items-start gap-5 px-5 lg:flex-row lg:items-center lg:justify-between lg:px-10">
            <div>
              <h2 className="text-2xl font-bold text-white lg:text-3xl">{t.adviceTitle}</h2>
              <p className="mt-2 max-w-[60ch] text-white/75">{t.adviceText}</p>
            </div>
            <Link
              href={ROUTES.request[locale] as Route}
              className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-[var(--nb-gold)] px-7 font-bold text-[#231a05] hover:bg-[var(--nb-gold-dark)]"
            >
              {t.adviceCta}
              <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2.2} />
            </Link>
          </div>
        </section>
      </main>

      <LegalStrip locale={locale} />
      <MobileTabBar locale={locale} page="employers" />
    </>
  );
}

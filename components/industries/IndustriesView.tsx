import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { LegalStrip } from "@/components/LegalStrip";
import { MobileTabBar } from "@/components/nav/MobileTabBar";
import { Icon } from "@/components/ui/Icon";
import { allIndustries, industryAssets, industryName, industryRoles } from "@/content/industries";
import { JOB_ORDERS, JOBS_COPY } from "@/content/jobs-current";
import { ROUTES, industryPath, type Locale } from "@/content/locales";
import { INDUSTRIES_PAGE } from "@/content/page-industries";

/**
 * Trang ngành nghề — dựng theo bộ mẫu mới ("Ngành nghề tuyển dụng"): lưới ảnh
 * lớn, mỗi ô một ngành, tên ngành nằm trên ảnh, ô nào đang có đơn hàng thì
 * gắn nhãn vàng.
 *
 * Nội dung và ảnh giữ nguyên: tên ngành, các vị trí và slot ảnh KIT đọc từ
 * registry. Ngành chưa mở (CẦN ĐIỀN 02) vẫn hiện thẻ nhưng không có link.
 */
export function IndustriesView({ locale }: { locale: Locale }) {
  const t = INDUSTRIES_PAGE[locale];
  const c = JOBS_COPY[locale];
  const industries = allIndustries();

  const openJobs = (slug: string) => JOB_ORDERS.filter((j) => j.industry === slug).length;

  return (
    <>
      <SiteHeader locale={locale} page="industries" />

      <main id="inhalt" className="bg-white">
        {/* ---------------- ĐẦU TRANG ---------------- */}
        <section className="bg-[var(--nb-navy-deep)] text-white">
          <div className="mx-auto max-w-[1400px] px-5 py-12 lg:px-10 lg:py-16">
            <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.24em] text-[var(--nb-gold)] uppercase lg:text-xs">
              <span className="h-px w-8 bg-[var(--nb-gold)]" aria-hidden="true" />
              {t.eyebrow}
            </p>
            <h1 className="mt-4 max-w-[20ch] text-[30px] leading-[1.1] font-extrabold tracking-[-0.02em] text-white lg:text-[48px]">
              {t.h1}
            </h1>
            <p className="mt-4 max-w-[70ch] whitespace-pre-line text-white/75">{t.sub}</p>

            <ul className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
              {t.trust.map(([a, b], i) => (
                <li key={a} className="flex items-center gap-3">
                  <Icon name={["users", "shield", "chart"][i]!} className="h-7 w-7 shrink-0 text-[var(--nb-gold)]" strokeWidth={1.7} />
                  <span className="text-sm text-white/80">
                    <b className="block font-semibold text-white">{a}</b>
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- LƯỚI NGÀNH ---------------- */}
        <section className="mx-auto max-w-[1400px] px-5 py-10 lg:px-10 lg:py-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#10284d] lg:text-3xl">{t.sectionTitle}</h2>
              <p className="mt-2 max-w-[80ch] text-sm text-[#5b6b80]">{t.sectionText}</p>
            </div>
            <p className="flex items-center gap-2 text-[#1f4f9f]">
              <b className="text-3xl font-extrabold">{industries.length}</b>
              <span className="text-sm">{t.fieldsLabel}</span>
            </p>
          </div>

          <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
            {industries.map((i) => {
              const blocked = i.status !== "active";
              const a = industryAssets(i);
              const jobs = openJobs(i.slug);
              const inner = (
                <>
                  <span className="absolute inset-0">
                    <Image
                      src={a.hero}
                      alt={i.alt.hero}
                      fill
                      sizes="(min-width:1024px) 25vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                      style={{ objectPosition: "50% 40%" }}
                    />
                    <span
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(180deg, rgba(10,31,61,.18), rgba(10,31,61,.88))" }}
                      aria-hidden="true"
                    />
                  </span>

                  {jobs > 0 && (
                    <span className="absolute top-3 left-3 rounded-full bg-[var(--nb-gold)] px-3 py-1 text-[11px] font-bold text-[#231a05]">
                      {jobs} × {c.eyebrow}
                    </span>
                  )}

                  <span className="relative mt-auto block p-4">
                    <Icon name={i.icon} className="h-7 w-7 text-[var(--nb-gold)]" strokeWidth={1.7} />
                    <span className="mt-2 block text-[15px] leading-tight font-bold text-white lg:text-lg">
                      {industryName(i, locale)}
                    </span>
                    <span className="mt-1 block truncate text-xs text-white/70">
                      {blocked ? t.inPrep : industryRoles(i, locale).join(" · ")}
                    </span>
                  </span>
                </>
              );

              const cls = "group relative flex aspect-[4/5] flex-col overflow-hidden rounded-2xl ring-1 ring-[#e3e9f1] sm:aspect-[4/4.4]";

              return (
                <li key={i.slug}>
                  {blocked ? (
                    <div className={`${cls} opacity-75`} aria-disabled="true">
                      {inner}
                    </div>
                  ) : (
                    <Link href={industryPath(locale, i.slug) as Route} className={`${cls} hover:ring-[var(--nb-gold)]`}>
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ---------------- DẢI KẾT ---------------- */}
        <section className="bg-[#f7f9fc] py-10 lg:py-12">
          <ul className="mx-auto grid max-w-[1400px] gap-6 px-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
            {t.strip.map(([title, sub], i) => (
              <li key={sub} className="flex items-center gap-4">
                <Icon name={["users", "globe", "handshake", "germany"][i]!} className="h-10 w-10 shrink-0 text-[#1f4f9f]" strokeWidth={1.7} />
                <span>
                  <b className="block text-[#10284d]">{i === 0 ? industries.length : title}</b>
                  <span className="block text-sm text-[#5b6b80]">{sub}</span>
                </span>
              </li>
            ))}
          </ul>

          <p className="mx-auto mt-8 flex max-w-[1400px] px-5 lg:px-10">
            <Link
              href={ROUTES.jobs[locale] as Route}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-[var(--nb-gold)] px-7 font-bold text-[#231a05] hover:bg-[var(--nb-gold-dark)]"
            >
              {c.tickerCta}
              <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2.2} />
            </Link>
          </p>
        </section>
      </main>

      <LegalStrip locale={locale} />
      <MobileTabBar locale={locale} page="industries" />
    </>
  );
}

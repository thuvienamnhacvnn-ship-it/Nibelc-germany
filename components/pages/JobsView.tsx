import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { PageShell } from "@/components/PageShell";
import { Icon } from "@/components/ui/Icon";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { industryBySlug, industryName } from "@/content/industries";
import { JOBS_COPY, JOB_ORDERS, totalSlots } from "@/content/jobs-current";
import { ROUTES, industryPath, type Locale } from "@/content/locales";

/**
 * Trang "đơn hàng đang chạy" — các vị trí đang tuyển, đọc từ
 * `content/jobs-current.ts`. Ảnh tin gốc chỉ hiện ở bản tiếng Việt: tin in
 * kèm giới hạn tuổi và giới tính, thứ mà tin tuyển dụng ở Đức không được nêu.
 */
export function JobsView({ locale }: { locale: Locale }) {
  const t = JOBS_COPY[locale];

  return (
    <PageShell
      locale={locale}
      page="jobs"
      eyebrow={t.eyebrow}
      title={t.title}
      lead={t.lead}
      hero={INDUSTRY_ASSETS["gartenbau-gaertner"]!.hero}
      heroFocus="55% 40%"
    >
      <section className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl bg-[#eaf1fa] px-5 py-4 text-sm text-[#2a3d58] ring-1 ring-[#dbe4f0]">
          <span className="flex items-center gap-2 font-bold text-[#0b3a80]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--nb-orange)] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--nb-orange)]" />
            </span>
            {JOB_ORDERS.length} × {t.eyebrow}
          </span>
          <span className="font-semibold text-[#10284d]">
            {totalSlots()} {t.slots}
          </span>
        </p>

        <ul className="mt-8 space-y-8">
          {JOB_ORDERS.map((j) => {
            const industry = industryBySlug(j.industry);
            return (
              <li key={j.id} className="overflow-hidden rounded-2xl bg-white ring-1 ring-[#e3e9f1]">
                {/* đầu thẻ */}
                <div className="flex flex-wrap items-start gap-4 border-b border-[#eef2f7] bg-[#f7f9fc] px-6 py-5">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-bold text-[#10284d] lg:text-2xl">{j.title[locale]}</h2>
                    <p className="mt-1 text-[#5b6b80]">{j.summary[locale]}</p>
                  </div>
                  <p className="flex items-center gap-2 rounded-full bg-[var(--nb-orange)] px-4 py-2 font-bold text-white">
                    {j.slots}
                    <span className="text-sm font-semibold">{t.slots}</span>
                  </p>
                </div>

                {/* thông số */}
                <dl className="grid gap-x-6 gap-y-4 px-6 py-5 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { icon: "chart", label: t.salaryLabel, value: `${j.salary.from.toLocaleString("de-DE")} – ${j.salary.to.toLocaleString("de-DE")} €`, sub: t.perMonth },
                    { icon: "clock", label: t.hoursLabel, value: `${j.hoursPerWeek} h`, sub: locale === "vi" ? "mỗi tuần" : locale === "en" ? "per week" : "pro Woche" },
                    { icon: "pin", label: t.locationLabel, value: j.locations.join(" · ") },
                    { icon: "doc", label: t.visaLabel, value: j.visa },
                  ].map((f) => (
                    <div key={f.label} className="flex gap-3">
                      <Icon name={f.icon} className="mt-0.5 h-5 w-5 shrink-0 text-[#1f4f9f]" strokeWidth={1.8} />
                      <div className="min-w-0">
                        <dt className="text-xs font-semibold tracking-wide text-[#5b6b80] uppercase">{f.label}</dt>
                        <dd className="font-bold text-[#10284d]">{f.value}</dd>
                        {f.sub && <dd className="text-xs text-[#5b6b80]">{f.sub}</dd>}
                      </div>
                    </div>
                  ))}
                </dl>

                {/* ba cột nội dung */}
                <div className="grid gap-6 border-t border-[#eef2f7] px-6 py-6 lg:grid-cols-3">
                  {[
                    { label: t.tasksLabel, items: j.tasks[locale], icon: "checkCircle", color: "text-[#1f4f9f]" },
                    { label: t.reqLabel, items: j.requirements[locale], icon: "checkSquare", color: "text-[#1f4f9f]" },
                    { label: t.benefitsLabel, items: j.benefits[locale], icon: "heart", color: "text-[#16a34a]" },
                  ].map((col) => (
                    <div key={col.label}>
                      <h3 className="font-bold text-[#10284d]">{col.label}</h3>
                      <ul className="mt-3 space-y-2 text-sm text-[#2a3d58]">
                        {col.items.map((x) => (
                          <li key={x} className="flex gap-2.5">
                            <Icon name={col.icon} className={`mt-0.5 h-4 w-4 shrink-0 ${col.color}`} strokeWidth={1.8} />
                            {x}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* tin gốc — chỉ bản tiếng Việt */}
                {locale === "vi" && (
                  <div className="border-t border-[#eef2f7] px-6 py-6">
                    <p className="text-sm font-semibold text-[#5b6b80]">{t.posterNote}</p>
                    <Image
                      src={j.poster.src}
                      alt={j.title.vi}
                      width={j.poster.w}
                      height={j.poster.h}
                      sizes="(min-width:1024px) 420px, 100vw"
                      className="mt-3 w-full max-w-[420px] rounded-xl ring-1 ring-[#e3e9f1]"
                    />
                  </div>
                )}

                {/* nút */}
                <div className="flex flex-wrap items-center gap-3 border-t border-[#eef2f7] bg-[#f7f9fc] px-6 py-5">
                  <Link
                    href={ROUTES.contact[locale] as Route}
                    className="inline-flex items-center gap-2 rounded-lg bg-[var(--nb-orange)] px-6 py-3 font-semibold text-white hover:bg-[var(--nb-orange-dark)]"
                  >
                    {t.apply}
                    <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2} />
                  </Link>
                  {industry && (
                    <Link
                      href={industryPath(locale, industry.slug) as Route}
                      className="inline-flex items-center gap-2 rounded-lg px-4 py-3 font-semibold text-[#1647a8] hover:underline"
                    >
                      {t.industryLink}: {industryName(industry, locale)}
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 max-w-[95ch] rounded-xl bg-[#f7f9fc] p-5 text-sm leading-6 text-[#5b6b80] ring-1 ring-[#e3e9f1]">
          {t.note}
        </p>
      </section>
    </PageShell>
  );
}

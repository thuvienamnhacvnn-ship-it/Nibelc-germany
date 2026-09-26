import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { LegalStrip } from "@/components/LegalStrip";
import { MobileTabBar } from "@/components/nav/MobileTabBar";
import { Icon } from "@/components/ui/Icon";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { industryBySlug, industryName } from "@/content/industries";
import { JOBS_COPY, otherJobs, type JobOrder } from "@/content/jobs-current";
import { STAGE } from "@/content/job-stage";
import { ROUTES, industryPath, jobPath, type Locale } from "@/content/locales";

/**
 * Trang chi tiết một đơn hàng — cùng ngôn ngữ thị giác với sân khấu ở trang
 * chủ: nền navy đậm, ảnh ngành phía sau, chữ lớn có phân cấp.
 *
 * Mọi con số (suất, lương, giờ, diện visa, nơi làm) đọc thẳng từ
 * `content/jobs-current.ts`. Không có trường "trạng thái tuyển dụng" trong dữ
 * liệu nên trang này không hiển thị trạng thái nào — không suy diễn.
 */
export function JobDetailView({ locale, job }: { locale: Locale; job: JobOrder }) {
  const t = STAGE[locale];
  const c = JOBS_COPY[locale];
  const img = INDUSTRY_ASSETS[job.industry]?.hero ?? INDUSTRY_ASSETS["gartenbau-gaertner"]!.hero;
  const industry = industryBySlug(job.industry);
  const others = otherJobs(job.id);

  const facts = [
    { icon: "users", label: c.slotsLabel, value: `${job.slots}`, sub: c.slots },
    { icon: "chart", label: c.salaryLabel, value: `${job.salary.from.toLocaleString("de-DE")} – ${job.salary.to.toLocaleString("de-DE")} €`, sub: c.perMonth },
    { icon: "clock", label: c.hoursLabel, value: `${job.hoursPerWeek} h`, sub: locale === "vi" ? "mỗi tuần" : locale === "en" ? "per week" : "pro Woche" },
    { icon: "doc", label: c.visaLabel, value: job.visa },
  ];

  const columns = [
    { label: c.tasksLabel, items: job.tasks[locale], icon: "checkCircle", tone: "text-[#8fc0ff]" },
    { label: c.reqLabel, items: job.requirements[locale], icon: "checkSquare", tone: "text-[#8fc0ff]" },
    { label: c.benefitsLabel, items: job.benefits[locale], icon: "heart", tone: "text-[#6fd39b]" },
  ];

  return (
    <>
      <SiteHeader locale={locale} page="jobs" />

      <main id="inhalt" className="bg-white">
        {/* ---------------- HERO ---------------- */}
        <section className="relative overflow-hidden bg-[#071d3a] text-white">
          <div className="absolute inset-0">
            <Image src={img} alt="" fill priority sizes="100vw" className="object-cover opacity-40" style={{ objectPosition: "50% 45%" }} />
            <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(7,29,58,.72), rgba(7,29,58,.94))" }} aria-hidden="true" />
          </div>

          <div className="relative mx-auto max-w-[1400px] px-5 pt-6 pb-10 lg:px-10 lg:pt-10 lg:pb-16">
            <Link
              href={ROUTES.jobs[locale] as Route}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 hover:text-white"
            >
              <Icon name="chevronRight" className="h-4 w-4 rotate-180" strokeWidth={2} />
              {t.back}
            </Link>

            <p className="mt-6 flex flex-wrap items-center gap-3 text-[11px] font-bold tracking-[0.2em] uppercase lg:text-xs">
              <span className="flex items-center gap-2 text-[#8fc0ff]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--nb-orange)] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--nb-orange)]" />
                </span>
                {t.eyebrow}
              </span>
              {industry && (
                <Link href={industryPath(locale, industry.slug) as Route} className="text-white/60 hover:text-white">
                  {industryName(industry, locale)}
                </Link>
              )}
            </p>

            <h1 className="mt-4 max-w-[20ch] text-[32px] leading-[1.08] font-extrabold tracking-[-0.025em] text-white lg:text-[58px]">
              {job.title[locale]}
            </h1>
            <p className="mt-4 max-w-[62ch] text-base text-white/75 lg:text-lg">{job.summary[locale]}</p>

            <p className="mt-6 flex flex-wrap items-center gap-2 text-sm">
              <span className="flex items-center gap-2 rounded-full bg-[var(--nb-orange)] px-4 py-2 font-bold">
                {job.slots}
                <span className="text-xs font-semibold">{c.slots}</span>
              </span>
              <span className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                <Icon name="pin" className="h-4 w-4" strokeWidth={1.9} />
                {job.locations.join(" · ")}
              </span>
            </p>

            <p className="mt-7 flex flex-wrap gap-3">
              <Link
                href={ROUTES.contact[locale] as Route}
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-[var(--nb-orange)] px-7 font-semibold text-white hover:bg-[var(--nb-orange-dark)]"
              >
                {c.apply}
                <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2} />
              </Link>
              <Link
                href={ROUTES.request[locale] as Route}
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/30 px-7 font-semibold text-white hover:bg-white/10"
              >
                {ROUTES.request[locale] === "/personalbedarf" ? "Personalbedarf melden" : locale === "vi" ? "Báo nhu cầu nhân sự" : "Report staffing needs"}
              </Link>
            </p>
          </div>
        </section>

        {/* ---------------- THÔNG SỐ ---------------- */}
        <section className="border-b border-[#e3e9f1] bg-[#f7f9fc]">
          <dl className="mx-auto grid max-w-[1400px] gap-x-6 gap-y-6 px-5 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:px-10 lg:py-10">
            {facts.map((f) => (
              <div key={f.label} className="flex gap-3">
                <Icon name={f.icon} className="mt-1 h-5 w-5 shrink-0 text-[#1f4f9f]" strokeWidth={1.8} />
                <div className="min-w-0">
                  <dt className="text-xs font-semibold tracking-[0.12em] text-[#5b6b80] uppercase">{f.label}</dt>
                  <dd className="text-lg font-bold text-[#10284d] lg:text-xl">{f.value}</dd>
                  {f.sub && <dd className="text-xs text-[#5b6b80]">{f.sub}</dd>}
                </div>
              </div>
            ))}
          </dl>
        </section>

        {/* ---------------- NỘI DUNG ---------------- */}
        <section className="mx-auto grid max-w-[1400px] gap-8 px-5 py-12 lg:grid-cols-3 lg:px-10 lg:py-16">
          {columns.map((col) => (
            <div key={col.label}>
              <h2 className="text-xl font-bold text-[#10284d]">{col.label}</h2>
              <span className="mt-3 block h-[3px] w-10 rounded-full bg-[var(--nb-orange)]" aria-hidden="true" />
              <ul className="mt-5 space-y-3 text-[#2a3d58]">
                {col.items.map((x) => (
                  <li key={x} className="flex gap-3">
                    <Icon name={col.icon} className={`mt-0.5 h-5 w-5 shrink-0 ${col.tone}`} strokeWidth={1.8} />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* ---------------- TIN GỐC (chỉ bản tiếng Việt) ---------------- */}
        {locale === "vi" && (
          <section className="mx-auto max-w-[1400px] px-5 pb-12 lg:px-10">
            <p className="text-sm font-semibold text-[#5b6b80]">{c.posterNote}</p>
            <Image
              src={job.poster.src}
              alt={job.title.vi}
              width={job.poster.w}
              height={job.poster.h}
              sizes="(min-width:1024px) 420px, 100vw"
              className="mt-3 w-full max-w-[420px] rounded-xl ring-1 ring-[#e3e9f1]"
            />
          </section>
        )}

        {/* ---------------- ĐƠN KHÁC ---------------- */}
        {others.length > 0 && (
          <section className="bg-[#071d3a] py-12 text-white lg:py-16">
            <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
              <h2 className="text-2xl font-bold lg:text-3xl">{t.related}</h2>
              <ul className="mt-7 grid gap-5 sm:grid-cols-2">
                {others.map((o) => (
                  <li key={o.id}>
                    <Link
                      href={jobPath(locale, o.id) as Route}
                      className="group flex items-stretch gap-4 overflow-hidden rounded-2xl ring-1 ring-white/12 hover:ring-white/35"
                      style={{ background: "linear-gradient(180deg,#0d2b52,#0a2039)" }}
                    >
                      <span className="relative w-28 shrink-0 overflow-hidden sm:w-36">
                        <Image
                          src={INDUSTRY_ASSETS[o.industry]?.hero ?? img}
                          alt=""
                          fill
                          sizes="144px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                        />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col justify-center py-4 pr-4">
                        <span className="block font-bold">{o.title[locale]}</span>
                        <span className="mt-1 block text-sm text-white/65">
                          {o.slots} {c.slots} · {o.locations[0]}
                        </span>
                      </span>
                      <span className="flex items-center pr-4 text-white/60 group-hover:text-white">
                        <Icon name="arrowRight" className="h-5 w-5" strokeWidth={2} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="mt-8 max-w-[95ch] text-sm leading-6 text-white/55">{c.note}</p>
            </div>
          </section>
        )}
      </main>

      <LegalStrip locale={locale} />
      <MobileTabBar locale={locale} page="jobs" />
    </>
  );
}

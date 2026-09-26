import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { LegalStrip } from "@/components/LegalStrip";
import { MobileTabBar } from "@/components/nav/MobileTabBar";
import { JobGallery } from "@/components/jobs/JobGallery";
import { JobTabs } from "@/components/jobs/JobTabs";
import { Icon } from "@/components/ui/Icon";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { industryBySlug, industryName } from "@/content/industries";
import { JOBS_COPY, otherJobs, type JobOrder } from "@/content/jobs-current";
import { STAGE } from "@/content/job-stage";
import { LEGAL } from "@/content/legal";
import { ROUTES, industryPath, jobPath, type Locale } from "@/content/locales";

/**
 * Trang chi tiết đơn hàng — dựng theo màn 03 của bộ mẫu mới:
 * ảnh lớn + cột ảnh nhỏ, bốn ô thông số, hai nút hành động, các thẻ tab
 * (Tổng quan · Công việc · Yêu cầu · Quyền lợi · Liên hệ) và cột tư vấn.
 *
 * Dữ liệu, ảnh và thông tin liên hệ đều là của dự án, đọc từ
 * `content/jobs-current.ts`, `content/industry-assets.ts`, `content/legal.ts`.
 * Mẫu có ô "Trạng thái", "Lưu đơn hàng", Zalo và một số điện thoại khác —
 * những thứ đó không có trong dữ liệu nên không dựng.
 */

const OVERVIEW: Record<Locale, { title: string; country: string; industry: string; position: string; slots: string; salary: string; visa: string; hours: string; locations: string }> = {
  de: {
    title: "Überblick",
    country: "Land",
    industry: "Branche",
    position: "Position",
    slots: "Plätze",
    salary: "Vergütung",
    visa: "Aufenthaltstitel",
    hours: "Arbeitszeit",
    locations: "Einsatzorte",
  },
  en: {
    title: "Overview",
    country: "Country",
    industry: "Industry",
    position: "Position",
    slots: "Places",
    salary: "Pay",
    visa: "Residence title",
    hours: "Working time",
    locations: "Locations",
  },
  vi: {
    title: "Tổng quan",
    country: "Quốc gia",
    industry: "Ngành nghề",
    position: "Vị trí",
    slots: "Số suất",
    salary: "Mức lương",
    visa: "Diện visa",
    hours: "Thời gian làm việc",
    locations: "Nơi làm việc",
  },
};

const ADVICE: Record<Locale, { title: string; note: string; call: string; mail: string; request: string }> = {
  de: {
    title: "Beratung zu dieser Stelle",
    note: "Wir beantworten Fragen zu Ablauf, Unterlagen und Terminen.",
    call: "Anrufen",
    mail: "E-Mail schreiben",
    request: "Personalbedarf melden",
  },
  en: {
    title: "Advice on this position",
    note: "We answer questions about the procedure, documents and dates.",
    call: "Call us",
    mail: "Write an email",
    request: "Report staffing needs",
  },
  vi: {
    title: "Tư vấn đơn hàng",
    note: "Chúng tôi giải đáp về quy trình, hồ sơ và lịch hẹn.",
    call: "Gọi điện",
    mail: "Gửi email",
    request: "Báo nhu cầu nhân sự",
  },
};

export function JobDetailView({ locale, job }: { locale: Locale; job: JobOrder }) {
  const t = STAGE[locale];
  const c = JOBS_COPY[locale];
  const o = OVERVIEW[locale];
  const a = ADVICE[locale];
  const set = INDUSTRY_ASSETS[job.industry] ?? INDUSTRY_ASSETS["gartenbau-gaertner"]!;
  const industry = industryBySlug(job.industry);
  const others = otherJobs(job.id);
  const tel = LEGAL.phone.replace(/\s/g, "");
  const salary = `${job.salary.from.toLocaleString("de-DE")} – ${job.salary.to.toLocaleString("de-DE")} €`;

  const facts = [
    { icon: "chart", value: salary, sub: c.perMonth },
    { icon: "users", value: `${job.slots}`, sub: c.slots },
    { icon: "doc", value: job.visa, sub: o.visa },
    { icon: "clock", value: `${job.hoursPerWeek} h`, sub: locale === "vi" ? "mỗi tuần" : locale === "en" ? "per week" : "pro Woche" },
  ];

  const rows: [string, string][] = [
    [o.country, t.country],
    [o.industry, industry ? industryName(industry, locale) : "—"],
    [o.position, job.title[locale]],
    [o.slots, `${job.slots}`],
    [o.salary, `${salary} · ${c.perMonth}`],
    [o.visa, job.visa],
    [o.hours, `${job.hoursPerWeek} h`],
    [o.locations, job.locations.join(" · ")],
  ];

  const list = (items: string[], icon: string, tone: string) => (
    <ul className="space-y-3 text-[#2a3d58]">
      {items.map((x) => (
        <li key={x} className="flex gap-3">
          <Icon name={icon} className={`mt-0.5 h-5 w-5 shrink-0 ${tone}`} strokeWidth={1.8} />
          {x}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <SiteHeader locale={locale} page="jobs" />

      <main id="inhalt" className="bg-white">
        {/* ---------------- ĐẦU TRANG: ảnh + thông số ---------------- */}
        <section className="bg-[#071d3a] text-white">
          <div className="mx-auto max-w-[1400px] px-5 pt-5 pb-10 lg:px-10 lg:pt-8 lg:pb-14">
            <Link href={ROUTES.jobs[locale] as Route} className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 hover:text-white">
              <Icon name="chevronRight" className="h-4 w-4 rotate-180" strokeWidth={2} />
              {t.back}
            </Link>

            <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center">
              <JobGallery images={[set.hero, set.portraitWork, set.portraitTeam, set.detail]} alt={job.title[locale]} />

              <div>
                <p className="flex flex-wrap items-center gap-3 text-[11px] font-bold tracking-[0.2em] uppercase lg:text-xs">
                  <span className="flex items-center gap-2 text-[#8fc0ff]">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--nb-orange)] opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--nb-orange)]" />
                    </span>
                    {t.eyebrow}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-white/85">
                    <Icon name="germany" className="h-3.5 w-3.5" />
                    {t.country}
                  </span>
                </p>

                <h1 className="mt-4 text-[30px] leading-[1.1] font-extrabold tracking-[-0.02em] text-white lg:text-[46px]">{job.title[locale]}</h1>
                <p className="mt-3 max-w-[54ch] text-white/75">{job.summary[locale]}</p>

                <ul className="mt-6 grid grid-cols-2 gap-3">
                  {facts.map((f) => (
                    <li key={f.sub} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/10">
                      <Icon name={f.icon} className="h-5 w-5 shrink-0 text-[#8fc0ff]" strokeWidth={1.8} />
                      <span className="min-w-0">
                        <b className="block text-[14px] leading-tight font-bold break-words sm:text-[15px]">{f.value}</b>
                        <span className="block text-xs text-white/60">{f.sub}</span>
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={ROUTES.contact[locale] as Route}
                    className="inline-flex h-12 flex-1 min-w-[190px] items-center justify-center gap-2 rounded-xl bg-[var(--nb-orange)] px-6 font-semibold text-white hover:bg-[var(--nb-orange-dark)]"
                  >
                    {c.apply}
                    <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2} />
                  </Link>
                  <a
                    href={`tel:${tel}`}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/30 px-6 font-semibold hover:bg-white/10"
                  >
                    <Icon name="phone" className="h-4 w-4" strokeWidth={1.9} />
                    {a.call}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- TAB + CỘT TƯ VẤN ---------------- */}
        <section className="mx-auto grid max-w-[1400px] gap-8 px-5 py-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:px-10 lg:py-14">
          <div className="min-w-0 rounded-2xl bg-white p-5 ring-1 ring-[#e3e9f1] lg:p-7">
            <JobTabs
              tabs={[
                {
                  id: "overview",
                  label: o.title,
                  icon: "grid",
                  content: (
                    <dl className="divide-y divide-[#eef2f7]">
                      {rows.map(([k, v]) => (
                        <div key={k} className="flex flex-wrap gap-x-6 gap-y-1 py-3">
                          <dt className="w-28 shrink-0 text-sm text-[#5b6b80] sm:w-40">{k}</dt>
                          <dd className="min-w-0 font-semibold break-words text-[#10284d]">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  ),
                },
                { id: "tasks", label: c.tasksLabel, icon: "checkCircle", content: list(job.tasks[locale], "checkCircle", "text-[#1f4f9f]") },
                { id: "req", label: c.reqLabel, icon: "checkSquare", content: list(job.requirements[locale], "checkSquare", "text-[#1f4f9f]") },
                { id: "benefits", label: c.benefitsLabel, icon: "heart", content: list(job.benefits[locale], "heart", "text-[#16a34a]") },
                {
                  id: "contact",
                  label: a.title,
                  icon: "chat",
                  content: (
                    <div className="space-y-3 text-[#2a3d58]">
                      <p>{a.note}</p>
                      <p className="flex items-center gap-2">
                        <Icon name="phone" className="h-5 w-5 text-[#1f4f9f]" strokeWidth={1.8} />
                        <a href={`tel:${tel}`} className="font-semibold text-[#10284d] hover:underline">
                          {LEGAL.phone}
                        </a>
                      </p>
                      <p className="flex items-center gap-2">
                        <Icon name="mail" className="h-5 w-5 text-[#1f4f9f]" strokeWidth={1.8} />
                        <a href={`mailto:${LEGAL.email}`} className="font-semibold text-[#10284d] hover:underline">
                          {LEGAL.email}
                        </a>
                      </p>
                      <p className="text-sm text-[#5b6b80]">
                        {LEGAL.name} · {LEGAL.street}, {LEGAL.postalCode} {LEGAL.city}
                      </p>
                    </div>
                  ),
                },
              ]}
            />

            {locale === "vi" && (
              <div className="mt-8 border-t border-[#eef2f7] pt-6">
                <p className="text-sm font-semibold text-[#5b6b80]">{c.posterNote}</p>
                <Image
                  src={job.poster.src}
                  alt={job.title.vi}
                  width={job.poster.w}
                  height={job.poster.h}
                  sizes="(min-width:1024px) 420px, 100vw"
                  className="mt-3 w-full max-w-[420px] rounded-xl ring-1 ring-[#e3e9f1]"
                />
              </div>
            )}
          </div>

          {/* cột tư vấn */}
          <aside className="min-w-0 space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-2xl ring-1 ring-[#e3e9f1]">
              <p className="bg-[#0b3a80] px-5 py-4 font-bold text-white">{a.title}</p>
              <div className="space-y-3 bg-white p-5">
                <p className="text-sm text-[#2a3d58]">{a.note}</p>
                <a
                  href={`tel:${tel}`}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0b3a80] font-semibold text-white hover:bg-[#0f4795]"
                >
                  <Icon name="phone" className="h-5 w-5" strokeWidth={1.9} />
                  {LEGAL.phone}
                </a>
                <a
                  href={`mailto:${LEGAL.email}`}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--nb-strip)] font-semibold text-[#10284d] hover:bg-[#e8eef8]"
                >
                  <Icon name="mail" className="h-5 w-5 text-[#1f4f9f]" strokeWidth={1.9} />
                  {a.mail}
                </a>
                <Link
                  href={ROUTES.request[locale] as Route}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#cdd8e6] font-semibold text-[#10284d] hover:bg-[var(--nb-strip)]"
                >
                  {a.request}
                </Link>
              </div>
            </div>

            {industry && (
              <Link
                href={industryPath(locale, industry.slug) as Route}
                className="flex items-center gap-4 overflow-hidden rounded-2xl bg-white ring-1 ring-[#e3e9f1] hover:ring-[#1d5fd6]"
              >
                <span className="relative h-24 w-28 shrink-0">
                  <Image src={set.detail} alt="" fill sizes="112px" className="object-cover" />
                </span>
                <span className="min-w-0 py-3 pr-4">
                  <span className="block text-xs font-semibold tracking-wide text-[#5b6b80] uppercase">{o.industry}</span>
                  <span className="block font-bold text-[#10284d]">{industryName(industry, locale)}</span>
                </span>
              </Link>
            )}
          </aside>
        </section>

        {/* ---------------- ĐƠN KHÁC ---------------- */}
        {others.length > 0 && (
          <section className="bg-[#071d3a] py-12 text-white lg:py-16">
            <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
              <h2 className="text-2xl font-bold lg:text-3xl">{t.related}</h2>
              <ul className="mt-7 grid gap-5 sm:grid-cols-2">
                {others.map((j) => (
                  <li key={j.id}>
                    <Link
                      href={jobPath(locale, j.id) as Route}
                      className="group flex items-stretch gap-4 overflow-hidden rounded-2xl ring-1 ring-white/12 hover:ring-white/35"
                      style={{ background: "linear-gradient(180deg,#0d2b52,#0a2039)" }}
                    >
                      <span className="relative w-28 shrink-0 overflow-hidden sm:w-36">
                        <Image
                          src={INDUSTRY_ASSETS[j.industry]?.hero ?? set.hero}
                          alt=""
                          fill
                          sizes="144px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                        />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col justify-center py-4 pr-4">
                        <span className="block font-bold">{j.title[locale]}</span>
                        <span className="mt-1 block text-sm text-white/65">
                          {j.slots} {c.slots} · {j.locations[0]}
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

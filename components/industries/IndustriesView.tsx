import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { SubShell } from "@/components/sub/SubShell";
import { Eyebrow, GoldBtn, H2, IconBox, Stat } from "@/components/sub/bits";
import { Icon } from "@/components/ui/Icon";
import { allIndustries, industryAssets, industryName, industryRoles } from "@/content/industries";
import { JOBS_COPY } from "@/content/jobs-current";
import { allJobs } from "@/content/jobs-all";
import { INDUSTRIES_PAGE } from "@/content/page-industries";
import { ROUTES, industryPath, type Locale } from "@/content/locales";

/**
 * TRANG 04 — NGÀNH NGHỀ, dựng lại theo bộ KIT navy–vàng.
 *
 * Bố cục cũ (nền trắng, lưới thẻ đều nhau) đã bỏ. Nay là "danh bạ ngành" kiểu
 * báo chí: ô ảnh lớn xen ô nhỏ, tên ngành nằm trên ảnh, ngành nào đang có đơn
 * thì gắn nhãn vàng đếm số đơn thật.
 */
export function IndustriesView({ locale }: { locale: Locale }) {
  const t = INDUSTRIES_PAGE[locale];
  const c = JOBS_COPY[locale];
  const nganhs = allIndustries();
  const jobs = allJobs(locale);
  const demDon = (slug: string) => jobs.filter((j) => j.industry === slug).length;

  return (
    <SubShell
      locale={locale}
      page="industries"
      hero={industryAssets(nganhs[0]!).hero}
      heroFocus="50% 38%"
      eyebrow={t.eyebrow}
      title={t.h1}
      lead={t.sub.replace(/\n/g, " ")}
      breadcrumb={[
        { label: locale === "vi" ? "Trang chủ" : locale === "en" ? "Home" : "Startseite", href: ROUTES.home[locale] },
        { label: t.sectionTitle },
      ]}
      heroExtra={
        <div className="flex flex-wrap gap-x-14 gap-y-6">
          <Stat value={String(nganhs.length)} label={t.fieldsLabel} />
          <Stat value={String(jobs.length)} label={c.eyebrow} />
        </div>
      }
    >
      {/* ---------------- BA LỜI HỨA ---------------- */}
      <section className="border-b border-white/10">
        <ul className="mx-auto grid max-w-[1560px] gap-8 px-6 py-10 sm:grid-cols-3 lg:px-12 lg:py-12">
          {t.trust.map(([a, b], i) => (
            <li key={a} className="flex items-center gap-4">
              <IconBox name={["users", "shield", "handshake"][i]!} size={48} />
              <span>
                <b className="block text-[16px] font-bold text-white">{a}</b>
                <span className="block text-[14px] text-white/55">{b}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------- DANH BẠ NGÀNH ---------------- */}
      <section className="mx-auto max-w-[1560px] px-6 py-14 lg:px-12 lg:py-20">
        <div className="max-w-[72ch]">
          <Eyebrow>{t.fieldsLabel}</Eyebrow>
          <H2>{t.sectionTitle}</H2>
          <p className="mt-5 text-[16px] leading-[1.8] text-white/65">{t.sectionText}</p>
        </div>

        {/* Ô đầu tiên chiếm hai cột, phần còn lại xếp lưới — tránh kiểu ba cột đều tăm tắp */}
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {nganhs.map((i, k) => {
            const khoa = i.status !== "active";
            const a = industryAssets(i);
            const don = demDon(i.slug);
            const to = k === 0;
            const ruot = (
              <>
                <span className="absolute inset-0">
                  <Image
                    src={a.hero}
                    alt={i.alt.hero}
                    fill
                    sizes={to ? "(min-width:1024px) 66vw, 100vw" : "(min-width:1024px) 33vw, 100vw"}
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.06] motion-reduce:transition-none"
                    style={{ objectPosition: "50% 40%" }}
                  />
                  <span
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(180deg, rgba(6,23,43,.1) 0, rgba(6,23,43,.5) 52%, rgba(6,23,43,.95) 100%)" }}
                    aria-hidden="true"
                  />
                </span>

                {don > 0 && (
                  <span className="absolute top-4 left-4 rounded-full bg-[var(--nb-gold)] px-3.5 py-1.5 text-[11.5px] font-bold text-[#231a05]">
                    {don} × {c.eyebrow}
                  </span>
                )}

                <span className="relative mt-auto block p-5 lg:p-6">
                  <Icon name={i.icon} className="h-8 w-8 text-[var(--nb-gold)]" strokeWidth={1.7} />
                  <b className={`mt-3 block leading-tight font-bold text-white ${to ? "text-[24px] lg:text-[30px]" : "text-[18px] lg:text-[20px]"}`}>
                    {industryName(i, locale)}
                  </b>
                  <span className="mt-1.5 block text-[13px] text-white/60">
                    {khoa ? t.inPrep : industryRoles(i, locale).slice(0, 3).join(" · ")}
                  </span>
                  {!khoa && (
                    <span className="mt-4 inline-flex items-center gap-2 text-[13.5px] font-semibold text-[var(--nb-gold)]">
                      {c.industryLink}
                      <Icon name="arrowRight" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.2} />
                    </span>
                  )}
                </span>
              </>
            );

            const cls = `group relative flex flex-col overflow-hidden rounded-2xl ring-1 ring-white/10 ${
              to ? "aspect-[16/10] lg:col-span-2" : "aspect-[4/5] sm:aspect-[4/4.2]"
            }`;

            return (
              <li key={i.slug} className={to ? "lg:col-span-2" : ""}>
                {khoa ? (
                  <div className={`${cls} opacity-70`} aria-disabled="true">
                    {ruot}
                  </div>
                ) : (
                  <Link href={industryPath(locale, i.slug) as Route} className={`${cls} transition hover:ring-[var(--nb-gold)]/60`}>
                    {ruot}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* ---------------- DẢI KẾT ---------------- */}
      <section className="border-t border-white/10 bg-[var(--nb-sub-navy-2)]">
        <div className="mx-auto flex max-w-[1560px] flex-col gap-8 px-6 py-12 lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:py-16">
          <ul className="grid flex-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.strip.map(([title, sub], i) => (
              <li key={sub} className="flex items-center gap-3.5">
                <Icon name={["users", "globe", "handshake", "germany"][i]!} className="h-8 w-8 shrink-0 text-[var(--nb-gold)]" strokeWidth={1.7} />
                <span>
                  <b className="block text-[15px] font-bold text-white">{i === 0 ? nganhs.length : title}</b>
                  <span className="block text-[13px] text-white/55">{sub}</span>
                </span>
              </li>
            ))}
          </ul>
          <GoldBtn href={ROUTES.jobs[locale]} size="lg" className="shrink-0">
            {c.tickerCta}
          </GoldBtn>
        </div>
      </section>
    </SubShell>
  );
}

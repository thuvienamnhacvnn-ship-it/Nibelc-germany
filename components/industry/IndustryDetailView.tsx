import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { SubShell } from "@/components/sub/SubShell";
import { Tabs } from "@/components/sub/Tabs";
import { Eyebrow, GhostBtn, GoldBtn, H2, IconBox, Panel, Tick } from "@/components/sub/bits";
import { Icon } from "@/components/ui/Icon";
import { Gated } from "@/components/Gated";
import { industryAssets, industryName, type Industry } from "@/content/industries";
import { JOBS_COPY } from "@/content/jobs-current";
import { allJobs } from "@/content/jobs-all";
import { INDUSTRIES_PAGE } from "@/content/page-industries";
import { INDUSTRY_DETAIL, INDUSTRY_DETAIL_PAGE } from "@/content/page-industry-detail";
import { ROUTES, industryPath, jobPath, type Locale } from "@/content/locales";

/**
 * TRANG 05 — CHI TIẾT MỘT NGÀNH, dựng lại theo bộ KIT navy–vàng.
 *
 * Bố cục cũ bám theo ảnh mẫu 05 nền sáng đã bỏ hẳn. Nay: banner điện ảnh dùng
 * đúng ảnh KIT của ngành, hàng bốn chỉ số, dải tab (tổng quan / công việc /
 * chuẩn bị / điều kiện), thư viện ảnh gốc của ngành và các đơn hàng đang chạy
 * thuộc ngành đó.
 *
 * Mọi câu chữ vẫn lấy từ `content/page-industry-detail.ts`; chỉ số nào bị khoá
 * (CẦN ĐIỀN 05) vẫn đi qua `Gated` như cũ nên không lộ số chưa duyệt.
 */
const EUR = (n: number) => n.toLocaleString("de-DE");

export function IndustryDetailView({ locale, industry }: { locale: Locale; industry: Industry }) {
  const t = INDUSTRY_DETAIL_PAGE[locale];
  const d = INDUSTRY_DETAIL[industry.slug]!;
  const a = industryAssets(industry);
  const c = JOBS_COPY[locale];
  const tasks = locale === "de" ? industry.taetigkeiten : locale === "en" ? d.tasksEn : d.tasksVi;
  const donNganh = allJobs(locale).filter((j) => j.industry === industry.slug);
  const [h1a, ...h1rest] = d.h1[locale].split("\n");

  return (
    <SubShell
      locale={locale}
      page="industries"
      heroTall
      hero={a.hero}
      heroFocus={d.heroFocus}
      eyebrow={t.eyebrow}
      title={h1a!}
      titleGold={h1rest.join(" ") || undefined}
      lead={d.intro[locale]}
      breadcrumb={[
        { label: locale === "vi" ? "Trang chủ" : locale === "en" ? "Home" : "Startseite", href: ROUTES.home[locale] },
        { label: industryName(industry, locale), href: ROUTES.industries[locale] },
        { label: d.sector[locale] },
      ]}
      heroExtra={
        <div className="flex flex-wrap gap-3">
          <GoldBtn href={ROUTES.request[locale]}>{t.ctaEmployer}</GoldBtn>
          <GhostBtn href={ROUTES.candidates[locale]}>{t.ctaCandidate}</GhostBtn>
        </div>
      }
    >
      {/* ---------------- BỐN CHỈ SỐ ---------------- */}
      <section className="border-b border-white/10">
        <ul className="mx-auto grid max-w-[1560px] gap-7 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-12 lg:py-12">
          {t.stats.map((s, i) => (
            <li key={s.label.join()} className="flex items-center gap-4">
              <IconBox name={["users", "chart", "badge", "globe"][i] ?? "grid"} size={48} />
              <span className="min-w-0">
                {s.value ? (
                  <b className="block text-[22px] leading-none font-extrabold text-[var(--nb-gold)]">{s.value}</b>
                ) : (
                  <Gated code="05">
                    <span className="block text-[13px] text-white/40">—</span>
                  </Gated>
                )}
                <span className="mt-1.5 block text-[13.5px] leading-[1.45] text-white/60">
                  {s.label[0]} {s.label[1]}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------- TAB NỘI DUNG ---------------- */}
      <section className="mx-auto grid max-w-[1560px] gap-12 px-6 py-14 lg:grid-cols-[1fr_400px] lg:px-12 lg:py-20">
        <div className="min-w-0">
          <Tabs
            items={[
              {
                key: "tq",
                label: t.facts[0] ?? d.sector[locale],
                body: (
                  <div>
                    <H2 className="!mt-0 !text-[26px] lg:!text-[32px]">{d.sector[locale]}</H2>
                    <p className="mt-5 max-w-[72ch] text-[16px] leading-[1.85] text-white/75">{d.intro[locale]}</p>
                    <p className="mt-8 text-[20px] leading-[1.5] font-semibold text-[var(--nb-gold)] italic lg:text-[24px]">
                      {d.caption[locale]}
                    </p>
                  </div>
                ),
              },
              {
                key: "cv",
                label: t.tasksTitle,
                body: (
                  <ul className="grid gap-4 sm:grid-cols-2">
                    {tasks.map((x) => (
                      <Tick key={x}>{x}</Tick>
                    ))}
                  </ul>
                ),
              },
              {
                key: "cb",
                label: t.prepTitle,
                body: (
                  <div>
                    <p className="max-w-[72ch] text-[16px] leading-[1.8] text-white/70">{t.prepIntro}</p>
                    <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                      {t.prep.map((x) => (
                        <Tick key={x}>{x}</Tick>
                      ))}
                    </ul>
                  </div>
                ),
              },
              {
                key: "dk",
                label: t.reqTitle,
                body: (
                  <div>
                    <p className="max-w-[72ch] text-[16px] leading-[1.8] text-white/70">{t.reqIntro}</p>
                    <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                      {t.req.map((x) => (
                        <Tick key={x}>{x}</Tick>
                      ))}
                    </ul>
                  </div>
                ),
              },
            ]}
          />

          {/* Thư viện ảnh gốc của ngành */}
          <div className="mt-14">
            <Eyebrow>{t.galleryTitle}</Eyebrow>
            <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
              {[
                { src: a.portraitWork, alt: industry.alt.portraitWork, cls: "aspect-[3/4]" },
                { src: a.portraitTeam, alt: industry.alt.portraitTeam, cls: "aspect-[3/4]" },
                { src: a.detail, alt: industry.alt.detail, cls: "aspect-[3/4] col-span-2 lg:col-span-1" },
              ].map((x) => (
                <li key={x.src} className={`relative overflow-hidden rounded-2xl ring-1 ring-white/10 ${x.cls}`}>
                  <Image src={x.src} alt={x.alt} fill sizes="(min-width:1024px) 30vw, 50vw" className="object-cover" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---------------- CỘT PHẢI ---------------- */}
        <aside className="lg:sticky lg:top-[100px] lg:self-start">
          <Panel className="p-7">
            <Eyebrow>{t.expert[0]}</Eyebrow>
            <p className="mt-4 text-[15.5px] leading-[1.7] text-white/75">{t.expert[1]}</p>
            <div className="mt-6 flex flex-col gap-3">
              <GoldBtn href={ROUTES.request[locale]} className="w-full">
                {t.ctaEmployer}
              </GoldBtn>
              <GhostBtn href={ROUTES.process[locale]} className="w-full">
                {t.ctaCandidate}
              </GhostBtn>
            </div>
          </Panel>

          <Panel className="mt-6 overflow-hidden">
            <span className="relative block h-[180px]">
              <Image src={a.portraitTeam} alt="" fill sizes="400px" className="object-cover" />
              <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(6,23,43,.15), rgba(6,23,43,.92))" }} aria-hidden="true" />
            </span>
            <span className="block p-6">
              <p className="text-[17px] leading-[1.55] font-semibold text-white italic">{t.quote}</p>
              <p className="mt-3 text-[13px] text-white/50">
                {t.quoteBy} · {t.quoteSub}
              </p>
            </span>
          </Panel>
        </aside>
      </section>

      {/* ---------------- ĐƠN HÀNG THUỘC NGÀNH ---------------- */}
      {donNganh.length > 0 && (
        <section className="border-t border-white/10 bg-[var(--nb-sub-navy-2)]">
          <div className="mx-auto max-w-[1560px] px-6 py-14 lg:px-12 lg:py-18">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <Eyebrow>{c.eyebrow}</Eyebrow>
                <H2 className="!text-[26px] lg:!text-[34px]">{c.title}</H2>
              </div>
              <GhostBtn href={ROUTES.jobs[locale]}>{c.tickerCta}</GhostBtn>
            </div>

            <ul className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {donNganh.map((j) => (
                <li key={j.id}>
                  <Link href={jobPath(locale, j.id) as Route} className="nb-sub-panel nb-sub-panel-hover block overflow-hidden">
                    <span className="relative block h-[170px]">
                      <Image src={j.image} alt="" fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" style={{ objectPosition: j.imageFocus }} />
                    </span>
                    <span className="block p-5">
                      <b className="block text-[16px] leading-snug font-bold text-white">{j.title}</b>
                      <b className="mt-2 block text-[15px] font-bold text-[var(--nb-gold)]">
                        {j.salary.from === j.salary.to ? `${EUR(j.salary.from)} €` : `${EUR(j.salary.from)} – ${EUR(j.salary.to)} €`}
                        <span className="font-normal text-white/50"> {c.perMonth}</span>
                      </b>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------------- CÁC NGÀNH KHÁC ---------------- */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-[1560px] px-6 py-12 lg:px-12">
          <Eyebrow>{t.wayTitle}</Eyebrow>
          <ol className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.way.map(([tieuDe, mo], i) => (
              <li key={tieuDe} className="nb-sub-panel p-5">
                <b className="block text-[13px] font-extrabold text-[var(--nb-gold)]">{String(i + 1).padStart(2, "0")}</b>
                <b className="mt-2 block text-[15.5px] font-bold text-white">{tieuDe}</b>
                <span className="mt-1.5 block text-[13.5px] leading-[1.6] text-white/60">{mo}</span>
              </li>
            ))}
          </ol>
          <p className="mt-8">
            <Link
              href={ROUTES.industries[locale] as Route}
              className="inline-flex items-center gap-2 text-[16px] font-semibold text-[var(--nb-gold)] transition hover:gap-3"
            >
              {INDUSTRIES_PAGE[locale].sectionTitle}
              <Icon name="arrowRight" className="h-5 w-5" strokeWidth={2.2} />
            </Link>
          </p>
        </div>
      </section>
    </SubShell>
  );
}

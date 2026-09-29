import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { SubFooter } from "@/components/sub/SubFooter";
import { SubMenuBar } from "@/components/sub/SubMenuBar";
import { MobileTabBar } from "@/components/nav/MobileTabBar";
import { Eyebrow, GhostBtn, GoldBtn, H2, IconBox, Panel, Stat, Tick } from "@/components/sub/bits";
import { Icon } from "@/components/ui/Icon";
import { activeIndustries, industryName } from "@/content/industries";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { JOBS_COPY } from "@/content/jobs-current";
import { allJobs } from "@/content/jobs-all";
import { LEGAL } from "@/content/legal";
import { EMPLOYERS } from "@/content/page-employers";
import { ROUTES, industryPath, type Locale } from "@/content/locales";

/**
 * TRANG 07 — DÀNH CHO DOANH NGHIỆP, dựng lại theo bộ KIT navy–vàng.
 *
 * Bố cục cũ đã bỏ. Nay là trang B2B kiểu báo chí: banner điện ảnh có số liệu
 * thật, bốn dịch vụ, sáu bước hợp tác trên đường kẻ vàng, khối tuân thủ pháp
 * lý, các ngành và khối tư vấn.
 */
const STEP_ICON = ["users", "search", "doc", "shield", "plane", "home"];

export function EmployersView({ locale }: { locale: Locale }) {
  const t = EMPLOYERS[locale];
  const c = JOBS_COPY[locale];
  const jobs = allJobs(locale);
  const tel = LEGAL.phone.replace(/\s/g, "");
  const anhChinh = INDUSTRY_ASSETS["akademische-fachkraefte"]!.hero;

  return (
    <div className="nb-sub">
      {/* Không có menu trên đầu — menu vàng nằm ở đáy như trang chủ. */}
      <div className="flex h-14 items-center justify-center border-b border-white/10 bg-[var(--nb-sub-navy)] lg:hidden">
        <Link href={ROUTES.home[locale] as Route} aria-label="NIBELC">
          <Image src="/nibelc-logo-dark.svg" alt="NIBELC GmbH" width={1201} height={376} priority className="h-7 w-auto" />
        </Link>
      </div>

      <main id="inhalt">
        {/* ==================================================================
            BANNER — ĐÚNG KIT MÀN 07
            Cột trái: logo · nhãn · tiêu đề hai dòng · câu phụ · BỐN dòng icon ·
            MỘT nút vàng.  Cột phải: ảnh lớn.
            ================================================================== */}
        {/* bản điện thoại: ảnh chiếm màn, chữ nằm trên ảnh */}
        <section className="relative isolate lg:hidden">
          <span className="relative block h-[70vh] min-h-[460px] w-full">
            <Image src={anhChinh} alt="" fill priority quality={88} sizes="100vw" className="object-cover object-[58%_30%]" />
            <span
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(6,23,43,.5) 0, rgba(6,23,43,.1) 26%, rgba(6,23,43,.8) 64%, rgba(6,23,43,1) 100%)" }}
              aria-hidden="true"
            />
          </span>
          <div className="absolute inset-x-0 bottom-0 px-6 pb-9">
            <p className="flex items-center gap-2.5 text-[10.5px] font-bold tracking-[0.24em] text-[var(--nb-gold)] uppercase">
              <span className="h-px w-7 bg-[var(--nb-gold)]/70" aria-hidden="true" />
              {t.eyebrow}
            </p>
            <h1 className="mt-4 text-[32px] leading-[1.14] font-bold tracking-[-0.025em] text-white">
              {t.h1a}
              <br />
              <span className="nb-sub-gold">{t.h1b}</span>
            </h1>
            <p className="mt-4 text-[15px] leading-[1.65] text-white/75">{t.sub}</p>
            <Link href={ROUTES.request[locale] as Route} className="nb-sub-cta mt-6 h-12 w-full text-[15px]">
              {t.cta}
              <Icon name="arrowRight" className="h-[18px] w-[18px]" strokeWidth={2.2} />
            </Link>
          </div>
        </section>

        {/* bốn dịch vụ dạng dải cuộn ngang — chỉ điện thoại */}
        <ul className="flex gap-3 overflow-x-auto px-6 py-6 [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
          {t.services.map((s2, i2) => (
            <li key={s2.title} className="nb-sub-panel w-[240px] shrink-0 p-4">
              <Icon name={["search", "doc", "plane", "home"][i2]!} className="h-7 w-7 text-[var(--nb-gold)]" strokeWidth={1.7} />
              <b className="mt-3 block text-[15px] font-bold text-white">{s2.title}</b>
              <span className="mt-1 block text-[13px] leading-[1.6] text-white/55">{s2.text}</span>
            </li>
          ))}
        </ul>

        {/* bản máy tính */}
        <section className="relative hidden lg:block">
          <div className="mx-auto grid max-w-[1560px] items-stretch px-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.06fr)] lg:gap-14">
            <div className="flex flex-col justify-center py-20">
              <Link href={ROUTES.home[locale] as Route} aria-label="NIBELC" className="mb-9 block">
                <Image src="/nibelc-logo-dark.svg" alt="NIBELC GmbH" width={1201} height={376} priority className="h-11 w-auto" />
              </Link>
              <p className="flex items-center gap-3 text-[11px] font-bold tracking-[0.28em] text-[var(--nb-gold)] uppercase">
                <span className="h-px w-10 bg-[var(--nb-gold)]/70" aria-hidden="true" />
                {t.eyebrow}
              </p>
              <h1 className="mt-6 text-[46px] leading-[1.1] font-bold tracking-[-0.03em] text-white xl:text-[54px]">
                {t.h1a}
                <br />
                <span className="nb-sub-gold">{t.h1b}</span>
              </h1>
              <p className="mt-5 max-w-[46ch] text-[17px] leading-[1.65] text-white/70">{t.sub}</p>

              <ul className="mt-9 space-y-[18px]">
                {t.services.map((s2, i2) => (
                  <li key={s2.title} className="flex items-center gap-4">
                    <span className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-xl border border-[var(--nb-gold-line)] bg-[var(--nb-gold)]/8 text-[var(--nb-gold)]">
                      <Icon name={["search", "doc", "plane", "home"][i2]!} className="h-[22px] w-[22px]" strokeWidth={1.7} />
                    </span>
                    <span className="min-w-0">
                      <b className="block text-[17px] leading-tight font-bold text-white">{s2.title}</b>
                      <span className="mt-0.5 block text-[14px] text-white/55">{s2.text}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <Link href={ROUTES.request[locale] as Route} className="nb-sub-cta h-[54px] px-8 text-[16px]">
                  {t.cta}
                  <Icon name="arrowRight" className="h-[18px] w-[18px]" strokeWidth={2.2} />
                </Link>
              </div>
            </div>

            <div className="relative my-10 min-h-[640px] overflow-hidden rounded-[28px] ring-1 ring-white/10">
              <Image src={anhChinh} alt="" fill priority quality={90} sizes="52vw" className="object-cover object-[56%_30%]" />
              <span
                className="absolute inset-0"
                style={{ background: "linear-gradient(90deg, rgba(6,23,43,.6) 0, rgba(6,23,43,0) 28%), linear-gradient(180deg, rgba(6,23,43,.25) 0, rgba(6,23,43,0) 30%, rgba(6,23,43,.45) 100%)" }}
                aria-hidden="true"
              />
            </div>
          </div>
          <span
            className="absolute inset-x-0 bottom-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(214,172,98,.6) 40%, rgba(214,172,98,.2) 74%, transparent)" }}
            aria-hidden="true"
          />
        </section>

      {/* ---------------- BỐN DỊCH VỤ ---------------- */}
      <section className="mx-auto max-w-[1560px] px-6 py-14 lg:px-12 lg:py-20">
        <Eyebrow>{t.servicesLabel}</Eyebrow>
        <H2 className="!text-[26px] lg:!text-[34px]">{t.howTo[0]}</H2>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.services.map((s, i) => (
            <li key={s.title} className="nb-sub-panel nb-sub-panel-hover p-6">
              <IconBox name={["search", "doc", "plane", "home"][i]!} size={48} />
              <b className="mt-5 block text-[18px] font-bold text-white">{s.title}</b>
              <p className="mt-2.5 text-[14.5px] leading-[1.7] text-white/60">{s.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------- SÁU BƯỚC TRÊN ĐƯỜNG VÀNG ---------------- */}
      <section className="border-y border-white/10 bg-[var(--nb-sub-navy-2)]">
        <div className="mx-auto max-w-[1560px] px-6 py-14 lg:px-12 lg:py-18">
          <Eyebrow>{t.howTo[1]}</Eyebrow>
          <H2 className="!text-[26px] lg:!text-[34px]">{t.stepsLabel}</H2>

          <ol className="relative mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* đường kẻ vàng nối các bước trên desktop */}
            <span
              className="pointer-events-none absolute top-[26px] right-6 left-6 hidden h-px bg-gradient-to-r from-transparent via-[var(--nb-gold)]/45 to-transparent lg:block"
              aria-hidden="true"
            />
            {t.steps.map((s, i) => (
              <li key={s.title} className="relative">
                <span className="relative z-10 flex h-[52px] w-[52px] items-center justify-center rounded-full border border-[var(--nb-gold-line)] bg-[var(--nb-sub-navy)] text-[15px] font-extrabold text-[var(--nb-gold)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <b className="mt-5 flex items-center gap-2.5 text-[17px] font-bold text-white">
                  <Icon name={STEP_ICON[i]!} className="h-[18px] w-[18px] text-[var(--nb-gold)]" strokeWidth={1.9} />
                  {s.title}
                </b>
                <p className="mt-2 max-w-[38ch] text-[14.5px] leading-[1.7] text-white/60">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- TUÂN THỦ + NGÀNH ---------------- */}
      <section className="mx-auto grid max-w-[1560px] gap-10 px-6 py-14 lg:grid-cols-[1.1fr_1fr] lg:px-12 lg:py-18">
        <Panel className="p-7 lg:p-9">
          <b className="flex items-center gap-3 text-[19px] font-bold text-white">
            <Icon name="shield" className="h-6 w-6 text-[var(--nb-gold)]" strokeWidth={1.8} />
            {t.complianceTitle}
          </b>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {t.compliance.map((x) => (
              <Tick key={x}>{x}</Tick>
            ))}
          </ul>
        </Panel>

        <div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>{t.industriesLabel}</Eyebrow>
              <H2 className="!mt-3 !text-[22px] lg:!text-[26px]">{t.allIndustries}</H2>
            </div>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {activeIndustries().map((i) => (
              <li key={i.slug}>
                <Link
                  href={industryPath(locale, i.slug) as Route}
                  className="flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.03] px-5 py-2.5 text-[14px] font-semibold text-white/80 transition hover:border-[var(--nb-gold)]/60 hover:text-white"
                >
                  <Icon name={i.icon} className="h-4 w-4 text-[var(--nb-gold)]" strokeWidth={1.8} />
                  {industryName(i, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- TƯ VẤN ---------------- */}
      <section className="relative isolate overflow-hidden border-t border-white/10">
        <Image src={INDUSTRY_ASSETS["logistik-fachkraft-lagerlogistik"]!.hero} alt="" fill sizes="100vw" className="-z-10 object-cover object-[50%_40%]" />
        <span
          className="absolute inset-0 -z-10"
          style={{ background: "linear-gradient(90deg, rgba(6,23,43,.97) 0, rgba(6,23,43,.88) 52%, rgba(6,23,43,.6) 100%)" }}
          aria-hidden="true"
        />
        <div className="mx-auto flex max-w-[1560px] flex-col gap-8 px-6 py-16 lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:py-20">
          <div>
            <H2 className="!mt-0 !text-[26px] lg:!text-[36px]">{t.adviceTitle}</H2>
            <p className="mt-4 max-w-[58ch] text-[16px] leading-[1.75] text-white/70">{t.adviceText}</p>
            <p className="mt-6 text-[15px] text-white/55 italic">
              {t.quote} <span className="not-italic text-white/40">— {t.quoteBy}</span>
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3">
            <GoldBtn href={ROUTES.request[locale]} size="lg">
              {t.adviceCta}
            </GoldBtn>
            <GhostBtn href={ROUTES.contact[locale]}>{t.contact}</GhostBtn>
          </div>
        </div>
      </section>
      </main>

      <SubFooter locale={locale} />
      <SubMenuBar locale={locale} page="employers" />
      <MobileTabBar locale={locale} page="employers" />
    </div>
  );
}

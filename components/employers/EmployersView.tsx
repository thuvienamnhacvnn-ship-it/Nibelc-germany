import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileTabBar } from "@/components/nav/MobileTabBar";
import { Icon } from "@/components/ui/Icon";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { allIndustries, industryName } from "@/content/industries";
import { isApproved } from "@/lib/field-gate";
import { ROUTES, industryPath, type Locale } from "@/content/locales";
import { navFor, requestLabel } from "@/content/nav-menu";
import { EMPLOYERS } from "@/content/page-employers";

/**
 * Trang 02 — screens/02-fuer-unternehmen.png. Bố cục bị khoá.
 *
 * Toạ độ desktop lấy từ ảnh mẫu (1 --u = 1px ảnh mẫu):
 *   header 0–67 · hero 67–408 (341u)
 *   dưới hero (gốc y = 408):
 *     "Unsere Branchen" 16 · 8 ô ngành 38–125 (x 42–1631)
 *     "In 6 Schritten" 144 · 6 bước 167–272 (x 60–1215) · khối tuân thủ 140–277 (x 1233–1630)
 *     "Unsere Services" 302 · 4 thẻ 325–457 (x 43–660) · thanh chứng thực 472–517
 *     "Ihr Personalprojekt" 302 (x 680) · bảng điều khiển 322–507 (x 680–1217)
 *     thẻ tư vấn 289–462 (x 1233–1672)
 */

const u = (n: number) => `calc(${n} * var(--u))`;

export function EmployersView({ locale }: { locale: Locale }) {
  const t = EMPLOYERS[locale];
  const industries = allIndustries();

  return (
    <>
      <SiteHeader locale={locale} page="employers" variant="navy" />

      <main id="inhalt" className="bg-[#f4f7fb]">
        {/* ---------------- HERO ---------------- */}
        <section className="relative overflow-hidden lg:h-[calc(341*var(--u))]">
          <div className="nb-photo-right absolute inset-y-0 left-[calc(560*var(--u))] hidden lg:block">
            <Image
              src={INDUSTRY_ASSETS["produktion-maschinen-anlagen"]!.hero}
              alt=""
              fill
              priority
              sizes="70vw"
              className="object-cover"
              style={{ objectPosition: "60% 28%" }}
            />
          </div>
          {/* Nền sáng bên trái mờ dần vào ảnh */}
          <div
            className="nb-photo-right absolute inset-y-0 left-0 hidden lg:block"
            style={{
              background:
                "linear-gradient(90deg, #eef2f7 0, #eef2f7 calc(640 * var(--u)), rgba(238,242,247,.6) calc(720 * var(--u)), rgba(238,242,247,0) calc(820 * var(--u)))",
            }}
            aria-hidden="true"
          />

          <div className="relative px-4 py-12 lg:absolute lg:top-0 lg:left-[calc(43*var(--u))] lg:w-[calc(760*var(--u))] lg:p-0">
            <p className="text-[11px] font-bold tracking-[0.16em] text-[#1f3b63] uppercase lg:tracking-[0.32em] lg:mt-[calc(38*var(--u))] lg:text-[calc(15*var(--u))]">
              {t.eyebrow}
            </p>
            <h1 className="mt-4 text-4xl leading-tight font-extrabold tracking-[-0.02em] lg:mt-[calc(10*var(--u))] lg:text-[calc(64*var(--u))] lg:leading-[calc(60*var(--u))] [:lang(vi)_&]:lg:leading-[calc(68*var(--u))]">
              <span className="text-[var(--nb-ink)]">{t.h1a}</span>
              <br />
              <span className="text-[#1d5fd6]">{t.h1b}</span>
              <span className="text-[var(--nb-orange)]">.</span>
            </h1>
            <p className="mt-5 max-w-xl text-[#3a4a5e] lg:mt-[calc(18*var(--u))] lg:max-w-[calc(620*var(--u))] lg:text-[calc(17*var(--u))] lg:leading-[calc(22*var(--u))]">
              {t.sub}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-6 lg:mt-[calc(21*var(--u))] lg:gap-[calc(32*var(--u))]">
              <Link
                href={`${ROUTES.employers[locale]}#beratung` as Route}
                className="inline-flex items-center gap-3 rounded-xl bg-[var(--nb-orange)] px-7 py-3.5 font-bold text-white shadow-[0_10px_24px_-10px_rgba(255,106,19,.9)] hover:bg-[var(--nb-orange-dark)] lg:h-[calc(53*var(--u))] lg:rounded-[calc(12*var(--u))] lg:px-[calc(30*var(--u))] lg:py-0 lg:text-[calc(19*var(--u))]"
              >
                {t.cta}
                <Icon name="chevronRight" className="h-5 w-5 lg:h-[calc(20*var(--u))] lg:w-[calc(20*var(--u))]" strokeWidth={2.4} />
              </Link>
              <Link href={ROUTES.process[locale] as Route} className="flex items-center gap-4 lg:gap-[calc(18*var(--u))]">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#c9d6ea] bg-white/70 text-[#1d5fd6] lg:h-[calc(49*var(--u))] lg:w-[calc(49*var(--u))]">
                  <Icon name="play" className="ml-[calc(3*var(--u))] h-5 w-5 lg:h-[calc(20*var(--u))] lg:w-[calc(20*var(--u))]" />
                </span>
                <span className="text-sm leading-tight font-bold text-[var(--nb-ink)] lg:text-[calc(13*var(--u))]">
                  {t.howTo[0]}
                  <br />
                  {t.howTo[1]}
                </span>
              </Link>
            </div>
          </div>

          {/* Thẻ trích dẫn góc phải dưới */}
          <figure className="hidden bg-[rgba(52,66,90,.86)] text-white backdrop-blur lg:absolute lg:right-0 lg:bottom-0 lg:block lg:h-[calc(115*var(--u))] lg:w-[calc(362*var(--u))] lg:px-[calc(30*var(--u))] lg:pt-[calc(16*var(--u))]">
            <span className="block h-[calc(3*var(--u))] w-[calc(32*var(--u))] bg-[var(--nb-orange)]" aria-hidden="true" />
            <blockquote className="mt-[calc(9*var(--u))] text-[calc(17*var(--u))] leading-[calc(23*var(--u))]">„{t.quote}“</blockquote>
            <figcaption className="mt-[calc(8*var(--u))] text-[calc(11*var(--u))] tracking-[0.2em] text-white/80 uppercase">{t.quoteBy}</figcaption>
          </figure>
        </section>

        {/* ---------------- DƯỚI HERO ---------------- */}
        <div className="relative space-y-12 px-4 py-10 lg:h-[calc(533*var(--u))] lg:space-y-0 lg:p-0">
          {/* Ngành */}
          <section className="lg:absolute lg:inset-x-0 lg:top-0">
            <div className="flex items-center justify-between lg:absolute lg:top-[calc(12*var(--u))] lg:left-[calc(43*var(--u))] lg:w-[calc(1588*var(--u))]">
              <h2 className="text-[13px] font-bold tracking-[0.12em] text-[#1f3b63] uppercase lg:tracking-[0.2em] lg:text-[calc(14*var(--u))]">{t.industriesLabel}</h2>
              <Link href={ROUTES.industries[locale] as Route} className="flex items-center gap-2 text-sm font-semibold text-[#1d5fd6] hover:underline lg:text-[calc(14*var(--u))]">
                {t.allIndustries}
                <Icon name="arrowRight" className="h-4 w-4 lg:h-[calc(16*var(--u))] lg:w-[calc(16*var(--u))]" />
              </Link>
            </div>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:absolute lg:top-[calc(38*var(--u))] lg:left-[calc(42*var(--u))] lg:mt-0 lg:grid-cols-8 lg:gap-[calc(15*var(--u))]" style={{ width: undefined }}>
              {industries.map((i) => {
                const blocked = i.status !== "active";
                const inner = (
                  <>
                    <Icon name={i.icon} className="h-8 w-8 text-[var(--nb-navy-hero)] lg:h-[calc(30*var(--u))] lg:w-[calc(30*var(--u))]" strokeWidth={1.9} />
                    <span className="mt-2 block text-center text-sm leading-snug text-[var(--nb-ink)] lg:mt-[calc(8*var(--u))] lg:text-[calc(15*var(--u))] lg:leading-[calc(17*var(--u))]">
                      {industryName(i, locale)}
                    </span>
                  </>
                );
                const cls =
                  "flex h-full flex-col items-center justify-center rounded-lg bg-white/80 p-3 shadow-[0_2px_10px_-4px_rgba(15,35,64,.15)] ring-1 ring-[#e3e9f1] lg:h-[calc(87*var(--u))] lg:w-[calc(184.5*var(--u))] lg:rounded-[calc(8*var(--u))] lg:p-[calc(8*var(--u))]";
                return (
                  <li key={i.slug}>
                    {blocked ? (
                      <div className={`${cls} opacity-60`} title="In Vorbereitung">{inner}</div>
                    ) : (
                      <Link href={industryPath(locale, i.slug) as Route} className={`${cls} hover:ring-[#1d5fd6]`}>
                        {inner}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          {/* 6 bước */}
          <section className="lg:absolute lg:top-[calc(140*var(--u))] lg:left-[calc(43*var(--u))] lg:w-[calc(1172*var(--u))]">
            <h2 className="text-[13px] font-bold tracking-[0.12em] text-[#1f3b63] uppercase lg:tracking-[0.2em] lg:mt-[calc(4*var(--u))] lg:text-[calc(14*var(--u))]">{t.stepsLabel}</h2>
            <ol className="mt-5 grid gap-6 sm:grid-cols-3 lg:mt-[calc(16*var(--u))] lg:grid-cols-6 lg:gap-[calc(4*var(--u))] lg:pl-[calc(17*var(--u))]">
              {t.steps.map((s, i) => (
                <li key={s.title} className="relative">
                  <div className="flex items-center gap-3 lg:gap-[calc(12*var(--u))]">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1d5fd6] text-sm font-bold text-white lg:h-[calc(32*var(--u))] lg:w-[calc(32*var(--u))] lg:text-[calc(15*var(--u))]">
                      {i + 1}
                    </span>
                    <Icon name={s.icon} className="h-7 w-7 text-[var(--nb-navy-hero)] lg:h-[calc(28*var(--u))] lg:w-[calc(28*var(--u))]" />
                    {i < t.steps.length - 1 && (
                      <span className="hidden flex-1 border-t-2 border-dashed border-[#c7d3e3] lg:block lg:mr-[calc(14*var(--u))]" aria-hidden="true" />
                    )}
                  </div>
                  <h3 className="mt-3 font-bold text-[var(--nb-ink)] lg:mt-[calc(10*var(--u))] lg:text-[calc(16*var(--u))]">{s.title}</h3>
                  <p className="mt-1 text-sm text-[#6b7a8d] lg:mt-[calc(3*var(--u))] lg:max-w-[calc(185*var(--u))] lg:text-[calc(14*var(--u))] lg:leading-[calc(18*var(--u))]">{s.text}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Khối tuân thủ */}
          <aside className="rounded-xl bg-white p-5 shadow-[0_4px_18px_-8px_rgba(15,35,64,.2)] ring-1 ring-[#e3e9f1] lg:absolute lg:top-[calc(140*var(--u))] lg:left-[calc(1233*var(--u))] lg:h-[calc(137*var(--u))] lg:w-[calc(397*var(--u))] lg:rounded-[calc(10*var(--u))] lg:px-[calc(18*var(--u))] lg:py-[calc(14*var(--u))]">
            <p className="flex items-center gap-3 font-bold lg:whitespace-nowrap text-[var(--nb-ink)] lg:gap-[calc(10*var(--u))] lg:text-[calc(14.5*var(--u))]">
              <Icon name="shield" className="h-7 w-7 shrink-0 text-[var(--nb-navy-hero)] lg:h-[calc(26*var(--u))] lg:w-[calc(26*var(--u))]" strokeWidth={2} />
              {t.complianceTitle}
            </p>
            <ul className="mt-3 space-y-1 lg:mt-[calc(6*var(--u))] lg:ml-[calc(22*var(--u))] lg:space-y-0">
              {t.compliance.map((c) => (
                <li key={c} className="flex items-center gap-2 text-sm text-[#3a4a5e] lg:gap-[calc(10*var(--u))] lg:text-[calc(12.5*var(--u))] lg:leading-[calc(18*var(--u))] lg:whitespace-nowrap">
                  <Icon name="check" className="h-4 w-4 shrink-0 text-[var(--nb-navy-hero)] lg:h-[calc(14*var(--u))] lg:w-[calc(14*var(--u))]" strokeWidth={2.6} />
                  {c}
                </li>
              ))}
            </ul>
          </aside>

          {/* Dịch vụ */}
          <section id="services" className="lg:absolute lg:top-[calc(298*var(--u))] lg:left-[calc(43*var(--u))] lg:w-[calc(620*var(--u))]">
            <h2 className="text-[13px] font-bold tracking-[0.12em] text-[#1f3b63] uppercase lg:tracking-[0.2em] lg:text-[calc(14*var(--u))]">{t.servicesLabel}</h2>
            <ul className="mt-4 grid grid-cols-2 gap-3 lg:mt-[calc(13*var(--u))] lg:grid-cols-4 lg:gap-[calc(10*var(--u))]">
              {t.services.map((s) => (
                <li key={s.title} className="flex flex-col items-center rounded-md bg-white p-4 text-center ring-1 ring-[#e3e9f1] lg:h-[calc(132*var(--u))] lg:rounded-[calc(6*var(--u))] lg:px-[calc(8*var(--u))] lg:pt-[calc(12*var(--u))]">
                  <Icon name={s.icon} className="h-8 w-8 text-[#1d5fd6] lg:h-[calc(32*var(--u))] lg:w-[calc(32*var(--u))]" strokeWidth={1.9} />
                  <h3 className="mt-2 text-sm font-bold text-[var(--nb-ink)] lg:mt-[calc(8*var(--u))] lg:text-[calc(12.5*var(--u))] lg:leading-[calc(15*var(--u))]">{s.title}</h3>
                  <p className="mt-1 text-xs text-[#5b6b80] lg:mt-[calc(6*var(--u))] lg:text-[calc(11.5*var(--u))] lg:leading-[calc(14.5*var(--u))]">{s.text}</p>
                </li>
              ))}
            </ul>
            {/* Thanh chứng thực chỉ xuất hiện khi CẦN ĐIỀN 05 được duyệt —
                trước đó khung rỗng chỉ làm rối, nhất là trên điện thoại. */}
            {isApproved("05") && (
              <div className="mt-4 flex items-center gap-4 rounded-md bg-white px-4 py-3 ring-1 ring-[#e3e9f1] lg:mt-[calc(15*var(--u))] lg:h-[calc(45*var(--u))] lg:rounded-[calc(6*var(--u))] lg:px-[calc(12*var(--u))] lg:py-0">
                <Icon name="quote" className="h-6 w-6 shrink-0 text-[#1d5fd6] lg:h-[calc(22*var(--u))] lg:w-[calc(22*var(--u))]" strokeWidth={2.2} />
              </div>
            )}
          </section>

          {/* Bảng điều khiển minh hoạ */}
          <section className="lg:absolute lg:top-[calc(298*var(--u))] lg:left-[calc(680*var(--u))] lg:w-[calc(537*var(--u))]">
            <h2 className="text-[13px] font-bold tracking-[0.12em] text-[#1f3b63] uppercase lg:tracking-[0.2em] lg:text-[calc(14*var(--u))]">{t.dashLabel}</h2>
            <div className="mt-4 flex max-lg:flex-col overflow-hidden rounded-lg bg-white shadow-[0_6px_22px_-10px_rgba(15,35,64,.3)] ring-1 ring-[#e3e9f1] lg:mt-[calc(8*var(--u))] lg:h-[calc(185*var(--u))] lg:rounded-[calc(8*var(--u))]">
              <ul className="flex w-full shrink-0 gap-1 overflow-x-auto bg-[var(--nb-navy-hero)] py-2 text-white/85 max-lg:px-2 lg:w-[calc(103*var(--u))] lg:flex-col lg:space-y-1 lg:overflow-visible lg:py-3 lg:w-[calc(103*var(--u))] lg:space-y-[calc(3*var(--u))] lg:py-[calc(10*var(--u))]">
                {t.dash.menu.map((m, i) => (
                  <li
                    key={m}
                    className={`flex shrink-0 items-center gap-2 rounded px-3 py-1 text-[11px] lg:gap-[calc(6*var(--u))] lg:px-[calc(10*var(--u))] lg:py-[calc(4*var(--u))] lg:text-[calc(9.5*var(--u))] lg:whitespace-nowrap ${i === 0 ? "bg-[#1d5fd6] text-white" : ""}`}
                  >
                    <Icon name={["grid", "users", "doc", "home", "check", "chart"][i]!} className="h-3 w-3 lg:h-[calc(11*var(--u))] lg:w-[calc(11*var(--u))]" />
                    {m}
                  </li>
                ))}
              </ul>
              <div className="flex-1 p-4 lg:px-[calc(15*var(--u))] lg:pt-[calc(12*var(--u))]">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-[var(--nb-ink)] lg:text-[calc(14*var(--u))]">{t.dash.welcome}</p>
                  <span className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-[#3a4a5e] ring-1 ring-[#e3e9f1] lg:text-[calc(10*var(--u))]">
                    {t.dash.project}
                    <Icon name="chevronDown" className="h-3 w-3" />
                  </span>
                </div>
                <p className="text-[10px] text-[#8a97a8] lg:text-[calc(9*var(--u))]">{t.dash.sample}</p>
                <ul className="mt-2 grid grid-cols-2 gap-2 lg:grid-cols-4 lg:mt-[calc(8*var(--u))] lg:gap-[calc(9*var(--u))]">
                  {t.dash.stats.map(([n, l], i) => (
                    <li key={l} className="rounded-md p-2 ring-1 ring-[#e3e9f1] lg:h-[calc(72*var(--u))] lg:rounded-[calc(6*var(--u))] lg:p-[calc(8*var(--u))]">
                      <span className="flex items-center gap-2">
                        <Icon name={["users", "doc", "plane", "lock"][i]!} className="h-4 w-4 text-[#1d5fd6] lg:h-[calc(18*var(--u))] lg:w-[calc(18*var(--u))]" />
                        <span className="font-bold text-[var(--nb-ink)] lg:text-[calc(17*var(--u))]">{n}</span>
                      </span>
                      <span className="mt-1 block text-[9px] leading-tight text-[#6b7a8d] lg:text-[calc(8.5*var(--u))]">{l}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs font-bold text-[var(--nb-ink)] lg:mt-[calc(12*var(--u))] lg:text-[calc(11*var(--u))]">{t.dash.progress}</p>
                <div className="mt-2 flex items-center gap-3 lg:mt-[calc(8*var(--u))]">
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-[#e3e9f1] lg:h-[calc(7*var(--u))]">
                    <span className="block h-full w-[67%] rounded-full bg-[#1d5fd6]" />
                  </span>
                  <span className="text-xs font-bold text-[var(--nb-ink)] lg:text-[calc(10*var(--u))]">67%</span>
                </div>
              </div>
            </div>
          </section>

          {/* Thẻ tư vấn */}
          <section
            id="beratung"
            className="relative overflow-hidden rounded-xl bg-[linear-gradient(120deg,#0b3a78,#0f4b98)] p-6 text-white lg:absolute lg:top-[calc(289*var(--u))] lg:left-[calc(1233*var(--u))] lg:h-[calc(173*var(--u))] lg:w-[calc(439*var(--u))] lg:rounded-none lg:rounded-l-[calc(10*var(--u))] lg:px-[calc(18*var(--u))] lg:pt-[calc(14*var(--u))]"
          >
            <div className="absolute inset-y-0 right-0 hidden w-[calc(212*var(--u))] lg:block">
              <Image src={INDUSTRY_ASSETS["akademische-fachkraefte"]!.portraitTeam} alt="" fill sizes="15vw" className="object-cover" style={{ objectPosition: "78% 48%" }} />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,#0d4288,rgba(13,66,136,0)_55%)]" aria-hidden="true" />
            </div>
            <div className="relative lg:w-[calc(240*var(--u))]">
              <h2 className="text-xl leading-tight font-bold text-white lg:text-[calc(18*var(--u))] lg:leading-[calc(21*var(--u))]">{t.adviceTitle}</h2>
              <p className="mt-3 text-sm text-white/85 lg:mt-[calc(9*var(--u))] lg:text-[calc(13.5*var(--u))] lg:leading-[calc(17*var(--u))]">{t.adviceText}</p>
              <Link
                href={`mailto:info@nibelc-germany.de` as Route}
                className="mt-4 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-bold lg:whitespace-nowrap text-[var(--nb-navy-hero)] hover:bg-[#e8eef8] lg:mt-[calc(12*var(--u))] lg:h-[calc(35*var(--u))] lg:rounded-[calc(6*var(--u))] lg:px-[calc(20*var(--u))] lg:py-0 lg:text-[calc(14*var(--u))]"
              >
                {t.adviceCta}
                <Icon name="chevronRight" className="h-4 w-4" strokeWidth={2.4} />
              </Link>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter locale={locale} />
      <MobileTabBar locale={locale} page={"employers"} />
    </>
  );
}

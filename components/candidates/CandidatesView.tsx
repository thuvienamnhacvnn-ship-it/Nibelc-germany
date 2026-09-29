import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { SubShell } from "@/components/sub/SubShell";
import { Eyebrow, GhostBtn, GoldBtn, H2, IconBox, Panel } from "@/components/sub/bits";
import { Gated } from "@/components/Gated";
import { Icon } from "@/components/ui/Icon";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { JOBS_COPY } from "@/content/jobs-current";
import { allJobs } from "@/content/jobs-all";
import { CANDIDATES } from "@/content/page-candidates";
import { PROCESS } from "@/content/page-process";
import { ROUTES, jobPath, type Locale } from "@/content/locales";

/**
 * TRANG 06 — DÀNH CHO NGƯỜI LAO ĐỘNG, dựng lại theo bộ KIT navy–vàng.
 *
 * Bố cục cũ (nền trắng, dải số liệu, lưới thẻ) đã bỏ. Nay kể theo hành trình:
 * banner điện ảnh với bốn cam kết → các chủ đề cần biết → sáu chặng đường →
 * đơn hàng đang tuyển → lời kết.
 *
 * Chữ vẫn lấy nguyên từ `content/page-candidates.ts`; số nào chưa duyệt
 * (CẦN ĐIỀN 05) vẫn đi qua `Gated` nên không lộ ra production.
 */
const EUR = (n: number) => n.toLocaleString("de-DE");

export function CandidatesView({ locale }: { locale: Locale }) {
  const t = CANDIDATES[locale];
  const c = JOBS_COPY[locale];
  const p = PROCESS[locale];
  const jobs = allJobs(locale).slice(0, 3);

  return (
    <SubShell
      locale={locale}
      page="candidates"
      heroTall
      hero={INDUSTRY_ASSETS["akademische-fachkraefte"]!.hero}
      heroFocus="58% 38%"
      eyebrow={t.eyebrow}
      title={t.h1a}
      titleGold={`${t.h1accent}${t.h1rest}`}
      lead={t.sub.replace(/\n/g, " ")}
      breadcrumb={[
        { label: locale === "vi" ? "Trang chủ" : locale === "en" ? "Home" : "Startseite", href: ROUTES.home[locale] },
        { label: t.eyebrow },
      ]}
      heroExtra={
        <div className="flex flex-wrap gap-3">
          <GoldBtn href={ROUTES.jobs[locale]}>{c.tickerCta}</GoldBtn>
          <GhostBtn href={ROUTES.process[locale]}>{t.secondary[0]}</GhostBtn>
        </div>
      }
    >
      {/* ---------------- BA CAM KẾT ---------------- */}
      <section className="border-b border-white/10">
        <ul className="mx-auto grid max-w-[1560px] gap-8 px-6 py-10 sm:grid-cols-3 lg:px-12 lg:py-12">
          {t.trust.map(([a, b], i) => (
            <li key={a} className="flex items-center gap-4">
              <IconBox name={["briefcase", "shield", "handshake"][i]!} size={48} />
              <span>
                <b className="block text-[16px] font-bold text-white">{a}</b>
                <span className="block text-[14px] text-white/55">{b}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------- CHỦ ĐỀ CẦN BIẾT: hai cột lệch ---------------- */}
      <section className="mx-auto max-w-[1560px] px-6 py-14 lg:px-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-start">
          <div className="lg:sticky lg:top-[100px]">
            <Eyebrow>{t.secondary[1]}</Eyebrow>
            <H2>{t.secondary[1]}</H2>
            <p className="mt-5 max-w-[46ch] text-[16px] leading-[1.8] text-white/65">{t.quote}</p>
            <p className="mt-3 text-[13.5px] text-white/40">{t.quoteBy}</p>

            <ul className="mt-9 flex flex-wrap gap-x-10 gap-y-5">
              {t.stats.map((s) => (
                <li key={s.label} className="flex items-center gap-3">
                  <Icon name={s.icon} className="h-6 w-6 text-[var(--nb-gold)]" strokeWidth={1.8} />
                  <span>
                    {s.value ? (
                      <b className="block text-[22px] leading-none font-extrabold text-[var(--nb-gold)]">{s.value}</b>
                    ) : (
                      <Gated code="05">
                        <b className="block text-[22px] leading-none font-extrabold text-[var(--nb-gold)]">—</b>
                      </Gated>
                    )}
                    <span className="mt-1 block text-[13px] text-white/55">{s.label}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-9">
              <GoldBtn href={ROUTES.contact[locale]}>{t.cta}</GoldBtn>
            </div>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {t.topics.map((x) => (
              <li key={x.title} className="nb-sub-panel nb-sub-panel-hover p-6">
                <IconBox name={x.icon} size={46} />
                <b className="mt-4 block text-[17px] leading-snug font-bold text-white">{x.title}</b>
                <p className="mt-2 text-[14.5px] leading-[1.7] text-white/60">{x.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- SÁU CHẶNG ---------------- */}
      <section className="border-y border-white/10 bg-[var(--nb-sub-navy-2)]">
        <div className="mx-auto max-w-[1560px] px-6 py-14 lg:px-12 lg:py-18">
          <Eyebrow>{p.eyebrow}</Eyebrow>
          <H2 className="!text-[26px] lg:!text-[34px]">
            {p.h1[0]} {p.h1[1]}
          </H2>

          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {p.steps.map((s, i) => (
              <li key={s.title} className="nb-sub-panel flex gap-4 p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--nb-gold-line)] text-[15px] font-extrabold text-[var(--nb-gold)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <b className="block text-[16px] font-bold text-white">{s.title}</b>
                  <span className="mt-1.5 block text-[13.5px] leading-[1.6] text-white/60">{s.sub.join(" ")}</span>
                </span>
              </li>
            ))}
          </ol>

          <p className="mt-9">
            <GhostBtn href={ROUTES.process[locale]}>{t.secondary[0]}</GhostBtn>
          </p>
        </div>
      </section>

      {/* ---------------- ĐƠN HÀNG ĐANG TUYỂN ---------------- */}
      <section className="mx-auto max-w-[1560px] px-6 py-14 lg:px-12 lg:py-18">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <Eyebrow>{c.eyebrow}</Eyebrow>
            <H2 className="!text-[26px] lg:!text-[34px]">{c.title}</H2>
          </div>
          <GhostBtn href={ROUTES.jobs[locale]}>{c.tickerCta}</GhostBtn>
        </div>

        <ul className="mt-9 grid gap-6 md:grid-cols-3">
          {jobs.map((j) => (
            <li key={j.id}>
              <Link href={jobPath(locale, j.id) as Route} className="nb-sub-panel nb-sub-panel-hover block overflow-hidden">
                <span className="relative block h-[180px]">
                  <Image src={j.image} alt="" fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" style={{ objectPosition: j.imageFocus }} />
                </span>
                <span className="block p-5">
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-4 w-4 overflow-hidden rounded-full ring-1 ring-white/30" aria-hidden="true">
                      {j.flag.map((cc, i) => (
                        <span key={i} className="block h-1/3 w-full" style={{ background: cc }} />
                      ))}
                    </span>
                    <span className="text-[12.5px] text-white/55">{j.countryName}</span>
                  </span>
                  <b className="mt-2 block text-[16.5px] leading-snug font-bold text-white">{j.title}</b>
                  <b className="mt-2 block text-[15px] font-bold text-[var(--nb-gold)]">
                    {j.salary.from === j.salary.to ? `${EUR(j.salary.from)} €` : `${EUR(j.salary.from)} – ${EUR(j.salary.to)} €`}
                    <span className="font-normal text-white/50"> {c.perMonth}</span>
                  </b>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------- LỜI KẾT ---------------- */}
      <section className="relative isolate overflow-hidden border-t border-white/10">
        <Image
          src={INDUSTRY_ASSETS["elektrotechnik-elektroniker"]!.portraitTeam}
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover object-[60%_30%]"
        />
        <span
          className="absolute inset-0 -z-10"
          style={{ background: "linear-gradient(90deg, rgba(6,23,43,.97) 0, rgba(6,23,43,.86) 48%, rgba(6,23,43,.55) 100%)" }}
          aria-hidden="true"
        />
        <Panel className="!border-0 !bg-transparent !shadow-none">
          <div className="mx-auto max-w-[1560px] px-6 py-16 lg:px-12 lg:py-20">
            <p className="max-w-[24ch] text-[26px] leading-[1.3] font-bold text-white lg:text-[38px]">{t.quote}</p>
            <p className="mt-4 text-[14px] text-white/50">{t.quoteBy}</p>
            <p className="mt-8">
              <GoldBtn href={ROUTES.contact[locale]} size="lg">
                {t.cta}
              </GoldBtn>
            </p>
          </div>
        </Panel>
      </section>
    </SubShell>
  );
}

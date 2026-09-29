import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { SubFooter } from "@/components/sub/SubFooter";
import { SubMenuBar } from "@/components/sub/SubMenuBar";
import { MobileTabBar } from "@/components/nav/MobileTabBar";
import { Gated } from "@/components/Gated";
import { Icon } from "@/components/ui/Icon";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { JOBS_COPY } from "@/content/jobs-current";
import { allJobs } from "@/content/jobs-all";
import { CANDIDATES } from "@/content/page-candidates";
import { PROCESS } from "@/content/page-process";
import { ROUTES, jobPath, type Locale } from "@/content/locales";

/**
 * TRANG "DÀNH CHO NGƯỜI LAO ĐỘNG" — dựng mới hoàn toàn từ component trắng.
 *
 * KHÔNG dùng khung banner chung `SubShell`: trang này có bố cục riêng theo bộ
 * KIT — banner điện ảnh tràn màn hình, tấm thông tin nổi đè lên mép banner,
 * dòng thời gian lệch trục, lưới chủ đề kiểu báo chí và khối kết điện ảnh.
 *
 * Desktop và điện thoại là HAI CÂY GIAO DIỆN RIÊNG (không phải thu nhỏ bản
 * desktop): điện thoại kể dọc, có dải cuộn ngang bám ngón tay.
 *
 * Chữ, ảnh, liên kết giữ nguyên từ `page-candidates.ts`, `page-process.ts` và
 * danh sách đơn hàng thật; số chưa duyệt vẫn đi qua `Gated`.
 */

const EUR = (n: number) => n.toLocaleString("de-DE");
const ANH_CHANG = [
  "akademische-fachkraefte",
  "gastronomie-koch",
  "elektrotechnik-elektroniker",
  "logistik-fachkraft-lagerlogistik",
  "produktion-maschinen-anlagen",
  "gartenbau-gaertner",
];

export function CandidatesView({ locale }: { locale: Locale }) {
  const t = CANDIDATES[locale];
  const c = JOBS_COPY[locale];
  const p = PROCESS[locale];
  const jobs = allJobs(locale).slice(0, 3);
  const anhChinh = INDUSTRY_ASSETS["akademische-fachkraefte"]!;

  const gia = (j: (typeof jobs)[number]) =>
    j.salary.from === j.salary.to ? `${EUR(j.salary.from)} €` : `${EUR(j.salary.from)} – ${EUR(j.salary.to)} €`;

  return (
    <div className="nb-sub">
      {/* Không có menu trên đầu — menu vàng nằm ở đáy như trang chủ. */}

      {/* thanh trên cho điện thoại */}
      <div className="flex h-14 items-center justify-center border-b border-white/10 bg-[var(--nb-sub-navy)] lg:hidden">
        <Link href={ROUTES.home[locale] as Route} aria-label="NIBELC">
          <Image src="/nibelc-logo-dark.svg" alt="NIBELC GmbH" width={1201} height={376} priority className="h-7 w-auto" />
        </Link>
      </div>

      <main id="inhalt">
        {/* ==================================================================
            BANNER — BẢN ĐIỆN THOẠI: ảnh chiếm trọn màn, chữ nằm trên ảnh
            ================================================================== */}
        <section className="relative isolate lg:hidden">
          <span className="relative block h-[74vh] min-h-[480px] w-full">
            <Image src={anhChinh.portraitTeam} alt="" fill priority quality={88} sizes="100vw" className="object-cover object-[52%_22%]" />
            <span
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(6,23,43,.55) 0, rgba(6,23,43,.1) 26%, rgba(6,23,43,.78) 66%, rgba(6,23,43,1) 100%)" }}
              aria-hidden="true"
            />
          </span>

          <div className="absolute inset-x-0 bottom-0 px-6 pb-9">
            <p className="flex items-center gap-2.5 text-[10.5px] font-bold tracking-[0.24em] text-[var(--nb-gold)] uppercase">
              <span className="h-px w-7 bg-[var(--nb-gold)]/70" aria-hidden="true" />
              {t.eyebrow}
            </p>
            <h1 className="mt-4 text-[34px] leading-[1.12] font-bold tracking-[-0.025em] text-white">
              {t.h1a}
              <br />
              <span className="nb-sub-gold">{t.h1accent}</span>
              {t.h1rest}
            </h1>
            <p className="mt-4 text-[15px] leading-[1.65] text-white/75">{t.sub.split("\n")[0]}</p>
            <div className="mt-6 flex flex-col gap-3">
              <Link href={ROUTES.jobs[locale] as Route} className="nb-sub-cta h-12 w-full text-[15px]">
                {c.tickerCta}
                <Icon name="arrowRight" className="h-[18px] w-[18px]" strokeWidth={2.2} />
              </Link>
              <Link href={ROUTES.process[locale] as Route} className="nb-sub-ghost h-12 w-full text-[15px]">
                {t.secondary[0]}
              </Link>
            </div>
          </div>
        </section>

        {/* dải cam kết cuộn ngang — chỉ điện thoại */}
        <ul className="flex gap-3 overflow-x-auto px-6 py-6 [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
          {t.trust.map(([a, b], i) => (
            <li key={a} className="nb-sub-panel w-[230px] shrink-0 p-4">
              <Icon name={["briefcase", "shield", "handshake"][i]!} className="h-7 w-7 text-[var(--nb-gold)]" strokeWidth={1.7} />
              <b className="mt-3 block text-[15px] font-bold text-white">{a}</b>
              <span className="mt-1 block text-[13px] text-white/55">{b}</span>
            </li>
          ))}
        </ul>

        {/* ==================================================================
            BANNER — BẢN MÁY TÍNH, ĐÚNG KIT MÀN 06
            Cột trái: logo · nhãn · tiêu đề hai dòng · câu phụ · BỐN dòng icon ·
            MỘT nút vàng.  Cột phải: ảnh lớn chiếm trọn chiều cao.
            ================================================================== */}
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
                <span className="nb-sub-gold">{t.h1accent}</span>
                {t.h1rest}
              </h1>

              <p className="mt-5 max-w-[46ch] text-[17px] leading-[1.65] text-white/70">{t.sub.split("\n")[0]}</p>

              {/* Bốn dòng icon — đúng nhịp của KIT */}
              <ul className="mt-9 space-y-[18px]">
                {[0, 2, 3, 6].map((k) => {
                  const x = t.topics[k]!;
                  return (
                    <li key={x.title} className="flex items-center gap-4">
                      <span className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-xl border border-[var(--nb-gold-line)] bg-[var(--nb-gold)]/8 text-[var(--nb-gold)]">
                        <Icon name={x.icon} className="h-[22px] w-[22px]" strokeWidth={1.7} />
                      </span>
                      <span className="min-w-0">
                        <b className="block text-[17px] leading-tight font-bold text-white">{x.title}</b>
                        <span className="mt-0.5 block text-[14px] text-white/55">{x.text}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-10">
                <Link href={ROUTES.process[locale] as Route} className="nb-sub-cta h-[54px] px-8 text-[16px]">
                  {t.secondary[0]}
                  <Icon name="arrowRight" className="h-[18px] w-[18px]" strokeWidth={2.2} />
                </Link>
              </div>
            </div>

            <div className="relative my-10 min-h-[640px] overflow-hidden rounded-[28px] ring-1 ring-white/10">
              <Image src={anhChinh.portraitTeam} alt="" fill priority quality={90} sizes="52vw" className="object-cover object-[48%_24%]" />
              <span
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(6,23,43,.6) 0, rgba(6,23,43,0) 28%), linear-gradient(180deg, rgba(6,23,43,.25) 0, rgba(6,23,43,0) 30%, rgba(6,23,43,.45) 100%)",
                }}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* vệt sáng vàng khép chân banner */}
          <span
            className="absolute inset-x-0 bottom-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(214,172,98,.6) 40%, rgba(214,172,98,.2) 74%, transparent)" }}
            aria-hidden="true"
          />
        </section>

        {/* ==================================================================
            HÀNH TRÌNH — máy tính: trục vàng ở giữa, các chặng so le hai bên
            ================================================================== */}
        <section className="mx-auto hidden max-w-[1560px] px-12 pt-24 pb-20 lg:block">
          <div className="max-w-[60ch]">
            <p className="flex items-center gap-3 text-[11px] font-bold tracking-[0.28em] text-[var(--nb-gold)] uppercase">
              <span className="h-px w-10 bg-[var(--nb-gold)]/70" aria-hidden="true" />
              {p.eyebrow}
            </p>
            <h2 className="mt-5 text-[42px] leading-[1.12] font-bold tracking-[-0.025em] text-white">
              {p.h1[0]} <span className="nb-sub-gold">{p.h1[1]}</span>
            </h2>
          </div>

          <ol className="relative mt-16">
            <span
              className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2"
              style={{ background: "linear-gradient(180deg, transparent, rgba(214,172,98,.45) 8%, rgba(214,172,98,.45) 92%, transparent)" }}
              aria-hidden="true"
            />
            {p.steps.map((s, i) => {
              const trai = i % 2 === 0;
              const anh = INDUSTRY_ASSETS[ANH_CHANG[i] ?? "akademische-fachkraefte"]!;
              return (
                <li key={s.title} className="relative grid grid-cols-2 gap-16 pb-14 last:pb-0">
                  {/* chấm tròn trên trục */}
                  <span
                    className="absolute top-[34px] left-1/2 z-10 flex h-[46px] w-[46px] -translate-x-1/2 items-center justify-center rounded-full border border-[var(--nb-gold-line)] bg-[var(--nb-sub-navy)] text-[13px] font-extrabold text-[var(--nb-gold)]"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className={trai ? "col-start-1 pr-4 text-right" : "col-start-2 pl-4"}>
                    <b className="block text-[24px] leading-tight font-bold text-white">{s.title}</b>
                    <span className="mt-1.5 block text-[14px] text-white/50">{s.sub.join(" ")}</span>
                    <ul className={`mt-5 space-y-2.5 ${trai ? "items-end" : ""}`}>
                      {s.candidate.bullets.map((b) => (
                        <li key={b} className={`flex gap-2.5 text-[15px] leading-[1.6] text-white/72 ${trai ? "flex-row-reverse" : ""}`}>
                          <Icon name="check" className="mt-[5px] h-4 w-4 shrink-0 text-[var(--nb-gold)]" strokeWidth={2.6} />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={trai ? "col-start-2 pl-4" : "col-start-1 row-start-1 pr-4"}>
                    <span className="relative block aspect-[16/9] overflow-hidden rounded-2xl ring-1 ring-white/10">
                      <Image src={anh.portraitWork} alt="" fill sizes="40vw" className="object-cover object-[50%_30%]" />
                      <span
                        className="absolute inset-0"
                        style={{ background: "linear-gradient(180deg, rgba(6,23,43,.1), rgba(6,23,43,.7))" }}
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* HÀNH TRÌNH — điện thoại: dải thẻ cuộn ngang */}
        <section className="px-6 pt-10 pb-8 lg:hidden">
          <p className="flex items-center gap-2.5 text-[10.5px] font-bold tracking-[0.24em] text-[var(--nb-gold)] uppercase">
            <span className="h-px w-7 bg-[var(--nb-gold)]/70" aria-hidden="true" />
            {p.eyebrow}
          </p>
          <h2 className="mt-4 text-[26px] leading-[1.18] font-bold text-white">
            {p.h1[0]} <span className="nb-sub-gold">{p.h1[1]}</span>
          </h2>
          <ol className="-mx-6 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {p.steps.map((s, i) => (
              <li key={s.title} className="nb-sub-panel w-[270px] shrink-0 snap-start overflow-hidden">
                <span className="relative block h-[130px]">
                  <Image
                    src={INDUSTRY_ASSETS[ANH_CHANG[i] ?? "akademische-fachkraefte"]!.portraitWork}
                    alt=""
                    fill
                    sizes="270px"
                    className="object-cover object-[50%_28%]"
                  />
                  <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(6,23,43,.1), rgba(6,23,43,.85))" }} aria-hidden="true" />
                  <b className="absolute bottom-3 left-4 text-[30px] leading-none font-extrabold text-white/40">{String(i + 1).padStart(2, "0")}</b>
                </span>
                <span className="block p-4">
                  <b className="block text-[16px] leading-snug font-bold text-white">{s.title}</b>
                  <span className="mt-1 block text-[12.5px] text-white/50">{s.sub.join(" ")}</span>
                  <ul className="mt-3 space-y-1.5">
                    {s.candidate.bullets.map((b) => (
                      <li key={b} className="flex gap-2 text-[13px] leading-[1.55] text-white/70">
                        <Icon name="check" className="mt-[4px] h-3.5 w-3.5 shrink-0 text-[var(--nb-gold)]" strokeWidth={2.8} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* ==================================================================
            CHỦ ĐỀ CẦN BIẾT — lưới kiểu báo chí, hai ô đầu to kèm ảnh
            ================================================================== */}
        <section className="border-y border-white/10 bg-[var(--nb-sub-navy-2)]">
          <div className="mx-auto max-w-[1560px] px-6 py-14 lg:px-12 lg:py-20">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-[56ch]">
                <p className="flex items-center gap-3 text-[10.5px] font-bold tracking-[0.26em] text-[var(--nb-gold)] uppercase lg:text-[11px]">
                  <span className="h-px w-8 bg-[var(--nb-gold)]/70" aria-hidden="true" />
                  {t.secondary[1]}
                </p>
                <h2 className="mt-4 text-[28px] leading-[1.15] font-bold text-white lg:text-[40px]">{t.secondary[1]}</h2>
              </div>
              <Link href={ROUTES.knowledge[locale] as Route} className="nb-sub-ghost h-12 px-6 text-[15px]">
                {t.cta}
              </Link>
            </div>

            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {t.topics.map((x, i) => {
                const to = i < 2;
                return (
                  <li key={x.title} className={to ? "sm:col-span-2" : ""}>
                    <div className="nb-sub-panel nb-sub-panel-hover h-full overflow-hidden">
                      {to && (
                        <span className="relative block h-[160px]">
                          <Image
                            src={INDUSTRY_ASSETS[i === 0 ? "gastronomie-koch" : "elektrotechnik-elektroniker"]!.hero}
                            alt=""
                            fill
                            sizes="(min-width:640px) 50vw, 100vw"
                            className="object-cover object-[50%_35%]"
                          />
                          <span
                            className="absolute inset-0"
                            style={{ background: "linear-gradient(180deg, rgba(6,23,43,.15), rgba(6,23,43,.9))" }}
                            aria-hidden="true"
                          />
                        </span>
                      )}
                      <span className="block p-6">
                        <span className="flex h-[46px] w-[46px] items-center justify-center rounded-xl border border-[var(--nb-gold-line)] bg-[var(--nb-gold)]/8 text-[var(--nb-gold)]">
                          <Icon name={x.icon} className="h-[22px] w-[22px]" strokeWidth={1.7} />
                        </span>
                        <b className={`mt-4 block leading-snug font-bold text-white ${to ? "text-[20px]" : "text-[17px]"}`}>{x.title}</b>
                        <span className="mt-2 block text-[14.5px] leading-[1.7] text-white/62">{x.text}</span>
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ---------------- DẢI SỐ LIỆU ---------------- */}
        <section className="border-b border-white/10">
          <ul className="mx-auto flex max-w-[1560px] flex-wrap gap-x-16 gap-y-7 px-6 py-10 lg:px-12 lg:py-12">
            {t.stats.map((s) => (
              <li key={s.label} className="flex items-center gap-4">
                <Icon name={s.icon} className="h-7 w-7 shrink-0 text-[var(--nb-gold)]" strokeWidth={1.7} />
                <span>
                  {s.value ? (
                    <b className="block text-[26px] leading-none font-extrabold text-[var(--nb-gold)]">{s.value}</b>
                  ) : (
                    <Gated code="05">
                      <b className="block text-[26px] leading-none font-extrabold text-[var(--nb-gold)]">—</b>
                    </Gated>
                  )}
                  <span className="mt-1.5 block text-[13.5px] text-white/55">{s.label}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ==================================================================
            ĐƠN HÀNG ĐANG TUYỂN
            ================================================================== */}
        <section className="mx-auto max-w-[1560px] px-6 py-14 lg:px-12 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="flex items-center gap-3 text-[10.5px] font-bold tracking-[0.26em] text-[var(--nb-gold)] uppercase lg:text-[11px]">
                <span className="h-px w-8 bg-[var(--nb-gold)]/70" aria-hidden="true" />
                {c.eyebrow}
              </p>
              <h2 className="mt-4 text-[26px] leading-[1.15] font-bold text-white lg:text-[36px]">{c.title}</h2>
            </div>
            <Link href={ROUTES.jobs[locale] as Route} className="nb-sub-ghost h-12 px-6 text-[15px]">
              {c.tickerCta}
            </Link>
          </div>

          <ul className="-mx-6 mt-9 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 [-ms-overflow-style:none] [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
            {jobs.map((j) => (
              <li key={j.id} className="w-[290px] shrink-0 snap-start lg:w-auto">
                <Link href={jobPath(locale, j.id) as Route} className="nb-sub-panel nb-sub-panel-hover block h-full overflow-hidden">
                  <span className="relative block h-[190px]">
                    <Image src={j.image} alt="" fill sizes="(min-width:1024px) 33vw, 290px" className="object-cover" style={{ objectPosition: j.imageFocus }} />
                    <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(6,23,43,0), rgba(6,23,43,.55))" }} aria-hidden="true" />
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
                    <b className="mt-2 block text-[17px] leading-snug font-bold text-white">{j.title}</b>
                    <b className="mt-2.5 block text-[16px] font-bold text-[var(--nb-gold)]">
                      {gia(j)}
                      <span className="font-normal text-white/50"> {c.perMonth}</span>
                    </b>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ==================================================================
            KHỐI KẾT ĐIỆN ẢNH
            ================================================================== */}
        <section className="relative isolate overflow-hidden border-t border-white/10">
          <Image
            src={INDUSTRY_ASSETS["elektrotechnik-elektroniker"]!.portraitTeam}
            alt=""
            fill
            sizes="100vw"
            className="-z-10 object-cover object-[58%_26%]"
          />
          <span
            className="absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(90deg, rgba(6,23,43,.98) 0, rgba(6,23,43,.9) 46%, rgba(6,23,43,.5) 100%), linear-gradient(180deg, rgba(6,23,43,.6) 0, rgba(6,23,43,.2) 40%, rgba(6,23,43,.85) 100%)",
            }}
            aria-hidden="true"
          />
          <div className="mx-auto max-w-[1560px] px-6 py-16 lg:px-12 lg:py-24">
            <p className="max-w-[22ch] text-[28px] leading-[1.28] font-bold text-white lg:text-[44px]">{t.quote}</p>
            <p className="mt-4 text-[13.5px] text-white/45">{t.quoteBy}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href={ROUTES.contact[locale] as Route} className="nb-sub-cta h-[54px] px-8 text-[16px]">
                {t.cta}
                <Icon name="arrowRight" className="h-[18px] w-[18px]" strokeWidth={2.2} />
              </Link>
              <Link href={ROUTES.jobs[locale] as Route} className="nb-sub-ghost h-[54px] px-8 text-[16px]">
                {c.tickerCta}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SubFooter locale={locale} />
      <SubMenuBar locale={locale} page="candidates" />
      <MobileTabBar locale={locale} page="candidates" />
    </div>
  );
}

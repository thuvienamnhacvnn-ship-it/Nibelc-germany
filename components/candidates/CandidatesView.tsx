import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { Icon } from "@/components/ui/Icon";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { isApproved, isProduction } from "@/lib/field-gate";
import { ROUTES, type Locale } from "@/content/locales";
import { navFor, requestLabel } from "@/content/nav-menu";
import { CANDIDATES } from "@/content/page-candidates";

/**
 * Trang 03 — screens/03-fuer-bewerber-vietnam.png. Bố cục bị khoá.
 *
 * Toạ độ desktop (1 --u = 1px ảnh mẫu):
 *   hero 0–560, header trong suốt 0–84 đè lên ảnh (ảnh chạy tới mép trên)
 *   chữ nhỏ y≈127 · H1 hai dòng, dòng 2 có từ nhấn CAM · phụ đề 3 dòng từ y≈316
 *   nút y 416–482 · hàng 3 điểm tin cậy y 510–548
 *   8 thẻ chủ đề y 583–778 (x 35–1639, bề ngang mỗi thẻ theo mẫu)
 *   dải số liệu navy y 799–941 (vạch ngăn x 338, 635, 952, 1263)
 */

/** Bề ngang 8 thẻ đo từ mẫu */
const CARD_W = [174, 187, 182, 185, 191, 207, 199, 201];
/** Mép trái 4 cột số liệu và cột trích dẫn */
const STAT_W = [293, 297, 317, 311];

export function CandidatesView({ locale }: { locale: Locale }) {
  const t = CANDIDATES[locale];
  const statVerified = isApproved("05");

  return (
    <>
      <SiteHeader locale={locale} page="candidates" variant="light" />

      <main id="inhalt" className="bg-[#fdfdfd]">
        {/* ---------------- HERO ---------------- */}
        <section className="relative overflow-hidden bg-[#eef2f7] lg:h-[calc(560*var(--u))]">
          <div className="nb-photo-right absolute inset-y-0 left-[calc(560*var(--u))] hidden lg:block">
            <Image
              src={INDUSTRY_ASSETS["akademische-fachkraefte"]!.hero}
              alt=""
              fill
              priority
              sizes="70vw"
              className="object-cover"
              style={{ objectPosition: "55% 40%" }}
            />
          </div>
          <div
            className="nb-photo-right absolute inset-y-0 left-0 hidden lg:block"
            style={{
              background:
                "linear-gradient(90deg, #f3f6fa 0, #f3f6fa calc(600 * var(--u)), rgba(243,246,250,.75) calc(700 * var(--u)), rgba(243,246,250,0) calc(860 * var(--u)))",
            }}
            aria-hidden="true"
          />
          {/* Dải sáng trên cùng để header trong suốt vẫn đọc được trên ảnh */}
          <div
            className="absolute inset-x-0 top-0 hidden h-[calc(110*var(--u))] bg-[linear-gradient(180deg,rgba(243,246,250,.85),rgba(243,246,250,0))] lg:block"
            aria-hidden="true"
          />

          <div className="relative px-4 py-12 lg:absolute lg:top-0 lg:left-[calc(39*var(--u))] lg:w-[calc(830*var(--u))] lg:p-0">
            <p className="text-xs tracking-[0.3em] text-[#4a5a6e] uppercase lg:mt-[calc(126*var(--u))] lg:text-[calc(14*var(--u))]">
              {t.eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.025em] text-[var(--nb-ink)] lg:mt-[calc(16*var(--u))] lg:text-[calc(59*var(--u))] lg:leading-[calc(70*var(--u))]">
              {t.h1a}
              <br />
              <span className="text-[#f26a21]">{t.h1accent}</span>
              {t.h1rest}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-[#3a4a5e] lg:mt-[calc(12*var(--u))] lg:max-w-[calc(680*var(--u))] lg:text-[calc(20*var(--u))] lg:leading-[calc(28*var(--u))] lg:whitespace-pre-line">
              {t.sub}
            </p>
            <div className="mt-7 flex flex-wrap gap-4 lg:mt-[calc(22*var(--u))] lg:gap-[calc(17*var(--u))]">
              <Link
                href={ROUTES.industries[locale] as Route}
                className="inline-flex items-center gap-4 rounded-md bg-[#1647a8] px-7 py-4 font-semibold text-white hover:bg-[#0f3a8f] lg:h-[calc(66*var(--u))] lg:rounded-[calc(6*var(--u))] lg:px-[calc(39*var(--u))] lg:py-0 lg:text-[calc(21*var(--u))]"
              >
                {t.cta}
                <Icon name="arrowRight" className="h-6 w-6 lg:h-[calc(24*var(--u))] lg:w-[calc(24*var(--u))]" strokeWidth={2.2} />
              </Link>
              <Link
                href={ROUTES.process[locale] as Route}
                className="inline-flex items-center gap-4 rounded-md border-[1.5px] border-[#1d3f7a] bg-white/70 px-5 py-3 text-[var(--nb-ink)] hover:bg-white lg:h-[calc(66*var(--u))] lg:rounded-[calc(6*var(--u))] lg:px-[calc(22*var(--u))] lg:py-0"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#1d3f7a] lg:h-[calc(36*var(--u))] lg:w-[calc(36*var(--u))]">
                  <Icon name="chevronRight" className="h-5 w-5 lg:h-[calc(18*var(--u))] lg:w-[calc(18*var(--u))]" strokeWidth={2.4} />
                </span>
                <span className="text-sm leading-tight lg:text-[calc(15*var(--u))] lg:leading-[calc(21*var(--u))]">
                  {t.secondary[0]}
                  <br />
                  {t.secondary[1]}
                </span>
              </Link>
            </div>
            <ul className="mt-7 grid gap-4 sm:grid-cols-3 lg:mt-[calc(28*var(--u))] lg:flex lg:gap-0">
              {t.trust.map(([a, b], i) => (
                <li
                  key={a}
                  className="flex items-center gap-3 lg:gap-[calc(20*var(--u))]"
                  style={{ ["--w" as string]: [237, 236, 250][i] } as React.CSSProperties}
                  data-lgw
                >
                  <Icon
                    name={["cap", "shield", "users"][i]!}
                    className="h-8 w-8 shrink-0 text-[#1d5fd6] lg:h-[calc(34*var(--u))] lg:w-[calc(34*var(--u))]"
                  />
                  <span className="text-sm text-[#3a4a5e] lg:text-[calc(14*var(--u))] lg:leading-[calc(19*var(--u))]">
                    {a}
                    <br />
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- 8 THẺ CHỦ ĐỀ ---------------- */}
        <section className="px-4 py-8 lg:h-[calc(239*var(--u))] lg:px-[calc(35*var(--u))] lg:pt-[calc(23*var(--u))] lg:pb-0">
          <ul className="grid gap-3 sm:grid-cols-2 lg:flex lg:gap-[calc(11*var(--u))]">
            {t.topics.map((c, i) => (
              <li key={c.title} className="lg:shrink-0" style={{ ["--w" as string]: CARD_W[i] } as React.CSSProperties}
                  data-lgw>
                <Link
                  href={(i === 0 ? ROUTES.industries[locale] : ROUTES.process[locale]) as Route}
                  className="relative flex h-full flex-col rounded-xl bg-white p-4 shadow-[0_8px_24px_-12px_rgba(15,35,64,.25)] ring-1 ring-[#eef2f7] hover:ring-[#1d5fd6] lg:h-[calc(195*var(--u))] lg:rounded-[calc(10*var(--u))] lg:p-[calc(17*var(--u))]"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f0fc] text-[#1d5fd6] lg:h-[calc(60*var(--u))] lg:w-[calc(60*var(--u))]">
                    <Icon name={c.icon} className="h-7 w-7 lg:h-[calc(30*var(--u))] lg:w-[calc(30*var(--u))]" />
                  </span>
                  <span className="mt-3 font-bold text-[var(--nb-ink)] lg:mt-[calc(17*var(--u))] lg:text-[calc(16.5*var(--u))] lg:leading-[calc(21*var(--u))] lg:whitespace-nowrap">
                    {c.title}
                  </span>
                  <span className="mt-1 text-sm text-[#5b6b80] lg:mt-[calc(6*var(--u))] lg:text-[calc(12.5*var(--u))] lg:leading-[calc(19*var(--u))]">
                    {c.text}
                  </span>
                  <Icon
                    name="chevronRight"
                    className="absolute right-4 bottom-4 h-5 w-5 text-[#1d5fd6] lg:right-[calc(20*var(--u))] lg:bottom-[calc(16*var(--u))] lg:h-[calc(20*var(--u))] lg:w-[calc(20*var(--u))]"
                    strokeWidth={2.4}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------- DẢI SỐ LIỆU ---------------- */}
        <section className="bg-[radial-gradient(ellipse_at_30%_120%,#1d4a7d,#153862_55%,#112f55)] text-white lg:h-[calc(142*var(--u))]">
          <div className="grid gap-6 px-4 py-8 sm:grid-cols-2 lg:flex lg:h-full lg:gap-0 lg:p-0">
            {t.stats.map((s, i) => {
              // Số chưa xác minh: dev hiện gạch ngang để thấy chỗ trống,
              // production bỏ hẳn ô đó (policy CẦN ĐIỀN 05).
              if (s.value === null && !statVerified && isProduction()) return null;
              return (
                <div
                  key={s.label}
                  className={`flex items-center gap-4 lg:h-full lg:gap-[calc(28*var(--u))] ${i === 0 ? "lg:pl-[calc(45*var(--u))]" : "lg:border-l lg:border-white/20 lg:pl-[calc(34*var(--u))]"}`}
                  style={{ ["--w" as string]: STAT_W[i] } as React.CSSProperties}
                  data-lgw
                >
                  <Icon name={s.icon} className="h-12 w-12 shrink-0 lg:h-[calc(58*var(--u))] lg:w-[calc(58*var(--u))]" strokeWidth={1.4} />
                  <span>
                    <span className="block text-3xl leading-none font-bold lg:text-[calc(34*var(--u))]">
                      {s.value ?? "—"}
                    </span>
                    <span className="mt-1 block text-sm text-white/85 lg:mt-[calc(6*var(--u))] lg:text-[calc(16*var(--u))] lg:leading-[calc(20*var(--u))]">
                      {s.label}
                    </span>
                  </span>
                </div>
              );
            })}
            <figure className="lg:flex lg:h-full lg:flex-1 lg:flex-col lg:justify-center lg:border-l lg:border-white/20 lg:pr-[calc(42*var(--u))] lg:pl-[calc(45*var(--u))]">
              <blockquote className="text-lg lg:text-[calc(18*var(--u))] lg:leading-[calc(24*var(--u))]">“{t.quote}”</blockquote>
              <figcaption className="mt-3 flex items-end justify-between gap-4 lg:mt-[calc(14*var(--u))]">
                <span className="h-[5px] w-16 bg-[var(--nb-orange)] lg:h-[calc(5*var(--u))] lg:w-[calc(64*var(--u))]" aria-hidden="true" />
                <span className="text-sm text-white/85 lg:text-[calc(14*var(--u))]">{t.quoteBy}</span>
              </figcaption>
            </figure>
          </div>
        </section>
      </main>
    </>
  );
}

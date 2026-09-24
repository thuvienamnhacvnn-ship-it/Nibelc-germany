import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import type { CSSProperties, ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileTabBar } from "@/components/nav/MobileTabBar";
import { Icon } from "@/components/ui/Icon";
import { industryAssets, type Industry } from "@/content/industries";
import { LOCALES, ROUTES, industryPath, type Locale } from "@/content/locales";
import { navFor, requestLabel } from "@/content/nav-menu";
import { INDUSTRY_DETAIL, INDUSTRY_DETAIL_PAGE } from "@/content/page-industry-detail";
import { isApproved, isProduction, shouldShowPlaceholder } from "@/lib/field-gate";

/**
 * Trang 05 — screens/05-branche-elektrotechnik.png. Một khuôn cho mọi ngành
 * đang mở; chữ và ảnh đọc từ registry. Bố cục bị khoá.
 *
 * Toạ độ desktop (1 --u = 1px ảnh mẫu, y tính từ đỉnh trang):
 *   header sáng đè lên ảnh 0–60 (logo x66, nav x392 cách 48, nút navy x1405–1608)
 *   hero 0–358: chữ trái x67, ảnh phải từ x≈600, thẻ trích dẫn x1403 y185 220×152
 *   dải 4 ý 358–400 (vạch ngăn x420, 835, 1218)
 *   bốn thẻ 408–667: x50/435/836/1221, rộng 375/391/374/402
 *   thẻ ảnh 676–897 x50–1106 (y 276 trong thân); thẻ lộ trình 676–897 x1115–1623
 *   dải navy chân trang 902–941
 */

type Box = { x: number; y: number; w?: number; h?: number };

/** Vị trí tuyệt đối trên desktop; mobile chảy dọc bình thường. */
const ABS =
  "lg:absolute lg:left-[calc(var(--x)*var(--u))] lg:top-[calc(var(--y)*var(--u))] lg:w-[calc(var(--w)*var(--u))] lg:h-[calc(var(--h)*var(--u))]";

function at({ x, y, w, h }: Box): CSSProperties {
  return {
    ["--x" as string]: x,
    ["--y" as string]: y,
    ["--w" as string]: w ?? "auto",
    ["--h" as string]: h ?? "auto",
  } as CSSProperties;
}

const CARD = "rounded-lg bg-white ring-1 ring-[#e3e9f1] shadow-[0_6px_20px_-12px_rgba(15,35,64,.35)] lg:rounded-[calc(8*var(--u))]";

function CardTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-lg font-bold text-[#10284d] lg:text-[calc(18.5*var(--u))] lg:leading-[calc(22*var(--u))]">
      {children}
      <span className="mt-1.5 block h-[3px] w-9 rounded-full bg-[var(--nb-orange)] lg:mt-[calc(6*var(--u))] lg:h-[calc(3*var(--u))] lg:w-[calc(35*var(--u))]" aria-hidden="true" />
    </h2>
  );
}

export function IndustryDetailView({ locale, industry }: { locale: Locale; industry: Industry }) {
  const t = INDUSTRY_DETAIL_PAGE[locale];
  const d = INDUSTRY_DETAIL[industry.slug]!;
  const a = industryAssets(industry);
  const tasks = locale === "de" ? industry.taetigkeiten : locale === "en" ? d.tasksEn : d.tasksVi;
  const facts = [d.sector[locale], ...t.facts.slice(1)];
  const statsOk = isApproved("05");
  const devMark = !isProduction();

  const langHrefs = Object.fromEntries(LOCALES.map((l) => [l, industryPath(l, industry.slug)])) as Record<Locale, string>;
  const employers = ROUTES.employers[locale];
  const candidates = ROUTES.candidates[locale];

  return (
    <>
      <SiteHeader locale={locale} page="industries" variant="light" langHrefs={langHrefs} />

      <main id="inhalt" className="bg-[#eef3f9]">
        {/* ---------------- HERO ---------------- */}
        <section className="relative overflow-hidden bg-[#eef3f9] lg:h-[calc(358*var(--u))]">
          <div className="relative aspect-[16/9] lg:nb-photo-right lg:absolute lg:inset-y-0 lg:left-[calc(540*var(--u))] lg:aspect-auto">
            <Image
              src={a.hero}
              alt={industry.alt.hero}
              fill
              priority
              sizes="(min-width:1024px) 65vw, 100vw"
              className="object-cover"
              style={{ objectPosition: d.heroFocus }}
            />
          </div>
          <div
            className="nb-photo-right absolute inset-y-0 left-0 hidden lg:block"
            style={{
              background:
                "linear-gradient(90deg, #eef3f9 0, #eef3f9 calc(560 * var(--u)), rgba(238,243,249,.7) calc(610 * var(--u)), rgba(238,243,249,0) calc(700 * var(--u)))",
            }}
            aria-hidden="true"
          />
          {/* dải sáng dưới header để nav đọc được trên ảnh */}
          <div className="absolute inset-x-0 top-0 hidden h-[calc(70*var(--u))] bg-gradient-to-b from-white/80 to-white/0 lg:block" aria-hidden="true" />

          <div className="relative px-4 py-8 lg:absolute lg:top-0 lg:left-[calc(67*var(--u))] lg:w-[calc(570*var(--u))] lg:p-0">
            <p className="flex items-center gap-3 text-xs font-medium tracking-[0.12em] text-[#1f3a60] uppercase lg:mt-[calc(89*var(--u))] lg:gap-[calc(14*var(--u))] lg:text-[calc(13*var(--u))]">
              {t.eyebrow}
              <span className="h-[2px] w-10 bg-[var(--nb-orange)] lg:w-[calc(45*var(--u))]" aria-hidden="true" />
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.02em] text-[#10284d] lg:mt-[calc(10*var(--u))] lg:text-[calc(38*var(--u))] lg:leading-[calc(42*var(--u))] lg:min-h-[calc(84*var(--u))] lg:whitespace-pre-line [text-wrap:balance]">
              {d.h1[locale]}
            </h1>
            <p className="mt-2 text-lg text-[#10284d] lg:mt-[calc(6*var(--u))] lg:text-[calc(20.5*var(--u))] lg:leading-[calc(28*var(--u))]">
              {t.sub}
            </p>
            <ul className="mt-5 flex flex-wrap gap-5 lg:mt-[calc(14*var(--u))] lg:gap-0">
              {t.trust.map(([l1, l2], i) => (
                <li
                  key={l1}
                  className="flex items-center gap-3 lg:w-[calc(var(--w)*var(--u))] lg:gap-[calc(18*var(--u))]"
                  style={{ ["--w" as string]: [168, 185, 190][i] } as CSSProperties}
                >
                  <Icon
                    name={["shield", "handshake", "chart"][i]!}
                    className="h-8 w-8 shrink-0 text-[#1f4f9f] lg:h-[calc(32*var(--u))] lg:w-[calc(32*var(--u))]"
                    strokeWidth={1.6}
                  />
                  <span className="text-sm text-[#2a3d58] lg:text-[calc(12.5*var(--u))] lg:leading-[calc(17*var(--u))]">
                    {l1}
                    <br />
                    {l2}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3 lg:mt-[calc(16*var(--u))] lg:gap-[calc(17*var(--u))]">
              <Link
                href={`${employers}#beratung` as Route}
                className="inline-flex items-center justify-center gap-3 rounded-md bg-[var(--nb-orange)] px-6 py-3 font-semibold text-white shadow-[0_8px_18px_-8px_rgba(255,106,19,.8)] hover:bg-[var(--nb-orange-dark)] lg:h-[calc(40*var(--u))] lg:w-[calc(211*var(--u))] lg:gap-[calc(14*var(--u))] lg:rounded-[calc(6*var(--u))] lg:p-0 lg:text-[calc(14.5*var(--u))]"
              >
                {t.ctaEmployer}
                <Icon name="arrowRight" className="h-4 w-4 lg:h-[calc(16*var(--u))] lg:w-[calc(16*var(--u))]" strokeWidth={2} />
              </Link>
              <Link
                href={candidates as Route}
                className="inline-flex items-center justify-center gap-3 rounded-md border border-[#0f3470] bg-white/70 px-6 py-3 font-semibold text-[#0f3470] hover:bg-white lg:h-[calc(40*var(--u))] lg:w-[calc(206*var(--u))] lg:gap-[calc(14*var(--u))] lg:rounded-[calc(6*var(--u))] lg:p-0 lg:text-[calc(14.5*var(--u))]"
              >
                {t.ctaCandidate}
                <Icon name="arrowRight" className="h-4 w-4 lg:h-[calc(16*var(--u))] lg:w-[calc(16*var(--u))]" strokeWidth={2} />
              </Link>
            </div>
          </div>

          {/* Câu thương hiệu thay cho trích dẫn người thật trong mẫu */}
          <figure
            className="absolute hidden rounded-[calc(10*var(--u))] bg-white/85 px-[calc(20*var(--u))] pt-[calc(14*var(--u))] shadow-[0_10px_30px_-12px_rgba(15,35,64,.45)] backdrop-blur lg:block"
            style={{ left: "calc(1403 * var(--u))", top: "calc(185 * var(--u))", width: "calc(220 * var(--u))", height: "calc(152 * var(--u))" }}
          >
            <blockquote className="text-[calc(17.5*var(--u))] leading-[calc(22*var(--u))] text-[#10284d] italic">{t.quote}</blockquote>
            <figcaption className="mt-[calc(8*var(--u))]">
              <span className="block text-[calc(12.5*var(--u))] font-bold text-[#10284d]">{t.quoteBy}</span>
              <span className="block text-[calc(11*var(--u))] text-[#3a4a5e]">{t.quoteSub}</span>
            </figcaption>
          </figure>
        </section>

        {/* ---------------- DẢI 4 Ý ---------------- */}
        <section className="bg-[#f5f8fc] lg:h-[calc(42*var(--u))]">
          <ul className="grid gap-3 px-4 py-4 sm:grid-cols-2 lg:flex lg:h-full lg:gap-0 lg:p-0 lg:pl-[calc(50*var(--u))]">
            {facts.map((f, i) => (
              <li
                key={f}
                className={`flex items-center gap-3 lg:h-full lg:w-[calc(var(--w)*var(--u))] lg:gap-[calc(18*var(--u))] ${i === 0 ? "lg:pl-[calc(40*var(--u))]" : "lg:pl-[calc(58*var(--u))]"}`}
                style={{ ["--w" as string]: [370, 415, 383, 405][i] } as CSSProperties}
              >
                <Icon
                  name={["pin", "users", "doc", "handshake"][i]!}
                  className="h-5 w-5 shrink-0 text-[#1f4f9f] lg:h-[calc(22*var(--u))] lg:w-[calc(22*var(--u))]"
                  strokeWidth={1.9}
                />
                <span className="text-sm text-[#2a3d58] lg:text-[calc(13*var(--u))] lg:whitespace-nowrap">{f}</span>
                {i < 3 && <span className="ml-auto hidden h-[calc(18*var(--u))] w-px bg-[#b9c7da] lg:block" aria-hidden="true" />}
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------- THÂN TRANG ---------------- */}
        <div className="relative grid gap-4 px-4 py-6 lg:block lg:h-[calc(502*var(--u))] lg:p-0">
          {/* Tätigkeiten */}
          <section className={`${CARD} ${ABS} p-5 lg:px-[calc(22*var(--u))] lg:pt-[calc(10*var(--u))] lg:pb-[calc(12*var(--u))]`} style={at({ x: 50, y: 8, w: 375, h: 259 })}>
            <CardTitle>{t.tasksTitle}</CardTitle>
            <p className="mt-2 text-sm text-[#2a3d58] lg:mt-[calc(4*var(--u))] lg:text-[calc(12.5*var(--u))] lg:leading-[calc(16*var(--u))]">{d.intro[locale]}</p>
            <ul className="mt-3 space-y-2 lg:mt-[calc(9*var(--u))] lg:space-y-[calc(5.5*var(--u))]">
              {tasks.map((x) => (
                <li key={x} className="flex items-center gap-3 lg:gap-[calc(18*var(--u))] lg:pl-[calc(6*var(--u))]">
                  <Icon name="checkCircle" className="h-4 w-4 shrink-0 text-[#1f4f9f] lg:h-[calc(16*var(--u))] lg:w-[calc(16*var(--u))]" />
                  <span className="text-sm text-[#2a3d58] lg:text-[calc(12*var(--u))] lg:leading-[calc(16.5*var(--u))] lg:whitespace-nowrap">{x}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Vorbereitung */}
          <section className={`${CARD} ${ABS} p-5 lg:px-[calc(26*var(--u))] lg:pt-[calc(10*var(--u))] lg:pb-[calc(12*var(--u))]`} style={at({ x: 435, y: 8, w: 391, h: 259 })}>
            <CardTitle>{t.prepTitle}</CardTitle>
            <p className="mt-2 text-sm text-[#2a3d58] lg:mt-[calc(4*var(--u))] lg:text-[calc(12.5*var(--u))] lg:leading-[calc(16*var(--u))]">{t.prepIntro}</p>
            <ul className="mt-3 space-y-2 lg:mt-[calc(9*var(--u))] lg:space-y-[calc(6*var(--u))]">
              {t.prep.map((x, i) => (
                <li key={x} className="flex items-center gap-3 lg:h-[calc(21*var(--u))] lg:gap-[calc(20*var(--u))] lg:pl-[calc(6*var(--u))]">
                  <Icon name={["book", "wrench", "doc", "users", "home"][i]!} className="h-5 w-5 shrink-0 text-[#1f4f9f] lg:h-[calc(24*var(--u))] lg:w-[calc(24*var(--u))]" strokeWidth={1.8} />
                  <span className="text-sm text-[#2a3d58] lg:text-[calc(12*var(--u))] lg:whitespace-nowrap">{x}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Anforderungen — điều kiện chính thức khoá bởi CẦN ĐIỀN 04 + 08 */}
          <section className={`${CARD} ${ABS} p-5 lg:px-[calc(26*var(--u))] lg:pt-[calc(10*var(--u))] lg:pb-[calc(12*var(--u))]`} style={at({ x: 836, y: 8, w: 374, h: 259 })}>
            <CardTitle>{t.reqTitle}</CardTitle>
            <p className="mt-2 text-sm text-[#2a3d58] lg:mt-[calc(4*var(--u))] lg:text-[calc(12.5*var(--u))] lg:leading-[calc(16*var(--u))]">{t.reqIntro}</p>
            <ul className="mt-3 space-y-2 lg:mt-[calc(9*var(--u))] lg:space-y-[calc(6*var(--u))]">
              {t.req.map((x, i) => (
                <li key={x} className="flex items-center gap-3 lg:h-[calc(21*var(--u))] lg:gap-[calc(14*var(--u))] lg:pl-[calc(6*var(--u))]">
                  <Icon name={["gear", "checkSquare", "users"][i]!} className="h-5 w-5 shrink-0 text-[#1f4f9f] lg:h-[calc(22*var(--u))] lg:w-[calc(22*var(--u))]" strokeWidth={1.9} />
                  <span className="text-sm text-[#2a3d58] lg:text-[calc(12*var(--u))] lg:whitespace-nowrap">{x}</span>
                </li>
              ))}
            </ul>
            {shouldShowPlaceholder("08") && (
              <p data-field-gate="04 08" className="mt-3 rounded border border-dashed border-amber-500 bg-amber-50 px-2 py-1 text-[11px] text-amber-800 lg:mt-[calc(10*var(--u))] lg:text-[calc(10.5*var(--u))]">
                CẦN ĐIỀN 04 + 08: bằng cấp tối thiểu và trình độ tiếng Đức — chỉ hiện ở dev.
              </p>
            )}
          </section>

          {/* Chuyên gia + số liệu — số khoá bởi CẦN ĐIỀN 05 */}
          <section className={`${CARD} ${ABS} relative overflow-hidden p-5 lg:px-[calc(22*var(--u))] lg:py-[calc(22*var(--u))]`} style={at({ x: 1221, y: 8, w: 402, h: 259 })}>
            <Icon name="germany" className="pointer-events-none absolute text-[#e9eff7] lg:top-[calc(6*var(--u))] lg:right-[calc(-6*var(--u))] lg:h-[calc(110*var(--u))] lg:w-[calc(110*var(--u))]" />
            <p className="relative text-xl text-[#10284d] lg:text-[calc(17.5*var(--u))] lg:leading-[calc(22*var(--u))]">
              {t.expert[0]}
              <br />
              {t.expert[1]}
            </p>
            <ul className="relative mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:mt-[calc(46*var(--u))] lg:flex lg:gap-0">
              {t.stats.map((s, i) => {
                const locked = s.value === null && !statsOk;
                if (locked && isProduction()) return null;
                return (
                  <li
                    key={s.label.join()}
                    className={`flex-1 ${i > 0 ? "max-sm:border-t max-sm:pt-3 sm:border-l sm:border-[#c9d6ea] sm:pl-4 lg:pl-[calc(26*var(--u))]" : "lg:pl-[calc(4*var(--u))]"} border-[#c9d6ea]`}
                  >
                    {s.value === "" ? (
                      <Icon name="handshake" className="h-8 w-8 text-[#1f4f9f] lg:h-[calc(30*var(--u))] lg:w-[calc(30*var(--u))]" strokeWidth={1.6} />
                    ) : (
                      <span
                        className="block text-2xl font-extrabold text-[#1b4fb0] lg:text-[calc(28*var(--u))] lg:leading-[calc(30*var(--u))]"
                        data-field-gate={locked && devMark ? "05" : undefined}
                        title={locked ? "CẦN ĐIỀN 05" : undefined}
                      >
                        {s.value ?? "—"}
                      </span>
                    )}
                    <span className="mt-1 block text-sm text-[#2a3d58] lg:mt-[calc(8*var(--u))] lg:text-[calc(12.5*var(--u))] lg:leading-[calc(17*var(--u))]">
                      {s.label[0]}
                      <br />
                      {s.label[1]}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Ảnh công việc */}
          <section className={`${CARD} ${ABS} p-4 lg:px-[calc(16*var(--u))] lg:pt-[calc(7*var(--u))]`} style={at({ x: 50, y: 276, w: 1056, h: 221 })}>
            <CardTitle>{t.galleryTitle}</CardTitle>
            <div className="mt-3 grid gap-2 sm:grid-cols-[3fr_1fr_1fr] lg:absolute lg:top-[calc(38*var(--u))] lg:left-[calc(16*var(--u))] lg:mt-0 lg:flex lg:h-[calc(176*var(--u))] lg:gap-[calc(9*var(--u))]">
              {[
                { src: a.hero, alt: industry.alt.hero, w: 620, cap: d.caption[locale], pos: d.heroFocus, big: true },
                { src: a.portraitTeam, alt: industry.alt.portraitTeam, w: 202, cap: t.gallery[0], pos: "50% 30%" },
                { src: a.detail, alt: industry.alt.detail, w: 192, cap: t.gallery[1], pos: "50% 50%" },
              ].map((g) => (
                <figure
                  key={g.src}
                  className="relative aspect-[4/3] overflow-hidden rounded-md lg:aspect-auto lg:h-full lg:w-[calc(var(--w)*var(--u))] lg:rounded-[calc(4*var(--u))]"
                  style={{ ["--w" as string]: g.w } as CSSProperties}
                >
                  <Image src={g.src} alt={g.alt} fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" style={{ objectPosition: g.pos }} />
                  <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0" aria-hidden="true" />
                  <figcaption
                    className={`absolute bottom-3 left-3 font-semibold text-white lg:left-[calc(12*var(--u))] ${
                      g.big
                        ? "max-w-[60%] text-sm lg:bottom-[calc(12*var(--u))] lg:left-[calc(15*var(--u))] lg:max-w-[calc(180*var(--u))] lg:text-[calc(13*var(--u))] lg:leading-[calc(17*var(--u))]"
                        : "text-xs lg:bottom-[calc(8*var(--u))] lg:text-[calc(11*var(--u))]"
                    }`}
                  >
                    {g.cap}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* Lộ trình + hai hộp CTA */}
          <section className={`${CARD} ${ABS} p-4 lg:px-[calc(11*var(--u))] lg:pt-[calc(7*var(--u))]`} style={at({ x: 1115, y: 276, w: 508, h: 221 })}>
            <CardTitle>{t.wayTitle}</CardTitle>
            <ol className="relative mt-4 grid grid-cols-3 gap-y-3 sm:grid-cols-6 lg:absolute lg:top-[calc(43*var(--u))] lg:left-[calc(12*var(--u))] lg:mt-0 lg:w-[calc(488*var(--u))]">
              <span className="absolute top-[calc(8*var(--u))] right-[calc(40*var(--u))] left-[calc(40*var(--u))] hidden h-px bg-[#1845a0] lg:block" aria-hidden="true" />
              {t.way.map(([l1, l2], i) => (
                <li key={l1} className="relative flex flex-col items-center text-center">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1845a0] text-[11px] font-bold text-white lg:h-[calc(17*var(--u))] lg:w-[calc(17*var(--u))] lg:text-[calc(10*var(--u))]">
                    {i + 1}
                  </span>
                  <span className="mt-1 text-[11px] leading-tight text-[#2a3d58] lg:mt-[calc(5*var(--u))] lg:text-[calc(9.5*var(--u))] lg:leading-[calc(12*var(--u))]">
                    {l1}
                    <br />
                    {l2}
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:absolute lg:top-[calc(103*var(--u))] lg:left-[calc(9*var(--u))] lg:mt-0 lg:flex lg:gap-[calc(13*var(--u))]">
              {[
                { b: t.boxEmployer, icon: "building", color: "text-[var(--nb-orange)]", btn: "bg-[var(--nb-orange)] hover:bg-[var(--nb-orange-dark)]", href: `${employers}#beratung`, w: 236 },
                { b: t.boxCandidate, icon: "users", color: "text-[#1845a0]", btn: "bg-[#1845a0] hover:bg-[#0f3470]", href: candidates, w: 241 },
              ].map(({ b, icon, color, btn, href, w }) => (
                <div
                  key={b.title}
                  className="relative rounded-md bg-white p-4 ring-1 ring-[#e3e9f1] lg:h-[calc(115*var(--u))] lg:w-[calc(var(--w)*var(--u))] lg:rounded-[calc(6*var(--u))] lg:px-[calc(19*var(--u))] lg:pt-[calc(11*var(--u))]"
                  style={{ ["--w" as string]: w } as CSSProperties}
                >
                  <div className="flex gap-3 lg:gap-[calc(14*var(--u))]">
                    <Icon name={icon} className={`h-9 w-9 shrink-0 ${color} lg:h-[calc(38*var(--u))] lg:w-[calc(38*var(--u))]`} strokeWidth={1.8} />
                    <div>
                      <p className={`font-bold ${color} lg:text-[calc(14.5*var(--u))] lg:leading-[calc(18*var(--u))]`}>{b.title}</p>
                      <p className="text-sm text-[#2a3d58] lg:mt-[calc(3*var(--u))] lg:text-[calc(12*var(--u))] lg:leading-[calc(16*var(--u))]">{b.text}</p>
                    </div>
                  </div>
                  <Link
                    href={href as Route}
                    className={`mt-3 flex items-center justify-center gap-2 rounded py-2 text-sm font-semibold text-white ${btn} lg:absolute lg:bottom-[calc(14*var(--u))] lg:mt-0 lg:h-[calc(29*var(--u))] lg:w-[calc(195*var(--u))] lg:gap-[calc(12*var(--u))] lg:rounded-[calc(4*var(--u))] lg:py-0 lg:text-[calc(13*var(--u))]`}
                  >
                    {b.cta}
                    <Icon name="arrowRight" className="h-4 w-4 lg:h-[calc(15*var(--u))] lg:w-[calc(15*var(--u))]" strokeWidth={2} />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ---------------- DẢI NAVY CHÂN TRANG ---------------- */}
        <footer className="flex flex-wrap items-center gap-3 bg-[#0c2a55] px-4 py-4 text-white lg:h-[calc(39*var(--u))] lg:flex-nowrap lg:gap-0 lg:px-[calc(66*var(--u))] lg:py-0">
          <p className="text-sm lg:text-[calc(14.5*var(--u))]">{t.footer}</p>
          <p className="flex items-center gap-3 text-xs lg:ml-auto lg:gap-[calc(12*var(--u))] lg:text-[calc(11*var(--u))]">
            NIBELC TalentBridge Deutschland
            <span className="h-px w-8 bg-[var(--nb-orange)] lg:w-[calc(35*var(--u))]" aria-hidden="true" />
            {t.footerClaim}
          </p>
        </footer>
      </main>
      <SiteFooter locale={locale} />
      <MobileTabBar locale={locale} page={"industries"} />
    </>
  );
}

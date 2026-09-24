import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { LegalStrip } from "@/components/LegalStrip";
import { MobileTabBar } from "@/components/nav/MobileTabBar";
import { HeroParallax } from "@/components/home/HeroParallax";
import { JobTicker } from "@/components/home/JobTicker";
import { MobileHero } from "@/components/home/MobileHero";
import { HOME, ROUTES, type Locale } from "@/content/locales";

/**
 * Trang 01 — screens/01-homepage.png. Bố cục bị khoá.
 *
 * Số đo (px ảnh mẫu = 1 --u):
 *   header 0–101 · hero 101–768 (667u) · dải 4 ô 768–941 (173u)
 *   chữ cách mép trái 50u · mảng navy chéo 668u (trên) → 622u (dưới)
 *   H1 cỡ ~79u, khoảng dòng 77u, đỉnh dòng 1 ở y=237 (136u vào hero)
 *   phụ đề ~24u, khoảng dòng 34u · nút cao 69u, bo 12u
 *   4 huy hiệu vòng cung tâm (997,128) (1088,213) (1160,328) (1222,439)
 */

const ICONS = {
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>,
  doc: <><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /><path d="m9.5 14 2 2 3.5-3.8" /></>,
  plane: <path d="M10.5 3.5a1.5 1.5 0 0 1 3 0v6l7.5 4.2v2.3l-7.5-2.2v4.4l2.5 1.8v1.7L12 20.6l-4 1.1v-1.7l2.5-1.8v-4.4L3 16v-2.3l7.5-4.2Z" />,
  people: <><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M17 11.5a3 3 0 1 0-1.8-5.4M18.5 20a5.5 5.5 0 0 0-3-4.9" /></>,
  shield: <><path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.5 7.5 9.5 4.4-1 7.5-4.9 7.5-9.5V6L12 3Z" /><path d="m8.8 12.2 2.3 2.3 4.3-4.6" /></>,
  scale: <><path d="M12 4v16M7 20h10M5 8h14" /><path d="m5 8-3 6a3 3 0 0 0 6 0Zm14 0-3 6a3 3 0 0 0 6 0Z" /></>,
  group: <><circle cx="12" cy="7" r="2.8" /><circle cx="5.5" cy="9" r="2.3" /><circle cx="18.5" cy="9" r="2.3" /><path d="M7 20v-2a5 5 0 0 1 10 0v2M1.5 19v-1.2a4 4 0 0 1 5-3.8M22.5 19v-1.2a4 4 0 0 0-5-3.8" /></>,
  hands: <path d="m2 11 4-4 4 3 3-2 3 1 6 5-4 4-3-2-3 3-3-3-3 1-2-3Zm8 3 3 3M13 12l3 3" />,
};

function Svg({ d, cls }: { d: React.ReactNode; cls: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {d}
    </svg>
  );
}

/** Tâm 4 huy hiệu theo toạ độ hero (y đã trừ 101 của header) */
const ARC_POINTS = [
  { x: 997, y: 128, icon: ICONS.search },
  { x: 1088, y: 213, icon: ICONS.doc },
  { x: 1160, y: 328, icon: ICONS.plane },
  { x: 1222, y: 439, icon: ICONS.people },
];

const STRIP_ICONS = [ICONS.shield, ICONS.scale, ICONS.group, ICONS.hands];

/** Bốn chặng trên vòng cung dẫn tới trang tương ứng. */
const ARC_LINKS: ((l: Locale) => string)[] = [
  (l) => ROUTES.industries[l],
  (l) => ROUTES.process[l],
  (l) => ROUTES.process[l],
  (l) => ROUTES.knowledge[l],
];

export function HomeView({ locale }: { locale: Locale }) {
  const t = HOME[locale];

  return (
    <>
      <SiteHeader locale={locale} page="home" variant="navy" />

      <main id="inhalt">
        {/* ---------------- ĐƠN HÀNG ĐANG CHẠY ---------------- */}
        <div className="hidden lg:block">
          <JobTicker locale={locale} />
        </div>

        {/* ---------------- HERO (điện thoại) ---------------- */}
        <MobileHero locale={locale} />

        {/* ---------------- HERO (máy tính) ---------------- */}
        <section className="relative hidden bg-[var(--nb-navy-hero)] text-white lg:block lg:h-[calc(667*var(--ub))]">
          {/* Banner 2 lớp: B2 nền + navy chéo + B1 người, có parallax */}
          <HeroParallax />

          {/* 4 huy hiệu nằm trên cùng (vòng cung đã ở trong HeroParallax) */}
          <ul className="absolute inset-y-0 right-[calc(-1*var(--nb-gutter))] hidden w-[calc(1672*var(--ub))] lg:block">
            {ARC_POINTS.map((p, i) => (
              <li
                key={i}
                className="absolute"
                style={{ left: `calc(${p.x - 28} * var(--ub))`, top: `calc(${p.y - 28} * var(--ub))` }}
              >
                <Link href={ARC_LINKS[i]!(locale) as Route} className="group flex items-center">
                <span className="flex h-[calc(56*var(--u))] w-[calc(56*var(--u))] items-center justify-center rounded-full bg-[var(--nb-blue-dark)] text-white ring-[calc(3*var(--u))] ring-white/90 transition duration-300 group-hover:-translate-y-[calc(3*var(--u))] group-hover:scale-110 group-hover:bg-[var(--nb-orange)] group-hover:ring-white group-hover:shadow-[0_calc(10*var(--u))_calc(24*var(--u))_calc(-8*var(--u))_rgba(255,106,19,.85)]">
                  <Svg d={p.icon} cls="h-[calc(28*var(--u))] w-[calc(28*var(--u))] transition-transform duration-300 group-hover:scale-110" />
                </span>
                <span className="ml-[calc(18*var(--u))] text-[calc(17*var(--u))] leading-[1.25] font-medium text-[var(--nb-ink)] transition-colors duration-300 group-hover:text-[var(--nb-blue-dark)] [text-shadow:0_0_calc(8*var(--u))_rgba(255,255,255,.95)]">
                  {t.arc[i]![0]}
                  <br />
                  {t.arc[i]![1]}
                </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Chữ sát mép trái 50u */}
          <div className="absolute top-0 left-[calc(50*var(--u))] w-[calc(660*var(--u))]">
            <p className="text-xs font-bold tracking-[0.3em] text-[var(--nb-blue)] uppercase lg:mt-[calc(89*var(--u))] lg:text-[calc(15.5*var(--u))]">
              {t.eyebrow}
            </p>
            <h1 className="mt-5 text-[2.6rem] leading-[1] font-extrabold tracking-[-0.035em] text-white lg:mt-[calc(18*var(--u))] lg:text-[calc(76*var(--u))] lg:leading-[calc(77*var(--u))] [:lang(vi)_&]:lg:leading-[calc(83*var(--u))]">
              {t.h1a}
              <br />
              {t.h1b}
              <br />
              <span className="text-[var(--nb-blue)]">{t.h1accent}</span>
              <span className="text-[var(--nb-orange)]">.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/85 lg:mt-[calc(26*var(--u))] lg:max-w-[calc(560*var(--u))] lg:text-[calc(22*var(--u))] lg:leading-[calc(35*var(--u))]">
              {t.sub}
            </p>
            <div className="mt-8 flex flex-wrap gap-4 lg:mt-[calc(31*var(--u))] lg:gap-[calc(19*var(--u))]">
              <Link
                href={ROUTES.employers[locale] as Route}
                className="inline-flex items-center gap-3 rounded-xl bg-[var(--nb-orange)] px-7 py-4 font-semibold hover:bg-[var(--nb-orange-dark)] lg:h-[calc(69*var(--u))] lg:rounded-[calc(12*var(--u))] lg:px-[calc(36*var(--u))] lg:py-0 lg:text-[calc(19.5*var(--u))]"
              >
                {t.ctaPrimary}
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href={ROUTES.process[locale] as Route}
                className="inline-flex items-center rounded-xl border-2 border-white/90 px-7 py-4 font-medium hover:bg-white/10 lg:h-[calc(69*var(--u))] lg:rounded-[calc(12*var(--u))] lg:px-[calc(40*var(--u))] lg:py-0 lg:text-[calc(19.5*var(--u))]"
              >
                {t.ctaSecondary}
              </Link>
            </div>
          </div>
        </section>

        {/* ---------------- DẢI 4 Ô ---------------- */}
        <section className="bg-[var(--nb-strip)] lg:h-[calc(173*var(--u))]">
          <ul className="grid h-full grid-cols-2 max-sm:gap-y-1 lg:grid-cols-4 lg:px-[calc(45*var(--u))]">
            {t.strip.map(([title, sub], i) => (
              <li
                key={title}
                className={`flex items-center gap-3 px-4 py-5 max-lg:flex-col max-lg:items-start max-lg:gap-2 lg:gap-[calc(28*var(--u))] lg:px-[calc(30*var(--u))] lg:py-0 lg:mt-[calc(34*var(--u))] lg:mb-[calc(64*var(--u))] ${i > 0 ? "lg:border-l lg:border-[var(--nb-line)]" : ""}`}
              >
                <Svg d={STRIP_ICONS[i]} cls="h-9 w-9 shrink-0 text-[var(--nb-ink)] lg:h-[calc(52*var(--u))] lg:w-[calc(52*var(--u))]" />
                <span>
                  <span className="block text-[15px] font-bold text-[var(--nb-ink)] lg:text-[calc(20*var(--u))] lg:whitespace-nowrap">{title}</span>
                  <span className="block text-[13px] leading-[1.35] text-[var(--nb-muted)] lg:text-[calc(16*var(--u))] lg:whitespace-nowrap">{sub}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <LegalStrip locale={locale} />
      <MobileTabBar locale={locale} page={"home"} />
    </>
  );
}

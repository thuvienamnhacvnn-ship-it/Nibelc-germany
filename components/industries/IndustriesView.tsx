import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { LegalStrip } from "@/components/LegalStrip";
import { MobileTabBar } from "@/components/nav/MobileTabBar";
import { Icon } from "@/components/ui/Icon";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { allIndustries, industryAssets, industryName, industryRoles } from "@/content/industries";
import { ROUTES, industryPath, type Locale } from "@/content/locales";
import { navFor, requestLabel } from "@/content/nav-menu";
import { INDUSTRIES_PAGE } from "@/content/page-industries";

/**
 * Trang 04 — screens/04-branchen (2).png. Bố cục bị khoá.
 *
 * Toạ độ desktop (1 --u = 1px ảnh mẫu):
 *   header trắng 0–63
 *   hero 63–340: chữ trái nền sáng, ảnh phải, mảng navy cắt chéo góc phải
 *     (mép chéo từ x≈1640 ở trên xuống x≈1300 ở dưới)
 *   hàng tiêu đề "Unsere Branchen" 340–415, số "8 Kompetenzfelder" bên phải
 *   lưới thẻ 2×4: hàng 1 y 415–617, hàng 2 y 628–834
 *     mỗi thẻ rộng 401u (x 15, 429, 843, 1257), ảnh 140u + thanh trắng 62u
 *   dải 4 ô đáy 848–941 (vạch ngăn x 387, 813, 1223)
 */

const CARD_X = [15, 429, 843, 1257];
const STRIP_W = [387, 426, 410, 449];

export function IndustriesView({ locale }: { locale: Locale }) {
  const t = INDUSTRIES_PAGE[locale];
  const industries = allIndustries();
  const count = industries.length;

  return (
    <>
      <SiteHeader locale={locale} page="industries" variant="light" />
      <main id="inhalt" className="bg-white">
        {/* ---------------- HERO ---------------- */}
        <section className="relative overflow-hidden bg-[#eaf1f8] lg:h-[calc(277*var(--u))]">
          <div className="nb-photo-right absolute inset-y-0 left-[calc(760*var(--u))] hidden lg:block">
            <Image
              src={INDUSTRY_ASSETS["produktion-maschinen-anlagen"]!.portraitTeam}
              alt=""
              fill
              priority
              sizes="55vw"
              className="object-cover"
              style={{ objectPosition: "50% 32%" }}
            />
          </div>
          <div
            className="nb-photo-right absolute inset-y-0 left-0 hidden lg:block"
            style={{
              background:
                "linear-gradient(90deg, #eaf1f8 0, #eaf1f8 calc(760 * var(--u)), rgba(234,241,248,.6) calc(820 * var(--u)), rgba(234,241,248,0) calc(900 * var(--u)))",
            }}
            aria-hidden="true"
          />
          {/* Mảng navy cắt chéo góc phải */}
          <div
            className="nb-photo-right absolute inset-y-0 left-0 hidden bg-[linear-gradient(135deg,#1454b8,#0b3a80)] lg:block"
            style={{
              clipPath:
                "polygon(calc(1640 * var(--u)) 0, 100% 0, 100% 100%, calc(1300 * var(--u)) 100%)",
            }}
            aria-hidden="true"
          />
          <div className="absolute top-[calc(146*var(--u))] left-[calc(1490*var(--u))] hidden text-white lg:block">
            <span className="block h-[calc(4*var(--u))] w-[calc(38*var(--u))] bg-[var(--nb-orange)]" aria-hidden="true" />
            <p className="mt-[calc(16*var(--u))] text-[calc(20*var(--u))] leading-[calc(23*var(--u))] font-bold">
              {t.panel.title[0]}
              <br />
              {t.panel.title[1]}
            </p>
            <p className="text-[calc(18*var(--u))] leading-[calc(23*var(--u))]">
              {t.panel.sub[0]}
              <br />
              {t.panel.sub[1]}
            </p>
          </div>

          <div className="relative px-4 py-10 lg:absolute lg:top-0 lg:left-[calc(49*var(--u))] lg:w-[calc(800*var(--u))] lg:p-0">
            <p className="flex items-center gap-4 text-xs font-semibold tracking-[0.2em] text-[#1d5fd6] uppercase lg:mt-[calc(38*var(--u))] lg:gap-[calc(12*var(--u))] lg:text-[calc(14*var(--u))]">
              {t.eyebrow}
              <span className="h-[2px] w-12 bg-[var(--nb-orange)] lg:w-[calc(46*var(--u))]" aria-hidden="true" />
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.025em] text-[var(--nb-ink)] lg:mt-[calc(10*var(--u))] lg:text-[calc(56*var(--u))] lg:leading-[calc(62*var(--u))]">
              {t.h1}
            </h1>
            <p className="mt-3 text-lg text-[#3a4a5e] lg:mt-[calc(10*var(--u))] lg:text-[calc(20*var(--u))] lg:leading-[calc(27*var(--u))] lg:whitespace-pre-line">
              {t.sub}
            </p>
            <ul className="mt-6 flex flex-wrap gap-6 lg:mt-[calc(26*var(--u))] lg:gap-0">
              {t.trust.map(([a, b], i) => (
                <li
                  key={a}
                  className={`flex items-center gap-3 lg:gap-[calc(14*var(--u))] ${i > 0 ? "lg:border-l lg:border-[#c9d6ea] lg:pl-[calc(32*var(--u))]" : ""}`}
                  style={{ ["--w" as string]: [191, 248, 240][i] } as React.CSSProperties}
                  data-lgw
                >
                  <Icon
                    name={["users", "shield", "chart"][i]!}
                    className="h-10 w-10 shrink-0 text-[#1d5fd6] lg:h-[calc(46*var(--u))] lg:w-[calc(46*var(--u))]"
                    strokeWidth={2.2}
                  />
                  <span className="text-sm font-semibold text-[var(--nb-ink)] lg:text-[calc(16*var(--u))] lg:leading-[calc(20*var(--u))]">
                    {a}
                    <br />
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- TIÊU ĐỀ KHỐI ---------------- */}
        <section className="flex flex-wrap items-center gap-4 px-4 py-6 lg:h-[calc(75*var(--u))] lg:flex-nowrap lg:gap-0 lg:px-[calc(49*var(--u))] lg:py-0">
          <h2 className="text-3xl font-extrabold tracking-[-0.02em] whitespace-nowrap text-[var(--nb-ink)] lg:text-[calc(36*var(--u))]">
            {t.sectionTitle}
          </h2>
          <span className="hidden h-[calc(28*var(--u))] w-px bg-[#c9d6ea] lg:mx-[calc(30*var(--u))] lg:block" aria-hidden="true" />
          <p className="text-sm text-[#3a4a5e] lg:w-[calc(850*var(--u))] lg:text-[calc(14*var(--u))] lg:leading-[calc(19*var(--u))]">
            {t.sectionText}
          </p>
          <p className="flex items-center gap-4 lg:ml-auto lg:gap-[calc(20*var(--u))]">
            <span className="hidden h-px w-[calc(94*var(--u))] bg-[#9fb6d6] lg:block" aria-hidden="true" />
            <span className="text-4xl font-extrabold text-[#1d5fd6] lg:text-[calc(44*var(--u))]">{count}</span>
            <span className="text-[#1d5fd6] lg:text-[calc(18*var(--u))]">{t.fieldsLabel}</span>
          </p>
        </section>

        {/* ---------------- LƯỚI THẺ NGÀNH ---------------- */}
        <section className="px-4 lg:relative lg:h-[calc(433*var(--u))] lg:p-0">
          <ul className="grid gap-4 sm:grid-cols-2 lg:block">
            {industries.map((i, idx) => {
              const blocked = i.status !== "active";
              const row = Math.floor(idx / 4);
              const col = idx % 4;
              const a = industryAssets(i);
              const roles = industryRoles(i, locale);
              const card = (
                <>
                  <span className="relative block aspect-[401/140] overflow-hidden rounded-t-[calc(6*var(--u))] lg:aspect-auto lg:h-[calc(140*var(--u))]">
                    <Image src={a.hero} alt={i.alt.hero} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" style={{ objectPosition: "50% 35%" }} />
                  </span>
                  <span className="flex min-w-0 items-center gap-3 px-4 py-3 lg:h-[calc(62*var(--u))] lg:gap-[calc(22*var(--u))] lg:px-[calc(15*var(--u))] lg:py-0">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0f3470] text-white lg:h-[calc(48*var(--u))] lg:w-[calc(48*var(--u))]">
                      <Icon name={i.icon} className="h-6 w-6 lg:h-[calc(24*var(--u))] lg:w-[calc(24*var(--u))]" strokeWidth={2} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold text-[var(--nb-ink)] lg:text-[calc(18*var(--u))] lg:leading-[calc(22*var(--u))]">
                        {industryName(i, locale)}
                      </span>
                      <span className="block truncate text-sm text-[#5b6b80] lg:text-[calc(13*var(--u))] lg:leading-[calc(18*var(--u))]">
                        {blocked ? t.inPrep : roles.join(", ")}
                      </span>
                    </span>
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c9d6ea] text-[#0f3470] lg:h-[calc(40*var(--u))] lg:w-[calc(40*var(--u))] ${blocked ? "opacity-40" : ""}`}
                      aria-hidden="true"
                    >
                      <Icon name="arrowRight" className="h-5 w-5 lg:h-[calc(18*var(--u))] lg:w-[calc(18*var(--u))]" strokeWidth={2} />
                    </span>
                  </span>
                </>
              );
              const cls =
                "block min-w-0 overflow-hidden rounded-md bg-white shadow-[0_6px_20px_-10px_rgba(15,35,64,.3)] ring-1 ring-[#e3e9f1] lg:absolute lg:w-[calc(401*var(--u))] lg:rounded-[calc(6*var(--u))]";
              const pos = {
                left: `calc(${CARD_X[col]} * var(--u))`,
                top: `calc(${row === 0 ? 0 : 213} * var(--u))`,
              };
              return (
                <li key={i.slug} className="min-w-0 lg:contents">
                  {blocked ? (
                    <div className={cls} style={pos} aria-disabled="true">
                      {card}
                    </div>
                  ) : (
                    <Link href={industryPath(locale, i.slug) as Route} className={`${cls} hover:ring-[#1d5fd6]`} style={pos}>
                      {card}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ---------------- DẢI 4 Ô ĐÁY ---------------- */}
        <section className="bg-[#eaf1f8] lg:h-[calc(93*var(--u))]">
          <ul className="grid gap-4 px-4 py-6 sm:grid-cols-2 lg:flex lg:h-full lg:gap-0 lg:p-0">
            {t.strip.map(([title, sub], i) => (
              <li
                key={sub}
                className={`flex items-center gap-4 lg:h-full lg:gap-[calc(28*var(--u))] ${i === 0 ? "lg:pl-[calc(72*var(--u))]" : "lg:border-l lg:border-[#c9d6ea] lg:pl-[calc(60*var(--u))]"}`}
                style={{ ["--w" as string]: STRIP_W[i] } as React.CSSProperties}
                  data-lgw
              >
                <Icon
                  name={["users", "globe", "handshake", "germany"][i]!}
                  className="h-10 w-10 shrink-0 text-[#1d5fd6] lg:h-[calc(52*var(--u))] lg:w-[calc(52*var(--u))]"
                  strokeWidth={i === 0 ? 2.2 : 1.6}
                />
                <span>
                  <span className={`block font-bold text-[var(--nb-ink)] ${i === 0 ? "lg:text-[calc(22*var(--u))]" : "lg:text-[calc(18*var(--u))]"}`}>
                    {i === 0 ? count : title}
                  </span>
                  <span className="block text-sm text-[#5b6b80] lg:text-[calc(15*var(--u))]">{sub}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <LegalStrip locale={locale} />
      <MobileTabBar locale={locale} page={"industries"} />
    </>
  );
}

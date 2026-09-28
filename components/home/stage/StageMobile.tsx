"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useCallback, useEffect, useRef, useState } from "react";
import { Fact, Flag, FlagVN } from "@/components/home/stage/StageBits";
import { Icon } from "@/components/ui/Icon";
import { activeIndustries, industryName } from "@/content/industries";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { STAGE } from "@/content/home-stage";
import { stageCards } from "@/content/jobs-stage";
import { LOCALES, ROUTES, industryPath, type Locale } from "@/content/locales";
import { mainMenu } from "@/content/nav-menu";

/**
 * BANNER TRANG CHỦ — BẢN ĐIỆN THOẠI.
 *
 * Dựng theo ảnh mẫu 941×1672 Sếp gửi 27/09/2026. 1 đơn vị = 1px ảnh mẫu, quy ra
 * CSS bằng `--um` (bề ngang màn hình chia 941) nên mọi khoảng cách co giãn đúng
 * tỷ lệ mẫu trên mọi cỡ máy.
 *
 * Thứ tự đúng như mẫu: thanh trên (logo · tìm · ngôn ngữ · menu) → chữ lớn →
 * ô tìm hai cột → ba thẻ đơn hàng (thẻ giữa to, hai thẻ bên ló ra) → hàng tiến
 * trình → hàng ngành nghề cuộn ngang → dải hành trình.
 *
 * Menu đáy không nằm trong đây: đó là `MobileTabBar`, dùng chung cho mọi trang.
 */

const u = (n: number) => `calc(${n} * var(--um))`;

/** Khung gốc của thẻ và tâm thẻ ở từng ô, đo trên ảnh mẫu 941 rộng. */
const BASE = { x: 232, w: 478, h: 748 };
const CX = BASE.x + BASE.w / 2;
const CY = BASE.h / 2;
const SLOT: Record<number, { cx: number; cy: number; s: number; rot: number; z: number; dim: number; op: number }> = {
  0: { cx: 471, cy: 374, s: 1, rot: 0, z: 30, dim: 0, op: 1 },
  [-1]: { cx: 78, cy: 424, s: 0.47, rot: -16, z: 20, dim: 0.22, op: 1 },
  1: { cx: 864, cy: 424, s: 0.47, rot: 16, z: 20, dim: 0.22, op: 1 },
  [-2]: { cx: -230, cy: 452, s: 0.34, rot: -22, z: 10, dim: 0.4, op: 0 },
  2: { cx: 1172, cy: 452, s: 0.34, rot: 22, z: 10, dim: 0.4, op: 0 },
};

/** Khoảng cách được dựng ra DOM; ±2 nằm ngoài màn hình để thẻ bay vào, bay ra. */
const RANGE = [-2, -1, 0, 1, 2];
const EUR = (n: number) => n.toLocaleString("de-DE");

const CHIP_ICON: Record<string, string> = {
  "gastronomie-koch": "utensils",
  "baeckerei-baecker": "bread",
  "fleischerei-fleischer": "meat",
  "elektrotechnik-elektroniker": "bolt",
  "logistik-fachkraft-lagerlogistik": "box",
  "gartenbau-gaertner": "sprout",
  "produktion-maschinen-anlagen": "factory",
};

export function StageMobile({ locale }: { locale: Locale }) {
  const t = STAGE[locale];
  const titleSize = locale === "vi" ? 84 : locale === "en" ? 72 : 62;
  const jobs = stageCards(locale);
  const n = jobs.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lang, setLang] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const firstRun = useRef(true);
  const [menu, setMenu] = useState(false);

  const go = useCallback((d: number) => setActive((i) => (i + d + n) % n), [n]);

  useEffect(() => {
    if (paused || n < 2) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % n), 6500);
    return () => window.clearInterval(id);
  }, [paused, n]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
  }, []);

  /* Ảnh trên thẻ lật trọn một vòng mỗi lần đổi đơn — xem ghi chú bản desktop. */
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    stageRef.current?.querySelectorAll<HTMLElement>(".nb-card-media").forEach((el, k) => {
      el.animate([{ transform: "rotateY(0deg)" }, { transform: "rotateY(360deg)" }], {
        duration: 900,
        delay: k * 45,
        easing: "cubic-bezier(.45,0,.2,1)",
      });
    });
  }, [active]);

  /** Vuốt ngang để đổi thẻ */
  const [x0, setX0] = useState<number | null>(null);


  return (
    <section className="relative isolate overflow-hidden bg-[var(--nb-stage-navy)] text-white lg:hidden">
      <Image
        src="/kit/banner/stage-mobile.jpg"
        alt=""
        fill
        priority
        quality={92}
        sizes="100vw"
        className="-z-10 object-cover object-top"
      />
      <span
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(3,8,18,.72) 0, rgba(3,8,18,.26) 18%, rgba(3,8,18,.42) 44%, rgba(3,8,18,.78) 70%, rgba(3,8,18,.94) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Khung nội dung: rộng đúng 941u, tự căn giữa khi máy rộng hơn mức cắt. */}
      <div className="relative mx-auto" style={{ width: u(941) }}>
      {/* ---------------- THANH TRÊN ---------------- */}
      <div className="flex items-center justify-between" style={{ height: u(104), paddingInline: u(28) }}>
        <Link href={ROUTES.home[locale] as Route} aria-label="NIBELC" className="flex items-center">
          <Image
            src="/nibelc-logo-dark.svg"
            alt="NIBELC GmbH"
            width={1201}
            height={376}
            priority
            style={{ height: u(46), width: "auto" }}
          />
        </Link>

        <div className="flex items-center" style={{ gap: u(26) }}>
          <Link href={ROUTES.jobs[locale] as Route} aria-label={t.search}>
            <Icon name="search" style={{ width: u(34), height: u(34) }} strokeWidth={1.9} />
          </Link>
          <span className="block bg-white/25" style={{ width: 1, height: u(30) }} aria-hidden="true" />
          <div className="relative">
            <button
              type="button"
              onClick={() => setLang((v) => !v)}
              aria-expanded={lang}
              className="flex items-center font-semibold"
              style={{ gap: u(10), fontSize: u(26) }}
            >
              {locale === "vi" ? <FlagVN size={u(32)} /> : <Flag colors={["#111111","#dd0000","#ffce00"]} size={u(32)} />}
              {locale.toUpperCase()}
              <Icon name="chevronDown" style={{ width: u(22), height: u(22) }} strokeWidth={2.2} />
            </button>
            {lang && (
              <ul
                className="absolute right-0 z-50 overflow-hidden rounded-xl bg-white text-[var(--nb-ink)] shadow-lg"
                style={{ top: u(46), minWidth: u(220), fontSize: u(24) }}
              >
                {LOCALES.map((l) => (
                  <li key={l}>
                    <Link
                      href={ROUTES.home[l] as Route}
                      hrefLang={l}
                      onClick={() => setLang(false)}
                      className={`block ${l === locale ? "font-bold" : ""}`}
                      style={{ paddingInline: u(20), paddingBlock: u(14) }}
                    >
                      {l === "de" ? "Deutsch" : l === "en" ? "English" : "Tiếng Việt"}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="button"
            onClick={() => setMenu((v) => !v)}
            aria-expanded={menu}
            aria-label="Menu"
          >
            <Icon name={menu ? "close" : "burger"} style={{ width: u(38), height: u(38) }} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Menu đầy đủ — thanh đáy chỉ có sáu điểm đến chính nên phần còn lại
          (dịch vụ, kiến thức, về chúng tôi…) mở ở đây. */}
      {menu && (
        <nav
          className="absolute inset-x-0 z-50 bg-[#061225]/97 backdrop-blur"
          style={{ top: u(104), paddingInline: u(34), paddingBlock: u(20), borderBlock: "1px solid rgba(232,194,102,.3)" }}
        >
          <ul>
            {mainMenu(locale).map((m) => (
              <li key={m.label}>
                <Link
                  href={m.href as Route}
                  onClick={() => setMenu(false)}
                  className="block border-b border-white/10 font-semibold text-white"
                  style={{ fontSize: u(28), paddingBlock: u(20) }}
                >
                  {m.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* ---------------- CHỮ LỚN ---------------- */}
      <div style={{ paddingInline: u(34), marginTop: u(14) }}>
        <p className="font-semibold text-white/85 uppercase" style={{ fontSize: u(26), letterSpacing: u(10) }}>
          {t.eyebrow}
        </p>
        <h1 className="font-[family-name:var(--font-serif)] font-bold" style={{ marginTop: u(8) }}>
          <span className="nb-gold-text block" style={{ fontSize: u(titleSize), lineHeight: u(titleSize * 1.1) }}>
            {t.title[0]}
          </span>
          <span className="nb-gold-text block" style={{ fontSize: u(titleSize), lineHeight: u(titleSize * 1.1) }}>
            {t.title[1]}
          </span>
        </h1>
        <p className="text-white/85" style={{ marginTop: u(14), fontSize: u(28), lineHeight: u(40) }}>
          {t.sub[0]}
          <br />
          {t.sub[1]}
        </p>
      </div>

      {/* ---------------- Ô TÌM ---------------- */}
      <form
        action={ROUTES.jobs[locale]}
        className="flex items-center bg-white"
        style={{ margin: `${u(26)} ${u(34)} 0`, height: u(104), borderRadius: u(22), padding: u(8) }}
      >
        <span className="flex min-w-0 flex-1 items-center" style={{ gap: u(10), paddingInline: u(14) }}>
          <Icon name="pin" className="shrink-0 text-[#8a97a8]" style={{ width: u(28), height: u(28) }} strokeWidth={1.8} />
          <select
            name="land"
            aria-label={t.searchCountry}
            className="min-w-0 flex-1 appearance-none bg-transparent text-[#5b6b80] outline-none"
            style={{ fontSize: u(26) }}
          >
            <option value="">{t.searchCountry}</option>
            <option value="de">{t.country}</option>
          </select>
          <Icon name="chevronDown" className="shrink-0 text-[#8a97a8]" style={{ width: u(24), height: u(24) }} strokeWidth={2} />
        </span>
        <span className="block bg-[#e3e9f1]" style={{ width: 1, height: u(48) }} aria-hidden="true" />
        <span className="flex min-w-0 flex-1 items-center" style={{ gap: u(10), paddingInline: u(14) }}>
          <Icon name="briefcase" className="shrink-0 text-[#8a97a8]" style={{ width: u(28), height: u(28) }} strokeWidth={1.8} />
          <select
            name="branche"
            aria-label={t.searchField}
            className="min-w-0 flex-1 appearance-none bg-transparent text-[#5b6b80] outline-none"
            style={{ fontSize: u(26) }}
          >
            <option value="">{t.searchField}</option>
            {activeIndustries().map((i) => (
              <option key={i.slug} value={i.slug}>
                {industryName(i, locale)}
              </option>
            ))}
          </select>
          <Icon name="chevronDown" className="shrink-0 text-[#8a97a8]" style={{ width: u(24), height: u(24) }} strokeWidth={2} />
        </span>
        <button
          type="submit"
          aria-label={t.search}
          className="nb-gold-btn flex shrink-0 items-center justify-center"
          style={{ width: u(156), height: u(88), borderRadius: u(18) }}
        >
          <Icon name="search" style={{ width: u(34), height: u(34) }} strokeWidth={2.1} />
        </button>
      </form>

      {/* ---------------- BA THẺ ĐƠN HÀNG ---------------- */}
      <div
        ref={stageRef}
        className="relative"
        style={{ height: u(752), marginTop: u(22), perspective: u(1400) }}
        onPointerDown={(e) => {
          setX0(e.clientX);
          setPaused(true);
        }}
        onPointerUp={(e) => {
          if (x0 !== null && Math.abs(e.clientX - x0) > 40) go(e.clientX < x0 ? 1 : -1);
          setX0(null);
        }}
      >
        {RANGE.map((d) => {
          const i = (((active + d) % n) + n) % n;
          const j = jobs[i]!;
          const img = j.image;
          const center = d === 0;
          const pos = d === 0 ? 0 : d < 0 ? 1 : 2;
          return (
            <Link
              /* Khoá theo đơn hàng, không theo ô — xem ghi chú ở bản desktop. */
              key={j.id}
              href={`${ROUTES.jobs[locale]}#${j.id}` as Route}
              aria-hidden={!center}
              tabIndex={center ? undefined : -1}
              onClick={(e) => {
                if (!center) {
                  e.preventDefault();
                  setActive(i);
                }
              }}
              data-center={center}
              className="nb-stage-card absolute top-0 block overflow-hidden"
              style={{
                left: u(BASE.x),
                width: u(BASE.w),
                height: u(BASE.h),
                zIndex: SLOT[d]!.z,
                opacity: SLOT[d]!.op,
                pointerEvents: SLOT[d]!.op === 0 ? "none" : undefined,
                borderRadius: u(26),
                transform: `translate3d(calc(${SLOT[d]!.cx - CX} * var(--um)), calc(${SLOT[d]!.cy - CY} * var(--um)), 0) rotateY(${SLOT[d]!.rot}deg) scale(${SLOT[d]!.s})`,
                boxShadow: center
                  ? `0 ${u(34)} ${u(64)} rgba(0,0,0,.62), 0 ${u(10)} ${u(22)} rgba(0,0,0,.45)`
                  : `0 ${u(30)} ${u(56)} rgba(0,0,0,.5)`,
              }}
            >
              <span className="nb-card-media relative block overflow-hidden" style={{ height: u(300) }}>
                <Image src={img} alt="" fill sizes="60vw" className="object-cover" style={{ objectPosition: j.focus }} />
                <span
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg, rgba(5,14,29,.1) 0, rgba(5,14,29,.35) 58%, rgba(5,14,29,.96) 100%)" }}
                  aria-hidden="true"
                />
                <span
                  className="absolute font-[family-name:var(--font-serif)] font-bold text-white/30"
                  style={{ right: u(20), top: u(8), fontSize: u(86), lineHeight: 1.1 }}
                  aria-hidden="true"
                >
                  {String(pos + 1).padStart(2, "0")}
                </span>
              </span>

              <span className="relative block" style={{ padding: u(26), paddingTop: u(4) }}>
                <span className="flex items-center" style={{ gap: u(10) }}>
                  <Flag colors={j.flag} size={u(32)} />
                  <span className="font-semibold text-white/85" style={{ fontSize: u(26) }}>
                    {j.countryName}
                  </span>
                </span>
                <b
                  className="block overflow-hidden font-bold text-white"
                  style={{
                    fontSize: u(36),
                    lineHeight: u(44),
                    marginTop: u(12),
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                  }}
                >
                  {j.title}
                </b>
                <span className="flex items-baseline" style={{ gap: u(10), marginTop: u(14) }}>
                  <span
                    className="flex shrink-0 items-center justify-center rounded-full border border-[var(--nb-gold-line)] text-[var(--nb-gold)]"
                    style={{ width: u(34), height: u(34), fontSize: u(20) }}
                  >
                    €
                  </span>
                  <b className="font-bold whitespace-nowrap text-[var(--nb-gold)]" style={{ fontSize: u(36) }}>
                    {j.salary.from === j.salary.to
                      ? `${EUR(j.salary.from)} €`
                      : `${EUR(j.salary.from)} – ${EUR(j.salary.to)} €`}
                  </b>
                </span>

                <span className="block bg-white/15" style={{ height: 1, marginBlock: u(18) }} aria-hidden="true" />
                <span className="flex items-center justify-between" style={{ gap: u(8) }}>
                  {j.facts.map((ft) => (
                    <Fact key={ft.label} icon={ft.icon} value={ft.value} label={ft.label} u={u} />
                  ))}
                </span>
                {/* Nút chỉ sáng ở thẻ giữa nhưng vẫn chiếm chỗ ở thẻ bên, để mọi
                    thẻ chung một bố cục — chuyển cảnh khi đó chỉ là transform. */}
                <span
                  className="nb-gold-btn flex items-center justify-center transition-opacity duration-500"
                  style={{ marginTop: u(22), height: u(84), gap: u(12), fontSize: u(30), borderRadius: u(18), opacity: center ? 1 : 0 }}
                >
                  {t.detail}
                  <Icon name="arrowRight" style={{ width: u(28), height: u(28) }} strokeWidth={2.2} />
                </span>
              </span>
            </Link>
          );
        })}

        {n > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={t.prev}
              className="nb-stage-arrow absolute"
              style={{ left: u(18), top: u(360), width: u(76), height: u(76), zIndex: 40 }}
            >
              <Icon name="chevronRight" style={{ width: u(30), height: u(30), transform: "rotate(180deg)" }} strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={t.next}
              className="nb-stage-arrow absolute"
              style={{ right: u(18), top: u(360), width: u(76), height: u(76), zIndex: 40 }}
            >
              <Icon name="chevronRight" style={{ width: u(30), height: u(30) }} strokeWidth={2} />
            </button>
          </>
        )}
      </div>

      {/* ---------------- HÀNG TIẾN TRÌNH ---------------- */}
      <div className="flex items-center" style={{ paddingInline: u(34), marginTop: u(26), gap: u(26) }}>
        <span className="shrink-0 font-semibold">
          <b className="text-white" style={{ fontSize: u(40) }}>
            {String(active + 1).padStart(2, "0")}
          </b>
          <span className="text-white/45" style={{ fontSize: u(28) }}> / {n}</span>
        </span>
        <span className="relative flex flex-1 items-center" style={{ height: u(6) }}>
          <span className="absolute inset-x-0 rounded-full bg-white/20" style={{ height: u(6) }} aria-hidden="true" />
          <span
            className="absolute left-0 rounded-full bg-white transition-[width] duration-500"
            style={{ height: u(6), width: `${((active + 1) / n) * 100}%` }}
            aria-hidden="true"
          />
          {jobs.map((j, i) => (
            <button
              key={j.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={j.title}
              className="absolute -translate-x-1/2 rounded-full"
              style={{
                left: `${((i + 1) / n) * 100}%`,
                width: u(16),
                height: u(16),
                background: i <= active ? "#fff" : "rgba(255,255,255,.35)",
              }}
            />
          ))}
        </span>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? t.play : t.pause}
          className="nb-stage-arrow shrink-0"
          style={{ width: u(68), height: u(68) }}
        >
          <Icon name={paused ? "play" : "pause"} style={{ width: u(26), height: u(26) }} strokeWidth={2} />
        </button>
      </div>

      {/* ---------------- HÀNG NGÀNH NGHỀ ---------------- */}
      <ul
        className="flex overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ gap: u(16), padding: `${u(26)} ${u(24)} 0`, scrollPaddingInline: u(24) }}
      >
        {activeIndustries().map((ind) => {
          const on = false;
          return (
            <li key={ind.slug} className="shrink-0">
              <Link
                href={industryPath(locale, ind.slug) as Route}
                className="flex flex-col items-center justify-center text-center"
                style={{
                  width: u(156),
                  height: u(136),
                  gap: u(10),
                  borderRadius: u(18),
                  border: `1px solid ${on ? "var(--nb-gold)" : "rgba(255,255,255,.16)"}`,
                  background: on ? "rgba(232,194,102,.12)" : "rgba(10,22,42,.6)",
                  paddingInline: u(10),
                }}
              >
                <Icon
                  name={CHIP_ICON[ind.slug] ?? "grid"}
                  className="shrink-0 text-[var(--nb-gold)]"
                  style={{ width: u(40), height: u(40) }}
                  strokeWidth={1.7}
                />
                <span
                  className="overflow-hidden font-semibold text-white"
                  style={{
                    fontSize: u(19),
                    lineHeight: u(24),
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                  }}
                >
                  {industryName(ind, locale)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* ---------------- DẢI HÀNH TRÌNH ---------------- */}
      <Link
        href={ROUTES.process[locale] as Route}
        className="relative flex items-center overflow-hidden"
        style={{
          margin: `${u(26)} ${u(24)} ${u(30)}`,
          height: u(172),
          borderRadius: u(20),
          border: "1px solid rgba(232,194,102,.28)",
          gap: u(20),
          paddingInline: u(22),
        }}
      >
        <Image
          src={INDUSTRY_ASSETS["akademische-fachkraefte"]!.hero}
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover object-[70%_35%]"
        />
        <span
          className="absolute inset-0 -z-10"
          style={{ background: "linear-gradient(90deg, rgba(5,14,29,.96) 0, rgba(5,14,29,.82) 52%, rgba(5,14,29,.25) 100%)" }}
          aria-hidden="true"
        />
        <span
          className="flex shrink-0 items-center justify-center rounded-full bg-[var(--nb-gold)] text-[#231a05]"
          style={{ width: u(74), height: u(74) }}
        >
          <Icon name="plane" style={{ width: u(36), height: u(36) }} strokeWidth={1.8} />
        </span>
        <span className="min-w-0">
          <b className="block font-bold text-white" style={{ fontSize: u(30), lineHeight: u(38) }}>
            {t.journey[0]}
            <br />
            {t.journey[1]}
          </b>
          <span className="block text-white/70" style={{ fontSize: u(24), marginTop: u(6) }}>
            {t.journeySub}
          </span>
        </span>
      </Link>
      </div>
    </section>
  );
}

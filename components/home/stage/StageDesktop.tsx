"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Fact, Flag } from "@/components/home/stage/StageBits";
import { Icon } from "@/components/ui/Icon";
import { STAGE } from "@/content/home-stage";
import { stageCards } from "@/content/jobs-stage";
import { LOCALES, ROUTES, type Locale, type PageKey } from "@/content/locales";
import { mainMenu, requestLabel } from "@/content/nav-menu";

/**
 * BANNER TRANG CHỦ — BẢN DESKTOP.
 *
 * Dựng theo ảnh mẫu 1672×941 Sếp gửi 27/09/2026. 1 đơn vị dưới đây = 1px của
 * ảnh mẫu, quy ra CSS bằng `--ub` (tính trên toàn bề ngang màn hình, không trừ
 * lề trang) nên banner luôn phủ kín mép và giữ đúng tỷ lệ mẫu.
 *
 * Sân khấu luôn có đủ NĂM thẻ: thẻ giữa to nhất, hai thẻ trong nhỏ hơn, hai
 * thẻ ngoài cùng nhỏ nhất và chỉ còn ảnh, tên nghề, mức lương. Danh sách đơn
 * hàng chạy vòng tròn nên ô nào cũng có nội dung.
 *
 * Toạ độ đọc thẳng từ ảnh mẫu:
 *   thanh menu 0–80 · chữ lớn x110 y84 · sân khấu thẻ y92–740
 *   thẻ giữa x645 rộng 462 · hai thẻ trong x396/x1116 · hai thẻ ngoài x212/x1382
 *   mũi tên tâm y540 · hàng tiến trình y772 · dải 5 ô y824–926
 */

const u = (n: number) => `calc(${n} * var(--us))`;

/** Ô nào ứng với số mấy trên ảnh mẫu: giữa là 01, rồi lan dần ra hai bên. */
const POS: Record<number, number> = { 0: 1, [-1]: 2, 1: 3, [-2]: 4, 2: 5 };

/** Các khoảng cách được dựng ra DOM. ±3 nằm ngoài sân khấu, để thẻ có chỗ
 *  bay vào và bay ra thay vì hiện ra đột ngột ở rìa. */
const RANGE = [-3, -2, -1, 0, 1, 2, 3];

/** Khung gốc của thẻ — mọi thẻ đều có đúng khung này, chỉ khác phép biến đổi. */
const BASE = { x: 645, y: 92, w: 462, h: 648 };
const CX = BASE.x + BASE.w / 2;
const CY = BASE.y + BASE.h / 2;

/** Tâm thẻ ở từng ô, đo trên ảnh mẫu, kèm cỡ thu nhỏ và góc xoay. */
const SLOT: Record<number, { cx: number; cy: number; s: number; rot: number; z: number; dim: number; op: number }> = {
  0: { cx: 876, cy: 416, s: 1, rot: 0, z: 40, dim: 0, op: 1 },
  [-1]: { cx: 524, cy: 500, s: 0.58, rot: -15, z: 30, dim: 0.18, op: 1 },
  1: { cx: 1244, cy: 514, s: 0.58, rot: 15, z: 30, dim: 0.18, op: 1 },
  [-2]: { cx: 308, cy: 569, s: 0.42, rot: -22, z: 20, dim: 0.36, op: 1 },
  2: { cx: 1479, cy: 557, s: 0.42, rot: 22, z: 20, dim: 0.36, op: 1 },
  [-3]: { cx: 110, cy: 600, s: 0.3, rot: -28, z: 10, dim: 0.5, op: 0 },
  3: { cx: 1660, cy: 592, s: 0.3, rot: 28, z: 10, dim: 0.5, op: 0 },
};

const EUR = (n: number) => n.toLocaleString("de-DE");

/** Icon của từng mục trên thanh menu đáy banner */
const MENU_ICON: Partial<Record<PageKey, string>> = {
  home: "home",
  employers: "building",
  candidates: "users",
  industries: "grid",
  process: "doc",
  knowledge: "book",
  about: "handshake",
};

export function StageDesktop({ locale }: { locale: Locale }) {
  const t = STAGE[locale];
  const cards = useMemo(() => stageCards(locale), [locale]);
  const menu = useMemo(() => mainMenu(locale), [locale]);
  const n = cards.length;
  const titleSize = locale === "vi" ? 68 : locale === "en" ? 58 : 50;

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const firstRun = useRef(true);

  const go = useCallback((d: number) => setActive((i) => (i + d + n) % n), [n]);

  useEffect(() => {
    if (paused || n < 2) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % n), 6500);
    return () => window.clearInterval(id);
  }, [paused, n]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
  }, []);

  /* Trang chủ đứng yên: cả banner đã vừa một khung hình nên không cho cuộn.
     Chỉ khoá từ 1024px trở lên; điện thoại nội dung dài hơn màn hình nên vẫn
     phải cuộn được. Khoá bằng class chứ không bằng :has — :has phụ thuộc vào
     cây DOM, đổi bố cục một chút là hết ăn. */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => document.documentElement.classList.toggle("nb-lock", mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      document.documentElement.classList.remove("nb-lock");
    };
  }, []);

  /* Mỗi lần đổi đơn, HAI board hai bên board chính quay trọn một vòng 360°
     trong lúc trượt sang ô mới. Board giữa đứng yên cho người đọc kịp nhìn.

     Phép quay đặt lên tấm board bên trong, còn phép trượt giữa các ô đặt lên
     cái khung bọc ngoài: hai transform ở hai phần tử khác nhau thì mới cộng
     được với nhau. Để chung một phần tử thì animation sẽ đè mất transform của
     ô, board nhảy về gốc rồi mới quay. */
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    stageRef.current
      ?.querySelectorAll<HTMLElement>('[data-slot="-1"] .nb-stage-card, [data-slot="1"] .nb-stage-card')
      .forEach((el) => {
        el.animate([{ transform: "rotateY(0deg)" }, { transform: "rotateY(360deg)" }], {
          duration: 850,
          easing: "cubic-bezier(.32,.72,0,1)",
        });
      });
  }, [active]);

  return (
    <section
      data-stage
      className="relative hidden bg-[#050e1d] text-white lg:block"
      style={{ height: u(941) }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Nền phủ kín hai mép màn hình, bất kể lề trang */}
      <div className="absolute inset-y-0 right-[calc(-1*var(--nb-gutter))] left-[calc(-1*var(--nb-gutter))]">
        <Image
          src="/kit/banner/stage-desktop.jpg"
          alt=""
          fill
          priority
          quality={92}
          sizes="100vw"
          className="object-cover"
        />
        <span
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(3,8,18,.9) 0, rgba(3,8,18,.55) 22%, rgba(3,8,18,.3) 42%, rgba(3,8,18,.5) 72%, rgba(3,8,18,.88) 100%), linear-gradient(180deg, rgba(3,8,18,.8) 0, rgba(3,8,18,.28) 14%, rgba(3,8,18,.26) 58%, rgba(3,8,18,.72) 84%, rgba(3,8,18,.95) 100%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Khung nội dung đúng 1672u, căn giữa — thu nhỏ theo --us nên luôn vừa
          một khung hình kể cả màn hình thấp. */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2" style={{ width: u(1672) }}>
        {/* ---------------- CHỮ LỚN ---------------- */}
        <div className="absolute" style={{ left: u(110), top: u(36), width: u(560) }}>
          {/* Logo nay đứng ngay trên tiêu đề chính, không còn trên thanh header */}
          <Link href={ROUTES.home[locale] as Route} aria-label="NIBELC" className="mb-[calc(10*var(--us))] block">
            <Image
              src="/nibelc-logo-dark.svg"
              alt="NIBELC GmbH"
              width={1201}
              height={376}
              priority
              style={{ height: u(40), width: "auto" }}
            />
          </Link>
          <p className="font-semibold text-white/85 uppercase" style={{ fontSize: u(15), letterSpacing: u(6) }}>
            {t.eyebrow}
          </p>
          <h1 className="font-[family-name:var(--font-serif)] font-bold" style={{ marginTop: u(6) }}>
            <span className="nb-gold-text block" style={{ fontSize: u(titleSize), lineHeight: u(titleSize * 1.04) }}>
              {t.title[0]}
            </span>
            <span className="nb-gold-text block" style={{ fontSize: u(titleSize), lineHeight: u(titleSize * 1.08) }}>
              {t.title[1]}
            </span>
          </h1>
          {/* Dòng phụ hẹp hơn tiêu đề: thẻ bên trái bắt đầu ở x=396, câu tiếng
              Đức dài sẽ chui xuống dưới thẻ nếu để rộng bằng tiêu đề. */}
          <p className="text-white/85" style={{ marginTop: u(8), fontSize: u(19), lineHeight: u(27), maxWidth: u(286) }}>
            {t.sub[0]}
            <br />
            {t.sub[1]}
          </p>
          <Link
            href={ROUTES.jobs[locale] as Route}
            className="nb-gold-pill group inline-flex items-center justify-between"
            style={{ marginTop: u(10), height: u(50), width: u(280), paddingLeft: u(22), paddingRight: u(6), fontSize: u(16) }}
          >
            {t.cta}
            <span
              className="flex items-center justify-center rounded-full bg-[#1b1405] text-[var(--nb-gold)] transition group-hover:translate-x-[2px]"
              style={{ width: u(38), height: u(38) }}
            >
              <Icon name="arrowRight" style={{ width: u(18), height: u(18) }} strokeWidth={2} />
            </span>
          </Link>
        </div>

        {/* ---------------- SÂN KHẤU THẺ ---------------- */}
        <div ref={stageRef} className="absolute inset-0" style={{ perspective: u(1600) }}>
          {RANGE.map((d) => {
            const s = SLOT[d]!;
            const i = (((active + d) % n) + n) % n;
            const card = cards[i]!;
            const center = d === 0;
            const pos = (POS[d] ?? 6) - 1;

            return (
              <Link
                /* Khoá theo ĐƠN HÀNG chứ không theo ô: có vậy khi đổi thẻ,
                   React mới giữ nguyên phần tử cũ và để CSS đưa nó sang ô mới.
                   Khoá theo ô thì nó chỉ thay chữ tại chỗ, không hề chuyển động. */
                key={card.id}
                href={`${ROUTES.jobs[locale]}#${card.id}` as Route}
                aria-hidden={!center}
                tabIndex={center ? undefined : -1}
                onClick={(e) => {
                  if (!center) {
                    e.preventDefault();
                    setActive(i);
                  }
                }}
                data-slot={d}
                className="nb-stage-frame absolute block"
                style={{
                  left: u(BASE.x),
                  top: u(BASE.y),
                  width: u(BASE.w),
                  height: u(BASE.h),
                  zIndex: s.z,
                  opacity: s.op,
                  pointerEvents: s.op === 0 ? "none" : undefined,
                  perspective: u(1100),
                  transform: `translate3d(calc(${s.cx - CX} * var(--us)), calc(${s.cy - CY} * var(--us)), 0) rotateY(${s.rot}deg) scale(${s.s})`,
                }}
              >
                <span
                  data-center={center}
                  className="nb-stage-card absolute inset-0 block overflow-hidden"
                  style={{
                    borderRadius: u(26),
                    boxShadow: center
                      ? `0 ${u(34)} ${u(70)} rgba(0,0,0,.62), 0 ${u(8)} ${u(20)} rgba(0,0,0,.45)`
                      : `0 ${u(30)} ${u(60)} rgba(0,0,0,.5)`,
                  }}
                >
                <span className="relative block overflow-hidden" style={{ height: u(BASE.h - 336) }}>
                  <Image
                    src={card.image}
                    alt=""
                    fill
                    sizes="50vw"
                    className="object-cover"
                    style={{ objectPosition: card.focus }}
                  />
                  <span
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(180deg, rgba(5,14,29,.12) 0, rgba(5,14,29,.32) 52%, rgba(5,14,29,.95) 100%)" }}
                    aria-hidden="true"
                  />
                  <span
                    className="absolute font-[family-name:var(--font-serif)] font-bold text-white/30"
                    style={{ right: u(26), top: u(8), fontSize: u(86), lineHeight: 1.1 }}
                    aria-hidden="true"
                  >
                    {String(pos + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="absolute font-semibold tracking-[0.3em] text-white/45 uppercase transition-opacity duration-500"
                    style={{ right: u(14), top: u(120), fontSize: u(12), writingMode: "vertical-rl", opacity: center ? 1 : 0 }}
                    aria-hidden="true"
                  >
                    {card.countryName}
                  </span>
                </span>

                <span className="relative block" style={{ padding: u(24), paddingTop: u(4) }}>
                  <span className="flex items-center" style={{ gap: u(10) }}>
                    <Flag colors={card.flag} size={u(22)} />
                    <span className="font-semibold text-white/80" style={{ fontSize: u(15) }}>
                      {card.countryName}
                    </span>
                  </span>
                  <b
                    className="block overflow-hidden font-bold text-white"
                    style={{
                      fontSize: u(27),
                      lineHeight: u(34),
                      marginTop: u(10),
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                    }}
                  >
                    {card.title}
                  </b>

                  <span className="flex items-baseline" style={{ gap: u(8), marginTop: u(12) }}>
                    <span
                      className="flex shrink-0 items-center justify-center rounded-full border border-[var(--nb-gold-line)] text-[var(--nb-gold)]"
                      style={{ width: u(26), height: u(26), fontSize: u(14) }}
                    >
                      €
                    </span>
                    <b
                      className="font-bold whitespace-nowrap text-[var(--nb-gold)]"
                      style={{ fontSize: u(25) }}
                    >
                      {card.salary.from === card.salary.to
                        ? `${EUR(card.salary.from)} €`
                        : `${EUR(card.salary.from)} – ${EUR(card.salary.to)} €`}
                    </b>
                    <span className="text-white/60" style={{ fontSize: u(16) }}>
                      {t.perMonth}
                    </span>
                  </span>

                  {card.facts.length > 0 && (
                    <>
                      <span
                        className="block bg-white/15"
                        style={{ height: 1, marginTop: u(16), marginBottom: u(14) }}
                        aria-hidden="true"
                      />
                      <span className="flex items-center justify-between" style={{ gap: u(10) }}>
                        {card.facts.map((f) => (
                          <Fact key={f.label} icon={f.icon} value={f.value} label={f.label} u={u} />
                        ))}
                      </span>
                    </>
                  )}

                  {/* Nút chỉ sáng ở thẻ giữa nhưng vẫn chiếm chỗ ở thẻ bên, để
                      mọi thẻ chung một bố cục — có vậy mới chuyển cảnh được
                      bằng mỗi transform, không phải dựng lại bố cục mỗi khung. */}
                  <span
                    className="nb-gold-btn flex items-center justify-center transition-opacity duration-500"
                    style={{ marginTop: u(20), height: u(56), gap: u(10), fontSize: u(18), opacity: center ? 1 : 0 }}
                  >
                    {t.detail}
                    <Icon name="arrowRight" style={{ width: u(18), height: u(18) }} strokeWidth={2.2} />
                  </span>
                </span>

                {s.dim > 0 && (
                  <span className="absolute inset-0" style={{ background: `rgba(5,12,25,${s.dim})` }} aria-hidden="true" />
                )}
                </span>
              </Link>
            );
          })}
        </div>

        {/* ---------------- HAI MŨI TÊN ---------------- */}
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label={t.prev}
          className="nb-stage-arrow absolute"
          style={{ left: u(74), top: u(510), width: u(62), height: u(62), zIndex: 45 }}
        >
          <Icon name="chevronRight" style={{ width: u(24), height: u(24), transform: "rotate(180deg)" }} strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label={t.next}
          className="nb-stage-arrow absolute"
          style={{ right: u(74), top: u(510), width: u(62), height: u(62), zIndex: 45 }}
        >
          <Icon name="chevronRight" style={{ width: u(24), height: u(24) }} strokeWidth={2} />
        </button>

        {/* ---------------- HÀNG TIẾN TRÌNH ---------------- */}
        <div className="absolute flex items-center" style={{ left: u(500), right: u(60), top: u(772), height: u(40), zIndex: 45 }}>
          <span className="shrink-0 font-semibold" style={{ fontSize: u(25) }}>
            <b className="text-white">{String(active + 1).padStart(2, "0")}</b>
            <span className="text-white/45" style={{ fontSize: u(17) }}> / {n}</span>
          </span>

          <span className="relative mx-[3%] flex flex-1 items-center" style={{ height: u(3) }}>
            <span className="absolute inset-x-0 rounded-full bg-white/20" style={{ height: u(3) }} aria-hidden="true" />
            <span
              className="absolute left-0 rounded-full bg-white transition-[width] duration-500"
              style={{ height: u(3), width: `${((active + 1) / n) * 100}%` }}
              aria-hidden="true"
            />
            {cards.map((card, i) => (
              <button
                key={card.id}
                type="button"
                onClick={() => setActive(i)}
                aria-label={card.title}
                className="absolute -translate-x-1/2 rounded-full transition"
                style={{
                  left: `${((i + 1) / n) * 100}%`,
                  width: u(9),
                  height: u(9),
                  background: i <= active ? "#fff" : "rgba(255,255,255,.35)",
                }}
              />
            ))}
          </span>

          <Link href={ROUTES.jobs[locale] as Route} className="shrink-0 text-white/75 hover:text-white" style={{ fontSize: u(16) }}>
            {t.allJobs}
          </Link>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? t.play : t.pause}
            className="nb-stage-arrow ml-[1.4%] shrink-0"
            style={{ width: u(40), height: u(40) }}
          >
            <Icon name={paused ? "play" : "pause"} style={{ width: u(16), height: u(16) }} strokeWidth={2} />
          </button>
        </div>

        {/* ---------------- THANH MENU Ở ĐÁY BANNER ----------------
            Trước đây chỗ này là dải năm ô giới thiệu, còn menu nằm trên đầu
            trang. Nay đổi chỗ: dải giới thiệu bỏ đi, menu chính xuống đây,
            bo tròn hai đầu, nền vàng, mỗi mục một icon kèm tên. */}
        <nav
          aria-label="Menu chính"
          className="absolute flex items-center justify-center"
          style={{ left: u(74), right: u(74), top: u(830), height: u(94), zIndex: 45 }}
        >
          <ul
            className="nb-menu-bar flex items-stretch"
            style={{ height: u(94), borderRadius: u(47), padding: u(8), gap: u(4) }}
          >
            {menu.map((m) => {
              const on = m.page === "home";
              return (
                <li key={m.label} className="flex">
                  <Link
                    href={m.href as Route}
                    aria-current={on ? "page" : undefined}
                    className={`flex items-center whitespace-nowrap transition${
                      on ? " nb-menu-on" : " nb-menu-off"
                    }`}
                    style={{
                      gap: u(10),
                      paddingInline: u(22),
                      borderRadius: u(39),
                      fontSize: u(17),
                      fontWeight: 700,
                    }}
                  >
                    <Icon name={MENU_ICON[m.page] ?? "grid"} style={{ width: u(22), height: u(22) }} strokeWidth={1.9} />
                    {m.label}
                  </Link>
                </li>
              );
            })}

            <li className="flex">
              <details className="nb-menu-lang relative flex">
                <summary
                  className="nb-menu-off flex cursor-pointer list-none items-center [&::-webkit-details-marker]:hidden"
                  style={{ gap: u(8), paddingInline: u(18), borderRadius: u(39), fontSize: u(17), fontWeight: 700 }}
                >
                  <Icon name="globe" style={{ width: u(20), height: u(20) }} strokeWidth={1.9} />
                  {locale.toUpperCase()}
                </summary>
                <ul
                  className="absolute bottom-full left-1/2 -translate-x-1/2 overflow-hidden bg-white text-[var(--nb-ink)] shadow-xl"
                  style={{ marginBottom: u(12), minWidth: u(150), borderRadius: u(12), fontSize: u(15) }}
                >
                  {LOCALES.map((l) => (
                    <li key={l}>
                      <Link
                        href={ROUTES.home[l] as Route}
                        hrefLang={l}
                        className={`block hover:bg-[var(--nb-strip)] ${l === locale ? "font-bold" : ""}`}
                        style={{ paddingInline: u(16), paddingBlock: u(10) }}
                      >
                        {l === "de" ? "Deutsch" : l === "en" ? "English" : "Tiếng Việt"}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>

            <li className="flex">
              <Link
                href={ROUTES.request[locale] as Route}
                className="nb-menu-cta flex items-center whitespace-nowrap"
                style={{ gap: u(10), paddingInline: u(24), borderRadius: u(39), fontSize: u(17), fontWeight: 800 }}
              >
                {requestLabel(locale)}
                <Icon name="arrowRight" style={{ width: u(20), height: u(20) }} strokeWidth={2.2} />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
}

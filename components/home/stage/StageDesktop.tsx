"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Fact, Flag } from "@/components/home/stage/StageBits";
import { Icon } from "@/components/ui/Icon";
import { STAGE } from "@/content/home-stage";
import { stageCards } from "@/content/jobs-stage";
import { ROUTES, type Locale } from "@/content/locales";

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

/** Thứ tự vẽ các ô: giữa trước rồi lan ra hai bên — cũng là thứ tự đánh số 01…05 */
const ORDER = [0, -1, 1, -2, 2];

const SLOT: Record<number, { x: number; y: number; w: number; h: number; rot: number; z: number; dim: number }> = {
  0: { x: 645, y: 92, w: 462, h: 648, rot: 0, z: 40, dim: 0 },
  [-1]: { x: 396, y: 298, w: 256, h: 404, rot: -15, z: 30, dim: 0.2 },
  1: { x: 1116, y: 312, w: 256, h: 404, rot: 15, z: 30, dim: 0.2 },
  [-2]: { x: 212, y: 432, w: 192, h: 274, rot: -22, z: 20, dim: 0.42 },
  2: { x: 1382, y: 402, w: 194, h: 310, rot: 22, z: 20, dim: 0.42 },
};

const EUR = (n: number) => n.toLocaleString("de-DE");

export function StageDesktop({ locale }: { locale: Locale }) {
  const t = STAGE[locale];
  const cards = useMemo(() => stageCards(locale), [locale]);
  const n = cards.length;
  const titleSize = locale === "vi" ? 76 : locale === "en" ? 64 : 56;

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((d: number) => setActive((i) => (i + d + n) % n), [n]);

  useEffect(() => {
    if (paused || n < 2) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % n), 6500);
    return () => window.clearInterval(id);
  }, [paused, n]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
  }, []);

  return (
    <section
      className="relative hidden bg-[#050e1d] text-white lg:block"
      style={{ height: u(941) }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* khung 1672u, kéo ra sát hai mép màn hình bất kể lề trang */}
      <div className="absolute inset-y-0 right-[calc(-1*var(--nb-gutter))] left-[calc(-1*var(--nb-gutter))]">
        <Image src="/kit/banner/stage-desktop.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
        <span
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(4,11,24,.88) 0, rgba(4,11,24,.42) 32%, rgba(4,11,24,.12) 50%, rgba(4,11,24,.42) 72%, rgba(4,11,24,.86) 100%), linear-gradient(180deg, rgba(4,11,24,.8) 0, rgba(4,11,24,0) 16%, rgba(4,11,24,0) 60%, rgba(4,11,24,.94) 100%)",
          }}
          aria-hidden="true"
        />

        {/* ---------------- CHỮ LỚN ---------------- */}
        <div className="absolute" style={{ left: u(110), top: u(84), width: u(560) }}>
          <p className="font-semibold text-white/85 uppercase" style={{ fontSize: u(15), letterSpacing: u(6) }}>
            {t.eyebrow}
          </p>
          <h1 className="font-[family-name:var(--font-serif)] font-bold" style={{ marginTop: u(6) }}>
            <span className="nb-gold-text block" style={{ fontSize: u(titleSize), lineHeight: u(titleSize * 1.08) }}>
              {t.title[0]}
            </span>
            <span className="nb-gold-text block" style={{ fontSize: u(titleSize), lineHeight: u(titleSize * 1.08) }}>
              {t.title[1]}
            </span>
          </h1>
          {/* Dòng phụ hẹp hơn tiêu đề: thẻ bên trái bắt đầu ở x=396, câu tiếng
              Đức dài sẽ chui xuống dưới thẻ nếu để rộng bằng tiêu đề. */}
          <p className="text-white/85" style={{ marginTop: u(12), fontSize: u(21), lineHeight: u(30), maxWidth: u(286) }}>
            {t.sub[0]}
            <br />
            {t.sub[1]}
          </p>
          <Link
            href={ROUTES.jobs[locale] as Route}
            className="nb-gold-pill group inline-flex items-center justify-between"
            style={{ marginTop: u(18), height: u(52), width: u(288), paddingLeft: u(22), paddingRight: u(6), fontSize: u(17) }}
          >
            {t.cta}
            <span
              className="flex items-center justify-center rounded-full bg-[#1b1405] text-[var(--nb-gold)] transition group-hover:translate-x-[2px]"
              style={{ width: u(40), height: u(40) }}
            >
              <Icon name="arrowRight" style={{ width: u(18), height: u(18) }} strokeWidth={2} />
            </span>
          </Link>
        </div>

        {/* ---------------- SÂN KHẤU THẺ ---------------- */}
        <div className="absolute inset-0" style={{ perspective: u(1600) }}>
          {ORDER.map((d, pos) => {
            const s = SLOT[d]!;
            const i = (((active + d) % n) + n) % n;
            const card = cards[i]!;
            const center = d === 0;
            const far = Math.abs(d) === 2;

            return (
              <Link
                key={d}
                href={`${ROUTES.jobs[locale]}#${card.id}` as Route}
                aria-hidden={!center}
                tabIndex={center ? undefined : -1}
                onClick={(e) => {
                  if (!center) {
                    e.preventDefault();
                    setActive(i);
                  }
                }}
                className="nb-stage-card absolute block overflow-hidden"
                style={{
                  left: u(s.x),
                  top: u(s.y),
                  width: u(s.w),
                  height: u(s.h),
                  zIndex: s.z,
                  borderRadius: u(center ? 26 : 18),
                  transform: `rotateY(${s.rot}deg)`,
                  boxShadow: center
                    ? `0 ${u(40)} ${u(90)} rgba(0,0,0,.6), 0 0 ${u(70)} rgba(232,194,102,.28)`
                    : `0 ${u(24)} ${u(50)} rgba(0,0,0,.55)`,
                }}
              >
                <span
                  className="relative block overflow-hidden"
                  style={{ height: u(center ? s.h - 336 : far ? s.h - 122 : s.h - 182) }}
                >
                  <Image
                    src={card.image}
                    alt=""
                    fill
                    sizes={center ? "50vw" : "25vw"}
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
                    style={{
                      right: u(center ? 26 : 12),
                      top: u(center ? 8 : 4),
                      fontSize: u(center ? 86 : far ? 34 : 44),
                      lineHeight: 1.1,
                    }}
                    aria-hidden="true"
                  >
                    {String(pos + 1).padStart(2, "0")}
                  </span>
                  {center && (
                    <span
                      className="absolute font-semibold tracking-[0.3em] text-white/45 uppercase"
                      style={{ right: u(14), top: u(120), fontSize: u(12), writingMode: "vertical-rl" }}
                      aria-hidden="true"
                    >
                      {card.countryName}
                    </span>
                  )}
                </span>

                <span className="relative block" style={{ padding: u(center ? 24 : far ? 11 : 14), paddingTop: u(center ? 4 : 2) }}>
                  {!far && (
                    <span className="flex items-center" style={{ gap: u(center ? 10 : 7) }}>
                      <Flag colors={card.flag} size={u(center ? 22 : 16)} />
                      <span className="font-semibold text-white/80" style={{ fontSize: u(center ? 15 : 12) }}>
                        {card.countryName}
                      </span>
                    </span>
                  )}
                  <b
                    className="block overflow-hidden font-bold text-white"
                    style={{
                      fontSize: u(center ? 27 : far ? 13 : 17),
                      lineHeight: u(center ? 34 : far ? 17 : 22),
                      marginTop: u(center ? 10 : far ? 0 : 6),
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                    }}
                  >
                    {card.title}
                  </b>

                  <span className="flex items-baseline" style={{ gap: u(center ? 8 : 6), marginTop: u(center ? 12 : far ? 5 : 7) }}>
                    <span
                      className="flex shrink-0 items-center justify-center rounded-full border border-[var(--nb-gold-line)] text-[var(--nb-gold)]"
                      style={{
                        width: u(center ? 26 : far ? 15 : 18),
                        height: u(center ? 26 : far ? 15 : 18),
                        fontSize: u(center ? 14 : far ? 9 : 10),
                      }}
                    >
                      €
                    </span>
                    <b
                      className="font-bold whitespace-nowrap text-[var(--nb-gold)]"
                      style={{ fontSize: u(center ? 25 : far ? 12 : 16) }}
                    >
                      {card.salary.from === card.salary.to
                        ? `${EUR(card.salary.from)} €`
                        : `${EUR(card.salary.from)} – ${EUR(card.salary.to)} €`}
                    </b>
                    {!far && (
                      <span className="text-white/60" style={{ fontSize: u(center ? 16 : 11) }}>
                        {t.perMonth}
                      </span>
                    )}
                  </span>

                  {!far && card.facts.length > 0 && (
                    <>
                      <span
                        className="block bg-white/15"
                        style={{ height: 1, marginTop: u(center ? 16 : 9), marginBottom: u(center ? 14 : 8) }}
                        aria-hidden="true"
                      />
                      <span className="flex items-center justify-between" style={{ gap: u(center ? 10 : 6) }}>
                        {card.facts.slice(0, center ? 3 : 2).map((f) => (
                          <Fact key={f.label} icon={f.icon} value={f.value} label={f.label} u={u} compact={!center} />
                        ))}
                      </span>
                    </>
                  )}

                  {center && (
                    <span
                      className="nb-gold-btn flex items-center justify-center"
                      style={{ marginTop: u(20), height: u(56), gap: u(10), fontSize: u(18) }}
                    >
                      {t.detail}
                      <Icon name="arrowRight" style={{ width: u(18), height: u(18) }} strokeWidth={2.2} />
                    </span>
                  )}
                </span>

                {s.dim > 0 && (
                  <span className="absolute inset-0" style={{ background: `rgba(5,12,25,${s.dim})` }} aria-hidden="true" />
                )}
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

        {/* ---------------- DẢI NĂM Ô ---------------- */}
        <ul
          className="absolute flex items-center"
          style={{
            left: u(74),
            right: u(74),
            top: u(824),
            height: u(102),
            zIndex: 45,
            borderRadius: u(16),
            background: "rgba(8,18,35,.72)",
            border: "1px solid rgba(232,194,102,.22)",
            backdropFilter: "blur(6px)",
          }}
        >
          {t.strip.map(([title, sub], i) => (
            <li
              key={title}
              className="flex flex-1 items-center"
              style={{
                gap: u(14),
                paddingInline: u(22),
                borderLeft: i > 0 ? "1px solid rgba(255,255,255,.12)" : undefined,
              }}
            >
              <Icon
                name={["box", "globe", "shield", "pin", "users"][i]!}
                className="shrink-0 text-[var(--nb-gold)]"
                style={{ width: u(34), height: u(34) }}
                strokeWidth={1.6}
              />
              <span className="min-w-0">
                <b className="block truncate font-bold text-white" style={{ fontSize: u(16) }}>
                  {title}
                </b>
                <span className="block truncate text-white/60" style={{ fontSize: u(13) }}>
                  {sub}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

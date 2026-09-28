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

/** Các khoảng cách được dựng ra DOM. ±3 nằm ngoài sân khấu, để thẻ có chỗ
 *  bay vào và bay ra thay vì hiện ra đột ngột ở rìa. */
const RANGE = [-3, -2, -1, 0, 1, 2, 3];

/** Khung gốc của thẻ — mọi thẻ đều có đúng khung này, chỉ khác phép biến đổi. */
const BASE = { x: 645, y: 92, w: 462, h: 648 };
const CX = BASE.x + BASE.w / 2;
const CY = BASE.y + BASE.h / 2;

/** Tâm thẻ ở từng ô, đo trên ảnh mẫu, kèm cỡ thu nhỏ và góc xoay. */
const SLOT: Record<number, { cx: number; cy: number; s: number; rot: number; z: number; dim: number; op: number }> = {
  0: { cx: 836, cy: 462, s: 1, rot: 0, z: 40, dim: 0, op: 1 },
  [-1]: { cx: 430, cy: 556, s: 0.58, rot: -15, z: 30, dim: 0.18, op: 1 },
  1: { cx: 1242, cy: 556, s: 0.58, rot: 15, z: 30, dim: 0.18, op: 1 },
  [-2]: { cx: 156, cy: 612, s: 0.42, rot: -22, z: 20, dim: 0.36, op: 1 },
  2: { cx: 1516, cy: 612, s: 0.42, rot: 22, z: 20, dim: 0.36, op: 1 },
  [-3]: { cx: -100, cy: 648, s: 0.3, rot: -28, z: 10, dim: 0.5, op: 0 },
  3: { cx: 1772, cy: 648, s: 0.3, rot: 28, z: 10, dim: 0.5, op: 0 },
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
  // Tiêu đề gói gọn MỘT dòng và nhỏ hơn 20% so với lúc để hai dòng.
  const titleSize = Math.round((locale === "vi" ? 60 : locale === "en" ? 52 : 44) * 0.8);

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  /** Đơn đang đứng giữa ở lần vẽ trước, để biết tấm nào vừa rời khỏi giữa */
  const truocDo = useRef(0);
  /** Tấm nào đã lật bao nhiêu độ — để lần sau lật tiếp nửa vòng, không giật về 0 */
  const gocQuay = useRef<Record<string, number>>({});

  const go = useCallback((d: number) => setActive((i) => (i + d + n) % n), [n]);

  /* Loé một lần ngay khi mở trang, để tấm đầu tiên cũng có hiệu ứng. */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => {
      stageRef.current
        ?.querySelector<HTMLElement>('[data-slot="0"] .nb-loe')
        ?.animate(
          [
            { opacity: 0, transform: "translateX(-50%) scale(0.5, 0.55)" },
            { opacity: 1, transform: "translateX(-50%) scale(1.06, 1)", offset: 0.3 },
            { opacity: 0, transform: "translateX(-50%) scale(1.3, 1.18)" },
          ],
          { duration: 1400, delay: 620, easing: "cubic-bezier(.2,.7,.3,1)" },
        );
    }, 420);
    return () => window.clearTimeout(id);
  }, []);

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

  /* Ai quay khi đổi đơn:
       - tấm đang ở ô phụ mà được đưa LÊN làm tấm chính
       - và đúng lúc đó, tấm chính cũ quay để lùi ra ô phụ
     Hai tấm đó quay trọn 360° trong lúc trượt; các tấm còn lại chỉ trượt.

     Phép quay đặt lên tấm board bên trong, phép trượt đặt lên khung bọc ngoài:
     hai transform ở hai phần tử khác nhau thì mới cộng được với nhau. Để chung
     một phần tử thì animation đè mất transform của ô, tấm nhảy về gốc rồi mới
     quay. */
  useEffect(() => {
    const truoc = truocDo.current;
    truocDo.current = active;
    if (truoc === active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /** Nhịp chung của một lần đổi đơn — trùng với thời gian tấm trượt sang ô mới */
    const NHIP = 1400;
    const DIU = "cubic-bezier(.22,.61,.24,1)";

    const quay = (id: string | undefined, vaoGiua: boolean) => {
      if (!id) return;
      const el = stageRef.current?.querySelector<HTMLElement>('[data-card="' + id + '"] .nb-stage-card');
      if (!el) return;

      /* Lật đúng NỬA vòng mỗi lần đổi đơn. Lật nửa vòng thì tấm dừng ở mặt
         sau, nên đúng giữa chừng phải soi gương phần nội dung (scaleX(-1)):
         mặt sau lật ngược một lần nữa thành ra chữ vẫn đọc xuôi. Lần đổi sau
         lật tiếp nửa vòng để về lại mặt trước.

         Tấm đi lên làm tấm chính thì nhấc cao lên rồi hạ xuống đúng lúc vào
         giữa; tấm chính cũ chùng xuống một nhịp để nhường chỗ. Nửa vòng kéo
         đúng bằng quãng đường đi, nên vừa tới nơi là vừa xong. */
      const cu = gocQuay.current[id] ?? 0;
      const moi = cu + 180;
      gocQuay.current[id] = moi;
      const nhac = vaoGiua ? "-5%" : "3.5%";

      el.getAnimations().forEach((a) => {
        if (a.id === "lat") a.cancel();
      });
      const chay = el.animate(
        [
          { transform: `translateY(0) rotateY(${cu}deg)` },
          { transform: `translateY(${nhac}) rotateY(${cu + 90}deg)`, offset: 0.5 },
          { transform: `translateY(0) rotateY(${moi}deg)` },
        ],
        { duration: NHIP, easing: DIU, fill: "forwards" },
      );
      chay.id = "lat";

    };

    // Cả hai bắt đầu cùng một lúc: tấm phụ nhảy lên giữa, tấm chính lùi ra.
    quay(cards[active]?.id, true);
    quay(cards[truoc]?.id, false);

    /* Vệt sáng vàng loé dưới chân tấm vừa vào giữa. */
    const loe = stageRef.current?.querySelector<HTMLElement>('[data-slot="0"] .nb-loe');
    loe?.animate(
      [
        { opacity: 0, transform: "translateX(-50%) scale(0.5, 0.55)" },
        { opacity: 1, transform: "translateX(-50%) scale(1.06, 1)", offset: 0.3 },
        { opacity: 0, transform: "translateX(-50%) scale(1.3, 1.18)" },
      ],
      { duration: 1400, delay: 620, easing: "cubic-bezier(.2,.7,.3,1)" },
    );

  }, [active, cards]);

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
              "linear-gradient(90deg, rgba(3,8,18,.8) 0, rgba(3,8,18,.4) 18%, rgba(3,8,18,.2) 38%, rgba(3,8,18,.2) 66%, rgba(3,8,18,.5) 100%), linear-gradient(180deg, rgba(3,8,18,.5) 0, rgba(3,8,18,.18) 12%, rgba(3,8,18,.2) 60%, rgba(3,8,18,.5) 84%, rgba(3,8,18,.8) 100%)",
          }}
          aria-hidden="true"
        />
        {/* ---------------- MÁY BAY ----------------
            Nền mới không còn in sẵn máy bay; máy bay là ảnh PNG rời, đặt đúng
            chỗ cũ trên nền trời. Rê chuột vào thì nó lao vút về phía trước rồi
            mất hút, rời chuột ra lại bay về chỗ cũ. */}
        <span className="nb-plane absolute" style={{ left: u(1176), top: u(96), width: u(300), zIndex: 6 }}>
          <Image
            src="/kit/banner/may-bay.png"
            alt=""
            width={900}
            height={327}
            sizes="30vw"
            className="h-auto w-full"
          />
        </span>

        {/* Hai nút điều hướng bám sát mép ảnh, ngang đúng tâm cụm bảng. */}
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label={t.prev}
          className="nb-stage-arrow absolute -translate-y-1/2"
          style={{ left: "1.6cm", top: u(462), width: u(62), height: u(62), zIndex: 45 }}
        >
          <Icon name="chevronRight" style={{ width: u(24), height: u(24), transform: "rotate(180deg)" }} strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label={t.next}
          className="nb-stage-arrow absolute -translate-y-1/2"
          style={{ right: "1.6cm", top: u(462), width: u(62), height: u(62), zIndex: 45 }}
        >
          <Icon name="chevronRight" style={{ width: u(24), height: u(24) }} strokeWidth={2} />
        </button>

        {/* ---------------- CHỮ LỚN ---------------- */}
        <div className="absolute" style={{ left: "3cm", top: u(74), width: u(640), zIndex: 10 }}>
          {/* Logo nay đứng ngay trên tiêu đề chính, không còn trên thanh header */}
          <Link href={ROUTES.home[locale] as Route} aria-label="NIBELC" className="mb-[calc(8*var(--us))] block">
            <Image
              src="/nibelc-logo-dark.svg"
              alt="NIBELC GmbH"
              width={1201}
              height={376}
              priority
              style={{ height: u(34), width: "auto" }}
            />
          </Link>
          <p className="font-semibold text-white/85 uppercase" style={{ fontSize: u(15), letterSpacing: u(6) }}>
            {t.eyebrow}
          </p>
          <h1 className="font-[family-name:var(--font-serif)] font-bold" style={{ marginTop: u(6) }}>
            <span
              className="nb-gold-text block whitespace-nowrap"
              style={{ fontSize: u(titleSize), lineHeight: u(titleSize * 1.16) }}
            >
              {t.title[0]} {t.title[1]}
            </span>
          </h1>
          {/* Dòng phụ hẹp hơn tiêu đề: thẻ bên trái bắt đầu ở x=396, câu tiếng
              Đức dài sẽ chui xuống dưới thẻ nếu để rộng bằng tiêu đề. */}
          <p className="text-white/85" style={{ marginTop: u(8), fontSize: u(18), lineHeight: u(25), maxWidth: u(270) }}>
            {t.sub[0]}
            <br />
            {t.sub[1]}
          </p>
          <Link
            href={ROUTES.jobs[locale] as Route}
            className="nb-gold-pill group inline-flex items-center justify-between"
            style={{ marginTop: u(12), height: u(46), width: u(262), paddingLeft: u(20), paddingRight: u(5), fontSize: u(15) }}
          >
            {t.cta}
            <span
              className="flex items-center justify-center rounded-full bg-[#1b1405] text-[var(--nb-gold)] transition group-hover:translate-x-[2px]"
              style={{ width: u(36), height: u(36) }}
            >
              <Icon name="arrowRight" style={{ width: u(18), height: u(18) }} strokeWidth={2} />
            </span>
          </Link>
        </div>
      </div>

      {/* Khung nội dung đúng 1672u, căn giữa — thu nhỏ theo --us nên luôn vừa
          một khung hình kể cả màn hình thấp. */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2" style={{ width: u(1672) }}>
        {/* ---------------- SÂN KHẤU THẺ ---------------- */}
        <div ref={stageRef} className="absolute inset-0" style={{ perspective: u(1600) }}>
          {RANGE.map((d) => {
            const s = SLOT[d]!;
            const i = (((active + d) % n) + n) % n;
            const card = cards[i]!;
            const center = d === 0;

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
                data-card={card.id}
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
                  /* KHÔNG để overflow-hidden ở đây: nó làm phẳng không gian 3D, khiến
                     backface-visibility của hai mặt mất tác dụng và mặt sau lộ ra
                     thành chữ ngược. Việc cắt góc bo để cho từng mặt lo. */
                  className="nb-stage-card absolute inset-0 block"
                  style={{
                    borderRadius: u(26),
                    boxShadow: center
                      ? `0 ${u(34)} ${u(70)} rgba(0,0,0,.62), 0 ${u(8)} ${u(20)} rgba(0,0,0,.45)`
                      : `0 ${u(30)} ${u(60)} rgba(0,0,0,.5)`,
                  }}
                >

                {/* Hai mặt thật: mặt sau đã xoay sẵn 180°, cả hai cùng ẩn lưng nên
                    lật nửa vòng là thấy mặt sau đọc xuôi ngay, không có bước đổi nào
                    lộ ra ở điểm dừng. */}
                <span className="nb-mat nb-mat-truoc">
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
                </span>
                <span className="nb-mat nb-mat-sau" aria-hidden="true">
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
                </span>

                {s.dim > 0 && (
                  <span className="absolute inset-0" style={{ background: `rgba(5,12,25,${s.dim})` }} aria-hidden="true" />
                )}
                {/* Vệt sáng vàng hắt dưới chân tấm; loé lên mỗi lần đổi đơn.
                    Đặt ngoài hai mặt để nó không lật theo tấm. */}
                <span className="nb-loe" aria-hidden="true" style={{ height: u(96) }} />
                </span>
              </Link>
            );
          })}
        </div>

        {/* ---------------- HAI MŨI TÊN ---------------- */}
        {/* ---------------- HÀNG TIẾN TRÌNH ---------------- */}
        <div className="absolute flex items-center" style={{ left: u(500), right: u(60), top: u(772), height: u(40), zIndex: 45 }}>
          <span className="shrink-0 font-semibold" style={{ fontSize: u(25) }}>
            <b className="text-white">{String(active + 1).padStart(2, "0")}</b>
            <span className="text-white/45" style={{ fontSize: u(17) }}> / {n}</span>
          </span>

          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? t.play : t.pause}
            className="ml-[calc(14*var(--us))] shrink-0 text-white/55 hover:text-white"
            style={{ width: u(26), height: u(26) }}
          >
            <Icon name={paused ? "play" : "pause"} style={{ width: u(16), height: u(16) }} strokeWidth={2} />
          </button>

          <Link
            href={ROUTES.jobs[locale] as Route}
            className="ml-auto shrink-0 text-white/75 hover:text-white"
            style={{ fontSize: u(16) }}
          >
            {t.allJobs}
          </Link>
        </div>

        {/* ---------------- THANH MENU Ở ĐÁY BANNER ----------------
            Trước đây chỗ này là dải năm ô giới thiệu, còn menu nằm trên đầu
            trang. Nay đổi chỗ: dải giới thiệu bỏ đi, menu chính xuống đây,
            bo tròn hai đầu, nền vàng, mỗi mục một icon kèm tên. */}
        <nav
          aria-label="Menu chính"
          className="absolute flex items-center justify-center"
          style={{ left: u(74), right: u(74), top: u(852), height: u(68), zIndex: 45 }}
        >
          <ul
            className="nb-menu-bar flex items-stretch"
            style={{ height: u(68), borderRadius: u(34), padding: u(6), gap: u(2) }}
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
                      gap: u(8),
                      paddingInline: u(17),
                      borderRadius: u(28),
                      fontSize: u(15),
                      fontWeight: 700,
                    }}
                  >
                    <Icon name={MENU_ICON[m.page] ?? "grid"} style={{ width: u(18), height: u(18) }} strokeWidth={1.9} />
                    {m.label}
                  </Link>
                </li>
              );
            })}

            <li className="flex">
              <details className="nb-menu-lang relative flex">
                <summary
                  className="nb-menu-off flex cursor-pointer list-none items-center [&::-webkit-details-marker]:hidden"
                  style={{ gap: u(7), paddingInline: u(14), borderRadius: u(28), fontSize: u(15), fontWeight: 700 }}
                >
                  <Icon name="globe" style={{ width: u(17), height: u(17) }} strokeWidth={1.9} />
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
                style={{ gap: u(8), paddingInline: u(19), borderRadius: u(28), fontSize: u(15), fontWeight: 800 }}
              >
                {requestLabel(locale)}
                <Icon name="arrowRight" style={{ width: u(17), height: u(17) }} strokeWidth={2.2} />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
}

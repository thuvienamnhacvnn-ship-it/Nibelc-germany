"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { MOBILE_BANNER } from "@/content/industry-assets";
import { HOME, ROUTES, type Locale } from "@/content/locales";

/**
 * Banner trang chủ cho điện thoại — dựng dọc, giữ đủ thành phần của bản
 * desktop: hai lớp ảnh, vòng cung vàng và bốn huy hiệu.
 *
 *   nền  = khung cửa kính nhìn ra skyline Berlin (ảnh dọc 941×1672)
 *   trên = PNG hai nhân vật đã tách nền — ĐỨNG YÊN, không chạy theo cảm biến
 *
 * Nghiêng máy thì chỉ NỀN chạy ngược hướng nghiêng; người và các huy hiệu giữ
 * nguyên chỗ, nên mắt đọc ra chiều sâu mà chủ thể không bị rung.
 *
 * iOS 13+ bắt buộc người dùng bấm mới cho đọc cảm biến → nút nhỏ "3D" ở góc.
 * Máy không có cảm biến, hoặc người dùng bật "giảm chuyển động", thì banner
 * đứng yên và vẫn hiển thị đầy đủ.
 */

/** Biên độ dịch chuyển của nền, đơn vị px màn hình */
const BG = { x: 26, y: 18 };
/** Góc nghiêng (độ) tương ứng biên độ tối đa */
const RANGE = 22;

/** Bốn huy hiệu trên vòng cung — toạ độ theo khung 390×477 của banner dọc */
const ARC = [
  { x: 60, y: 96, icon: "search", flip: false },
  { x: 122, y: 168, icon: "doc", flip: false },
  { x: 196, y: 236, icon: "plane", flip: false },
  // huy hiệu cuối nằm gần đầu người bên phải → chữ lật sang trái icon
  { x: 316, y: 318, icon: "users", flip: true },
];

type Permissioned = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

export function MobileHero({ locale }: { locale: Locale }) {
  const t = HOME[locale];
  const bg = useRef<HTMLDivElement>(null);
  const [needsPermission, setNeedsPermission] = useState(false);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const D = window.DeviceOrientationEvent as Permissioned | undefined;
    if (!D) return;
    setOn(true);
    if (typeof D.requestPermission !== "function") return;
    // iOS: không có quyền thì không sự kiện nào tới — lúc đó mới mời bấm
    let seen = false;
    const mark = () => {
      seen = true;
    };
    window.addEventListener("deviceorientation", mark, { passive: true, once: true });
    const timer = setTimeout(() => {
      if (!seen) setNeedsPermission(true);
    }, 1200);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("deviceorientation", mark);
    };
  }, []);

  useEffect(() => {
    if (!on) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let base: number | null = null;

    function onTilt(e: DeviceOrientationEvent) {
      const gamma = e.gamma ?? 0; // nghiêng trái/phải
      const beta = e.beta ?? 0; // ngửa/cúi
      // Lấy tư thế cầm máy lúc đầu làm gốc, không bắt người dùng giữ máy thẳng
      if (base === null) base = beta;
      tx = Math.max(-1, Math.min(1, gamma / RANGE));
      ty = Math.max(-1, Math.min(1, (beta - base) / RANGE));
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function tick() {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      // chỉ nền chạy, và chạy NGƯỢC hướng nghiêng
      if (bg.current) bg.current.style.transform = `translate3d(${-cx * BG.x}px, ${-cy * BG.y}px, 0) scale(1.14)`;
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) raf = requestAnimationFrame(tick);
      else raf = 0;
    }

    window.addEventListener("deviceorientation", onTilt, { passive: true });
    return () => {
      window.removeEventListener("deviceorientation", onTilt);
      cancelAnimationFrame(raf);
    };
  }, [on]);

  async function enable() {
    const D = window.DeviceOrientationEvent as Permissioned;
    try {
      const res = await D.requestPermission?.();
      if (res === "granted") {
        setOn(true);
        setNeedsPermission(false);
      }
    } catch {
      setNeedsPermission(false);
    }
  }

  return (
    <section className="relative overflow-hidden bg-[var(--nb-navy-hero)] text-white lg:hidden">
      {/* ---- hai lớp ảnh + vòng cung + huy hiệu ---- */}
      <div className="relative aspect-[390/477] w-full overflow-hidden">
        {/* nền: lớp duy nhất chạy theo cảm biến */}
        <div ref={bg} className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.14)" }}>
          <Image src={MOBILE_BANNER.background} alt="" fill priority sizes="100vw" className="object-cover object-[50%_32%]" />
        </div>

        {/* vòng cung vàng — nằm dưới người, như bản desktop */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 390 477" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="m-arc" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#ffc15e" />
              <stop offset="1" stopColor="#ff6a13" />
            </linearGradient>
            <filter id="m-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
          </defs>
          <path className="nb-arc-glow" d="M48 78 C 96 104, 140 150, 176 208 S 250 300, 330 330" fill="none" stroke="url(#m-arc)" strokeWidth="11" opacity=".55" filter="url(#m-glow)" />
          <path d="M48 78 C 96 104, 140 150, 176 208 S 250 300, 330 330" fill="none" stroke="url(#m-arc)" strokeWidth="3.5" strokeLinecap="round" />
          <path className="nb-arc-run" d="M48 78 C 96 104, 140 150, 176 208 S 250 300, 330 330" fill="none" stroke="#fff3d6" strokeWidth="3.5" strokeLinecap="round" />
        </svg>

        {/* PNG hai nhân vật: cố định, không chạy theo cảm biến */}
        <div className="absolute inset-x-0 bottom-0">
          <Image src={MOBILE_BANNER.foreground} alt={MOBILE_BANNER.alt} width={1100} height={709} priority sizes="100vw" className="h-auto w-full" />
        </div>

        {/* bốn huy hiệu, trên cùng */}
        <ul className="absolute inset-0">
          {ARC.map((p, i) => (
            <li key={p.icon} className="absolute" style={{ left: `${(p.x / 390) * 100}%`, top: `${(p.y / 477) * 100}%` }}>
              <Link
                href={[ROUTES.industries, ROUTES.process, ROUTES.process, ROUTES.knowledge][i]![locale] as Route}
                className={`flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 active:scale-95 ${p.flip ? "flex-row-reverse" : ""}`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--nb-blue-dark)] text-white ring-2 ring-white/90">
                  <Icon name={p.icon} className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <span className="text-[11px] leading-[1.15] font-semibold text-[var(--nb-ink)] [text-shadow:0_0_6px_rgba(255,255,255,.95)]">
                  {t.arc[i]![0]}
                  <br />
                  {t.arc[i]![1]}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* chuyển sang nền navy ở đáy để nối liền với khối chữ */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%]"
          style={{ background: "linear-gradient(to bottom, rgba(11,42,82,0), var(--nb-navy-hero) 92%)" }}
          aria-hidden="true"
        />

        {needsPermission && (
          <button
            type="button"
            onClick={enable}
            aria-label="3D-Effekt beim Neigen des Geräts einschalten"
            className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur"
          >
            <Icon name="globe" className="h-4 w-4" strokeWidth={1.8} />
            3D
          </button>
        )}
      </div>

      {/* ---- chữ ---- */}
      <div className="relative px-5 pt-1 pb-8">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-[#7fb1ff] uppercase">{t.eyebrow}</p>
        <h1 className="mt-2 text-[34px] leading-[1.1] font-extrabold tracking-[-0.02em] text-white">
          {t.h1a}
          <br />
          {t.h1b}
          <br />
          <span className="text-[var(--nb-blue)]">{t.h1accent}</span>
          <span className="text-[var(--nb-orange)]">.</span>
        </h1>
        <p className="mt-3 text-[15px] leading-6 text-white/85">{t.sub}</p>

        <div className="mt-5 flex flex-col gap-3">
          <Link
            href={ROUTES.request[locale] as Route}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--nb-orange)] font-semibold text-white active:bg-[var(--nb-orange-dark)]"
          >
            {t.ctaPrimary}
            <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2} />
          </Link>
          <Link
            href={ROUTES.contact[locale] as Route}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/45 font-semibold text-white active:bg-white/10"
          >
            {t.ctaSecondary}
          </Link>
        </div>
      </div>
    </section>
  );
}

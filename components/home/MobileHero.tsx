"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { MOBILE_BANNER } from "@/content/industry-assets";
import { HOME, ROUTES, type Locale } from "@/content/locales";

/**
 * Banner trang chủ cho điện thoại — hai lớp ảnh, giống bản desktop nhưng
 * dựng dọc:
 *   nền  = khung cửa kính nhìn ra skyline Berlin (ảnh dọc 941×1672)
 *   trên = PNG hai nhân vật đã tách nền
 *
 * Nghiêng máy thì NỀN chạy ngược hướng nghiêng, hai nhân vật nhích nhẹ theo
 * hướng nghiêng. Hai lớp đi ngược nhau nên mắt đọc ra chiều sâu — cùng một
 * nguyên tắc với hiệu ứng rê chuột ở bản desktop.
 *
 * iOS 13+ bắt buộc người dùng bấm mới cho đọc cảm biến, nên có nút nhỏ
 * "3D" ở góc; Android chạy ngay. Máy không có cảm biến, hoặc người dùng bật
 * "giảm chuyển động", thì banner đứng yên — vẫn hiển thị đầy đủ.
 */

/** Biên độ dịch chuyển, đơn vị px màn hình */
const BG = { x: 26, y: 18 };
const FG = { x: 9, y: 6 };
/** Góc nghiêng (độ) tương ứng biên độ tối đa */
const RANGE = 22;

type Permissioned = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

export function MobileHero({ locale }: { locale: Locale }) {
  const t = HOME[locale];
  const bg = useRef<HTMLDivElement>(null);
  const fg = useRef<HTMLDivElement>(null);
  const [needsPermission, setNeedsPermission] = useState(false);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const D = window.DeviceOrientationEvent as Permissioned | undefined;
    if (!D) return;
    // iOS: phải hỏi quyền trong một cú chạm của người dùng
    if (typeof D.requestPermission === "function") setNeedsPermission(true);
    else setOn(true);
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
      // nền chạy NGƯỢC hướng nghiêng
      if (bg.current) bg.current.style.transform = `translate3d(${-cx * BG.x}px, ${-cy * BG.y}px, 0) scale(1.12)`;
      // người nhích NHẸ theo hướng nghiêng
      if (fg.current) fg.current.style.transform = `translate3d(${cx * FG.x}px, ${cy * FG.y}px, 0)`;
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
      {/* ---- hai lớp ảnh ---- */}
      <div className="relative aspect-[9/11] w-full overflow-hidden">
        <div ref={bg} className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.12)" }}>
          <Image
            src={MOBILE_BANNER.background}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_35%]"
          />
        </div>

        {/* Nhân vật: neo đáy, rộng hơn khung một chút để có chỗ nhích */}
        <div ref={fg} className="absolute inset-x-[-4%] bottom-0 will-change-transform">
          <Image
            src={MOBILE_BANNER.foreground}
            alt={MOBILE_BANNER.alt}
            width={1100}
            height={709}
            priority
            sizes="108vw"
            className="h-auto w-full"
          />
        </div>

        {/* Chuyển sang nền navy ở đáy để nối liền với khối chữ */}
        <div
          className="absolute inset-x-0 bottom-0 h-[38%]"
          style={{ background: "linear-gradient(to bottom, rgba(11,42,82,0), var(--nb-navy-hero) 88%)" }}
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
      <div className="relative px-5 pt-2 pb-8">
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

      {/* ---- bốn chặng, dạng thẻ ngang cuộn được ---- */}
      <ul className="flex snap-x gap-3 overflow-x-auto px-5 pb-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {t.arc.map(([a, b], i) => (
          <li
            key={a}
            className="flex min-w-[45%] snap-start items-center gap-3 rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/15"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--nb-blue-dark)] text-sm font-bold">
              {i + 1}
            </span>
            <span className="text-[13px] leading-[1.25] font-medium">
              {a}
              <br />
              {b}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

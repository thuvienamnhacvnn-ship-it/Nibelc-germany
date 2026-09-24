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

/** Bốn chặng xếp một hàng ngang trên đường line dưới logo */
const STEPS = ["search", "doc", "plane", "users"];

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
      <div className="sticky top-8 z-0 aspect-[390/430] w-full overflow-hidden">
        {/* nền: lớp duy nhất chạy theo cảm biến */}
        <div ref={bg} className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.14)" }}>
          <Image src={MOBILE_BANNER.background} alt="" fill priority sizes="100vw" className="object-cover object-[50%_32%]" />
        </div>

        {/* PNG hai nhân vật: cố định, không chạy theo cảm biến */}
        <div className="absolute inset-x-0 bottom-0">
          <Image src={MOBILE_BANNER.foreground} alt={MOBILE_BANNER.alt} width={1100} height={709} priority sizes="100vw" className="h-auto w-full" />
        </div>

        {/* phủ tối nhẹ ở đỉnh: logo và hàng icon phải đọc được trên nền trời */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[62%]"
          style={{ background: "linear-gradient(to bottom, rgba(8,30,60,.66), rgba(8,30,60,.42) 45%, rgba(8,30,60,.22) 70%, rgba(8,30,60,0))" }}
          aria-hidden="true"
        />

        {/* logo giữa banner, chếch lên cao */}
        <Link href={ROUTES.home[locale] as Route} aria-label="NIBELC" className="absolute inset-x-0 top-[5%] flex justify-center">
          <Image src="/nibelc-logo-dark.svg" alt="NIBELC GmbH" width={1201} height={376} priority className="h-11 w-auto drop-shadow-[0_2px_10px_rgba(6,26,54,.65)]" />
        </Link>

        {/* đường line ngang dưới logo: bốn icon trên line, chấm tròn xen giữa */}
        <div className="absolute inset-x-5 top-[19%]">
          <div className="relative">
            {/* đường line cắt ngang tâm các icon (icon cao 44 → tâm ở 22) */}
            <span
              className="absolute inset-x-0 top-[22px] h-[2px] -translate-y-1/2 rounded-full"
              style={{ background: "linear-gradient(90deg, rgba(255,193,94,0), #ffc15e 12%, #ff6a13 88%, rgba(255,106,19,0))" }}
              aria-hidden="true"
            />
            <span className="nb-line-run absolute top-[22px] h-[2px] w-16 -translate-y-1/2 rounded-full bg-white/85" aria-hidden="true" />

            <ul className="relative flex items-start justify-between">
            {STEPS.map((icon, i) => (
              <li key={icon} className="contents">
                {i > 0 && (
                  <span className="mt-[18px] h-2 w-2 shrink-0 rounded-full bg-[#ffc15e] ring-2 ring-[#ffc15e]/35" aria-hidden="true" />
                )}
                <Link
                  href={[ROUTES.industries, ROUTES.process, ROUTES.process, ROUTES.knowledge][i]![locale] as Route}
                  className="flex w-[70px] flex-col items-center gap-1 active:scale-95"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--nb-blue-dark)] text-white ring-[3px] ring-white/90 shadow-[0_6px_16px_-6px_rgba(6,26,54,.8)]">
                    <Icon name={icon} className="h-5 w-5" strokeWidth={1.9} />
                  </span>
                  <span className="text-center text-[10px] leading-[1.15] font-semibold text-white [text-shadow:0_1px_3px_rgba(6,26,54,1),0_0_10px_rgba(6,26,54,.9)]">
                    {t.arc[i]![0]}
                    <br />
                    {t.arc[i]![1]}
                  </span>
                </Link>
              </li>
            ))}
            </ul>
          </div>

          {/* tiêu đề ba dòng, gọn ngay dưới hàng icon */}
          <h1 className="mt-4 text-center text-[21px] leading-[1.2] font-extrabold tracking-[-0.01em] text-white [text-shadow:0_2px_4px_rgba(6,26,54,1),0_0_16px_rgba(6,26,54,.95)]">
            {t.h1a}
            <br />
            {t.h1b}
            <br />
            <span className="text-[#7fc0ff]">{t.h1accent}</span>
            <span className="text-[var(--nb-orange)]">.</span>
          </h1>
        </div>

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

    </section>
  );
}

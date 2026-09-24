"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { HOME_BANNER } from "@/content/industry-assets";

/**
 * Banner 2 lớp của trang 01.
 *
 * Thứ tự chồng lớp (dưới → trên):
 *   B2 nền skyline  →  mảng navy cắt chéo  →  B1 người + bàn (PNG)
 * B1 nằm TRÊN mảng navy nên người phụ nữ đè lên mép navy như trong mẫu —
 * đó là thứ tạo cảm giác có chiều sâu.
 *
 * Rê chuột: nền B2 chạy NGƯỢC hướng chuột, B1 nhích nhẹ theo hướng chuột.
 * Hai lớp đi hai hướng nên mắt đọc ra khoảng cách giữa chúng (parallax).
 *
 * Vị trí: trong mẫu hai lớp được thu về đúng chiều cao hero (941 → 667,
 * tỷ lệ 0,708) và bắt đầu từ x≈520, nên bề ngang lớp = 1184u.
 *
 * Người dùng bật "giảm chuyển động" trong hệ điều hành thì không chạy hiệu ứng.
 */

const LAYER_W = 1184; // 1672 × 0,708
const BG_SHIFT = { x: 22, y: 5 }; // biên độ nền, đơn vị --u
const FG_SHIFT = { x: 6, y: 4 }; // biên độ người, đơn vị --u

export function HeroParallax() {
  const bg = useRef<HTMLDivElement>(null);
  const fg = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    function onMove(e: PointerEvent) {
      // -1 … 1 theo vị trí chuột so với tâm màn hình
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function tick() {
      // Làm mượt: mỗi khung hình tiến 10% quãng còn lại, không giật theo chuột
      cx += (tx - cx) * 0.1;
      cy += (ty - cy) * 0.1;
      if (bg.current)
        bg.current.style.transform = `translate3d(calc(${-cx * BG_SHIFT.x} * var(--u)), calc(${-cy * BG_SHIFT.y} * var(--u)), 0) scale(1.04)`;
      if (fg.current)
        fg.current.style.transform = `translate3d(calc(${cx * FG_SHIFT.x} * var(--u)), calc(${cy * FG_SHIFT.y} * var(--u)), 0)`;
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const layer =
    "absolute top-0 left-[calc(520*var(--u))] h-full w-[calc(1184*var(--u))] will-change-transform";

  return (
    <div className="absolute inset-0 hidden overflow-hidden lg:block" aria-hidden="true">
      {/* Khung 1672u neo mép phải: ở màn rộng hơn mẫu, phần thừa bên trái là
          nền navy của section, bố cục ảnh + vòng cung giữ nguyên tỷ lệ mẫu. */}
      <div className="nb-photo-right absolute inset-y-0 w-[calc(1672*var(--u))]">
      {/* B2 — nền. Phóng 4% quanh quả cầu tháp truyền hình (740u,145u) để có chỗ
          cho parallax mà điểm nhấn vẫn đứng đúng vị trí mẫu. */}
      <div ref={bg} className={layer} style={{ transform: "scale(1.04)", transformOrigin: "calc(740 * var(--u)) calc(145 * var(--u))" }}>
        <Image
          src={HOME_BANNER.background}
          alt=""
          fill
          priority
          sizes={`${Math.round((LAYER_W / 1672) * 100)}vw`}
          className="object-cover"
        />
      </div>

      {/* Mảng navy cắt chéo 668u → 622u, mép có dải mềm */}
      <div
        className="absolute inset-0 bg-[var(--nb-navy-hero)]"
        style={{ clipPath: "polygon(0 0, calc(668 * var(--u)) 0, calc(622 * var(--u)) 100%, 0 100%)" }}
      />
      <div
        className="absolute inset-0"
        style={{
          clipPath:
            "polygon(calc(668 * var(--u)) 0, calc(800 * var(--u)) 0, calc(754 * var(--u)) 100%, calc(622 * var(--u)) 100%)",
          background: "linear-gradient(95deg, rgba(11,42,82,.92), rgba(11,42,82,0))",
        }}
      />

      {/* Vòng cung: nằm dưới B1 để đuôi chui ra sau người đàn ông như mẫu */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1672 667" preserveAspectRatio="none">
        <defs>
          <linearGradient id="arc" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#ffc15e" />
            <stop offset="1" stopColor="#ff6a13" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>
        <path d="M885 99 C 960 104, 1060 165, 1105 240 S 1190 395, 1240 462 S 1330 548, 1392 570" fill="none" stroke="url(#arc)" strokeWidth="16" opacity=".6" filter="url(#glow)" />
        <path d="M885 99 C 960 104, 1060 165, 1105 240 S 1190 395, 1240 462 S 1330 548, 1392 570" fill="none" stroke="url(#arc)" strokeWidth="5" strokeLinecap="round" />
      </svg>

      {/* B1 — người + bàn, nằm trên mảng navy và vòng cung */}
      {/* Dời phải 30u so với nền: người đàn ông trong B1 đứng lệch trái so với
          mẫu, nhãn "Erfolgreich starten" đè lên tóc. Mép trái làm mờ 110u để
          đầu bàn không cắt thẳng đứng trên nền navy. */}
      <div
        ref={fg}
        className="absolute top-0 left-[calc(550*var(--u))] h-full w-[calc(1184*var(--u))] will-change-transform"
        style={{
          maskImage: "linear-gradient(to right, transparent 0, #000 calc(110 * var(--u)))",
          WebkitMaskImage: "linear-gradient(to right, transparent 0, #000 calc(110 * var(--u)))",
        }}
      >
        <Image
          src={HOME_BANNER.foreground}
          alt=""
          fill
          priority
          sizes={`${Math.round((LAYER_W / 1672) * 100)}vw`}
          className="object-cover"
        />
      </div>
      </div>
    </div>
  );
}

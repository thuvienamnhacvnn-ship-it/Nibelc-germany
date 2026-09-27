"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { JOBS_COPY, type JobOrder } from "@/content/jobs-current";
import { STAGE } from "@/content/job-stage";
import { ROUTES, jobPath, type Locale } from "@/content/locales";

/**
 * JOB STAGE — sân khấu đơn hàng, thứ đầu tiên người xem thấy khi mở web.
 *
 * Máy tính: chiếm gần trọn màn hình. Một tấm poster lớn ở giữa, các đơn còn
 * lại lùi về hai bên theo chiều sâu (xoay nhẹ, thu nhỏ, mờ đi). Số thứ tự
 * khổng lồ nằm sau ảnh. Đổi đơn bằng chuột, bàn phím (←/→), kéo ngang hoặc
 * nút; tự chạy sau 6 giây và dừng hẳn khi người xem chạm vào.
 *
 * Điện thoại: một "rạp" riêng — ảnh nghề chiếm phần lớn màn hình, chữ và nút
 * nằm trong vùng ngón cái, vuốt ngang để đổi đơn, tấm kế lộ một phần để báo
 * hiệu vuốt được. Không thu nhỏ bố cục máy tính.
 *
 * Mọi số liệu đọc từ `content/jobs-current.ts`. Người bật "giảm chuyển động"
 * thì không tự chạy và không có chuyển cảnh.
 */

const AUTO_MS = 6000;

export function JobStage({ locale, jobs }: { locale: Locale; jobs: JobOrder[] }) {
  const t = STAGE[locale];
  const c = JOBS_COPY[locale];
  const n = jobs.length;

  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [progress, setProgress] = useState(0);
  const reduced = useRef(false);
  const track = useRef<HTMLUListElement>(null);
  const drag = useRef<{ x: number; on: boolean }>({ x: 0, on: false });

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) setAuto(false);
  }, []);

  const go = useCallback(
    (dir: 1 | -1) => {
      setAuto(false);
      setActive((i) => (i + dir + n) % n);
    },
    [n],
  );

  useEffect(() => {
    if (!auto || n < 2) return;
    const started = Date.now();
    const id = window.setInterval(() => {
      const p = Math.min(1, (Date.now() - started) / AUTO_MS);
      setProgress(p);
      if (p >= 1) setActive((i) => (i + 1) % n);
    }, 80);
    return () => window.clearInterval(id);
  }, [auto, active, n]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // kéo ngang bằng chuột / touchpad trên máy tính
  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, on: true };
    setAuto(false);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag.current.on) return;
    const dx = e.clientX - drag.current.x;
    drag.current.on = false;
    if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
  };

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / (el.clientWidth * 0.88));
    setActive(Math.max(0, Math.min(n - 1, i)));
  };

  const job = jobs[active]!;
  const fallback = INDUSTRY_ASSETS["gartenbau-gaertner"]!.hero;

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t.title}
      onMouseEnter={() => setAuto(false)}
      onTouchStart={() => setAuto(false)}
      className="relative isolate overflow-hidden bg-[#071322] text-[#F6F4EF]"
    >
      {/* nền: ảnh của đơn đang xem, làm mờ và tối */}
      <div className="absolute inset-0 -z-10">
        {jobs.map((j, i) => (
          <Image
            key={j.id}
            src={INDUSTRY_ASSETS[j.industry]?.hero ?? fallback}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover transition-opacity duration-700 motion-reduce:transition-none ${i === active ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <span className="absolute inset-0 bg-[#071322]/85" aria-hidden="true" />
        <span
          className="absolute inset-0"
          style={{ background: "radial-gradient(58% 52% at 50% 42%, rgba(213,166,75,.18), rgba(7,19,34,0) 70%)" }}
          aria-hidden="true"
        />
      </div>

      {/* ------------------------------------------------ MÁY TÍNH */}
      <div className="relative mx-auto hidden min-h-[88svh] max-w-[1600px] flex-col justify-center px-10 py-12 lg:flex">
        <div className="flex items-end justify-between gap-6">
          <p className="flex items-center gap-3 text-[11px] font-bold tracking-[0.3em] text-[#D5A64B] uppercase">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D5A64B] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D5A64B]" />
            </span>
            {t.eyebrow}
          </p>
          <Link
            href={ROUTES.jobs[locale] as Route}
            className="flex items-center gap-2 rounded-full border border-[#F6F4EF]/25 px-5 py-2.5 text-sm font-semibold transition hover:border-[#D5A64B] hover:text-[#D5A64B]"
          >
            {t.all}
            <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>

        <div
          className="relative mt-7 h-[540px] cursor-grab select-none active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          {/* số thứ tự khổng lồ nằm sau ảnh */}
          <span
            key={`num-${active}`}
            aria-hidden="true"
            className="nb-kinetic pointer-events-none absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 text-[20vw] leading-none font-black text-[#F6F4EF]/[.09]"
          >
            {String(active + 1).padStart(2, "0")}
          </span>

          {jobs.map((j, i) => {
            const d = ((((i - active + n) % n) + Math.floor(n / 2)) % n) - Math.floor(n / 2);
            const off = Math.max(-1, Math.min(1, d));
            const isActive = d === 0;
            const img = INDUSTRY_ASSETS[j.industry]?.hero ?? fallback;

            return (
              <article
                key={j.id}
                aria-hidden={!isActive}
                className="absolute top-0 left-1/2 w-[620px] transition-[transform,opacity,filter] duration-[700ms] ease-[cubic-bezier(.2,.75,.2,1)] motion-reduce:transition-none"
                style={{
                  transform: `translate3d(calc(-50% + ${off * 470}px), ${isActive ? 0 : 38}px, 0) scale(${isActive ? 1 : 0.76}) rotateY(${off * -7}deg)`,
                  opacity: Math.abs(d) > 1 ? 0 : isActive ? 1 : 0.42,
                  filter: isActive ? "none" : "saturate(.5) brightness(.82)",
                  pointerEvents: isActive ? "auto" : "none",
                  zIndex: isActive ? 20 : 10,
                }}
              >
                <Link
                  href={jobPath(locale, j.id) as Route}
                  className="group relative block h-[540px] overflow-hidden rounded-[28px] ring-1 ring-[#F6F4EF]/15"
                  style={isActive ? ({ viewTransitionName: `job-${j.id}` } as React.CSSProperties) : undefined}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    sizes="620px"
                    className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.05] motion-reduce:transition-none"
                  />
                  <span
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(180deg, rgba(7,19,34,.12) 22%, rgba(7,19,34,.93) 78%)" }}
                    aria-hidden="true"
                  />

                  <span className="absolute top-6 left-6 flex items-center gap-2 rounded-full bg-[#071322]/70 px-4 py-2 text-xs font-bold tracking-[0.18em] uppercase backdrop-blur">
                    <Icon name="germany" className="h-4 w-4 text-[#D5A64B]" />
                    {t.country}
                  </span>

                  <span className="absolute inset-x-0 bottom-0 p-8">
                    {isActive && (
                      <span key={`title-${j.id}`} className="block">
                        <span className="nb-kinetic block text-[12px] font-bold tracking-[0.26em] text-[#D5A64B] uppercase" style={{ animationDelay: "40ms" }}>
                          {j.locations.join(" · ")}
                        </span>
                        <span className="nb-kinetic mt-3 block text-[36px] leading-[1.06] font-black tracking-[-0.03em]" style={{ animationDelay: "120ms" }}>
                          {j.title[locale]}
                        </span>
                        <span className="nb-kinetic mt-5 flex flex-wrap items-end gap-x-8 gap-y-3" style={{ animationDelay: "220ms" }}>
                          <span className="block">
                            <span className="block text-[10px] tracking-[0.2em] text-[#F6F4EF]/55 uppercase">{c.salaryLabel}</span>
                            <b className="block text-[24px] leading-tight font-black text-[#D5A64B]">
                              {j.salary.from.toLocaleString("de-DE")} – {j.salary.to.toLocaleString("de-DE")} €
                            </b>
                          </span>
                          <span className="block">
                            <span className="block text-[10px] tracking-[0.2em] text-[#F6F4EF]/55 uppercase">{c.slotsLabel}</span>
                            <b className="block text-[24px] leading-tight font-black">{j.slots}</b>
                          </span>
                          <span className="block">
                            <span className="block text-[10px] tracking-[0.2em] text-[#F6F4EF]/55 uppercase">{c.hoursLabel}</span>
                            <b className="block text-[24px] leading-tight font-black">{j.hoursPerWeek} h</b>
                          </span>
                        </span>
                        <span
                          className="nb-kinetic mt-6 flex h-12 w-fit items-center gap-3 rounded-full bg-[#D5A64B] px-7 font-bold text-[#231a05] transition-[gap] group-hover:gap-5"
                          style={{ animationDelay: "320ms" }}
                        >
                          {t.detail}
                          <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2.4} />
                        </span>
                      </span>
                    )}
                  </span>
                </Link>
              </article>
            );
          })}
        </div>

        <div className="mt-9 flex items-center gap-5">
          <button type="button" onClick={() => go(-1)} aria-label={t.prev} className="flex h-12 w-12 items-center justify-center rounded-full border border-[#F6F4EF]/25 transition hover:border-[#D5A64B] hover:text-[#D5A64B]">
            <Icon name="chevronRight" className="h-5 w-5 rotate-180" strokeWidth={2} />
          </button>
          <button type="button" onClick={() => go(1)} aria-label={t.next} className="flex h-12 w-12 items-center justify-center rounded-full border border-[#F6F4EF]/25 transition hover:border-[#D5A64B] hover:text-[#D5A64B]">
            <Icon name="chevronRight" className="h-5 w-5" strokeWidth={2} />
          </button>

          <span className="text-sm tabular-nums text-[#F6F4EF]/60">
            <b className="text-[#F6F4EF]">{String(active + 1).padStart(2, "0")}</b> / {String(n).padStart(2, "0")}
          </span>

          <span className="h-px flex-1 overflow-hidden bg-[#F6F4EF]/15" aria-hidden="true">
            <span
              className="block h-full bg-[#D5A64B] transition-[width] duration-100 ease-linear"
              style={{ width: `${auto ? progress * 100 : ((active + 1) / n) * 100}%` }}
            />
          </span>

          <button
            type="button"
            onClick={() => setAuto((v) => !v)}
            aria-label={auto ? t.pause : t.play}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-[#F6F4EF]/25 transition hover:border-[#D5A64B] hover:text-[#D5A64B]"
          >
            <Icon name={auto ? "pause" : "play"} className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------ ĐIỆN THOẠI */}
      <div className="relative flex min-h-[86svh] flex-col lg:hidden">
        <div className="flex items-center justify-between px-5 pt-5">
          <p className="flex items-center gap-2 text-[10px] font-bold tracking-[0.24em] text-[#D5A64B] uppercase">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D5A64B] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D5A64B]" />
            </span>
            {t.eyebrow}
          </p>
          <span className="text-xs tabular-nums text-[#F6F4EF]/60">
            <b className="text-[#F6F4EF]">{String(active + 1).padStart(2, "0")}</b> / {String(n).padStart(2, "0")}
          </span>
        </div>

        <ul
          ref={track}
          onScroll={onScroll}
          className="mt-4 flex flex-1 snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {jobs.map((j) => {
            const img = INDUSTRY_ASSETS[j.industry]?.hero ?? fallback;
            return (
              <li key={j.id} className="w-[88%] shrink-0 snap-center">
                <Link
                  href={jobPath(locale, j.id) as Route}
                  className="relative flex h-full min-h-[60svh] flex-col justify-end overflow-hidden rounded-[24px] ring-1 ring-[#F6F4EF]/15"
                  style={{ viewTransitionName: `job-${j.id}` } as React.CSSProperties}
                >
                  <Image src={img} alt="" fill sizes="88vw" className="object-cover" />
                  <span
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(180deg, rgba(7,19,34,.08) 28%, rgba(7,19,34,.94) 84%)" }}
                    aria-hidden="true"
                  />
                  <span className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-[#071322]/70 px-3 py-1.5 text-[10px] font-bold tracking-[0.16em] uppercase backdrop-blur">
                    <Icon name="germany" className="h-3.5 w-3.5 text-[#D5A64B]" />
                    {t.country}
                  </span>

                  <span className="relative p-5">
                    <span className="block text-[11px] font-bold tracking-[0.2em] text-[#D5A64B] uppercase">{j.locations[0]}</span>
                    <span className="mt-2 block text-[23px] leading-[1.12] font-black tracking-[-0.02em]">{j.title[locale]}</span>
                    <span className="mt-3 flex items-end gap-6">
                      <span>
                        <span className="block text-[10px] tracking-[0.18em] text-[#F6F4EF]/55 uppercase">{c.salaryLabel}</span>
                        <b className="block text-lg leading-tight font-black text-[#D5A64B]">
                          {j.salary.from.toLocaleString("de-DE")} – {j.salary.to.toLocaleString("de-DE")} €
                        </b>
                      </span>
                      <span>
                        <span className="block text-[10px] tracking-[0.18em] text-[#F6F4EF]/55 uppercase">{c.slotsLabel}</span>
                        <b className="block text-lg leading-tight font-black">{j.slots}</b>
                      </span>
                    </span>
                    <span className="mt-4 flex h-12 items-center justify-center gap-2 rounded-xl bg-[#D5A64B] font-bold text-[#231a05]">
                      {t.detail}
                      <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2.4} />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3 px-5 pb-5">
          <span className="h-px flex-1 overflow-hidden bg-[#F6F4EF]/15" aria-hidden="true">
            <span className="block h-full bg-[#D5A64B] transition-[width] duration-300" style={{ width: `${((active + 1) / n) * 100}%` }} />
          </span>
          <Link href={ROUTES.jobs[locale] as Route} className="flex items-center gap-1.5 text-xs font-semibold text-[#F6F4EF]/80">
            {t.all}
            <Icon name="arrowRight" className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {t.ofLabel(active + 1, n)} — {job.title[locale]} · {job.slots} {c.slots}
      </p>
    </section>
  );
}

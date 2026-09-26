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
 * SÂN KHẤU ĐƠN HÀNG — trang chủ trình diễn các đơn đang tuyển.
 *
 * Máy tính: ba tấm nằm ngang, tấm giữa nổi hẳn, hai tấm bên lùi lại và nhỏ hơn
 * để tạo chiều sâu. Tự chuyển sau 6,5 giây và DỪNG HẲN ngay khi người xem chạm
 * vào (rê chuột, bấm nút, dùng bàn phím) — không giành quyền điều khiển.
 * Điện thoại: mỗi màn một đơn, vuốt ngang bằng cuộn có điểm dừng (scroll-snap),
 * không dùng thư viện hiệu ứng nào.
 *
 * Mọi số liệu đọc thẳng từ `content/jobs-current.ts`; ở đây không có dữ liệu.
 * Người bật "giảm chuyển động" thì không có chuyển động tự động và không có
 * biến đổi tỷ lệ.
 */

const AUTO_MS = 6500;

function fmtSalary(j: JobOrder) {
  return `${j.salary.from.toLocaleString("de-DE")} – ${j.salary.to.toLocaleString("de-DE")} €`;
}

export function JobStage({ locale, jobs }: { locale: Locale; jobs: JobOrder[] }) {
  const t = STAGE[locale];
  const c = JOBS_COPY[locale];
  const n = jobs.length;
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [progress, setProgress] = useState(0);
  const track = useRef<HTMLUListElement>(null);
  const reduced = useRef(false);

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

  // tự chuyển + thanh tiến trình
  useEffect(() => {
    if (!auto || n < 2) return;
    const started = Date.now();
    const tick = window.setInterval(() => {
      const p = Math.min(1, (Date.now() - started) / AUTO_MS);
      setProgress(p);
      if (p >= 1) setActive((i) => (i + 1) % n);
    }, 80);
    return () => window.clearInterval(tick);
  }, [auto, active, n]);

  useEffect(() => {
    if (!auto) setProgress(0);
  }, [auto]);

  // bàn phím
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    const el = track.current?.closest("section");
    el?.addEventListener("keydown", onKey as EventListener);
    return () => el?.removeEventListener("keydown", onKey as EventListener);
  }, [go]);

  // điện thoại: cuộn tới đâu thì chấm sáng tới đó
  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / (el.clientWidth * 0.86));
    setActive(Math.max(0, Math.min(n - 1, i)));
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t.title}
      tabIndex={-1}
      onMouseEnter={() => setAuto(false)}
      onTouchStart={() => setAuto(false)}
      className="relative overflow-hidden bg-[#071d3a] py-10 text-white lg:py-16"
    >
      {/* vệt sáng nền, rất nhẹ */}
      <span
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full opacity-45 blur-[90px]"
        style={{ background: "radial-gradient(closest-side, rgba(45,120,220,.55), rgba(7,29,58,0))" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1400px] px-5 lg:px-10">
        {/* tiêu đề khối */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] text-[#8fc0ff] uppercase lg:text-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--nb-orange)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--nb-orange)]" />
              </span>
              {t.eyebrow}
            </p>
            <h2 className="mt-3 max-w-[18ch] text-[28px] leading-[1.1] font-extrabold tracking-[-0.02em] text-white lg:text-[44px]">
              {t.title}
            </h2>
            <p className="mt-3 max-w-[60ch] text-sm text-white/70 lg:text-base">{t.lead}</p>
          </div>

          <Link
            href={ROUTES.jobs[locale] as Route}
            className="hidden items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold hover:bg-white/10 lg:inline-flex"
          >
            {t.all}
            <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>

        {/* ---------- MÁY TÍNH: ba tấm, tấm giữa nổi ---------- */}
        <div className="relative mt-10 hidden h-[430px] lg:block">
          {jobs.map((j, i) => {
            const d = ((i - active + n) % n + Math.floor(n / 2)) % n - Math.floor(n / 2);
            const off = Math.max(-1, Math.min(1, d));
            const isActive = d === 0;
            return (
              <article
                key={j.id}
                aria-hidden={!isActive}
                className="absolute top-0 left-1/2 w-[620px] transition-[transform,opacity] duration-700 ease-[cubic-bezier(.2,.7,.2,1)] motion-reduce:transition-none"
                style={{
                  transform: `translate3d(calc(-50% + ${off * 430}px), ${isActive ? 0 : 26}px, 0) scale(${isActive ? 1 : 0.82})`,
                  opacity: Math.abs(d) > 1 ? 0 : isActive ? 1 : 0.5,
                  zIndex: isActive ? 20 : 10,
                  filter: isActive ? "none" : "saturate(.6)",
                  pointerEvents: isActive ? "auto" : "none",
                }}
              >
                <StageCard job={j} locale={locale} big />
              </article>
            );
          })}
        </div>

        {/* mép trái/phải mờ dần để hai tấm bên chìm vào nền */}
        <span className="pointer-events-none absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-[#071d3a] to-transparent lg:block" aria-hidden="true" />
        <span className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-l from-[#071d3a] to-transparent lg:block" aria-hidden="true" />

        {/* điều khiển máy tính */}
        <div className="mt-6 hidden items-center gap-4 lg:flex">
          <button type="button" onClick={() => go(-1)} aria-label={t.prev} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 hover:bg-white/10">
            <Icon name="chevronRight" className="h-5 w-5 rotate-180" strokeWidth={2} />
          </button>
          <button type="button" onClick={() => go(1)} aria-label={t.next} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 hover:bg-white/10">
            <Icon name="chevronRight" className="h-5 w-5" strokeWidth={2} />
          </button>

          <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/15" aria-hidden="true">
            <span
              className="block h-full rounded-full bg-[var(--nb-orange)] transition-[width] duration-100 ease-linear"
              style={{ width: `${auto ? progress * 100 : ((active + 1) / n) * 100}%` }}
            />
          </span>

          <span className="text-sm tabular-nums text-white/70">{t.ofLabel(active + 1, n)}</span>

          <button
            type="button"
            onClick={() => setAuto((v) => !v)}
            aria-label={auto ? t.pause : t.play}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 hover:bg-white/10"
          >
            <Icon name={auto ? "pause" : "play"} className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {/* ---------- ĐIỆN THOẠI: vuốt ngang ---------- */}
        <ul
          ref={track}
          onScroll={onScroll}
          className="mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {jobs.map((j) => (
            <li key={j.id} className="w-[86%] shrink-0 snap-center">
              <StageCard job={j} locale={locale} />
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between lg:hidden">
          <span className="flex gap-1.5" aria-hidden="true">
            {jobs.map((j, i) => (
              <span key={j.id} className={`h-1.5 rounded-full transition-all ${i === active ? "w-6 bg-[var(--nb-orange)]" : "w-1.5 bg-white/35"}`} />
            ))}
          </span>
          <Link href={ROUTES.jobs[locale] as Route} className="flex items-center gap-1.5 text-sm font-semibold text-white/85">
            {t.all}
            <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>

        <p className="sr-only" aria-live="polite">
          {t.ofLabel(active + 1, n)} — {jobs[active]?.title[locale]} · {jobs[active]?.slots} {c.slots}
        </p>
      </div>
    </section>
  );
}

/** Một tấm đơn hàng. `big` là bản dùng ở giữa sân khấu trên máy tính. */
function StageCard({ job, locale, big }: { job: JobOrder; locale: Locale; big?: boolean }) {
  const t = STAGE[locale];
  const c = JOBS_COPY[locale];
  const img = INDUSTRY_ASSETS[job.industry]?.hero ?? INDUSTRY_ASSETS["gartenbau-gaertner"]!.hero;

  return (
    <Link
      href={jobPath(locale, job.id) as Route}
      className="group block overflow-hidden rounded-2xl bg-[#0d2banchor] ring-1 ring-white/12 transition hover:ring-white/35"
      style={{ background: "linear-gradient(180deg,#0d2b52,#0a2039)" }}
    >
      <span className={`relative block w-full overflow-hidden ${big ? "h-[230px]" : "h-[170px]"}`}>
        <Image
          src={img}
          alt=""
          fill
          sizes={big ? "620px" : "86vw"}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transition-none"
        />
        <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(7,29,58,.05), rgba(7,29,58,.85))" }} aria-hidden="true" />
        <span className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-[var(--nb-orange)] px-3.5 py-1.5 text-sm font-bold text-white">
          {job.slots}
          <span className="text-xs font-semibold">{c.slots}</span>
        </span>
        <span className="absolute right-4 bottom-4 flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1 text-xs font-semibold backdrop-blur">
          <Icon name="pin" className="h-3.5 w-3.5" strokeWidth={1.9} />
          {t.country}
        </span>
      </span>

      <span className="block p-5 lg:p-6">
        <span className={`block font-extrabold tracking-[-0.01em] text-white ${big ? "text-[26px] leading-[1.15]" : "text-[19px] leading-[1.2]"}`}>
          {job.title[locale]}
        </span>
        <span className="mt-2 block text-sm text-white/65">{job.locations.join(" · ")}</span>

        <span className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/12 pt-4 text-sm">
          <span className="flex items-center gap-2">
            <Icon name="chart" className="h-4 w-4 text-[#8fc0ff]" strokeWidth={1.9} />
            <b className="font-bold text-white">{fmtSalary(job)}</b>
            <span className="text-white/55">{c.perMonth}</span>
          </span>
          <span className="flex items-center gap-2 text-white/75">
            <Icon name="clock" className="h-4 w-4 text-[#8fc0ff]" strokeWidth={1.9} />
            {job.hoursPerWeek} h
          </span>
        </span>

        <span className="mt-5 flex h-11 items-center justify-center gap-2 rounded-xl bg-white/12 font-semibold text-white transition group-hover:bg-[var(--nb-orange)]">
          {t.detail}
          <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2} />
        </span>
      </span>
    </Link>
  );
}

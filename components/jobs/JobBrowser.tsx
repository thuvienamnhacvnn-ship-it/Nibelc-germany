"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { JOBS_COPY, type JobOrder } from "@/content/jobs-current";
import { STAGE } from "@/content/job-stage";
import { jobPath, type Locale } from "@/content/locales";

/**
 * Bộ duyệt đơn hàng — theo màn 02 của bộ mẫu mới: thanh lọc phía trên, danh
 * mục ngành bên trái (kèm số đếm), lưới thẻ có ảnh bên phải.
 *
 * Bộ lọc chỉ dùng những gì dữ liệu thật có: ngành nghề, nơi làm việc và mức
 * lương. Mẫu còn có ô "Quốc gia" và "Trạng thái" — mọi đơn đều ở Đức và dữ
 * liệu không có trường trạng thái, nên hai ô đó không dựng.
 */

const WORDS: Record<Locale, { filter: string; industry: string; location: string; salary: string; all: string; reset: string; found: (n: number) => string; empty: string; from: string }> = {
  de: {
    filter: "Filter",
    industry: "Branche",
    location: "Einsatzort",
    salary: "Vergütung ab",
    all: "Alle",
    reset: "Filter zurücksetzen",
    found: (n) => `${n} ${n === 1 ? "Stelle" : "Stellen"}`,
    empty: "Für diese Auswahl gibt es gerade keine Stelle.",
    from: "ab",
  },
  en: {
    filter: "Filter",
    industry: "Industry",
    location: "Location",
    salary: "Pay from",
    all: "All",
    reset: "Reset filters",
    found: (n) => `${n} ${n === 1 ? "position" : "positions"}`,
    empty: "No position matches this selection right now.",
    from: "from",
  },
  vi: {
    filter: "Bộ lọc",
    industry: "Ngành nghề",
    location: "Nơi làm việc",
    salary: "Lương từ",
    all: "Tất cả",
    reset: "Xoá bộ lọc",
    found: (n) => `${n} đơn hàng`,
    empty: "Chưa có đơn hàng nào khớp lựa chọn này.",
    from: "từ",
  },
};

const SELECT =
  "h-11 w-full rounded-lg border border-[#cdd8e6] bg-white px-3 text-sm text-[#10284d] outline-none focus:border-[#1d5fd6] focus:ring-2 focus:ring-[#1d5fd6]/20";

export function JobBrowser({
  locale,
  jobs,
  industries,
}: {
  locale: Locale;
  jobs: JobOrder[];
  /** Tên ngành theo ngôn ngữ, truyền từ server để không lặp dữ liệu */
  industries: { slug: string; name: string }[];
}) {
  const w = WORDS[locale];
  const c = JOBS_COPY[locale];
  const t = STAGE[locale];

  // từ khoá đến từ ô tìm trên banner trang chủ (?q=)
  const q = (useSearchParams().get("q") ?? "").trim().toLowerCase();
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [minSalary, setMinSalary] = useState(0);

  const locations = useMemo(() => [...new Set(jobs.flatMap((j) => j.locations))].sort(), [jobs]);
  const steps = useMemo(() => {
    const lows = jobs.map((j) => j.salary.from).sort((a, b) => a - b);
    return [...new Set(lows)];
  }, [jobs]);

  const matches = (j: JobOrder) =>
    !q ||
    [j.title[locale], j.summary[locale], ...j.locations, industries.find((i) => i.slug === j.industry)?.name ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(q);

  const shown = jobs.filter(
    (j) =>
      matches(j) &&
      (!industry || j.industry === industry) &&
      (!location || j.locations.includes(location)) &&
      j.salary.from >= minSalary,
  );

  const countFor = (slug: string) => jobs.filter((j) => j.industry === slug).length;
  const active = Boolean(industry || location || minSalary > 0 || q);

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-10 lg:px-10 lg:py-14">
      {/* thanh lọc */}
      <div className="grid gap-3 rounded-2xl bg-[#f7f9fc] p-4 ring-1 ring-[#e3e9f1] sm:grid-cols-3 lg:p-5">
        <label className="block text-xs font-semibold tracking-wide text-[#5b6b80] uppercase">
          {w.industry}
          <select value={industry} onChange={(e) => setIndustry(e.target.value)} className={`${SELECT} mt-1.5`}>
            <option value="">{w.all}</option>
            {industries
              .filter((i) => countFor(i.slug) > 0)
              .map((i) => (
                <option key={i.slug} value={i.slug}>
                  {i.name} ({countFor(i.slug)})
                </option>
              ))}
          </select>
        </label>

        <label className="block text-xs font-semibold tracking-wide text-[#5b6b80] uppercase">
          {w.location}
          <select value={location} onChange={(e) => setLocation(e.target.value)} className={`${SELECT} mt-1.5`}>
            <option value="">{w.all}</option>
            {locations.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </label>

        <label className="block text-xs font-semibold tracking-wide text-[#5b6b80] uppercase">
          {w.salary}
          <select value={minSalary} onChange={(e) => setMinSalary(Number(e.target.value))} className={`${SELECT} mt-1.5`}>
            <option value={0}>{w.all}</option>
            {steps.map((s) => (
              <option key={s} value={s}>
                {w.from} {s.toLocaleString("de-DE")} €
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[230px_minmax(0,1fr)]">
        {/* danh mục ngành */}
        <aside className="hidden lg:block">
          <p className="text-xs font-bold tracking-[0.16em] text-[#5b6b80] uppercase">{w.industry}</p>
          <ul className="mt-3 space-y-1">
            <li>
              <button
                type="button"
                onClick={() => setIndustry("")}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm ${
                  industry === "" ? "bg-[#eaf1fa] font-semibold text-[#10284d]" : "text-[#2a3d58] hover:bg-[var(--nb-strip)]"
                }`}
              >
                {w.all}
                <span className="text-xs text-[#5b6b80]">{jobs.length}</span>
              </button>
            </li>
            {industries
              .filter((i) => countFor(i.slug) > 0)
              .map((i) => (
                <li key={i.slug}>
                  <button
                    type="button"
                    onClick={() => setIndustry(i.slug)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                      industry === i.slug ? "bg-[#eaf1fa] font-semibold text-[#10284d]" : "text-[#2a3d58] hover:bg-[var(--nb-strip)]"
                    }`}
                  >
                    <span className="min-w-0 truncate">{i.name}</span>
                    <span className="text-xs text-[#5b6b80]">{countFor(i.slug)}</span>
                  </button>
                </li>
              ))}
          </ul>
        </aside>

        {/* lưới thẻ */}
        <div>
          <p className="flex flex-wrap items-center gap-3 text-sm text-[#5b6b80]">
            <b className="text-[#10284d]">{w.found(shown.length)}</b>
            {active && (
              <button
                type="button"
                onClick={() => {
                  setIndustry("");
                  setLocation("");
                  setMinSalary(0);
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--nb-strip)] px-3 py-1 font-semibold text-[#10284d]"
              >
                <Icon name="close" className="h-3.5 w-3.5" strokeWidth={2} />
                {w.reset}
              </button>
            )}
          </p>

          {shown.length === 0 ? (
            <p className="mt-6 rounded-2xl bg-[#f7f9fc] p-8 text-center text-[#5b6b80] ring-1 ring-[#e3e9f1]">{w.empty}</p>
          ) : (
            <ul className="mt-5 grid gap-5 sm:grid-cols-2">
              {shown.map((j) => (
                <li key={j.id}>
                  <Link
                    href={jobPath(locale, j.id) as Route}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-[#e3e9f1] transition hover:ring-[#1d5fd6]"
                  >
                    <span className="relative block h-[168px] overflow-hidden">
                      <Image
                        src={INDUSTRY_ASSETS[j.industry]?.hero ?? INDUSTRY_ASSETS["gartenbau-gaertner"]!.hero}
                        alt=""
                        fill
                        sizes="(min-width:640px) 45vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                      />
                      <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#10284d]">
                        <Icon name="germany" className="h-3.5 w-3.5" />
                        {t.country}
                      </span>
                      <span className="absolute right-3 bottom-3 rounded-full bg-[var(--nb-orange)] px-3 py-1 text-xs font-bold text-white">
                        {j.slots} {c.slots}
                      </span>
                    </span>

                    <span className="flex flex-1 flex-col p-5">
                      <span className="block text-lg leading-snug font-bold text-[#10284d]">{j.title[locale]}</span>
                      <span className="mt-1 block text-sm text-[#5b6b80]">{j.locations.join(" · ")}</span>

                      <span className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                        <span className="flex items-center gap-1.5 font-bold text-[#10284d]">
                          <Icon name="chart" className="h-4 w-4 text-[#1f4f9f]" strokeWidth={1.9} />
                          {j.salary.from.toLocaleString("de-DE")} – {j.salary.to.toLocaleString("de-DE")} €
                        </span>
                        <span className="flex items-center gap-1.5 text-[#5b6b80]">
                          <Icon name="clock" className="h-4 w-4 text-[#1f4f9f]" strokeWidth={1.9} />
                          {j.hoursPerWeek} h
                        </span>
                      </span>

                      <span className="mt-4 flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--nb-strip)] font-semibold text-[#10284d] transition group-hover:bg-[var(--nb-orange)] group-hover:text-white">
                        {t.detail}
                        <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2} />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

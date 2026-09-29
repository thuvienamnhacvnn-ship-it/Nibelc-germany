"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { jobPath, type Locale } from "@/content/locales";
import type { JobFull } from "@/content/jobs-all";

/**
 * TRANG 02 — DANH SÁCH ĐƠN HÀNG (Job Explorer), dựng theo KIT.
 *
 * Bên trái là cột lọc đếm số đơn theo quốc gia và theo ngành; bên phải là
 * danh sách thẻ NGANG (ảnh trái – thông tin phải – nút xem chi tiết). Lọc chạy
 * ngay tại trình duyệt trên đúng danh sách đơn hàng thật, không gọi mạng.
 */

const EUR = (n: number) => n.toLocaleString("de-DE");

export interface ExplorerCopy {
  locTatCa: string;
  quocGia: string;
  nganhNghe: string;
  mucLuong: string;
  tim: string;
  xemChiTiet: string;
  khongCo: string;
  ketQua: string;
  moiMuc: string;
  khac: string;
}

export function JobExplorer({
  locale,
  jobs,
  nganhs,
  copy,
  perMonth,
  slotsLabel,
}: {
  locale: Locale;
  jobs: JobFull[];
  /** [slug, tên ngành] của các ngành đang mở */
  nganhs: [string, string][];
  copy: ExplorerCopy;
  perMonth: string;
  slotsLabel: string;
}) {
  const [nuoc, setNuoc] = useState<string>("");
  const [nganh, setNganh] = useState<string>("");
  const [luongMin, setLuongMin] = useState<number>(0);
  const [tuKhoa, setTuKhoa] = useState<string>("");

  const nuocs = useMemo(() => {
    const m = new Map<string, { name: string; flag: string[]; count: number }>();
    for (const j of jobs) {
      const cu = m.get(j.country);
      if (cu) cu.count++;
      else m.set(j.country, { name: j.countryName, flag: j.flag, count: 1 });
    }
    return [...m.entries()];
  }, [jobs]);

  const demNganh = useMemo(() => {
    const m = new Map<string, number>();
    for (const j of jobs) if (j.industry) m.set(j.industry, (m.get(j.industry) ?? 0) + 1);
    return m;
  }, [jobs]);

  const khongNganh = jobs.filter((j) => !j.industry).length;

  const loc = useMemo(
    () =>
      jobs.filter(
        (j) =>
          (!nuoc || j.country === nuoc) &&
          (!nganh || (nganh === "_khac" ? !j.industry : j.industry === nganh)) &&
          j.salary.to >= luongMin &&
          (!tuKhoa || `${j.title} ${j.summary} ${j.countryName}`.toLowerCase().includes(tuKhoa.toLowerCase())),
      ),
    [jobs, nuoc, nganh, luongMin, tuKhoa],
  );

  const oLoc = "nb-sub-field appearance-none pr-10 !py-3";

  return (
    <div className="mx-auto max-w-[1560px] px-6 py-12 lg:px-12 lg:py-16">
      {/* ---------------- HÀNG BỘ LỌC ---------------- */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="nb-sub-panel grid gap-3 p-4 md:grid-cols-[1fr_1fr_1fr_auto] lg:p-5"
      >
        <label className="relative block">
          <span className="sr-only">{copy.quocGia}</span>
          <select value={nuoc} onChange={(e) => setNuoc(e.target.value)} className={oLoc}>
            <option value="">{copy.quocGia}</option>
            {nuocs.map(([code, v]) => (
              <option key={code} value={code}>
                {v.name} ({v.count})
              </option>
            ))}
          </select>
          <Icon name="chevronDown" className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-white/40" strokeWidth={2} />
        </label>

        <label className="relative block">
          <span className="sr-only">{copy.nganhNghe}</span>
          <select value={nganh} onChange={(e) => setNganh(e.target.value)} className={oLoc}>
            <option value="">{copy.nganhNghe}</option>
            {nganhs
              .filter(([slug]) => demNganh.get(slug))
              .map(([slug, ten]) => (
                <option key={slug} value={slug}>
                  {ten} ({demNganh.get(slug)})
                </option>
              ))}
            {khongNganh > 0 && (
              <option value="_khac">
                {copy.khac} ({khongNganh})
              </option>
            )}
          </select>
          <Icon name="chevronDown" className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-white/40" strokeWidth={2} />
        </label>

        <label className="relative block">
          <span className="sr-only">{copy.mucLuong}</span>
          <select value={luongMin} onChange={(e) => setLuongMin(Number(e.target.value))} className={oLoc}>
            <option value={0}>{copy.mucLuong}</option>
            {[1000, 1500, 2000, 2500].map((v) => (
              <option key={v} value={v}>
                ≥ {EUR(v)} €
              </option>
            ))}
          </select>
          <Icon name="chevronDown" className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-white/40" strokeWidth={2} />
        </label>

        <label className="relative flex min-w-0 items-center md:w-[220px]">
          <span className="sr-only">{copy.tim}</span>
          <input
            type="search"
            value={tuKhoa}
            onChange={(e) => setTuKhoa(e.target.value)}
            placeholder={copy.tim}
            className="nb-sub-field !py-3 pr-11"
          />
          <Icon name="search" className="pointer-events-none absolute right-4 h-4 w-4 text-[var(--nb-gold)]" strokeWidth={2} />
        </label>
      </form>

      <div className="mt-10 grid gap-8 lg:grid-cols-[250px_1fr] lg:gap-10">
        {/* ---------------- CỘT LỌC BÊN TRÁI ---------------- */}
        <aside className="lg:sticky lg:top-[100px] lg:self-start">
          <p className="text-[12px] font-bold tracking-[0.2em] text-[var(--nb-gold)] uppercase">{copy.quocGia}</p>
          <ul className="mt-4 space-y-1">
            <li>
              <button
                type="button"
                onClick={() => setNuoc("")}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[14.5px] transition ${
                  nuoc === "" ? "bg-[var(--nb-gold)]/12 text-[var(--nb-gold)]" : "text-white/70 hover:bg-white/5"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon name="globe" className="h-4 w-4" strokeWidth={1.8} />
                  {copy.locTatCa}
                </span>
                <b className="text-[13px] opacity-70">{jobs.length}</b>
              </button>
            </li>
            {nuocs.map(([code, v]) => (
              <li key={code}>
                <button
                  type="button"
                  onClick={() => setNuoc(nuoc === code ? "" : code)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[14.5px] transition ${
                    nuoc === code ? "bg-[var(--nb-gold)]/12 text-[var(--nb-gold)]" : "text-white/70 hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="inline-block h-4 w-4 shrink-0 overflow-hidden rounded-full ring-1 ring-white/25" aria-hidden="true">
                      {v.flag.map((c, i) => (
                        <span key={i} className="block h-1/3 w-full" style={{ background: c }} />
                      ))}
                    </span>
                    {v.name}
                  </span>
                  <b className="text-[13px] opacity-70">{v.count}</b>
                </button>
              </li>
            ))}
          </ul>

          <p className="mt-9 text-[12px] font-bold tracking-[0.2em] text-[var(--nb-gold)] uppercase">{copy.nganhNghe}</p>
          <ul className="mt-4 space-y-1">
            {nganhs
              .filter(([slug]) => demNganh.get(slug))
              .map(([slug, ten]) => (
                <li key={slug}>
                  <button
                    type="button"
                    onClick={() => setNganh(nganh === slug ? "" : slug)}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-[14.5px] transition ${
                      nganh === slug ? "bg-[var(--nb-gold)]/12 text-[var(--nb-gold)]" : "text-white/70 hover:bg-white/5"
                    }`}
                  >
                    <span className="min-w-0 truncate">{ten}</span>
                    <b className="shrink-0 text-[13px] opacity-70">{demNganh.get(slug)}</b>
                  </button>
                </li>
              ))}
            {khongNganh > 0 && (
              <li>
                <button
                  type="button"
                  onClick={() => setNganh(nganh === "_khac" ? "" : "_khac")}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-[14.5px] transition ${
                    nganh === "_khac" ? "bg-[var(--nb-gold)]/12 text-[var(--nb-gold)]" : "text-white/70 hover:bg-white/5"
                  }`}
                >
                  <span className="min-w-0 truncate">{copy.khac}</span>
                  <b className="shrink-0 text-[13px] opacity-70">{khongNganh}</b>
                </button>
              </li>
            )}
          </ul>
        </aside>

        {/* ---------------- DANH SÁCH THẺ NGANG ---------------- */}
        <div className="min-w-0">
          <p className="mb-5 text-[13.5px] text-white/50">
            {loc.length} {copy.ketQua}
          </p>

          {loc.length === 0 ? (
            <p className="nb-sub-panel p-10 text-center text-[15px] text-white/55">{copy.khongCo}</p>
          ) : (
            <ul className="space-y-5">
              {loc.map((j) => (
                <li key={j.id}>
                  <Link
                    href={jobPath(locale, j.id) as Route}
                    className="nb-sub-panel nb-sub-panel-hover group flex flex-col overflow-hidden sm:flex-row"
                  >
                    <span className="relative block h-[190px] shrink-0 sm:h-auto sm:w-[240px] lg:w-[280px]">
                      <Image
                        src={j.image}
                        alt=""
                        fill
                        sizes="(min-width:1024px) 280px, (min-width:640px) 240px, 100vw"
                        className="object-cover"
                        style={{ objectPosition: j.imageFocus }}
                      />
                    </span>

                    <span className="flex min-w-0 flex-1 flex-col gap-4 p-5 sm:flex-row sm:items-center lg:p-6">
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="inline-block h-[18px] w-[18px] shrink-0 overflow-hidden rounded-full ring-1 ring-white/30" aria-hidden="true">
                            {j.flag.map((c, i) => (
                              <span key={i} className="block h-1/3 w-full" style={{ background: c }} />
                            ))}
                          </span>
                          <span className="text-[12.5px] text-white/55">{j.countryName}</span>
                        </span>

                        <b className="mt-2 block text-[19px] leading-snug font-bold text-white lg:text-[21px]">{j.title}</b>

                        <span className="mt-2.5 flex flex-wrap items-baseline gap-x-2">
                          <b className="text-[19px] font-bold text-[var(--nb-gold)]">
                            {j.salary.from === j.salary.to ? `${EUR(j.salary.from)} €` : `${EUR(j.salary.from)} – ${EUR(j.salary.to)} €`}
                          </b>
                          <span className="text-[13.5px] text-white/50">{perMonth}</span>
                        </span>

                        <span className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                          {j.slots !== undefined && (
                            <span className="flex items-center gap-2 text-[13px] text-white/60">
                              <Icon name="users" className="h-4 w-4 text-[var(--nb-gold)]" strokeWidth={1.8} />
                              {j.slots} {slotsLabel}
                            </span>
                          )}
                          {j.contract && (
                            <span className="flex items-center gap-2 text-[13px] text-white/60">
                              <Icon name="doc" className="h-4 w-4 text-[var(--nb-gold)]" strokeWidth={1.8} />
                              {j.contract}
                            </span>
                          )}
                          {j.hoursPerWeek !== undefined && (
                            <span className="flex items-center gap-2 text-[13px] text-white/60">
                              <Icon name="clock" className="h-4 w-4 text-[var(--nb-gold)]" strokeWidth={1.8} />
                              {j.hoursPerWeek} h
                            </span>
                          )}
                        </span>
                      </span>

                      <span className="nb-sub-cta h-11 shrink-0 self-start px-5 text-[14px] sm:self-center">
                        {copy.xemChiTiet}
                        <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2.2} />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

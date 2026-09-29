"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  CO_NUOC,
  DON_HANG,
  EUR,
  NHOM_NGHE,
  cacNuoc,
  donSapXep,
  nhomCuaDon,
  tenViTri,
  tongSuat,
  type DonHang,
} from "@/content/don-hang";

/**
 * DANH SÁCH ĐƠN HÀNG — 16 đơn thật ở 5 nước.
 *
 * Lọc theo nước, nhóm nghề, mức thu nhập và từ khoá; chạy ngay trên máy người
 * xem nên bấm là đổi, không chờ tải lại. Chọn tối đa 3 đơn để so sánh.
 */

function Co({ nuoc, size = 18 }: { nuoc: string; size?: number }) {
  const mau = CO_NUOC[nuoc] ?? ["#888", "#aaa", "#888"];
  return (
    <span
      className="inline-block shrink-0 overflow-hidden rounded-full ring-1 ring-black/10"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {mau.map((c, i) => (
        <span key={i} className="block h-1/3 w-full" style={{ background: c }} />
      ))}
    </span>
  );
}

function TheDon({
  d,
  chon,
  doiChon,
}: {
  d: DonHang;
  chon: boolean;
  doiChon: (id: string) => void;
}) {
  const suat = tongSuat(d);
  return (
    <li className="v2-the v2-the-hover relative flex flex-col overflow-hidden">
      <button
        type="button"
        onClick={() => doiChon(d.id)}
        aria-pressed={chon}
        title="Chọn để so sánh"
        className={`absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 transition ${
          chon ? "border-[var(--v2-vang)] bg-[var(--v2-vang)] text-white" : "border-white/70 bg-white/85 text-[var(--v2-chu-nhat)]"
        }`}
      >
        <Icon name={chon ? "check" : "checkSquare"} className="h-4 w-4" strokeWidth={2.4} />
      </button>

      <Link href={`/don-hang/${d.id}` as Route} className="flex flex-1 flex-col">
        <span className="relative block h-[186px] bg-[var(--v2-nen)]">
          {d.anh[0] ? (
            <Image src={d.anh[0]} alt="" fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover" />
          ) : d.toDon[0] ? (
            <Image src={d.toDon[0]} alt="" fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover object-top" />
          ) : null}
          <span className="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-white/92 px-3 py-1.5 text-[12.5px] font-bold text-[var(--v2-xanh)] shadow-sm">
            <Co nuoc={d.nuoc} size={16} />
            {d.nuoc}
          </span>
          {suat !== null && (
            <span className="absolute bottom-3 left-3 rounded-full bg-[var(--v2-do)] px-3 py-1 text-[12px] font-bold text-white shadow-sm">
              {suat} suất
            </span>
          )}
        </span>

        <span className="flex flex-1 flex-col p-5">
          <b className="block text-[17.5px] leading-snug font-bold text-[var(--v2-xanh)]">{d.tieuDe}</b>
          {d.noiLamViec && (
            <span className="mt-1.5 flex items-center gap-1.5 text-[13px] text-[var(--v2-chu-nhat)]">
              <Icon name="pin" className="h-3.5 w-3.5 text-[var(--v2-vang)]" strokeWidth={1.9} />
              {d.noiLamViec}
            </span>
          )}

          {d.luong && (
            <span className="mt-3 flex items-baseline gap-2">
              <b className="v2-vang text-[21px] font-extrabold">
                {EUR(d.luong.tu)} – {EUR(d.luong.den)} €
              </b>
              <span className="text-[12.5px] text-[var(--v2-chu-nhat)]">mỗi tháng</span>
            </span>
          )}

          <span className="mt-3 flex flex-wrap gap-1.5">
            {d.viTri.slice(0, 2).map((v) => (
              <span key={v.ten} className="rounded-full bg-[var(--v2-nen)] px-2.5 py-1 text-[12px] text-[var(--v2-chu)]">
                {tenViTri(v.ten).slice(0, 38)}
                {tenViTri(v.ten).length > 38 ? "…" : ""}
              </span>
            ))}
            {d.viTri.length > 2 && (
              <span className="rounded-full bg-[var(--v2-nen)] px-2.5 py-1 text-[12px] text-[var(--v2-chu-nhat)]">
                +{d.viTri.length - 2}
              </span>
            )}
          </span>

          <span className="mt-4 flex items-center justify-between border-t border-[var(--v2-vien)] pt-3.5">
            <span className="flex items-center gap-3 text-[12.5px] text-[var(--v2-chu-nhat)]">
              {d.gioLam && (
                <span className="flex items-center gap-1.5">
                  <Icon name="clock" className="h-3.5 w-3.5 text-[var(--v2-vang)]" strokeWidth={1.9} />
                  {d.gioLam} h/tuần
                </span>
              )}
              {d.anh.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Icon name="grid" className="h-3.5 w-3.5 text-[var(--v2-vang)]" strokeWidth={1.9} />
                  {d.soAnhGoc} ảnh
                </span>
              )}
            </span>
            <span className="flex items-center gap-1.5 text-[13.5px] font-bold text-[var(--v2-do)]">
              Xem chi tiết
              <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2.2} />
            </span>
          </span>
        </span>
      </Link>
    </li>
  );
}

export function DonHangList() {
  const [nuoc, setNuoc] = useState("");
  const [nhom, setNhom] = useState("");
  const [luongMin, setLuongMin] = useState(0);
  const [tuKhoa, setTuKhoa] = useState("");
  const [soSanh, setSoSanh] = useState<string[]>([]);

  const nuocs = useMemo(() => cacNuoc(), []);
  const demNhom = useMemo(() => {
    const m = new Map<string, number>();
    for (const d of DON_HANG) for (const n of nhomCuaDon(d)) m.set(n, (m.get(n) ?? 0) + 1);
    return m;
  }, []);

  const loc = useMemo(
    () =>
      donSapXep().filter(
        (d) =>
          (!nuoc || d.nuoc === nuoc) &&
          (!nhom || nhomCuaDon(d).includes(nhom)) &&
          (!luongMin || (d.luong?.den ?? 0) >= luongMin) &&
          (!tuKhoa ||
            `${d.tieuDe} ${d.nuoc} ${d.noiLamViec ?? ""} ${d.viTri.map((v) => v.ten).join(" ")}`
              .toLowerCase()
              .includes(tuKhoa.toLowerCase())),
      ),
    [nuoc, nhom, luongMin, tuKhoa],
  );

  const doiChon = (id: string) =>
    setSoSanh((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length >= 3 ? s : [...s, id]));

  const donSoSanh = soSanh.map((id) => DON_HANG.find((d) => d.id === id)!).filter(Boolean);

  return (
    <div className="mx-auto max-w-[1480px] px-5 py-10 lg:px-8 lg:py-14">
      {/* ---------------- BỘ LỌC ---------------- */}
      <form onSubmit={(e) => e.preventDefault()} className="v2-the grid gap-3 p-4 md:grid-cols-[1fr_1fr_1fr_1.2fr] lg:p-5">
        <label className="relative block">
          <span className="sr-only">Quốc gia</span>
          <select value={nuoc} onChange={(e) => setNuoc(e.target.value)} className="v2-o appearance-none pr-10">
            <option value="">Tất cả quốc gia</option>
            {nuocs.map((n) => (
              <option key={n.ten} value={n.ten}>
                {n.ten} ({n.soDon})
              </option>
            ))}
          </select>
          <Icon name="chevronDown" className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-[var(--v2-chu-nhat)]" strokeWidth={2} />
        </label>

        <label className="relative block">
          <span className="sr-only">Nhóm nghề</span>
          <select value={nhom} onChange={(e) => setNhom(e.target.value)} className="v2-o appearance-none pr-10">
            <option value="">Tất cả nhóm nghề</option>
            {NHOM_NGHE.filter((n) => demNhom.get(n.ma)).map((n) => (
              <option key={n.ma} value={n.ma}>
                {n.ten} ({demNhom.get(n.ma)})
              </option>
            ))}
          </select>
          <Icon name="chevronDown" className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-[var(--v2-chu-nhat)]" strokeWidth={2} />
        </label>

        <label className="relative block">
          <span className="sr-only">Mức thu nhập</span>
          <select value={luongMin} onChange={(e) => setLuongMin(Number(e.target.value))} className="v2-o appearance-none pr-10">
            <option value={0}>Mọi mức thu nhập</option>
            {[1200, 1500, 2000, 2500].map((v) => (
              <option key={v} value={v}>
                từ {EUR(v)} € trở lên
              </option>
            ))}
          </select>
          <Icon name="chevronDown" className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-[var(--v2-chu-nhat)]" strokeWidth={2} />
        </label>

        <label className="relative flex items-center">
          <span className="sr-only">Tìm kiếm</span>
          <input
            type="search"
            value={tuKhoa}
            onChange={(e) => setTuKhoa(e.target.value)}
            placeholder="Tìm nghề, thành phố…"
            className="v2-o pr-11"
          />
          <Icon name="search" className="pointer-events-none absolute right-4 h-4 w-4 text-[var(--v2-vang)]" strokeWidth={2} />
        </label>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] text-[var(--v2-chu-nhat)]">
          <b className="text-[var(--v2-xanh)]">{loc.length}</b> đơn hàng
          {nuoc && <> · {nuoc}</>}
        </p>
        {(nuoc || nhom || luongMin || tuKhoa) && (
          <button
            type="button"
            onClick={() => {
              setNuoc("");
              setNhom("");
              setLuongMin(0);
              setTuKhoa("");
            }}
            className="flex items-center gap-1.5 text-[13.5px] font-semibold text-[var(--v2-do)]"
          >
            <Icon name="close" className="h-4 w-4" strokeWidth={2.2} />
            Xoá lọc
          </button>
        )}
      </div>

      {/* ---------------- LƯỚI THẺ ---------------- */}
      {loc.length === 0 ? (
        <p className="v2-the mt-6 p-10 text-center text-[15px] text-[var(--v2-chu-nhat)]">
          Chưa có đơn nào khớp lựa chọn này.
        </p>
      ) : (
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loc.map((d) => (
            <TheDon key={d.id} d={d} chon={soSanh.includes(d.id)} doiChon={doiChon} />
          ))}
        </ul>
      )}

      {/* ---------------- THANH SO SÁNH ---------------- */}
      {donSoSanh.length > 0 && (
        <div className="fixed inset-x-0 bottom-[70px] z-40 px-4 lg:bottom-6">
          <div className="v2-the mx-auto flex max-w-[1100px] items-center gap-4 border-[var(--v2-vang)] p-3 shadow-xl lg:p-4">
            <span className="hidden text-[13.5px] font-bold text-[var(--v2-xanh)] sm:block">So sánh</span>
            <ul className="flex min-w-0 flex-1 gap-2 overflow-x-auto">
              {donSoSanh.map((d) => (
                <li key={d.id} className="flex shrink-0 items-center gap-2 rounded-full bg-[var(--v2-nen)] py-1.5 pr-2 pl-3">
                  <Co nuoc={d.nuoc} size={14} />
                  <span className="max-w-[150px] truncate text-[12.5px] font-semibold text-[var(--v2-chu)]">{d.tieuDe}</span>
                  <button type="button" onClick={() => doiChon(d.id)} aria-label="Bỏ" className="text-[var(--v2-chu-nhat)]">
                    <Icon name="close" className="h-3.5 w-3.5" strokeWidth={2.4} />
                  </button>
                </li>
              ))}
            </ul>
            <Link href={`/so-sanh?don=${soSanh.join(",")}` as Route} className="v2-nut h-10 shrink-0 px-5 text-[13.5px]">
              So sánh {donSoSanh.length}
              <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

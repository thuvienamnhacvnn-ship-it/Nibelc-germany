"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Send } from "lucide-react";
import { INDUSTRIES } from "@/data/industries";
import { LEGAL } from "@/data/company";
import { tenNganh } from "@/data/i18n/industries";
import { useLang, useT } from "@/lib/i18n/client";
import { lienHe, MA_CHUONG_TRINH, MA_HOC_VAN, MA_THOI_GIAN, MA_TIENG } from "@/lib/i18n/dict/lien-he";

/**
 * PHIẾU TƯ VẤN 4 BƯỚC
 *
 * Kiểm tra dữ liệu ngay trên trình duyệt, chưa cần máy chủ. Gửi xong thì mở
 * sẵn thư trong trình email của người dùng — không có gì được gửi ngầm, và
 * giao diện nói rõ điều đó thay vì giả vờ đã gửi thành công.
 */

const SO_BUOC = ["01", "02", "03", "04"] as const;

/**
 * Các trường chọn lưu MÃ (vd "a1", "som") — chữ hiển thị lấy từ từ điển
 * lib/i18n/dict/lien-he.ts theo ngôn ngữ đang xem.
 */
const TRONG = {
  hoTen: "",
  ngaySinh: "",
  dienThoai: "",
  email: "",
  noiO: "",
  hocVan: "",
  tieng: "chua",
  nganh: "",
  chuongTrinh: "laoDong",
  thoiGian: "som",
  ghiChu: "",
};

export function ConsultationWizard() {
  const lang = useLang();
  const tx = useT(lienHe).phieu;
  const nhan = <M extends string>(bang: Record<M, string>, ma: string) => (ma ? (bang[ma as M] ?? "") : "");
  const tenNganhCua = (id: string) => {
    const n = INDUSTRIES.find((i) => i.id === id);
    return n ? tenNganh(n, lang) : "";
  };
  const BUOC = SO_BUOC.map((so, i) => ({ so, ten: tx.buoc[i]! }));
  const [b, setB] = useState(0);
  const [v, setV] = useState(TRONG);
  const [loi, setLoi] = useState<Record<string, string>>({});
  const [xong, setXong] = useState(false);

  function dat<K extends keyof typeof TRONG>(k: K, gt: string) {
    setV((x) => ({ ...x, [k]: gt }));
    setLoi((l) => {
      const { [k]: _bo, ...con } = l;
      void _bo;
      return con;
    });
  }

  /** Kiểm tra từng bước; chỉ cho đi tiếp khi bước hiện tại hợp lệ */
  function kiem(buoc: number): boolean {
    const l: Record<string, string> = {};
    if (buoc === 0) {
      if (!v.hoTen.trim()) l.hoTen = tx.loi.hoTen;
      if (!v.dienThoai.trim()) l.dienThoai = tx.loi.dienThoai;
      else if (!/^[\d\s+().-]{8,}$/.test(v.dienThoai.trim())) l.dienThoai = tx.loi.dienThoaiSai;
      if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) l.email = tx.loi.email;
      // Chấp nhận cả dd/mm/yyyy (vi, en) lẫn dd.mm.yyyy (de)
      if (v.ngaySinh.trim() && !/^\d{4}$|^\d{2}[/.]\d{2}[/.]\d{4}$/.test(v.ngaySinh.trim()))
        l.ngaySinh = tx.loi.ngaySinh;
    }
    if (buoc === 1 && !v.nganh) l.nganh = tx.loi.nganh;
    setLoi(l);
    return Object.keys(l).length === 0;
  }

  function tiep() {
    if (!kiem(b)) return;
    setB((x) => Math.min(x + 1, BUOC.length - 1));
  }

  /** Các dòng tóm tắt [nhãn, giá trị] đã bỏ dòng trống — dùng cho bước 4 và thân thư */
  function tomTat(coGhiChu: boolean): [string, string][] {
    const k = tx.tomTat;
    const dong: [string, string][] = [
      [k.hoTen, v.hoTen],
      [k.ngaySinh, v.ngaySinh],
      [k.dienThoai, v.dienThoai],
      [k.email, v.email],
      [k.noiO, v.noiO],
      [k.hocVan, nhan(tx.hocVan, v.hocVan)],
      [k.tieng, nhan(tx.tieng, v.tieng)],
      [k.nganh, tenNganhCua(v.nganh)],
      [k.chuongTrinh, nhan(tx.chuongTrinh, v.chuongTrinh)],
      [k.thoiGian, nhan(tx.thoiGian, v.thoiGian)],
    ];
    if (coGhiChu) dong.push([k.ghiChu, v.ghiChu]);
    return dong.filter(([, gt]) => gt.trim() !== "");
  }

  function gui() {
    if (!kiem(0) || !kiem(1)) {
      setB(0);
      return;
    }
    // Thư viết bằng ngôn ngữ người dùng đang xem — họ đọc lại nó trong
    // trình email trước khi bấm gửi.
    const than = tomTat(true)
      .map(([k, gt]) => `${k}: ${gt}`)
      .join("\n");

    window.location.href = `mailto:${LEGAL.email}?subject=${encodeURIComponent(
      tx.tieuDeThu(v.hoTen)
    )}&body=${encodeURIComponent(than)}`;
    setXong(true);
  }

  if (xong) {
    return (
      <div className="nb-panel p-7 text-center sm:p-10">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--nb-gold)]">
          <Check size={30} className="text-[var(--nb-navy-900)]" />
        </span>
        <h3 className="nb-display mt-5 text-[24px] text-white">{tx.xong.tieuDe}</h3>
        <p className="mx-auto mt-3 max-w-[52ch] text-[14.5px] leading-[1.7] text-[var(--nb-text-dim)]">
          {tx.xong.noiDung(LEGAL.phone, LEGAL.email)}
        </p>
        <button
          type="button"
          onClick={() => {
            setXong(false);
            setV(TRONG);
            setB(0);
          }}
          className="nb-btn-ghost mt-7 h-11 px-6 text-[14px]"
        >
          {tx.xong.dienLai}
        </button>
      </div>
    );
  }

  return (
    <div className="nb-panel overflow-hidden">
      {/* ---------- THANH BƯỚC ---------- */}
      <ol className="nb-no-scrollbar flex gap-2 overflow-x-auto border-b border-[var(--nb-line-soft)] px-4 py-4 sm:flex-wrap sm:overflow-x-visible sm:px-6 sm:py-5">
        {BUOC.map((x, i) => {
          const on = i === b;
          const qua = i < b;
          return (
            <li key={x.so} className="flex shrink-0 items-center gap-2 sm:shrink">
              <button
                type="button"
                onClick={() => i < b && setB(i)}
                disabled={i > b}
                aria-current={on ? "step" : undefined}
                className={`flex items-center gap-2.5 rounded-full px-3 py-1.5 transition ${
                  on ? "bg-[var(--nb-gold)]/12" : ""
                } ${i > b ? "cursor-default" : "cursor-pointer"}`}
              >
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full text-[12.5px] font-bold transition ${
                    on
                      ? "bg-[var(--nb-gold)] text-[var(--nb-navy-900)]"
                      : qua
                        ? "bg-[var(--nb-navy-500)] text-[var(--nb-gold-soft)] lg:bg-[#F6F1E7]"
                        : "border border-[var(--nb-line-soft)] text-[var(--nb-text-mute)]"
                  }`}
                >
                  {qua ? <Check size={14} /> : x.so}
                </span>
                <span className="text-left">
                  <span className="block text-[12px] tracking-wide text-[var(--nb-text-mute)] uppercase sm:text-[12px]">
                    {tx.chuBuoc(x.so)}
                  </span>
                  <span className={`block text-[13.5px] font-medium ${on ? "text-white" : "text-[var(--nb-text-dim)]"}`}>
                    {x.ten}
                  </span>
                </span>
              </button>
              {i < BUOC.length - 1 && <span className="h-px w-5 bg-[var(--nb-line-soft)]" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>

      {/* ---------- NỘI DUNG BƯỚC ---------- */}
      <motion.div
        key={b}
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
        className="p-5 sm:p-6 lg:p-8"
      >
        {b === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <O nhan={tx.truong.hoTen} batBuoc gt={v.hoTen} dat={(x) => dat("hoTen", x)} loi={loi.hoTen} auto="name" />
            <O
              nhan={tx.truong.ngaySinh}
              gt={v.ngaySinh}
              dat={(x) => dat("ngaySinh", x)}
              loi={loi.ngaySinh}
              goiY={tx.truong.ngaySinhGoiY}
            />
            <O
              nhan={tx.truong.dienThoai}
              batBuoc
              gt={v.dienThoai}
              dat={(x) => dat("dienThoai", x)}
              loi={loi.dienThoai}
              auto="tel"
            />
            <O nhan={tx.truong.email} gt={v.email} dat={(x) => dat("email", x)} loi={loi.email} auto="email" kieu="email" />
            <O nhan={tx.truong.noiO} gt={v.noiO} dat={(x) => dat("noiO", x)} />
            <Select
              nhan={tx.truong.hocVan}
              gt={v.hocVan}
              dat={(x) => dat("hocVan", x)}
              ds={[{ ma: "", ten: tx.chon }, ...MA_HOC_VAN.map((ma) => ({ ma, ten: tx.hocVan[ma] }))]}
            />
          </div>
        )}

        {b === 1 && (
          <div className="space-y-6">
            <div>
              <p className="mb-2.5 text-[13px] font-medium text-[var(--nb-text-dim)]">
                {tx.truong.nganh} <b className="text-[var(--nb-gold)]">*</b>
              </p>
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {INDUSTRIES.map((i) => (
                  <li key={i.id}>
                    <button
                      type="button"
                      onClick={() => dat("nganh", i.id)}
                      aria-pressed={v.nganh === i.id}
                      className={`min-h-[44px] w-full rounded-lg border px-3.5 py-2.5 text-left text-[13.5px] transition sm:min-h-0 ${
                        v.nganh === i.id
                          ? "border-[var(--nb-gold)] bg-[var(--nb-gold)]/12 text-[var(--nb-gold-soft)]"
                          : "border-[var(--nb-line-soft)] text-[var(--nb-text-dim)] hover:border-[var(--nb-line)]"
                      }`}
                    >
                      {tenNganh(i, lang)}
                    </button>
                  </li>
                ))}
              </ul>
              {loi.nganh && <p className="mt-2 text-[12.5px] text-[#ff7a6b]">{loi.nganh}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                nhan={tx.truong.chuongTrinh}
                gt={v.chuongTrinh}
                dat={(x) => dat("chuongTrinh", x)}
                ds={MA_CHUONG_TRINH.map((ma) => ({ ma, ten: tx.chuongTrinh[ma] }))}
              />
              <Select
                nhan={tx.truong.thoiGian}
                gt={v.thoiGian}
                dat={(x) => dat("thoiGian", x)}
                ds={MA_THOI_GIAN.map((ma) => ({ ma, ten: tx.thoiGian[ma] }))}
              />
            </div>
          </div>
        )}

        {b === 2 && (
          <div className="space-y-4">
            <Select
              nhan={tx.truong.tieng}
              gt={v.tieng}
              dat={(x) => dat("tieng", x)}
              ds={MA_TIENG.map((ma) => ({ ma, ten: tx.tieng[ma] }))}
            />
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--nb-text-dim)]">
                {tx.truong.ghiChu}
              </span>
              <textarea
                rows={5}
                value={v.ghiChu}
                onChange={(e) => dat("ghiChu", e.target.value)}
                className="nb-input min-h-[120px] resize-y"
              />
            </label>
          </div>
        )}

        {b === 3 && (
          <div>
            <h3 className="text-[17px] font-semibold text-white">{tx.kiemTra}</h3>
            <dl className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {tomTat(false).map(([k, gt]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-[var(--nb-line-soft)] pb-2">
                    <dt className="text-[13px] text-[var(--nb-text-mute)]">{k}</dt>
                    <dd className="text-right text-[13.5px] font-medium text-white">{gt}</dd>
                  </div>
                ))}
            </dl>
            {v.ghiChu && (
              <p className="mt-4 rounded-lg bg-[var(--nb-navy-900)]/60 p-4 lg:bg-[#F6F1E7] text-[13.5px] leading-[1.7] text-[var(--nb-text-dim)]">
                {v.ghiChu}
              </p>
            )}
            <p className="mt-5 text-[12.5px] leading-[1.65] text-[var(--nb-text-mute)]">
              {tx.luuY}
            </p>
          </div>
        )}
      </motion.div>

      {/* ---------- ĐIỀU HƯỚNG ---------- */}
      <div className="flex items-center justify-between gap-3 border-t border-[var(--nb-line-soft)] px-5 py-4 sm:gap-4 sm:px-6 sm:py-5">
        <button
          type="button"
          onClick={() => setB((x) => Math.max(0, x - 1))}
          disabled={b === 0}
          className="nb-btn-solid h-12 px-4 text-[14px] disabled:opacity-35 sm:h-11 sm:px-5"
        >
          <ArrowLeft size={15} />
          {tx.quayLai}
        </button>

        {b < BUOC.length - 1 ? (
          <button type="button" onClick={tiep} className="nb-btn h-12 px-6 text-[14.5px] sm:h-11 sm:px-7">
            {tx.tiepTuc}
            <ArrowRight size={15} />
          </button>
        ) : (
          <button type="button" onClick={gui} className="nb-btn h-12 px-6 text-[14.5px] sm:h-11 sm:px-7">
            {tx.gui}
            <Send size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

function O({
  nhan,
  gt,
  dat,
  loi,
  batBuoc,
  goiY,
  auto,
  kieu = "text",
}: {
  nhan: string;
  gt: string;
  dat: (v: string) => void;
  loi?: string;
  batBuoc?: boolean;
  goiY?: string;
  auto?: string;
  kieu?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-[var(--nb-text-dim)]">
        {nhan} {batBuoc && <b className="text-[var(--nb-gold)]">*</b>}
      </span>
      <input
        type={kieu}
        value={gt}
        onChange={(e) => dat(e.target.value)}
        placeholder={goiY}
        autoComplete={auto}
        aria-invalid={!!loi}
        className="nb-input min-h-[44px] sm:min-h-0"
        style={loi ? { borderColor: "#ff7a6b" } : undefined}
      />
      {loi && <span className="mt-1.5 block text-[12.5px] text-[#ff7a6b]">{loi}</span>}
    </label>
  );
}

function Select({
  nhan,
  gt,
  dat,
  ds,
}: {
  nhan: string;
  gt: string;
  dat: (v: string) => void;
  /** ma = giá trị lưu, ten = chữ hiển thị (đã dịch) */
  ds: { ma: string; ten: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-[var(--nb-text-dim)]">{nhan}</span>
      <select value={gt} onChange={(e) => dat(e.target.value)} className="nb-input min-h-[44px] sm:min-h-0">
        {ds.map((x) => (
          <option key={x.ma} value={x.ma}>
            {x.ten}
          </option>
        ))}
      </select>
    </label>
  );
}

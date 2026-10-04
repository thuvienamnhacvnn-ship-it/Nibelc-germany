"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, ChevronDown, Coins, FileText, GraduationCap, Languages, LayoutGrid, List, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import { JobCard } from "@/components/jobs/JobCard";
import { JobRow } from "@/components/jobs/JobRow";
import { JobCardSang, JobRowSang } from "@/components/jobs/JobCardSang";
import { SearchCommandBar, type BoLoc } from "@/components/jobs/SearchCommandBar";
import { INDUSTRIES } from "@/data/industries";
import type { JobFull } from "@/data/jobs";
import { tenNganh } from "@/data/i18n/industries";
import { NHAN_DON_HANG } from "@/data/i18n/jobs";
import { LOCALE } from "@/lib/i18n/config";
import { useLang, useT } from "@/lib/i18n/client";
import { donHang, MA_KINH_NGHIEM } from "@/lib/i18n/dict/don-hang";
import type { ProgramType } from "@/types/job";

/**
 * SÀN ĐƠN HÀNG
 *
 * Lọc hoàn toàn phía trình duyệt trên dữ liệu có sẵn — chưa cần máy chủ.
 * Trạng thái ban đầu đọc từ query (?industry= hoặc ?nganh=, ?city=, ?q=) nên
 * link từ trang chủ, chân trang và ô tìm kiếm mở đúng bộ lọc.
 *
 * ĐA NGÔN NGỮ: trang server truyền `jobs` đã dịch (getJobs(lang)) kèm `goc`
 * = thành phố / nước / kinh nghiệm GỐC. Bộ lọc lưu và so theo giá trị GỐC
 * (khớp dữ liệu, không lệch khi đổi ngôn ngữ); chỉ NHÃN hiển thị là bản dịch.
 * Giá trị rỗng "" = "tất cả".
 */

export type JobSan = JobFull & { goc: { city: string; state: string; experience: string } };

/** Nhóm lọc đang mở (chỉ một nhóm một lúc). undefined = nhóm tự giữ trạng thái moSan. */
const NhomCtx = createContext<[string | null | undefined, (v: string | null) => void]>([undefined, () => {}]);

const MUC_LUONG = [0, 1000, 1500, 2000, 2500];

/**
 * Mức ngoại ngữ SINH TỪ DỮ LIỆU THẬT, không chép tay.
 *
 * Bản cũ ghi cứng ["A2 – B1", "B1", "B1 – B2", "B2"] — nay chỉ đơn ở Đức mới
 * có yêu cầu ngoại ngữ (Sếp chốt 04/10/2026: Áo, Hy Lạp, Albania không cần
 * tiếng Đức), nên danh sách cứng sinh ra mấy mức chẳng lọc ra đơn nào. Sinh
 * từ kho thì thêm hay bớt đơn là bộ lọc tự khớp.
 */
function mucNgoaiNgu(ds: JobFull[]): string[] {
  return [...new Set(ds.filter((j) => j.language && j.languageLevel).map((j) => j.languageLevel))].sort();
}
const CHUONG_TRINH: ProgramType[] = ["Lao động", "Du học nghề"];

/** Một lựa chọn trong nhóm lọc: giá trị (khớp dữ liệu) + nhãn (theo ngôn ngữ) */
type LuaChon = { gt: string; nhan: string };

/** Giá trị gốc → nhãn đã dịch, sắp theo nhãn đúng thứ tự chữ cái của ngôn ngữ */
function luaChonTu(jobs: JobSan[], lay: (j: JobSan) => [string, string], locale: string): LuaChon[] {
  const m = new Map<string, string>();
  for (const j of jobs) {
    const [gt, nhan] = lay(j);
    if (!m.has(gt)) m.set(gt, nhan);
  }
  return [...m].map(([gt, nhan]) => ({ gt, nhan })).sort((a, b) => a.nhan.localeCompare(b.nhan, locale));
}

function bo(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .toLowerCase();
}

export function JobMarketplace({ jobs }: { jobs: JobSan[] }) {
  const sp = useSearchParams();
  const lang = useLang();
  const tx = useT(donHang);
  const nhanMa = useT(NHAN_DON_HANG);
  const locale = LOCALE[lang];

  const DS_THANH_PHO = useMemo(() => luaChonTu(jobs, (j) => [j.goc.city, j.city], locale), [jobs, locale]);
  const DS_QUOC_GIA = useMemo(() => luaChonTu(jobs, (j) => [j.goc.state, j.state], locale), [jobs, locale]);
  const MUC_NGOAI_NGU = useMemo(() => mucNgoaiNgu(jobs), [jobs]);

  const [nganh, setNganh] = useState<string[]>(() => {
    const v = sp.get("industry") ?? sp.get("nganh");
    return v ? [v] : [];
  });
  // ?city= có thể là tên gốc (tiếng Việt) hoặc tên đã dịch — quy về giá trị gốc
  const [thanhPho, setThanhPho] = useState(() => {
    const v = sp.get("city");
    if (!v) return "";
    return jobs.find((j) => j.goc.city === v || j.city === v)?.goc.city ?? v;
  });
  const [bang, setBang] = useState("");
  const [luongMin, setLuongMin] = useState(0);
  const [tieng, setTieng] = useState("");
  const [kn, setKn] = useState("");
  const [ct, setCt] = useState("");
  const [tuKhoa, setTuKhoa] = useState(sp.get("q") ?? "");
  const [sapXep, setSapXep] = useState<"moi" | "luong-cao" | "suat-nhieu">("moi");
  const [dangLuoi, setDangLuoi] = useState(true);
  const [hien, setHien] = useState(9);
  /** Chỉ dùng ở khổ điện thoại: bảy nhóm lọc nằm trong một TẤM TRƯỢT kéo lên
      từ đáy. Từ lg trở lên chúng là cột bên và luôn hiện, không phụ thuộc
      state này. */
  const [moSheet, setMoSheet] = useState(false);

  /* Mở tấm trượt thì KHOÁ cuộn nền: không khoá thì ngón tay vuốt trong tấm
     trượt tới cuối danh sách là nền phía sau cuộn tiếp, vị trí đọc của người
     dùng bị mất. Trả lại đúng giá trị cũ khi đóng. */
  useEffect(() => {
    if (!moSheet) return;
    const cu = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const phim = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoSheet(false);
    };
    window.addEventListener("keydown", phim);
    return () => {
      document.body.style.overflow = cu;
      window.removeEventListener("keydown", phim);
    };
  }, [moSheet]);
  const nhomMo = useState<string | null>("nganh");

  const ketQua = useMemo(() => {
    const q = bo(tuKhoa.trim());
    let ds = jobs.filter((j) => {
      if (nganh.length && !nganh.includes(j.industryId)) return false;
      if (thanhPho && j.goc.city !== thanhPho) return false;
      if (bang && j.goc.state !== bang) return false;
      if (j.salary.max < luongMin) return false;
      /* Đơn CHƯA BIẾT cần tiếng gì thì không khớp bộ lọc trình độ nào cả —
         không thể nói nó đạt mức A2–B1 của thứ tiếng không rõ. 13 trên 16 đơn
         đang ở tình trạng này (Hy Lạp, Albania, Litva). */
      if (tieng && (!j.language || j.languageLevel !== tieng)) return false;
      if (kn && j.goc.experience !== kn) return false;
      if (ct && j.programType !== ct) return false;
      if (q && !bo(`${j.title} ${j.city} ${j.state} ${j.goc.city} ${j.goc.state}`).includes(q)) return false;
      return true;
    });

    ds = [...ds].sort((a, b) => {
      if (sapXep === "luong-cao") return b.salary.max - a.salary.max;
      if (sapXep === "suat-nhieu") return b.vacancies - a.vacancies;
      return b.createdAt.localeCompare(a.createdAt) || b.gallery.length - a.gallery.length;
    });
    return ds;
  }, [jobs, nganh, thanhPho, bang, luongMin, tieng, kn, ct, tuKhoa, sapXep]);

  const soLoc =
    nganh.length +
    (thanhPho ? 1 : 0) +
    (bang ? 1 : 0) +
    (luongMin > 0 ? 1 : 0) +
    (tieng ? 1 : 0) +
    (kn ? 1 : 0) +
    (ct ? 1 : 0);

  function xoaHet() {
    setNganh([]);
    setThanhPho("");
    setBang("");
    setLuongMin(0);
    setTieng("");
    setKn("");
    setCt("");
    setTuKhoa("");
  }

  /** Thanh lệnh 5 ô dùng CHUNG state với bộ lọc bên trái, không có bộ lọc thứ hai. */
  const lenh: BoLoc = {
    nganh: nganh[0] ?? "",
    thanhPho,
    luongMin,
    chuongTrinh: ct,
    tieng,
  };

  function datLenh(v: Partial<BoLoc>) {
    if (v.nganh !== undefined) setNganh(v.nganh ? [v.nganh] : []);
    if (v.thanhPho !== undefined) setThanhPho(v.thanhPho);
    if (v.luongMin !== undefined) setLuongMin(v.luongMin);
    if (v.chuongTrinh !== undefined) setCt(v.chuongTrinh);
    if (v.tieng !== undefined) setTieng(v.tieng);
    setHien(9);
  }

  function nhanCua(ds: LuaChon[], gt: string) {
    return ds.find((x) => x.gt === gt)?.nhan ?? gt;
  }
  function nhanKn(gt: string) {
    return (MA_KINH_NGHIEM as readonly string[]).includes(gt)
      ? tx.loc.kinhNghiemNhan[gt as (typeof MA_KINH_NGHIEM)[number]]
      : gt;
  }

  /** Chip "đang lọc" trên thanh công cụ desktop — bấm X là bỏ đúng điều kiện đó. */
  const dangLoc: { nhan: string; bo: () => void }[] = [
    ...nganh.map((id) => {
      const n = INDUSTRIES.find((i) => i.id === id);
      return { nhan: n ? tenNganh(n, lang) : id, bo: () => setNganh((c) => c.filter((x) => x !== id)) };
    }),
    ...(thanhPho ? [{ nhan: nhanCua(DS_THANH_PHO, thanhPho), bo: () => setThanhPho("") }] : []),
    ...(bang ? [{ nhan: nhanCua(DS_QUOC_GIA, bang), bo: () => setBang("") }] : []),
    ...(luongMin > 0 ? [{ nhan: tx.loc.tuMuc(luongMin), bo: () => setLuongMin(0) }] : []),
    ...(tieng ? [{ nhan: `${tx.ct.ngoaiNgu} ${tieng}`, bo: () => setTieng("") }] : []),
    ...(kn ? [{ nhan: nhanKn(kn), bo: () => setKn("") }] : []),
    ...(ct ? [{ nhan: nhanMa.chuongTrinh[ct as ProgramType] ?? ct, bo: () => setCt("") }] : []),
    ...(tuKhoa.trim() ? [{ nhan: `“${tuKhoa.trim()}”`, bo: () => setTuKhoa("") }] : []),
  ];

  const daHien = Math.min(hien, ketQua.length);


  /* LÕI LỌC DÙNG CHUNG — bảy nhóm gập/mở, viết MỘT lần (phiên mobile).
     Desktop: nằm trong cột bên trái thẻ trắng, luôn hiện (lớp lg: của đội W-AGENT).
     Điện thoại: nằm trong tấm trượt kéo từ đáy.
     Cả hai chỗ đọc/ghi CÙNG state ở trên, không có bộ lọc thứ hai. */
  const nhomLoc = (
    <NhomCtx.Provider value={nhomMo}>
        <Nhom ma="nganh" nhan={tx.loc.nganh} Icon={Briefcase} moSan tomTat={nganh.length ? tx.loc.soNganhChon(nganh.length) : tx.loc.tatCaNganh}>
          {/* Desktop hiện ĐỦ mọi ngành, không cuộn lồng (trước bị khoá 216px nên
              chỉ thấy 6/12 ngành, "Nông nghiệp", "Ô tô"… bị giấu). */}
          <ul className="max-h-[240px] space-y-1 overflow-y-auto pr-1 lg:max-h-none lg:space-y-0.5 lg:overflow-visible lg:pr-0">
            {INDUSTRIES.map((i) => {
              const on = nganh.includes(i.id);
              const so = jobs.filter((j) => j.industryId === i.id).length;
              return (
                <li key={i.id}>
                  <button
                    type="button"
                    onClick={() => setNganh((c) => (on ? c.filter((x) => x !== i.id) : [...c, i.id]))}
                    aria-pressed={on}
                    className={`flex min-h-[44px] w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13.5px] transition lg:min-h-0 lg:py-[7px] ${
                      on
                        ? "bg-[var(--nb-gold)]/12 text-[var(--nb-gold-soft)] lg:bg-[var(--s-alt)] lg:font-medium lg:text-[var(--s-ink)]"
                        : "text-[var(--nb-text-dim)] hover:bg-white/5 lg:text-[var(--s-body)] lg:hover:bg-[var(--s-soft)]"
                    }`}
                  >
                    <span
                      className={`grid h-[15px] w-[15px] shrink-0 place-items-center rounded-[4px] border ${
                        on
                          ? "border-[var(--nb-gold)] bg-[var(--nb-gold)] lg:border-[var(--s-ink)] lg:bg-[var(--s-ink)]"
                          : "border-[var(--nb-line-soft)] lg:border-[var(--s-input-line)] lg:bg-white"
                      }`}
                    >
                      {on && <span className="h-[7px] w-[7px] rounded-[1px] bg-[var(--nb-navy-900)] lg:bg-white" />}
                    </span>
                    <span className="min-w-0 flex-1 truncate lg:whitespace-normal lg:leading-snug">{tenNganh(i, lang)}</span>
                    <span className="text-[12px] text-[var(--nb-text-mute)] lg:min-w-[22px] lg:rounded-full lg:bg-[var(--s-soft)] lg:px-1.5 lg:py-px lg:text-center lg:text-[12.5px] lg:text-[var(--s-mute)] lg:ring-1 lg:ring-[var(--s-line)]">
                      {so}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Nhom>

        <Nhom ma="thanhPho" nhan={tx.loc.thanhPho} Icon={MapPin} tomTat={thanhPho ? nhanCua(DS_THANH_PHO, thanhPho) : tx.loc.tatCaThanhPho}>
          <Chon gt={thanhPho} dat={setThanhPho} ds={[{ gt: "", nhan: tx.loc.tatCa }, ...DS_THANH_PHO]} />
        </Nhom>
        <Nhom ma="quocGia" nhan={tx.loc.quocGia} Icon={MapPin} tomTat={bang ? nhanCua(DS_QUOC_GIA, bang) : tx.loc.tatCaQuocGia}>
          <Chon gt={bang} dat={setBang} ds={[{ gt: "", nhan: tx.loc.tatCa }, ...DS_QUOC_GIA]} />
        </Nhom>

        <Nhom ma="luong" nhan={tx.loc.luong} Icon={Coins} tomTat={luongMin > 0 ? tx.loc.tuMuc(luongMin) : tx.loc.tatCaLuong}>
          <div className="flex flex-wrap gap-1.5">
            {MUC_LUONG.map((min) => (
              <button
                key={min}
                type="button"
                onClick={() => setLuongMin(min)}
                aria-pressed={luongMin === min}
                className={`inline-flex min-h-[44px] items-center rounded-full border px-3.5 py-1.5 text-[12.5px] transition lg:min-h-0 lg:px-3 ${
                  luongMin === min
                    ? "border-[var(--nb-gold)] bg-[var(--nb-gold)]/12 text-[var(--nb-gold-soft)] lg:border-[var(--s-ink)] lg:bg-[var(--s-ink)] lg:text-white"
                    : "border-[var(--nb-line-soft)] text-[var(--nb-text-dim)] hover:border-[var(--nb-line)] lg:border-[var(--s-input-line)] lg:bg-white lg:text-[var(--s-body)] lg:hover:border-[var(--s-ink)]"
                }`}
              >
                {min > 0 ? tx.loc.tuMuc(min) : tx.loc.tatCa}
              </button>
            ))}
          </div>
        </Nhom>

        {/* Ẩn hẳn nhóm lọc khi kho không còn đơn nào có yêu cầu ngoại ngữ —
            một nhóm lọc rỗng chỉ tổ làm người dùng bấm vào rồi chẳng thấy gì. */}
        {MUC_NGOAI_NGU.length > 0 && (
          <Nhom ma="tieng" nhan={tx.loc.tieng} Icon={Languages} tomTat={tieng || tx.loc.tatCaTrinhDo}>
            <Chon
              gt={tieng}
              dat={setTieng}
              ds={[{ gt: "", nhan: tx.loc.tatCa }, ...MUC_NGOAI_NGU.map((x) => ({ gt: x, nhan: x }))]}
            />
          </Nhom>
        )}
        <Nhom ma="kinhNghiem" nhan={tx.loc.kinhNghiem} Icon={GraduationCap} tomTat={kn ? nhanKn(kn) : tx.loc.tatCaKinhNghiem}>
          <Chon
            gt={kn}
            dat={setKn}
            ds={[{ gt: "", nhan: tx.loc.tatCa }, ...MA_KINH_NGHIEM.map((x) => ({ gt: x, nhan: tx.loc.kinhNghiemNhan[x] }))]}
          />
        </Nhom>
        <Nhom ma="chuongTrinh" nhan={tx.loc.chuongTrinh} Icon={FileText} tomTat={ct ? (nhanMa.chuongTrinh[ct as ProgramType] ?? ct) : tx.loc.tatCaChuongTrinh}>
          <Chon
            gt={ct}
            dat={setCt}
            ds={[{ gt: "", nhan: tx.loc.tatCa }, ...CHUONG_TRINH.map((x) => ({ gt: x, nhan: nhanMa.chuongTrinh[x] }))]}
          />
        </Nhom>
    </NhomCtx.Provider>
  );

  /* Desktop (≥lg) dùng thân trang SÁNG: mọi màu sáng đi bằng tiền tố `lg:` và
     token --s-* của .dh-sang (app/don-hang/don-hang-sang.css). Lớp không có
     tiền tố là giao diện điện thoại — giữ nguyên, phiên mobile đang làm. */
  return (
    <div className="dh-sang lg:bg-[var(--s-page)]">
      {/* Thanh 5 ô ngang CHỈ còn ở desktop. Ở điện thoại nó cao 469px và
          trùng chức năng với bảy nhóm lọc ngay bên dưới — hai bộ lọc chồng
          nhau. Bản điện thoại thay bằng một hàng: ô tìm chữ + nút mở tấm
          trượt. */}
      <div className="nb-wrap relative z-20 -mt-10 hidden pb-2 lg:block">
        <SearchCommandBar gt={lenh} dat={datLenh} onTim={() => setHien(9)} thanhPho={DS_THANH_PHO} />
      </div>

    {/* `grid-cols-[minmax(0,1fr)]` cho khổ hẹp: để `grid` trần thì cột là
        `auto` = min-content, và hàng nút "Lưới / Danh sách / Sắp xếp" bên
        trong kéo cột ra 366px trong khung 326px — cả trang rộng thành 398px.
        Đây là lần thứ ba cùng một bẫy trong dự án này. */}
    <div className="nb-wrap grid grid-cols-[minmax(0,1fr)] gap-5 py-9 sm:gap-8 sm:py-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:pt-12 lg:pb-24">
      {/* ---------- HÀNG ĐIỀU KHIỂN Ở ĐIỆN THOẠI ---------- */}
      <div className="flex gap-2.5 lg:hidden">
        <label className="nb-panel flex min-w-0 flex-1 items-center gap-2.5 px-4">
          <Search size={17} className="shrink-0 text-[var(--nb-gold)]" />
          <input
            value={tuKhoa}
            onChange={(e) => {
              setTuKhoa(e.target.value);
              setHien(9);
            }}
            placeholder={tx.timGoiY}
            aria-label={tx.timAria}
            className="h-12 min-w-0 flex-1 bg-transparent text-[14.5px] text-white outline-none placeholder:text-[var(--nb-text-mute)]"
          />
        </label>

        <button
          type="button"
          onClick={() => setMoSheet(true)}
          aria-haspopup="dialog"
          aria-expanded={moSheet}
          className="nb-btn-solid h-12 shrink-0 gap-2 px-4 text-[14.5px]"
        >
          <SlidersHorizontal size={17} className="text-[var(--nb-gold)]" />
          {tx.boLoc}
          {soLoc > 0 && (
            <span className="grid h-6 min-w-6 place-items-center rounded-full bg-[var(--nb-gold)] px-1.5 text-[12px] font-bold text-[var(--nb-navy-900)]">
              {soLoc}
            </span>
          )}
        </button>
      </div>

      {/* ---------------- BỘ LỌC (cột bên, chỉ desktop) ----------------
          Desktop: thẻ trắng rộng cố định 280px. */}
      <aside className="nb-panel hidden h-fit p-5 sm:p-6 lg:block lg:px-5 lg:py-4" aria-label={tx.boLocAria}>
        <div className="flex items-center justify-between lg:pb-1.5">
          <b className="flex items-center gap-2 text-[15.5px] font-semibold text-white lg:text-[15px] lg:text-[var(--s-ink)]">
            <SlidersHorizontal size={17} className="text-[var(--nb-gold)] lg:text-[var(--s-gold)]" />
            {tx.boLocTimKiem}
          </b>
          {soLoc > 0 && (
            <button
              type="button"
              onClick={xoaHet}
              className="flex min-h-[44px] items-center gap-1 text-[12.5px] text-[var(--nb-text-mute)] transition hover:text-[var(--nb-gold-soft)] lg:min-h-0 lg:font-medium lg:text-[var(--s-gold)] lg:hover:text-[var(--s-ink)]"
            >
              <X size={13} />
              {tx.xoa(soLoc)}
            </button>
          )}
        </div>

        {nhomLoc}
      </aside>

      {/* ---------------- KẾT QUẢ ---------------- */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-4 lg:items-end lg:border-b lg:border-[var(--s-line-warm)] lg:pb-5">
          <div>
            <h2 className="nb-display text-[23px] text-white sm:text-[26px] lg:text-[32px] lg:leading-tight lg:text-[var(--s-ink)]">
              {tx.donMoiNhat}
            </h2>
            <p className="mt-1 text-[13.5px] text-[var(--nb-text-dim)] lg:mt-1.5 lg:text-[14px] lg:text-[var(--s-mute)]">
              {tx.hienThi(daHien, ketQua.length)}
            </p>
          </div>

          {/* shrink-0 + nội dung rộng ~366px là thủ phạm làm trang Đơn hàng
              tràn ngang ở khổ 390px: khối này không co được nên nó nới cả khung
              trang ra. Ở khổ hẹp cho nó chiếm trọn một hàng và tự xuống dòng. */}
          <div className="flex w-full flex-wrap items-center gap-2.5 lg:w-auto lg:shrink-0 lg:gap-3">
            <div className="flex overflow-hidden rounded-full border border-[var(--nb-line-soft)] lg:border-[var(--s-input-line)] lg:bg-white lg:p-[3px]">
              {[
                { ma: "luoi", on: dangLuoi, dat: () => setDangLuoi(true), Icon: LayoutGrid, nhan: tx.luoi },
                { ma: "ds", on: !dangLuoi, dat: () => setDangLuoi(false), Icon: List, nhan: tx.danhSach },
              ].map(({ ma, on, dat, Icon, nhan }) => (
                <button
                  key={ma}
                  type="button"
                  onClick={dat}
                  aria-pressed={on}
                  className={`flex min-h-[44px] shrink-0 items-center gap-1.5 whitespace-nowrap px-3.5 py-2 text-[12.5px] transition lg:min-h-0 lg:rounded-full lg:py-1.5 lg:text-[13px] lg:font-medium ${
                    on
                      ? "bg-[var(--nb-gold)] text-[var(--nb-navy-900)] lg:bg-[var(--s-ink)] lg:text-white"
                      : "text-[var(--nb-text-dim)] lg:text-[var(--s-body)] lg:hover:text-[var(--s-ink)]"
                  }`}
                >
                  <Icon size={14} />
                  {nhan}
                </button>
              ))}
            </div>

            <span className="hidden shrink-0 text-[12.5px] whitespace-nowrap text-[var(--nb-text-mute)] sm:inline lg:text-[13px] lg:text-[var(--s-mute)]">
              {tx.sapXepTheo}
            </span>
            <select
              value={sapXep}
              onChange={(e) => setSapXep(e.target.value as typeof sapXep)}
              aria-label={tx.sapXep}
              className="nb-input h-11 min-w-[138px] flex-1 py-0 text-[13px] lg:h-10 lg:w-[176px]! lg:flex-none lg:shrink-0 lg:font-medium"
            >
              <option value="moi">{tx.sx.moi}</option>
              <option value="luong-cao">{tx.sx.luongCao}</option>
              <option value="suat-nhieu">{tx.sx.suatNhieu}</option>
            </select>
          </div>
        </div>

        {/* Chip điều kiện đang lọc — chỉ desktop (điện thoại đã có số đếm trên nút Bộ lọc) */}
        {dangLoc.length > 0 && (
          <div className="hidden lg:mt-4 lg:flex lg:flex-wrap lg:items-center lg:gap-2">
            <span className="mr-1 text-[13px] text-[var(--s-mute)]">{tx.dangLoc}</span>
            {dangLoc.map((d) => (
              <button
                key={d.nhan}
                type="button"
                onClick={() => {
                  d.bo();
                  setHien(9);
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--s-line-warm)] bg-white py-1 pr-2 pl-3 text-[12.5px] font-medium text-[var(--s-ink)] transition hover:border-[var(--s-ink)]"
                aria-label={tx.boLocChip(d.nhan)}
              >
                {d.nhan}
                <X size={13} className="text-[var(--s-mute)]" />
              </button>
            ))}
            <button
              type="button"
              onClick={xoaHet}
              className="ml-1 text-[13px] font-medium text-[var(--s-gold)] underline-offset-4 hover:underline"
            >
              {tx.xoaTatCa}
            </button>
          </div>
        )}

        {ketQua.length === 0 ? (
          <div className="nb-panel mt-8 p-8 text-center sm:p-14">
            <b className="block text-[17px] text-white lg:text-[var(--s-ink)]">{tx.khongKhop}</b>
            <p className="mt-2 text-[14px] text-[var(--nb-text-dim)] lg:text-[var(--s-body)]">{tx.thuBoBot}</p>
            <button type="button" onClick={xoaHet} className="nb-btn-ghost mt-6 h-10 px-5 text-[13.5px]">
              {tx.xoaBoLoc}
            </button>
          </div>
        ) : dangLuoi ? (
          <>
            {/* điện thoại / máy tính bảng: thẻ navy như cũ */}
            <ul className="mt-7 grid gap-6 md:grid-cols-2 2xl:grid-cols-3 lg:hidden">
              {ketQua.slice(0, hien).map((j, i) => (
                <li key={j.id} className={i === 0 && ketQua.length > 2 ? "md:col-span-2" : ""}>
                  <JobCard job={j} lon={i === 0 && ketQua.length > 2} />
                </li>
              ))}
            </ul>
            {/* desktop: lưới đều, không thẻ khổng lồ */}
            <ul className="hidden lg:mt-7 lg:grid lg:grid-cols-[repeat(2,minmax(0,1fr))] lg:gap-6 xl:grid-cols-[repeat(3,minmax(0,1fr))]">
              {ketQua.slice(0, hien).map((j) => (
                <li key={j.id}>
                  <JobCardSang job={j} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <ul className="mt-7 space-y-4 lg:hidden">
              {ketQua.slice(0, hien).map((j) => (
                <li key={j.id}>
                  <JobRow job={j} />
                </li>
              ))}
            </ul>
            <ul className="hidden lg:mt-7 lg:flex lg:flex-col lg:gap-4">
              {ketQua.slice(0, hien).map((j) => (
                <li key={j.id}>
                  <JobRowSang job={j} />
                </li>
              ))}
            </ul>
          </>
        )}

        {ketQua.length > 0 && (
          <div className={`${hien < ketQua.length ? "mt-10" : "hidden"} text-center lg:mt-12 lg:flex lg:flex-col lg:items-center`}>
            {/* tiến độ đã xem — chỉ desktop */}
            <p className="hidden text-[13px] text-[var(--s-mute)] lg:block">
              {tx.daXem(daHien, ketQua.length)}
            </p>
            <span className="hidden lg:mt-2.5 lg:mb-5 lg:block lg:h-1 lg:w-[220px] lg:overflow-hidden lg:rounded-full lg:bg-[var(--s-line-warm)]" aria-hidden="true">
              <span className="block h-full rounded-full bg-[var(--s-ink)]" style={{ width: `${(daHien / ketQua.length) * 100}%` }} />
            </span>
            {hien < ketQua.length && (
              <button type="button" onClick={() => setHien((h) => h + 9)} className="nb-btn-ghost h-12 px-8 text-[14.5px]">
                {tx.xemThem(Math.min(9, ketQua.length - hien))}
              </button>
            )}
          </div>
        )}
      </div>
    </div>

      {/* ---------------- TẤM TRƯỢT LỌC (chỉ điện thoại) ---------------- */}
      {/* PHỦ KÍN menu đáy chứ không dừng ở trên nó: nút chính "Xem N đơn hàng"
          nằm ở chân tấm trượt, để nó sát menu đáy là bấm nhầm sang menu. Khi
          tấm trượt mở thì menu đáy cũng không còn việc gì để làm. */}
      <AnimatePresence>
        {moSheet && (
          <div className="lg:hidden">
            <motion.div
              key="nen"
              className="fixed inset-0 z-[60] bg-[rgb(2_8_20/.62)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMoSheet(false)}
              aria-hidden="true"
            />

            <motion.div
              key="tam"
              role="dialog"
              aria-modal="true"
              aria-label={tx.boLocTimKiem}
              className="fixed inset-x-0 bottom-0 z-[61] flex max-h-[88dvh] flex-col rounded-t-3xl border-t border-[var(--nb-line)] bg-[var(--nb-navy-800)]"
              style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
            >
              {/* tay nắm — dấu hiệu quen thuộc "kéo xuống để đóng" */}
              <span
                aria-hidden="true"
                className="mx-auto mt-2.5 block h-1 w-10 shrink-0 rounded-full bg-[var(--nb-text-mute)]"
              />

              <div className="flex shrink-0 items-center gap-3 px-5 pt-3 pb-4">
                <b className="flex min-w-0 flex-1 items-center gap-2 text-[16px] font-semibold text-white">
                  <SlidersHorizontal size={17} className="shrink-0 text-[var(--nb-gold)]" />
                  {tx.boLoc}
                </b>
                {soLoc > 0 && (
                  <button
                    type="button"
                    onClick={xoaHet}
                    className="flex min-h-[44px] items-center gap-1 px-1 text-[13px] text-[var(--nb-text-dim)] transition hover:text-[var(--nb-gold-soft)]"
                  >
                    {tx.xoaHetSo(soLoc)}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMoSheet(false)}
                  aria-label={tx.dongBoLoc}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--nb-line-soft)] text-[var(--nb-text-dim)] transition hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* overscroll-contain: vuốt tới cuối danh sách thì DỪNG, không
                  truyền đà cuộn ra nền phía sau */}
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5">{nhomLoc}</div>

              <div className="shrink-0 border-t border-[var(--nb-line-soft)] p-4">
                <button
                  type="button"
                  onClick={() => setMoSheet(false)}
                  className="nb-btn h-12 w-full px-6 text-[15px]"
                >
                  {tx.xemSoDon(ketQua.length)}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Nhom({
  ma,
  nhan,
  Icon,
  tomTat,
  moSan = false,
  children,
}: {
  /** khoá ổn định của nhóm (không đổi theo ngôn ngữ) */
  ma: string;
  nhan: string;
  Icon?: React.ComponentType<{ size?: number; className?: string }>;
  /** giá trị đang chọn, hiện ngay dưới tên nhóm khi nhóm đang gập */
  tomTat: string;
  moSan?: boolean;
  children: React.ReactNode;
}) {
  // Mỗi lúc chỉ MỘT nhóm mở: mở nhóm này thì nhóm đang mở tự gập lại, cột lọc
  // không phình dài vô tận khi khách bấm mở lần lượt từng nhóm.
  const [dangMo, setDangMo] = useContext(NhomCtx);
  const mo = dangMo === undefined ? moSan : dangMo === ma;
  const setMo = (f: (v: boolean) => boolean) => setDangMo(f(mo) ? ma : null);
  return (
    <div className="border-t border-[var(--nb-line-soft)] first-of-type:border-0 lg:border-[var(--s-line)]">
      <button
        type="button"
        onClick={() => setMo((v) => !v)}
        aria-expanded={mo}
        className="flex w-full items-center gap-2.5 py-4 text-left lg:py-3"
      >
        {Icon && <Icon size={16} className="shrink-0 text-[var(--nb-gold)] lg:text-[var(--s-gold)]" />}
        <span className="min-w-0 flex-1">
          <span className="block text-[13.5px] font-semibold text-white lg:text-[var(--s-ink)]">{nhan}</span>
          <span className="mt-0.5 block truncate text-[12.5px] text-[var(--nb-text-mute)] lg:text-[var(--s-mute)]">{tomTat}</span>
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-[var(--nb-text-mute)] transition-transform duration-300 lg:text-[var(--s-mute)] ${mo ? "rotate-180" : ""}`}
        />
      </button>
      {mo && <div className="pb-4 lg:pb-3">{children}</div>}
    </div>
  );
}

function Chon({ gt, dat, ds }: { gt: string; dat: (v: string) => void; ds: LuaChon[] }) {
  return (
    <ul className="max-h-[220px] space-y-1 overflow-y-auto pr-1 lg:max-h-none lg:space-y-0.5 lg:overflow-visible lg:pr-0">
      {ds.map((x) => {
        const on = gt === x.gt;
        return (
          <li key={x.gt || "*"}>
            <button
              type="button"
              onClick={() => dat(x.gt)}
              aria-pressed={on}
              className={`flex min-h-[44px] w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13.5px] transition lg:min-h-0 lg:py-[7px] ${
                on
                  ? "bg-[var(--nb-gold)]/12 text-[var(--nb-gold-soft)] lg:bg-[var(--s-alt)] lg:font-medium lg:text-[var(--s-ink)]"
                  : "text-[var(--nb-text-dim)] hover:bg-white/5 lg:text-[var(--s-body)] lg:hover:bg-[var(--s-soft)]"
              }`}
            >
              <span
                className={`grid h-[15px] w-[15px] shrink-0 place-items-center rounded-full border ${
                  on
                    ? "border-[var(--nb-gold)] lg:border-[var(--s-ink)]"
                    : "border-[var(--nb-line-soft)] lg:border-[var(--s-input-line)] lg:bg-white"
                }`}
              >
                {on && <span className="h-[7px] w-[7px] rounded-full bg-[var(--nb-gold)] lg:bg-[var(--s-ink)]" />}
              </span>
              <span className="min-w-0 flex-1 truncate">{x.nhan}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

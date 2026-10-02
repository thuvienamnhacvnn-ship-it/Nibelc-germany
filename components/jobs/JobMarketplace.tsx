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
import { JOBS, allCities, allStates, type JobFull } from "@/data/jobs";

/**
 * SÀN ĐƠN HÀNG
 *
 * Lọc hoàn toàn phía trình duyệt trên dữ liệu có sẵn — chưa cần máy chủ.
 * Trạng thái ban đầu đọc từ query (?industry=, ?city=, ?q=) nên link từ trang
 * chủ và từ ô tìm kiếm mở đúng bộ lọc.
 */

/** Nhóm lọc đang mở (chỉ một nhóm một lúc). undefined = nhóm tự giữ trạng thái moSan. */
const NhomCtx = createContext<[string | null | undefined, (v: string | null) => void]>([undefined, () => {}]);

const MUC_LUONG = [
  { nhan: "Tất cả", min: 0 },
  { nhan: "Từ 1.000 €", min: 1000 },
  { nhan: "Từ 1.500 €", min: 1500 },
  { nhan: "Từ 2.000 €", min: 2000 },
  { nhan: "Từ 2.500 €", min: 2500 },
];

const TIENG = ["Tất cả", "A2 – B1", "B1", "B1 – B2", "B2"];
const KINH_NGHIEM = ["Tất cả", "Không yêu cầu", "Có kinh nghiệm"];
const CHUONG_TRINH = ["Tất cả", "Lao động", "Du học nghề"];

function bo(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .toLowerCase();
}

export function JobMarketplace() {
  const sp = useSearchParams();

  const [nganh, setNganh] = useState<string[]>(() => {
    const v = sp.get("industry");
    return v ? [v] : [];
  });
  const [thanhPho, setThanhPho] = useState(sp.get("city") ?? "Tất cả");
  const [bang, setBang] = useState("Tất cả");
  const [luongMin, setLuongMin] = useState(0);
  const [tieng, setTieng] = useState("Tất cả");
  const [kn, setKn] = useState("Tất cả");
  const [ct, setCt] = useState("Tất cả");
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
  const nhomMo = useState<string | null>("Ngành nghề");

  const ketQua = useMemo(() => {
    const q = bo(tuKhoa.trim());
    let ds = JOBS.filter((j) => {
      if (nganh.length && !nganh.includes(j.industryId)) return false;
      if (thanhPho !== "Tất cả" && j.city !== thanhPho) return false;
      if (bang !== "Tất cả" && j.state !== bang) return false;
      if (j.salary.max < luongMin) return false;
      if (tieng !== "Tất cả" && j.languageLevel !== tieng) return false;
      if (kn !== "Tất cả" && j.experience !== kn) return false;
      if (ct !== "Tất cả" && j.programType !== ct) return false;
      if (q && !bo(`${j.title} ${j.city} ${j.state}`).includes(q)) return false;
      return true;
    });

    ds = [...ds].sort((a, b) => {
      if (sapXep === "luong-cao") return b.salary.max - a.salary.max;
      if (sapXep === "suat-nhieu") return b.vacancies - a.vacancies;
      return b.createdAt.localeCompare(a.createdAt) || b.gallery.length - a.gallery.length;
    });
    return ds;
  }, [nganh, thanhPho, bang, luongMin, tieng, kn, ct, tuKhoa, sapXep]);

  const soLoc =
    nganh.length +
    (thanhPho !== "Tất cả" ? 1 : 0) +
    (bang !== "Tất cả" ? 1 : 0) +
    (luongMin > 0 ? 1 : 0) +
    (tieng !== "Tất cả" ? 1 : 0) +
    (kn !== "Tất cả" ? 1 : 0) +
    (ct !== "Tất cả" ? 1 : 0);

  function xoaHet() {
    setNganh([]);
    setThanhPho("Tất cả");
    setBang("Tất cả");
    setLuongMin(0);
    setTieng("Tất cả");
    setKn("Tất cả");
    setCt("Tất cả");
    setTuKhoa("");
  }

  /** Thanh lệnh 5 ô dùng CHUNG state với bộ lọc bên trái, không có bộ lọc thứ hai. */
  const lenh: BoLoc = {
    nganh: nganh[0] ?? "",
    thanhPho: thanhPho === "Tất cả" ? "" : thanhPho,
    luongMin,
    chuongTrinh: ct === "Tất cả" ? "" : ct,
    tieng: tieng === "Tất cả" ? "" : tieng,
  };

  function datLenh(v: Partial<BoLoc>) {
    if (v.nganh !== undefined) setNganh(v.nganh ? [v.nganh] : []);
    if (v.thanhPho !== undefined) setThanhPho(v.thanhPho || "Tất cả");
    if (v.luongMin !== undefined) setLuongMin(v.luongMin);
    if (v.chuongTrinh !== undefined) setCt(v.chuongTrinh || "Tất cả");
    if (v.tieng !== undefined) setTieng(v.tieng || "Tất cả");
    setHien(9);
  }

  /** Chip "đang lọc" trên thanh công cụ desktop — bấm X là bỏ đúng điều kiện đó. */
  const dangLoc: { nhan: string; bo: () => void }[] = [
    ...nganh.map((id) => ({
      nhan: INDUSTRIES.find((i) => i.id === id)?.titleVi ?? id,
      bo: () => setNganh((c) => c.filter((x) => x !== id)),
    })),
    ...(thanhPho !== "Tất cả" ? [{ nhan: thanhPho, bo: () => setThanhPho("Tất cả") }] : []),
    ...(bang !== "Tất cả" ? [{ nhan: bang, bo: () => setBang("Tất cả") }] : []),
    ...(luongMin > 0
      ? [{ nhan: MUC_LUONG.find((m) => m.min === luongMin)?.nhan ?? `${luongMin} €`, bo: () => setLuongMin(0) }]
      : []),
    ...(tieng !== "Tất cả" ? [{ nhan: `Tiếng ${tieng}`, bo: () => setTieng("Tất cả") }] : []),
    ...(kn !== "Tất cả" ? [{ nhan: kn, bo: () => setKn("Tất cả") }] : []),
    ...(ct !== "Tất cả" ? [{ nhan: ct, bo: () => setCt("Tất cả") }] : []),
    ...(tuKhoa.trim() ? [{ nhan: `“${tuKhoa.trim()}”`, bo: () => setTuKhoa("") }] : []),
  ];

  const daHien = Math.min(hien, ketQua.length);


  /* LÕI LỌC DÙNG CHUNG — bảy nhóm gập/mở, viết MỘT lần (phiên mobile).
     Desktop: nằm trong cột bên trái thẻ trắng, luôn hiện (lớp lg: của đội W-AGENT).
     Điện thoại: nằm trong tấm trượt kéo từ đáy.
     Cả hai chỗ đọc/ghi CÙNG state ở trên, không có bộ lọc thứ hai. */
  const nhomLoc = (
    <NhomCtx.Provider value={nhomMo}>
        <Nhom nhan="Ngành nghề" Icon={Briefcase} moSan tomTat={nganh.length ? `${nganh.length} ngành đã chọn` : "Tất cả ngành nghề"}>
          {/* Desktop hiện ĐỦ mọi ngành, không cuộn lồng (trước bị khoá 216px nên
              chỉ thấy 6/12 ngành, "Nông nghiệp", "Ô tô"… bị giấu). */}
          <ul className="max-h-[240px] space-y-1 overflow-y-auto pr-1 lg:max-h-none lg:space-y-0.5 lg:overflow-visible lg:pr-0">
            {INDUSTRIES.map((i) => {
              const on = nganh.includes(i.id);
              const so = JOBS.filter((j) => j.industryId === i.id).length;
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
                    <span className="min-w-0 flex-1 truncate">{i.titleVi}</span>
                    <span className="text-[12px] text-[var(--nb-text-mute)] lg:min-w-[22px] lg:rounded-full lg:bg-[var(--s-soft)] lg:px-1.5 lg:py-px lg:text-center lg:text-[11.5px] lg:text-[var(--s-mute)] lg:ring-1 lg:ring-[var(--s-line)]">
                      {so}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Nhom>

        <Nhom nhan="Thành phố" Icon={MapPin} tomTat={thanhPho === "Tất cả" ? "Tất cả thành phố" : thanhPho}>
          <Chon gt={thanhPho} dat={setThanhPho} ds={["Tất cả", ...allCities()]} />
        </Nhom>
        <Nhom nhan="Quốc gia / Bang" Icon={MapPin} tomTat={bang === "Tất cả" ? "Tất cả quốc gia" : bang}>
          <Chon gt={bang} dat={setBang} ds={["Tất cả", ...allStates()]} />
        </Nhom>

        <Nhom nhan="Mức lương tối thiểu" Icon={Coins} tomTat={MUC_LUONG.find((m) => m.min === luongMin)?.nhan ?? "Tất cả mức lương"}>
          <div className="flex flex-wrap gap-1.5">
            {MUC_LUONG.map((m) => (
              <button
                key={m.nhan}
                type="button"
                onClick={() => setLuongMin(m.min)}
                aria-pressed={luongMin === m.min}
                className={`inline-flex min-h-[44px] items-center rounded-full border px-3.5 py-1.5 text-[12.5px] transition lg:min-h-0 lg:px-3 ${
                  luongMin === m.min
                    ? "border-[var(--nb-gold)] bg-[var(--nb-gold)]/12 text-[var(--nb-gold-soft)] lg:border-[var(--s-ink)] lg:bg-[var(--s-ink)] lg:text-white"
                    : "border-[var(--nb-line-soft)] text-[var(--nb-text-dim)] hover:border-[var(--nb-line)] lg:border-[var(--s-input-line)] lg:bg-white lg:text-[var(--s-body)] lg:hover:border-[var(--s-ink)]"
                }`}
              >
                {m.nhan}
              </button>
            ))}
          </div>
        </Nhom>

        <Nhom nhan="Trình độ tiếng Đức" Icon={Languages} tomTat={tieng === "Tất cả" ? "Tất cả trình độ" : tieng}>
          <Chon gt={tieng} dat={setTieng} ds={TIENG} />
        </Nhom>
        <Nhom nhan="Kinh nghiệm" Icon={GraduationCap} tomTat={kn === "Tất cả" ? "Tất cả kinh nghiệm" : kn}>
          <Chon gt={kn} dat={setKn} ds={KINH_NGHIEM} />
        </Nhom>
        <Nhom nhan="Chương trình" Icon={FileText} tomTat={ct === "Tất cả" ? "Tất cả chương trình" : ct}>
          <Chon gt={ct} dat={setCt} ds={CHUONG_TRINH} />
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
        <SearchCommandBar gt={lenh} dat={datLenh} onTim={() => setHien(9)} />
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
            placeholder="Tìm đơn hàng, nghề, nơi làm"
            aria-label="Tìm đơn hàng"
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
          Bộ lọc
          {soLoc > 0 && (
            <span className="grid h-6 min-w-6 place-items-center rounded-full bg-[var(--nb-gold)] px-1.5 text-[12px] font-bold text-[var(--nb-navy-900)]">
              {soLoc}
            </span>
          )}
        </button>
      </div>

      {/* ---------------- BỘ LỌC (cột bên, chỉ desktop) ----------------
          Desktop: thẻ trắng rộng cố định 280px. */}
      <aside className="nb-panel hidden h-fit p-5 sm:p-6 lg:block lg:px-5 lg:py-4" aria-label="Bộ lọc đơn hàng">
        <div className="flex items-center justify-between lg:pb-1.5">
          <b className="flex items-center gap-2 text-[15.5px] font-semibold text-white lg:text-[15px] lg:text-[var(--s-ink)]">
            <SlidersHorizontal size={17} className="text-[var(--nb-gold)] lg:text-[var(--s-gold)]" />
            Bộ lọc tìm kiếm
          </b>
          {soLoc > 0 && (
            <button
              type="button"
              onClick={xoaHet}
              className="flex min-h-[44px] items-center gap-1 text-[12.5px] text-[var(--nb-text-mute)] transition hover:text-[var(--nb-gold-soft)] lg:min-h-0 lg:font-medium lg:text-[var(--s-gold)] lg:hover:text-[var(--s-ink)]"
            >
              <X size={13} />
              Xoá ({soLoc})
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
              Đơn hàng mới nhất
            </h2>
            <p className="mt-1 text-[13.5px] text-[var(--nb-text-dim)] lg:mt-1.5 lg:text-[14px] lg:text-[var(--s-mute)]">
              Hiển thị {daHien} trong {ketQua.length} đơn hàng
            </p>
          </div>

          {/* shrink-0 + nội dung rộng ~366px là thủ phạm làm trang Đơn hàng
              tràn ngang ở khổ 390px: khối này không co được nên nó nới cả khung
              trang ra. Ở khổ hẹp cho nó chiếm trọn một hàng và tự xuống dòng. */}
          <div className="flex w-full flex-wrap items-center gap-2.5 lg:w-auto lg:shrink-0 lg:gap-3">
            <div className="flex overflow-hidden rounded-full border border-[var(--nb-line-soft)] lg:border-[var(--s-input-line)] lg:bg-white lg:p-[3px]">
              {[
                { on: dangLuoi, dat: () => setDangLuoi(true), Icon: LayoutGrid, nhan: "Lưới" },
                { on: !dangLuoi, dat: () => setDangLuoi(false), Icon: List, nhan: "Danh sách" },
              ].map(({ on, dat, Icon, nhan }) => (
                <button
                  key={nhan}
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
              Sắp xếp theo
            </span>
            <select
              value={sapXep}
              onChange={(e) => setSapXep(e.target.value as typeof sapXep)}
              aria-label="Sắp xếp"
              className="nb-input h-11 min-w-[138px] flex-1 py-0 text-[13px] lg:h-10 lg:w-[176px]! lg:flex-none lg:shrink-0 lg:font-medium"
            >
              <option value="moi">Mới nhất</option>
              <option value="luong-cao">Lương cao nhất</option>
              <option value="suat-nhieu">Nhiều suất nhất</option>
            </select>
          </div>
        </div>

        {/* Chip điều kiện đang lọc — chỉ desktop (điện thoại đã có số đếm trên nút Bộ lọc) */}
        {dangLoc.length > 0 && (
          <div className="hidden lg:mt-4 lg:flex lg:flex-wrap lg:items-center lg:gap-2">
            <span className="mr-1 text-[13px] text-[var(--s-mute)]">Đang lọc:</span>
            {dangLoc.map((d) => (
              <button
                key={d.nhan}
                type="button"
                onClick={() => {
                  d.bo();
                  setHien(9);
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--s-line-warm)] bg-white py-1 pr-2 pl-3 text-[12.5px] font-medium text-[var(--s-ink)] transition hover:border-[var(--s-ink)]"
                aria-label={`Bỏ lọc ${d.nhan}`}
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
              Xoá tất cả
            </button>
          </div>
        )}

        {ketQua.length === 0 ? (
          <div className="nb-panel mt-8 p-8 text-center sm:p-14">
            <b className="block text-[17px] text-white lg:text-[var(--s-ink)]">Không có đơn hàng nào khớp bộ lọc</b>
            <p className="mt-2 text-[14px] text-[var(--nb-text-dim)] lg:text-[var(--s-body)]">Thử bỏ bớt điều kiện hoặc mở rộng mức lương.</p>
            <button type="button" onClick={xoaHet} className="nb-btn-ghost mt-6 h-10 px-5 text-[13.5px]">
              Xoá bộ lọc
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
              Đã xem {daHien} / {ketQua.length} đơn hàng
            </p>
            <span className="hidden lg:mt-2.5 lg:mb-5 lg:block lg:h-1 lg:w-[220px] lg:overflow-hidden lg:rounded-full lg:bg-[var(--s-line-warm)]" aria-hidden="true">
              <span className="block h-full rounded-full bg-[var(--s-ink)]" style={{ width: `${(daHien / ketQua.length) * 100}%` }} />
            </span>
            {hien < ketQua.length && (
              <button type="button" onClick={() => setHien((h) => h + 9)} className="nb-btn-ghost h-12 px-8 text-[14.5px]">
                Xem thêm {Math.min(9, ketQua.length - hien)} đơn hàng
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
              aria-label="Bộ lọc tìm kiếm"
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
                  Bộ lọc
                </b>
                {soLoc > 0 && (
                  <button
                    type="button"
                    onClick={xoaHet}
                    className="flex min-h-[44px] items-center gap-1 px-1 text-[13px] text-[var(--nb-text-dim)] transition hover:text-[var(--nb-gold-soft)]"
                  >
                    Xoá hết ({soLoc})
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMoSheet(false)}
                  aria-label="Đóng bộ lọc"
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
                  Xem {ketQua.length} đơn hàng
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
  nhan,
  Icon,
  tomTat,
  moSan = false,
  children,
}: {
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
  const mo = dangMo === undefined ? moSan : dangMo === nhan;
  const setMo = (f: (v: boolean) => boolean) => setDangMo(f(mo) ? nhan : null);
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

function Chon({ gt, dat, ds }: { gt: string; dat: (v: string) => void; ds: string[] }) {
  return (
    <ul className="max-h-[220px] space-y-1 overflow-y-auto pr-1 lg:max-h-none lg:space-y-0.5 lg:overflow-visible lg:pr-0">
      {ds.map((x) => {
        const on = gt === x;
        return (
          <li key={x}>
            <button
              type="button"
              onClick={() => dat(x)}
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
              <span className="min-w-0 flex-1 truncate">{x}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

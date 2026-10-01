"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Briefcase, ChevronDown, Coins, FileText, GraduationCap, Languages, LayoutGrid, List, MapPin, SlidersHorizontal, X } from "lucide-react";
import { JobCard } from "@/components/jobs/JobCard";
import { JobRow } from "@/components/jobs/JobRow";
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
  /** Chỉ dùng ở khổ điện thoại: bảng lọc 7 nhóm xếp TRÊN lưới kết quả, mở sẵn
      thì phải cuộn gần hai màn hình mới thấy đơn hàng đầu tiên. Từ lg trở lên
      bảng là cột bên nên luôn hiện, không phụ thuộc state này. */
  const [moLoc, setMoLoc] = useState(false);

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

  return (
    <>
      <div className="nb-wrap relative z-20 -mt-10 pb-2">
        <SearchCommandBar gt={lenh} dat={datLenh} onTim={() => setHien(9)} />
      </div>

    <div className="nb-wrap grid gap-5 py-9 sm:gap-8 sm:py-12 lg:grid-cols-[286px_minmax(0,1fr)]">
      {/* Cửa mở bảng lọc, chỉ có ở khổ hẹp */}
      <button
        type="button"
        onClick={() => setMoLoc((v) => !v)}
        aria-expanded={moLoc}
        className="nb-btn-solid h-12 w-full justify-between px-5 text-[14.5px] lg:hidden"
      >
        <span className="flex items-center gap-2.5">
          <SlidersHorizontal size={17} className="text-[var(--nb-gold)]" />
          Bộ lọc tìm kiếm
          {soLoc > 0 && (
            <span className="rounded-full bg-[var(--nb-gold)] px-2 py-0.5 text-[12px] font-bold text-[var(--nb-navy-900)]">
              {soLoc}
            </span>
          )}
        </span>
        <ChevronDown size={17} className={`transition-transform duration-300 ${moLoc ? "rotate-180" : ""}`} />
      </button>

      {/* ---------------- BỘ LỌC ---------------- */}
      <aside
        className={`nb-panel h-fit p-5 sm:p-6 lg:sticky lg:top-[calc(var(--nb-header)+20px)] lg:block ${
          moLoc ? "block" : "hidden"
        }`}
      >
        <div className="flex items-center justify-between">
          <b className="flex items-center gap-2 text-[15.5px] font-semibold text-white">
            <SlidersHorizontal size={17} className="text-[var(--nb-gold)]" />
            Bộ lọc tìm kiếm
          </b>
          {soLoc > 0 && (
            <button
              type="button"
              onClick={xoaHet}
              className="flex min-h-[44px] items-center gap-1 text-[12.5px] text-[var(--nb-text-mute)] transition hover:text-[var(--nb-gold-soft)] lg:min-h-0"
            >
              <X size={13} />
              Xoá ({soLoc})
            </button>
          )}
        </div>

        <Nhom nhan="Ngành nghề" Icon={Briefcase} moSan tomTat={nganh.length ? `${nganh.length} ngành đã chọn` : "Tất cả ngành nghề"}>
          <ul className="max-h-[240px] space-y-1 overflow-y-auto pr-1">
            {INDUSTRIES.map((i) => {
              const on = nganh.includes(i.id);
              const so = JOBS.filter((j) => j.industryId === i.id).length;
              return (
                <li key={i.id}>
                  <button
                    type="button"
                    onClick={() => setNganh((c) => (on ? c.filter((x) => x !== i.id) : [...c, i.id]))}
                    aria-pressed={on}
                    className={`flex min-h-[44px] w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13.5px] transition lg:min-h-0 ${
                      on ? "bg-[var(--nb-gold)]/12 text-[var(--nb-gold-soft)]" : "text-[var(--nb-text-dim)] hover:bg-white/5"
                    }`}
                  >
                    <span
                      className={`grid h-[15px] w-[15px] shrink-0 place-items-center rounded-[4px] border ${
                        on ? "border-[var(--nb-gold)] bg-[var(--nb-gold)]" : "border-[var(--nb-line-soft)]"
                      }`}
                    >
                      {on && <span className="h-[7px] w-[7px] rounded-[1px] bg-[var(--nb-navy-900)]" />}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{i.titleVi}</span>
                    <span className="text-[12px] text-[var(--nb-text-mute)] lg:text-[11.5px]">{so}</span>
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
                    ? "border-[var(--nb-gold)] bg-[var(--nb-gold)]/12 text-[var(--nb-gold-soft)]"
                    : "border-[var(--nb-line-soft)] text-[var(--nb-text-dim)] hover:border-[var(--nb-line)]"
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
      </aside>

      {/* ---------------- KẾT QUẢ ---------------- */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="nb-display text-[23px] text-white sm:text-[26px]">Đơn hàng mới nhất</h2>
            <p className="mt-1 text-[13.5px] text-[var(--nb-text-dim)]">
              Hiển thị {Math.min(hien, ketQua.length)} trong {ketQua.length} đơn hàng
            </p>
          </div>

          {/* shrink-0 + nội dung rộng ~366px là thủ phạm làm trang Đơn hàng
              tràn ngang ở khổ 390px: khối này không co được nên nó nới cả khung
              trang ra. Ở khổ hẹp cho nó chiếm trọn một hàng và tự xuống dòng. */}
          <div className="flex w-full flex-wrap items-center gap-2.5 lg:w-auto lg:shrink-0">
            <div className="flex overflow-hidden rounded-full border border-[var(--nb-line-soft)]">
              {[
                { on: dangLuoi, dat: () => setDangLuoi(true), Icon: LayoutGrid, nhan: "Lưới" },
                { on: !dangLuoi, dat: () => setDangLuoi(false), Icon: List, nhan: "Danh sách" },
              ].map(({ on, dat, Icon, nhan }) => (
                <button
                  key={nhan}
                  type="button"
                  onClick={dat}
                  aria-pressed={on}
                  className={`flex min-h-[44px] shrink-0 items-center gap-1.5 whitespace-nowrap px-3.5 py-2 text-[12.5px] transition lg:min-h-0 ${
                    on ? "bg-[var(--nb-gold)] text-[var(--nb-navy-900)]" : "text-[var(--nb-text-dim)]"
                  }`}
                >
                  <Icon size={14} />
                  {nhan}
                </button>
              ))}
            </div>

            <span className="hidden shrink-0 text-[12.5px] whitespace-nowrap text-[var(--nb-text-mute)] sm:inline">Sắp xếp theo</span>
            <select
              value={sapXep}
              onChange={(e) => setSapXep(e.target.value as typeof sapXep)}
              aria-label="Sắp xếp"
              className="nb-input h-11 min-w-[138px] flex-1 py-0 text-[13px] lg:h-10 lg:w-[176px]! lg:flex-none lg:shrink-0"
            >
              <option value="moi">Mới nhất</option>
              <option value="luong-cao">Lương cao nhất</option>
              <option value="suat-nhieu">Nhiều suất nhất</option>
            </select>
          </div>
        </div>

        {ketQua.length === 0 ? (
          <div className="nb-panel mt-8 p-8 text-center sm:p-14">
            <b className="block text-[17px] text-white">Không có đơn hàng nào khớp bộ lọc</b>
            <p className="mt-2 text-[14px] text-[var(--nb-text-dim)]">Thử bỏ bớt điều kiện hoặc mở rộng mức lương.</p>
            <button type="button" onClick={xoaHet} className="nb-btn-ghost mt-6 h-10 px-5 text-[13.5px]">
              Xoá bộ lọc
            </button>
          </div>
        ) : dangLuoi ? (
          <ul className="mt-7 grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
            {ketQua.slice(0, hien).map((j, i) => (
              <li key={j.id} className={i === 0 && ketQua.length > 2 ? "md:col-span-2" : ""}>
                <JobCard job={j} lon={i === 0 && ketQua.length > 2} />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-7 space-y-4">
            {ketQua.slice(0, hien).map((j) => (
              <li key={j.id}>
                <JobRow job={j} />
              </li>
            ))}
          </ul>
        )}

        {hien < ketQua.length && (
          <div className="mt-10 text-center">
            <button type="button" onClick={() => setHien((h) => h + 9)} className="nb-btn-ghost h-12 px-8 text-[14.5px]">
              Xem thêm {Math.min(9, ketQua.length - hien)} đơn hàng
            </button>
          </div>
        )}
      </div>
    </div>
    </>
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
  const [mo, setMo] = useState(moSan);
  return (
    <div className="border-t border-[var(--nb-line-soft)] first-of-type:border-0">
      <button
        type="button"
        onClick={() => setMo((v) => !v)}
        aria-expanded={mo}
        className="flex w-full items-center gap-2.5 py-4 text-left"
      >
        {Icon && <Icon size={16} className="shrink-0 text-[var(--nb-gold)]" />}
        <span className="min-w-0 flex-1">
          <span className="block text-[13.5px] font-semibold text-white">{nhan}</span>
          <span className="mt-0.5 block truncate text-[12.5px] text-[var(--nb-text-mute)]">{tomTat}</span>
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-[var(--nb-text-mute)] transition-transform duration-300 ${mo ? "rotate-180" : ""}`}
        />
      </button>
      {mo && <div className="pb-4">{children}</div>}
    </div>
  );
}

function Chon({ gt, dat, ds }: { gt: string; dat: (v: string) => void; ds: string[] }) {
  return (
    <ul className="max-h-[220px] space-y-1 overflow-y-auto pr-1">
      {ds.map((x) => {
        const on = gt === x;
        return (
          <li key={x}>
            <button
              type="button"
              onClick={() => dat(x)}
              aria-pressed={on}
              className={`flex min-h-[44px] w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13.5px] transition lg:min-h-0 ${
                on
                  ? "bg-[var(--nb-gold)]/12 text-[var(--nb-gold-soft)]"
                  : "text-[var(--nb-text-dim)] hover:bg-white/5"
              }`}
            >
              <span
                className={`grid h-[15px] w-[15px] shrink-0 place-items-center rounded-full border ${
                  on ? "border-[var(--nb-gold)]" : "border-[var(--nb-line-soft)]"
                }`}
              >
                {on && <span className="h-[7px] w-[7px] rounded-full bg-[var(--nb-gold)]" />}
              </span>
              <span className="min-w-0 flex-1 truncate">{x}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

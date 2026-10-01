"use client";

import { Briefcase, Coins, FileText, Languages, MapPin, Search } from "lucide-react";
import { INDUSTRIES } from "@/data/industries";
import { allCities } from "@/data/jobs";

/**
 * THANH TÌM KIẾM 5 Ô — nằm ngay dưới banner trang Đơn hàng, đúng như mẫu.
 *
 * Đây là thanh điều khiển chính của sàn: chọn ở đây thì lưới kết quả bên dưới
 * đổi theo ngay. Không phải một ô tìm kiếm trang trí.
 */

export interface BoLoc {
  nganh: string;
  thanhPho: string;
  luongMin: number;
  chuongTrinh: string;
  tieng: string;
}

const LUONG = [
  { nhan: "Mức lương", gt: 0 },
  { nhan: "Từ 1.000 €", gt: 1000 },
  { nhan: "Từ 1.500 €", gt: 1500 },
  { nhan: "Từ 2.000 €", gt: 2000 },
  { nhan: "Từ 2.500 €", gt: 2500 },
];

export function SearchCommandBar({
  gt,
  dat,
  onTim,
}: {
  gt: BoLoc;
  dat: (v: Partial<BoLoc>) => void;
  onTim: () => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onTim();
      }}
      className="nb-panel flex flex-wrap items-stretch gap-px overflow-hidden p-px"
      role="search"
      aria-label="Tìm đơn hàng"
    >
      <O Icon={Briefcase} nhan="Tìm ngành nghề">
        <select
          value={gt.nganh}
          onChange={(e) => dat({ nganh: e.target.value })}
          aria-label="Ngành nghề"
          className="h-11 w-full bg-transparent text-[14px] text-white outline-none lg:h-auto"
        >
          <option value="">Tất cả ngành nghề</option>
          {INDUSTRIES.map((i) => (
            <option key={i.id} value={i.id}>
              {i.titleVi}
            </option>
          ))}
        </select>
      </O>

      <O Icon={MapPin} nhan="Thành phố / Bang">
        <select
          value={gt.thanhPho}
          onChange={(e) => dat({ thanhPho: e.target.value })}
          aria-label="Thành phố"
          className="h-11 w-full bg-transparent text-[14px] text-white outline-none lg:h-auto"
        >
          <option value="">Tất cả địa điểm</option>
          {allCities().map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </O>

      <O Icon={Coins} nhan="Mức lương">
        <select
          value={gt.luongMin}
          onChange={(e) => dat({ luongMin: Number(e.target.value) })}
          aria-label="Mức lương tối thiểu"
          className="h-11 w-full bg-transparent text-[14px] text-white outline-none lg:h-auto"
        >
          {LUONG.map((l) => (
            <option key={l.gt} value={l.gt}>
              {l.nhan}
            </option>
          ))}
        </select>
      </O>

      <O Icon={FileText} nhan="Loại chương trình">
        <select
          value={gt.chuongTrinh}
          onChange={(e) => dat({ chuongTrinh: e.target.value })}
          aria-label="Loại chương trình"
          className="h-11 w-full bg-transparent text-[14px] text-white outline-none lg:h-auto"
        >
          <option value="">Tất cả chương trình</option>
          <option value="Lao động">Lao động</option>
          <option value="Du học nghề">Du học nghề</option>
        </select>
      </O>

      <O Icon={Languages} nhan="Trình độ tiếng Đức">
        <select
          value={gt.tieng}
          onChange={(e) => dat({ tieng: e.target.value })}
          aria-label="Trình độ tiếng Đức"
          className="h-11 w-full bg-transparent text-[14px] text-white outline-none lg:h-auto"
        >
          <option value="">Tất cả trình độ</option>
          {["A2 – B1", "B1", "B1 – B2", "B2"].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </O>

      {/* h-auto làm nút cao đúng bằng dòng chữ (24px) khi nó nằm một mình trên
          một hàng ở khổ điện thoại — không đủ để bấm. Khoá chiều cao 48px. */}
      <button type="submit" className="nb-btn m-1.5 h-12 w-full min-w-[168px] flex-1 px-7 text-[15px] lg:h-auto lg:w-auto">
        <Search size={17} />
        Tìm kiếm
      </button>
    </form>
  );
}

function O({
  Icon,
  nhan,
  children,
}: {
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  nhan: string;
  children: React.ReactNode;
}) {
  return (
    /* Ở khổ điện thoại mỗi ô chiếm trọn một hàng: min-w-[196px] để nguyên thì
       hai ô cố chen vào một hàng và ô nào cũng bị bóp còn một nửa chữ. */
    <label className="flex w-full min-w-0 flex-1 items-center gap-3 bg-[var(--nb-navy-800)]/60 px-4 py-2 transition hover:bg-[var(--nb-navy-700)]/70 lg:w-auto lg:min-w-[196px] lg:py-3">
      <Icon size={17} className="shrink-0 text-[var(--nb-gold)]" />
      <span className="min-w-0 flex-1">
        <span className="block text-[12px] tracking-[0.1em] text-[var(--nb-text-mute)] uppercase lg:text-[10.5px]">{nhan}</span>
        {children}
      </span>
    </label>
  );
}

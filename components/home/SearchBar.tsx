"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Briefcase, MapPin, Search, Tag } from "lucide-react";
import { useChuyenTrang } from "@/components/layout/PageTransition";
import type { DonGoiY } from "@/components/home/du-lieu";
import type { NganhTim } from "@/components/home/Hero";
import { useLh, useT } from "@/lib/i18n/client";
import { home } from "@/lib/i18n/dict/home";

/**
 * Ô TÌM KIẾM TRANG CHỦ
 *
 * Tìm ngay trên dữ liệu trong máy, chưa cần máy chủ. Gợi ý gồm ba loại: tên
 * đơn hàng, nhóm ngành và thành phố — mỗi loại có icon riêng để phân biệt.
 *
 * Đơn và ngành nhận qua props, đã dịch theo ngôn ngữ trang (server dựng sẵn).
 */

type Goi = { loai: "job" | "nganh" | "noi"; nhan: string; phu: string; href: string };

function bo(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .toLowerCase();
}

export function SearchBar({ don, nganh }: { don: DonGoiY[]; nganh: NganhTim[] }) {
  const chuyen = useChuyenTrang();
  const lhx = useLh();
  const tx = useT(home).tim;
  const [tu, setTu] = useState("");
  const [mo, setMo] = useState(false);
  const [chon, setChon] = useState(0);
  const boc = useRef<HTMLDivElement>(null);

  const goiY = useMemo<Goi[]>(() => {
    const q = bo(tu.trim());
    if (q.length < 2) return [];
    const ra: Goi[] = [];

    for (const i of nganh) {
      if (bo(i.ten).includes(q) || bo(i.tenVi).includes(q) || bo(i.tenDe).includes(q)) {
        // bản vi giữ dòng phụ là tên ngành tiếng Đức như cũ; en/de ghi "Sector"/"Branche"
        const phu = i.ten === i.tenVi ? i.tenDe : tx.nhanNganh;
        ra.push({ loai: "nganh", nhan: i.ten, phu, href: `/don-hang?industry=${i.id}` });
      }
    }
    for (const j of don) {
      if (bo(j.title).includes(q)) {
        ra.push({ loai: "job", nhan: j.title, phu: `${j.city}, ${j.state}`, href: `/don-hang/${j.slug}` });
      }
    }
    for (const c of [...new Set(don.map((j) => j.city))]) {
      if (bo(c).includes(q)) {
        const n = don.filter((j) => j.city === c).length;
        ra.push({ loai: "noi", nhan: c, phu: tx.soDon(n), href: `/don-hang?city=${encodeURIComponent(c)}` });
      }
    }
    return ra.slice(0, 7);
  }, [tu, don, nganh, tx]);

  useEffect(() => setChon(0), [tu]);

  // bấm ra ngoài thì đóng gợi ý
  useEffect(() => {
    function f(e: MouseEvent) {
      if (!boc.current?.contains(e.target as Node)) setMo(false);
    }
    document.addEventListener("mousedown", f);
    return () => document.removeEventListener("mousedown", f);
  }, []);

  function di(g: Goi) {
    setMo(false);
    setTu("");
    chuyen(lhx(g.href));
  }

  function phim(e: React.KeyboardEvent) {
    if (!goiY.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setChon((c) => (c + 1) % goiY.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setChon((c) => (c - 1 + goiY.length) % goiY.length);
    } else if (e.key === "Escape") {
      setMo(false);
    }
  }

  const ICON = { job: Briefcase, nganh: Tag, noi: MapPin } as const;

  return (
    <div ref={boc} className="relative">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (goiY[chon]) di(goiY[chon]);
          else chuyen(lhx(`/don-hang${tu.trim() ? `?q=${encodeURIComponent(tu.trim())}` : ""}`));
        }}
        // nền dùng BIẾN chứ không chép tay #0a1b36: mã đó là nền đen của bản
        // cũ, ở bản điện thoại nền xanh nó thành một vệt tối lạc tông
        className="flex items-center gap-3 rounded-full border border-[var(--nb-gold)]/70 bg-[var(--nb-navy-800)]/92 py-2 pr-2 pl-5 backdrop-blur-md transition focus-within:border-[var(--nb-gold)]"
        role="search"
      >
        <Search size={18} className="shrink-0 text-white/85" />
        <input
          value={tu}
          onChange={(e) => {
            setTu(e.target.value);
            setMo(true);
          }}
          onFocus={() => setMo(true)}
          onKeyDown={phim}
          placeholder={tx.goiY}
          aria-label={tx.aria}
          aria-expanded={mo && goiY.length > 0}
          aria-autocomplete="list"
          // h-9 = 36px, dưới ngưỡng 44px để ngón tay bấm trúng. Nút gửi cạnh
          // bên đã là 44px rồi, ô nhập phải bằng.
          className="h-11 min-w-0 flex-1 bg-transparent text-[15px] text-white outline-none placeholder:text-[var(--nb-text-mute)]"
        />
        <button
          type="submit"
          aria-label={tx.nut}
          className="nb-btn h-11 w-11 shrink-0 p-0 text-[13.5px]"
        >
          <ArrowRight size={18} />
        </button>
      </form>

      {mo && goiY.length > 0 && (
        <ul
          role="listbox"
          aria-label={tx.dsGoiY}
          className="absolute inset-x-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-2xl border border-[var(--nb-line)] bg-[var(--nb-navy-800)]/96 py-1.5 text-left backdrop-blur-xl"
          style={{ boxShadow: "0 30px 60px -28px rgba(0,0,0,.95)" }}
        >
          {goiY.map((g, i) => {
            const Icon = ICON[g.loai];
            return (
              <li key={`${g.loai}-${g.href}-${i}`} role="option" aria-selected={i === chon}>
                <button
                  type="button"
                  onMouseEnter={() => setChon(i)}
                  onClick={() => di(g)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
                    i === chon ? "bg-[var(--nb-navy-600)]" : ""
                  }`}
                >
                  <Icon size={15} className="shrink-0 text-[var(--nb-gold)]" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-medium text-white">{g.nhan}</span>
                    <span className="block truncate text-[12px] text-[var(--nb-text-mute)]">{g.phu}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

"use client";

import Image from "next/image";
import { AnimatedNumber } from "@/components/ui/TechText";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import { KhungHud } from "@/components/tech/KhungHud";
import { useT } from "@/lib/i18n/client";
import { home } from "@/lib/i18n/dict/home";
import { hieuUngHome } from "@/lib/i18n/dict/hieu-ung-home";

export function DanhMucNganh({ ds }: { ds: { id: string; ma: string; ten: string; anh: string; so: number }[] }) {
  const [chon, datChon] = useState(ds[0]?.id);
  const tx = useT(home);
  const nhan = useT(hieuUngHome);
  const hien = ds.find((n) => n.id === chon) ?? ds[0];
  if (!hien) return null;
  return <div className="nb-danh-muc">
    <svg width="0" height="0" className="absolute" aria-hidden="true"><defs><filter id="nb-rgb-home" colorInterpolationFilters="sRGB"><feOffset in="SourceGraphic" dx="2" result="r" /><feOffset in="SourceGraphic" dx="-2" result="b" /><feColorMatrix in="r" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="red" /><feColorMatrix in="b" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="blue" /><feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="green" /><feBlend in="red" in2="green" mode="screen" result="rg" /><feBlend in="rg" in2="blue" mode="screen" /></filter></defs></svg>
    <div className="nb-nganh-ds" aria-label={tx.congNghe.nganhTieuDe}>
      {ds.map((n) => <div key={n.id} className={`nb-nganh-hang ${n.id === hien.id ? "dang-chon" : ""}`}>
        <button type="button" aria-pressed={n.id === hien.id} onPointerEnter={(e) => { if (e.pointerType === "mouse") datChon(n.id); }} onFocus={() => datChon(n.id)} onClick={() => datChon(n.id)}>
          <span className="nb-ma">{n.ma}</span><span>{n.ten}</span><span className="nb-ma">{n.so.toString().padStart(2, "0")}</span>
        </button>
        <NavLink href={`/don-hang?nganh=${n.id}`} aria-label={`${tx.noiBat.tatCa} · ${n.ten}`} className="nb-nganh-mo"><ArrowUpRight size={18} /></NavLink>
      </div>)}
    </div>
    <KhungHud nhanTrai={`${hien.ma} / ${hien.id.toUpperCase()}`} nhanPhai="VN → DE" className="nb-nganh-khung">
      <div key={hien.id} className="nb-nganh-anh nb-nganh-doi nb-gd5-motion"><Image src={hien.anh} alt={hien.ten} fill sizes="(max-width: 1023px) 100vw, 48vw" className="object-cover" /></div>
      <div className="nb-nganh-thong-tin nb-gd5-motion" aria-live="polite">
        <p className="text-sm text-[var(--nb-text-dim)]"><span className="sr-only">{tx.tim.soDon(hien.so)}</span><span aria-hidden="true"><AnimatedNumber key={hien.id} value={hien.so} /> · {nhan.soDon}</span></p>
        <h3 className="nb-display mt-2 text-2xl">{hien.ten}</h3>
        <NavLink data-magnetic href={`/don-hang?nganh=${hien.id}`} className="nb-btn-ghost mt-5 min-h-11 px-5">{tx.congNghe.xemNganh}<ArrowUpRight size={17} /></NavLink>
      </div>
    </KhungHud>
  </div>;
}

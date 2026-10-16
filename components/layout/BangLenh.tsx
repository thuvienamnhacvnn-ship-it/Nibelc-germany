"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Search, X } from "lucide-react";
import { useLh, useT } from "@/lib/i18n/client";
import { giaoDien } from "@/lib/i18n/dict/giao-dien";
import { useChuyenTrang } from "./PageTransition";
import "./bang-lenh.css";
export type MucTim = { ten: string; href: string; nhom: number };
const chuan = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/gi, "d").toLocaleLowerCase();
export function BangLenh({ ds }: { ds: MucTim[] }) {
  const tx = useT(giaoDien); const lh = useLh(); const chuyen = useChuyenTrang();
  const [mo, datMo] = useState(false); const [tu, datTu] = useState(""); const [chon, datChon] = useState(0);
  const hop = useRef<HTMLDialogElement>(null); const oTim = useRef<HTMLInputElement>(null); const truoc = useRef<HTMLElement | null>(null);
  const ma = useId();
  const ketQua = useMemo(() => ds.filter(m => chuan(m.ten).includes(chuan(tu.trim()))).slice(0, 60), [ds, tu]);
  useEffect(() => {
    const phim = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); datMo(v => !v); } };
    const moHop = () => datMo(true);
    document.addEventListener("keydown", phim); window.addEventListener("nb:command", moHop);
    return () => { document.removeEventListener("keydown", phim); window.removeEventListener("nb:command", moHop); };
  }, []);
  useEffect(() => {
    if (!mo || !hop.current) return;
    truoc.current = document.activeElement as HTMLElement;
    const cu = document.body.style.overflow; const cuHtml = document.documentElement.style.overflow; document.body.style.overflow = "hidden"; document.documentElement.style.overflow = "hidden";
    hop.current.showModal(); oTim.current?.focus();
    return () => { document.body.style.overflow = cu; document.documentElement.style.overflow = cuHtml; truoc.current?.focus(); };
  }, [mo]);
  useEffect(() => { if (mo) document.getElementById(ma + "-" + chon)?.scrollIntoView({ block: "nearest" }); }, [chon, mo, ma]);
  function dong() { datMo(false); datTu(""); datChon(0); }
  function di(i: number) { const muc = ketQua[i]; if (!muc) return; dong(); chuyen(lh(muc.href)); }
  if (!mo) return null;
  return createPortal(<dialog ref={hop} className="nb-bang-lenh" aria-label={tx.tim} onCancel={e => { e.preventDefault(); dong(); }} onClick={e => { if (e.target === e.currentTarget) { const r=e.currentTarget.getBoundingClientRect(); if(e.clientX<r.left || e.clientX>r.right || e.clientY<r.top || e.clientY>r.bottom) dong(); } }} onKeyDown={e => {
    if (e.target !== oTim.current) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); datChon(v => (v + (e.key === "ArrowDown" ? 1 : -1) + Math.max(1, ketQua.length)) % Math.max(1, ketQua.length)); }
    if (e.key === "Enter") { e.preventDefault(); di(chon); }
  }}>
    <div className="nb-lenh-dau"><Search size={20} aria-hidden="true" /><input ref={oTim} role="combobox" aria-label={tx.tim} aria-expanded="true" aria-controls={ma} aria-activedescendant={ketQua[chon] ? ma + "-" + chon : undefined} autoComplete="off" placeholder={tx.goiY} value={tu} onChange={e => { datTu(e.target.value); datChon(0); }} /><button type="button" onClick={dong} aria-label={tx.dong}><X size={20} /></button></div>
    <ul id={ma} role="listbox" aria-label={tx.tim} className="nb-lenh-ket-qua">{ketQua.map((m,i) => <li key={m.href} id={ma + "-" + i} role="option" aria-selected={chon === i} onPointerMove={() => datChon(i)} onMouseDown={e => e.preventDefault()} onClick={() => di(i)}><span>{m.ten}</span><small>{tx.nhom[m.nhom]}</small></li>)}</ul>
    {!ketQua.length && <p role="status" className="nb-lenh-rong">{tx.rong}</p>}<p className="nb-lenh-phim">{tx.huongDan}</p>
  </dialog>, document.body);
}

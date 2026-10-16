"use client";

import { useEffect, useRef } from "react";

export type DongDuLieu = { ma: string; thanhPho: string; luong: string; suat: string; mau?: string };

export function DaiDuLieu({ ds, nhan }: { ds: DongDuLieu[]; nhan: string }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let hien = false;
    const giam = matchMedia("(prefers-reduced-motion: reduce)");
    const capNhat = () => { el.style.setProperty("--nb-ticker-play", hien && !document.hidden && !giam.matches ? "running" : "paused"); };
    const qs = new IntersectionObserver(([e]) => { hien = !!e?.isIntersecting; capNhat(); });
    qs.observe(el); document.addEventListener("visibilitychange", capNhat); giam.addEventListener("change", capNhat);
    return () => { qs.disconnect(); document.removeEventListener("visibilitychange", capNhat); giam.removeEventListener("change", capNhat); };
  }, []);
  if (!ds.length) return null;
  return <div ref={host} className="nb-dai-du-lieu" role="region" aria-label={nhan} tabIndex={0}>
    <div className="nb-dai-chay" aria-hidden="true">{[0, 1].map(lan => <div className="nb-dai-nhom" key={lan}>{ds.map((d, i) => <span className="nb-dai-dong" key={`${d.ma}-${i}`}><b>{d.ma}</b><span>{d.thanhPho}</span><span>{d.luong}</span><span>{d.suat}</span>{d.mau && <span>{d.mau}</span>}<i /></span>)}</div>)}</div>
    <ul className="sr-only">{ds.map((d, i) => <li key={`${d.ma}-${i}`}>{d.ma} · {d.thanhPho} · {d.luong} · {d.suat} {d.mau}</li>)}</ul>
  </div>;
}

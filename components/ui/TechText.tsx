"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

const kyTu = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/\\[]{}#%&*+=-_";
const cauHoi = "(prefers-reduced-motion: reduce)";
const docGiam = () => matchMedia(cauHoi).matches;
const docMayChu = () => true;
function theoDoi(doi: () => void) {
  const truyVan = matchMedia(cauHoi);
  truyVan.addEventListener("change", doi);
  return () => truyVan.removeEventListener("change", doi);
}

export function useGiamChuyenDong() {
  return useSyncExternalStore(theoDoi, docGiam, docMayChu);
}

/** Chữ gốc giữ chỗ và tên truy cập để giải mã không làm nhảy dòng hoặc đọc ký tự nhiễu. */
export function TechText({ children }: { children: ReactNode }) {
  const goc = typeof children === "string" || typeof children === "number" ? String(children) : "";
  const [hien, datHien] = useState(goc);
  const host = useRef<HTMLSpanElement>(null);
  const giam = useGiamChuyenDong();
  useEffect(() => {
    if (giam || !goc || !host.current || !window.IntersectionObserver) return;
    let khung = 0;
    const quanSat = new IntersectionObserver((muc) => {
      if (!muc[0]?.isIntersecting) return;
      quanSat.disconnect();
      const batDau = performance.now();
      function ve(luc: number) {
        const moc = Math.min(goc.length, Math.floor((luc - batDau) / 34));
        datHien(Array.from(goc, (chu, i) => i < moc || /[ .,]/.test(chu) ? chu : kyTu[Math.floor(Math.random() * kyTu.length)]).join(""));
        if (moc < goc.length) khung = requestAnimationFrame(ve);
      }
      khung = requestAnimationFrame(ve);
    }, { threshold: 0.25 });
    quanSat.observe(host.current);
    return () => { quanSat.disconnect(); cancelAnimationFrame(khung); };
  }, [goc, giam]);
  if (!goc) return <>{children}</>;
  return <span ref={host} className="nb-tech-text">
    <span className="sr-only">{goc}</span>
    <span className="nb-tech-goc" aria-hidden="true">{goc}</span>
    <span className="nb-tech-hien" aria-hidden="true">{giam ? goc : hien}</span>
  </span>;
}

/** Chữ số cuộn dọc một lần tới giá trị thật; năm giữ nguyên. */
export function AnimatedNumber({ value, format = "number" }: { value: number; format?: "number" | "year"; demMotLan?: boolean }) {
  const host = useRef<HTMLSpanElement>(null);
  const [chay, datChay] = useState(false);
  const giam = useGiamChuyenDong();
  useEffect(() => {
    datChay(false);
    if (giam || format === "year" || !host.current || !window.IntersectionObserver) return;
    const io = new IntersectionObserver(muc => { if (muc[0]?.isIntersecting) { io.disconnect(); datChay(true); } }, { threshold: .3 });
    io.observe(host.current); return () => io.disconnect();
  }, [value, format, giam]);
  return <span ref={host} className="nb-so-lat"><span className="sr-only">{value}</span><span aria-hidden="true">{String(value).split("").map((so,i) => /[0-9]/.test(so) ? <span key={i} className="nb-so-o"><span style={{ visibility: chay && !giam ? "hidden" : "visible" }}>{so}</span>{chay && !giam && <span className="nb-so-cuon" style={{ "--nb-so-dich": Number(so) + 10, animationDelay: i * 40 + "ms" } as React.CSSProperties}>{Array.from({ length: Number(so) + 11 }, (_,j) => <span key={j}>{j % 10}</span>)}</span>}</span> : <span key={i}>{so}</span>)}</span></span>;
}

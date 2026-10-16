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
    let thay = false;
    let xong = false;
    let mocTruoc = 0;
    let daChay = 0;
    const chuGoc = Array.from(goc);
    function ve(luc: number) {
      daChay += Math.min(80, luc - mocTruoc);
      mocTruoc = luc;
      const moc = Math.min(chuGoc.length, Math.floor(daChay / 24));
      datHien(chuGoc.map((chu, i) => i < moc || /[ .,]/.test(chu) ? chu : kyTu[Math.floor(Math.random() * kyTu.length)]).join(""));
      if (moc < chuGoc.length) khung = requestAnimationFrame(ve);
      else { xong = true; quanSat.disconnect(); }
    }
    function capNhat() {
      cancelAnimationFrame(khung);
      if (!thay || document.hidden || xong) return;
      mocTruoc = performance.now();
      khung = requestAnimationFrame(ve);
    }
    const quanSat = new IntersectionObserver((muc) => {
      thay = !!muc[0]?.isIntersecting;
      capNhat();
    }, { threshold: 0.25 });
    const el = host.current;
    const coRanh = typeof window.requestIdleCallback === "function";
    const batDau = () => quanSat.observe(el);
    const cho = coRanh ? window.requestIdleCallback(batDau, { timeout: 700 }) : window.setTimeout(batDau, 300);
    document.addEventListener("visibilitychange", capNhat);
    return () => {
      quanSat.disconnect(); cancelAnimationFrame(khung);
      document.removeEventListener("visibilitychange", capNhat);
      if (coRanh) window.cancelIdleCallback(cho); else clearTimeout(cho);
    };
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

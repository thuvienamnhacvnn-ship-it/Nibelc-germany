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

/** Nhịp số 85ms và ngưỡng 30% theo AnimatedNumber của bản VN; năm giữ nguyên. */
export function AnimatedNumber({ value, format = "number", demMotLan = false }: { value: number; format?: "number" | "year"; demMotLan?: boolean }) {
  const host = useRef<HTMLSpanElement>(null);
  const [so, datSo] = useState(value);
  const giam = useGiamChuyenDong();
  useEffect(() => {
    if (giam || format === "year" || !host.current || !window.IntersectionObserver) return;
    let nhip = 0;
    let khung = 0;
    const quanSat = new IntersectionObserver((muc) => {
      clearInterval(nhip);
      if (muc[0]?.isIntersecting) {
        if (demMotLan) {
          quanSat.disconnect();
          const batDau = performance.now();
          function dem(luc: number) {
            const tienDo = Math.min(1, (luc - batDau) / 900);
            datSo(Math.round(value * (1 - (1 - tienDo) ** 3)));
            if (tienDo < 1) khung = requestAnimationFrame(dem);
          }
          khung = requestAnimationFrame(dem);
          return;
        }
        nhip = window.setInterval(() => datSo(Math.floor(Math.random() * (Math.max(20, value * 2 + 9) + 1))), 85);
      } else datSo(value);
    }, { threshold: 0.3 });
    quanSat.observe(host.current);
    return () => { quanSat.disconnect(); clearInterval(nhip); cancelAnimationFrame(khung); };
  }, [value, format, giam, demMotLan]);
  return <span ref={host} className="nb-so-dong">
    <span className="sr-only">{value}</span>
    <span className="nb-tech-goc" aria-hidden="true">{value}</span>
    <span className="nb-tech-hien" aria-hidden="true">{giam || format === "year" ? value : so}</span>
  </span>;
}

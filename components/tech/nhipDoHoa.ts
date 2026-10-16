"use client";

import { useEffect, type RefObject } from "react";

type ButVe = (ctx: CanvasRenderingContext2D, rong: number, cao: number, giay: number, mau: string, nhan: string) => void;
type TacVu = { el: HTMLElement; hien: boolean; ve: (giay: number) => void };
const tacVu = new Set<TacVu>();
let khung = 0;
let truoc = 0;
let thoiGian = 0;
let lanVe = 0;

// Chỉ một canvas lớn chạy trong một viewport, kể cả khi thấy hai mục cùng lúc.
function nhip(luc: number) {
  khung = 0;
  const ds = [...tacVu].filter(t => t.hien);
  if (document.hidden || !ds.length || matchMedia("(prefers-reduced-motion: reduce)").matches) { truoc = 0; return; }
  thoiGian += truoc ? Math.min(luc - truoc, 100) / 1000 : 0;
  truoc = luc;
  if (luc - lanVe >= 1000 / 30) {
    ds.sort((a, b) => {
      const tam = (el: HTMLElement) => { const r = el.getBoundingClientRect(); return Math.abs(r.top + r.height / 2 - innerHeight / 2); };
      return tam(a.el) - tam(b.el);
    });
    ds[0]?.ve(thoiGian); lanVe = luc;
  }
  khung = requestAnimationFrame(nhip);
}
function chay() { if (!khung) khung = requestAnimationFrame(nhip); }

/** Canvas chỉ tạo trong effect; giữ HTML ban đầu giống server và giải phóng đầy đủ. */
export function useNetVe(host: RefObject<HTMLDivElement | null>, ve: ButVe) {
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true"); el.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) { canvas.remove(); return; }
    let rong = 1, cao = 1, mau = "", nhan = "";
    const giam = matchMedia("(prefers-reduced-motion: reduce)");
    const viec: TacVu = { el, hien: false, ve: (giay) => {
      ctx.clearRect(0, 0, rong, cao); ve(ctx, rong, cao, giay, mau, nhan);
    } };
    function doiMau() {
      const css = getComputedStyle(el!);
      mau = css.getPropertyValue("--nb-tech-ink").trim();
      nhan = css.getPropertyValue("--nb-tech-accent").trim();
      viec.ve(thoiGian);
    }
    function kichThuoc() {
      const r = el!.getBoundingClientRect(); rong = Math.max(1, r.width); cao = Math.max(1, r.height);
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(rong * dpr); canvas.height = Math.round(cao * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0); doiMau();
    }
    function trangThai() { if (giam.matches) viec.ve(0); chay(); }
    const quanSat = new IntersectionObserver(([e]) => { viec.hien = !!e?.isIntersecting; chay(); });
    const co = new ResizeObserver(kichThuoc);
    const chuDe = new MutationObserver(doiMau);
    tacVu.add(viec); quanSat.observe(el); co.observe(el);
    chuDe.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    document.addEventListener("visibilitychange", trangThai); giam.addEventListener("change", trangThai);
    kichThuoc();
    return () => {
      tacVu.delete(viec); quanSat.disconnect(); co.disconnect(); chuDe.disconnect(); canvas.remove();
      document.removeEventListener("visibilitychange", trangThai); giam.removeEventListener("change", trangThai);
      if (!tacVu.size) { cancelAnimationFrame(khung); khung = 0; truoc = 0; }
    };
  }, [host, ve]);
}

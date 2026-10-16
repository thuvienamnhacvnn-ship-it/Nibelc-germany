"use client";

import { useEffect, useRef } from "react";

export function ThuocToaDo() {
  const host = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const man = matchMedia("(min-width:1280px)");
    let hien = false, khung = 0;
    const giam = matchMedia("(prefers-reduced-motion: reduce)");
    function cuon() {
      if (!hien || !man.matches || document.hidden || khung) return;
      khung = requestAnimationFrame(() => {
        if (el) el.textContent = "Y " + String(Math.round(scrollY)).padStart(4, "0");
        khung = 0;
      });
    }
    function doiTrangThai() {
      cancelAnimationFrame(khung); khung = 0;
      if (hien && man.matches && !document.hidden && !giam.matches) window.addEventListener("scroll", cuon, { passive: true });
      else window.removeEventListener("scroll", cuon);
      if (!giam.matches) cuon(); else if (el) el.textContent = "Y 0000";
    }
    const qs = new IntersectionObserver(([e]) => { hien = !!e?.isIntersecting; doiTrangThai(); });
    qs.observe(el.parentElement!); man.addEventListener("change", doiTrangThai); giam.addEventListener("change", doiTrangThai); document.addEventListener("visibilitychange", doiTrangThai);
    return () => { qs.disconnect(); cancelAnimationFrame(khung); window.removeEventListener("scroll", cuon); man.removeEventListener("change", doiTrangThai); giam.removeEventListener("change", doiTrangThai); document.removeEventListener("visibilitychange", doiTrangThai); };
  }, []);
  return <span className="nb-thuoc-toa-do" aria-hidden="true"><span ref={host}>Y 0000</span></span>;
}

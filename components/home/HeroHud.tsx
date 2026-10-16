"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n/client";
import { hieuUngHome } from "@/lib/i18n/dict/hieu-ung-home";
import { useGiamChuyenDong } from "@/components/ui/TechText";

/** Chỉ trang trí tuyệt đối: không tham gia kích thước hay vị trí các khối hero. */
export function HeroHud({ soDon, soSuat }: { soDon: number; soSuat: number }) {
  const tx = useT(hieuUngHome);
  const host = useRef<HTMLDivElement>(null);
  const [gio, datGio] = useState<string[]>([]);
  const [soChu, datSoChu] = useState<number | null>(null);
  const giam = useGiamChuyenDong();
  const trangThai = `${tx.don}: ${soDon} / ${tx.suat}: ${soSuat}`;

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const desktop = matchMedia("(min-width: 1024px)");
    const berlin = new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    const hanoi = new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    let thay = !window.IntersectionObserver;
    let dongHo = 0;
    let goChu = 0;
    let viTri = 0;
    let daGo = false;
    function dung() { clearInterval(dongHo); clearInterval(goChu); }
    function capNhat() {
      dung();
      if (!thay || document.hidden || !desktop.matches) return;
      const doc = () => { const luc = new Date(); datGio([berlin.format(luc), hanoi.format(luc)]); };
      doc();
      if (!giam) dongHo = window.setInterval(doc, 1000);
      if (giam) datSoChu(null);
      else if (!daGo) {
        datSoChu(viTri);
        goChu = window.setInterval(() => {
          datSoChu(++viTri);
          if (viTri >= trangThai.length) { daGo = true; clearInterval(goChu); }
        }, 24);
      }
    }
    const io = window.IntersectionObserver ? new IntersectionObserver(([muc]) => { thay = !!muc?.isIntersecting; capNhat(); }) : null;
    const batDau = () => { io?.observe(el); capNhat(); };
    const coRanh = typeof window.requestIdleCallback === "function";
    const cho = coRanh ? window.requestIdleCallback(batDau, { timeout: 700 }) : window.setTimeout(batDau, 300);
    document.addEventListener("visibilitychange", capNhat);
    desktop.addEventListener("change", capNhat);
    return () => {
      dung(); io?.disconnect();
      if (coRanh) window.cancelIdleCallback(cho); else clearTimeout(cho);
      document.removeEventListener("visibilitychange", capNhat);
      desktop.removeEventListener("change", capNhat);
    };
  }, [giam, trangThai]);

  return <div ref={host} className="nb-hero-hud nb-gd5-motion" aria-hidden="true">
    <i className="nb-hero-goc nb-hero-goc-tren" /><i className="nb-hero-goc nb-hero-goc-duoi" />
    <span className="nb-hero-live">NIBELC · VN → DE · LIVE</span>
    {["trai", "phai"].map(ben => <div key={ben} className={`nb-hero-thuoc nb-hero-thuoc-${ben}`}>{Array.from({ length: 9 }, (_, i) => <span key={i}>{String(i * 128).padStart(4, "0")}</span>)}</div>)}
    <div className="nb-hero-terminal"><span>{trangThai}</span><span>{soChu === null ? trangThai : trangThai.slice(0, soChu)}<b className="nb-terminal-cursor">_</b></span></div>
    <div className="nb-hero-gio">{gio.length > 0 && <><span>BERLIN {gio[0]}</span><span>{tx.haNoi} {gio[1]}</span></>}</div>
    <div className="nb-hero-scan" />
  </div>;
}

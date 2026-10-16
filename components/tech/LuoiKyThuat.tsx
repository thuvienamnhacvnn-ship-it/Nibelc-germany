"use client";
import { useEffect, useRef, type ReactNode, type PointerEvent } from "react";
import "./cong-nghe.css";
export function LuoiKyThuat({ children, className = "" }: { children: ReactNode; className?: string }) {
  const host = useRef<HTMLDivElement>(null); const khung = useRef(0);
  const dich = useRef({ x: -100, y: -100 }); const hien = useRef({ x: -100, y: -100 });
  useEffect(() => () => cancelAnimationFrame(khung.current), []);
  function di(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || !matchMedia("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const r = e.currentTarget.getBoundingClientRect(); dich.current = { x: (e.clientX-r.left)/r.width*100, y: (e.clientY-r.top)/r.height*100 };
    if (hien.current.x === -100) hien.current = { ...dich.current };
    if (khung.current) return;
    let truoc = performance.now();
    function ve(luc: number) {
      const tiLe = 1 - Math.exp(-(luc-truoc)/120); truoc = luc;
      hien.current.x += (dich.current.x-hien.current.x)*tiLe; hien.current.y += (dich.current.y-hien.current.y)*tiLe;
      host.current?.style.setProperty("--mx", hien.current.x + "%"); host.current?.style.setProperty("--my", hien.current.y + "%");
      if (Math.abs(dich.current.x-hien.current.x)+Math.abs(dich.current.y-hien.current.y) > .05) khung.current = requestAnimationFrame(ve); else khung.current=0;
    }
    khung.current=requestAnimationFrame(ve);
  }
  function roi() { cancelAnimationFrame(khung.current); khung.current=0; hien.current={ x:-100,y:-100 }; host.current?.style.removeProperty("--mx"); host.current?.style.removeProperty("--my"); }
  return <div ref={host} data-grid-scan className={`nb-luoi ${className}`} onPointerMove={di} onPointerLeave={roi}>
    <span className="nb-luoi-den" aria-hidden="true" /><span className="nb-luoi-quet" aria-hidden="true" />
    <div className="nb-luoi-noi-dung">{children}</div>
  </div>;
}

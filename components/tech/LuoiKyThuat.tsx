"use client";

import type { ReactNode, PointerEvent } from "react";
import "./cong-nghe.css";

export function LuoiKyThuat({ children, className = "" }: { children: ReactNode; className?: string }) {
  function di(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || !matchMedia("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${(e.clientX - r.left) / r.width * 100}%`);
    e.currentTarget.style.setProperty("--my", `${(e.clientY - r.top) / r.height * 100}%`);
  }
  return <div className={`nb-luoi ${className}`} onPointerMove={di} onPointerLeave={(e) => { e.currentTarget.style.removeProperty("--mx"); e.currentTarget.style.removeProperty("--my"); }}>
    <span className="nb-luoi-den" aria-hidden="true" />
    <div className="nb-luoi-noi-dung">{children}</div>
  </div>;
}

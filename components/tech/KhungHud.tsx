import type { ReactNode } from "react";
import "./cong-nghe.css";

export function KhungHud({ nhanTrai, nhanPhai, children, className = "" }: { nhanTrai: string; nhanPhai?: string; children: ReactNode; className?: string }) {
  return <div className={`nb-hud ${className}`}>
    <div className="nb-hud-nhan"><span>{nhanTrai}</span><span>{nhanPhai}</span></div>
    {children}
    <i className="nb-hud-goc nb-hud-goc-tren" aria-hidden="true" />
    <i className="nb-hud-goc nb-hud-goc-duoi" aria-hidden="true" />
  </div>;
}

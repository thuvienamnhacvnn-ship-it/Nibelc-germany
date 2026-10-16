import type { ReactNode } from "react";
import "./cong-nghe.css";

export function VienChay({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`nb-vien-chay ${className}`}>
    {children}
    <svg className="nb-vien-net" width="100%" height="100%" aria-hidden="true"><rect x=".5" y=".5" width="calc(100% - 1px)" height="calc(100% - 1px)" rx="2" pathLength="100" /></svg>
  </div>;
}

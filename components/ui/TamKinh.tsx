import { type ReactNode } from "react";

/** Kính giữ nguyên vật liệu; dùng bộ chuột chung để không lệch nhịp với các thẻ. */
export function TamKinh({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div data-tilt className={`nb-hero-tam ${className}`}>
      <span className="nb-kinh-nen" aria-hidden="true" />
      <span className="nb-kinh-sang" aria-hidden="true" />
      <span className="nb-kinh-lap-lanh" aria-hidden="true" />
      <i className="nb-hud-goc nb-hud-goc-tren" aria-hidden="true" />
      <i className="nb-hud-goc nb-hud-goc-duoi" aria-hidden="true" />
      <div className="nb-kinh-noi">{children}</div>
    </div>
  );
}

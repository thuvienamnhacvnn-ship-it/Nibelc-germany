import { type ReactNode } from "react";

/**
 * Bảng hiệu banner trang con: kính cắt góc (Sếp 16/10: "hình chữ nhật cắt góc,
 * không để góc nhọn") + vệt sáng chạy quanh viền. Bộ chuột chung lo phần nghiêng.
 */
export function TamKinh({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div data-tilt className={`nb-hero-tam ${className}`}>
      <span className="nb-kinh-nen" aria-hidden="true" />
      <span className="nb-kinh-sang" aria-hidden="true" />
      <span className="nb-kinh-lap-lanh" aria-hidden="true" />
      <span className="nb-kinh-vien" aria-hidden="true" />
      <i className="nb-hud-goc nb-hud-goc-tren" aria-hidden="true" />
      <i className="nb-hud-goc nb-hud-goc-duoi" aria-hidden="true" />
      <div className="nb-kinh-noi">{children}</div>
    </div>
  );
}

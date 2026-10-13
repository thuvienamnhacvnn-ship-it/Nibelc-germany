"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

/**
 * TẤM KÍNH của banner trang con (Sếp 14/10: khung chữ navy đặc "nhìn rất xấu"
 * → "như 1 tấm kính title nổi, khi hover có hiệu ứng nghiêng ngả 3D và ánh
 * sáng lấp lánh").
 *
 * Thành phần này chỉ lo MỘT việc cần JavaScript: đọc vị trí chuột trên tấm rồi
 * ghi ra bốn biến CSS (--kx, --ky: -1…1 để nghiêng; --mx, --my: % để đặt vệt
 * sáng). Toàn bộ hình dáng kính, độ nghiêng, vệt sáng, lấp lánh nằm ở
 * page-hero.css — đổi dáng thì sửa ở đó, không sửa ở đây.
 *
 * Ghi thẳng vào style của phần tử chứ không qua state: chuột di là bắn sự
 * kiện vài chục lần một giây, cho qua state thì cả khối chữ dựng lại từng ấy
 * lần.
 *
 * Chỉ phản ứng với CHUỘT. Ngón tay chạm vào không có "hover": tấm nghiêng
 * theo điểm chạm rồi kẹt ở tư thế đó cho tới lần chạm sau.
 */
export function TamKinh({ className = "", children }: { className?: string; children: ReactNode }) {
  const tam = useRef<HTMLDivElement>(null);

  function di(e: PointerEvent<HTMLDivElement>) {
    const el = tam.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--kx", ((x - 0.5) * 2).toFixed(3));
    el.style.setProperty("--ky", ((y - 0.5) * 2).toFixed(3));
    el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
  }

  function roi() {
    const el = tam.current;
    if (!el) return;
    // về thẳng; vệt sáng giữ chỗ cuối và mờ dần tại đó (opacity lo ở CSS)
    el.style.setProperty("--kx", "0");
    el.style.setProperty("--ky", "0");
  }

  return (
    <div ref={tam} className={`nb-hero-tam ${className}`} onPointerMove={di} onPointerLeave={roi}>
      {/* Ba lớp trang trí đứng SAU chữ; dưới 1024px chúng bị tắt hẳn vì ở
          điện thoại chữ nằm trên nền phẳng, không có tấm nào. */}
      <span className="nb-kinh-nen" aria-hidden="true" />
      <span className="nb-kinh-sang" aria-hidden="true" />
      <span className="nb-kinh-lap-lanh" aria-hidden="true" />
      <div className="nb-kinh-noi">{children}</div>
    </div>
  );
}

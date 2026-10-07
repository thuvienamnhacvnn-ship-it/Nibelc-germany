"use client";

import { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";

/**
 * ẢNH TRONG TRANG QUẢN TRỊ — `<img>` thường, không `next/image`.
 *
 * Ảnh kho đã mang header cache một năm và trang quản trị không cần tối ưu
 * điểm số; đổi lại `<img>` cho phép bắt `onError` để hiện ô giữ chỗ thay vì
 * biểu tượng ảnh vỡ. Khung ngoài (className) PHẢI tự đặt `aspect-ratio` để
 * lưới không nhảy khi ảnh về.
 */
export function AnhKho({
  src,
  alt = "",
  className = "",
  chuTrong,
  nho = false,
}: {
  src: string | null | undefined;
  alt?: string;
  /** class của khung — nơi đặt aspect-ratio, bo góc, viền */
  className?: string;
  /** chữ hiện khi chưa có ảnh; bỏ trống = chỉ hiện icon */
  chuTrong?: string;
  /** ô nhỏ hơn ~80px: icon 16px, không chữ */
  nho?: boolean;
}) {
  const [hong, setHong] = useState(false);
  useEffect(() => setHong(false), [src]);

  const co = !!src && !hong;
  const chu = hong ? "Không tải được ảnh" : (chuTrong ?? "Chưa có ảnh");
  return (
    <span className={`qt-khung-anh ${className}`}>
      {co ? (
        <img src={src!} alt={alt} loading="lazy" decoding="async" draggable={false} onError={() => setHong(true)} />
      ) : (
        <span className={`qt-anh-trong${nho ? " qt-nho" : ""}`} role="img" aria-label={chu}>
          <ImageOff aria-hidden />
          {!nho && (hong || chuTrong) && <span>{chu}</span>}
        </span>
      )}
    </span>
  );
}

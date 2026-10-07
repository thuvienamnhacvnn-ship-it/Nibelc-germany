import Link from "next/link";
import type { Route } from "next";
import { ArrowLeft } from "lucide-react";

/**
 * ĐẦU TRANG: tiêu đề + dòng phụ bên trái, nút hành động chính bên phải.
 * Không dính đỉnh — thứ cần dính là thanh công cụ và thanh lưu, không phải
 * tiêu đề.
 */
export function DauTrang({
  tieuDe,
  phu,
  loiVe,
  children,
}: {
  tieuDe: string;
  phu?: React.ReactNode;
  /** trang form: liên kết quay lại danh sách, nằm trên tiêu đề */
  loiVe?: { nhan: string; duong: Route };
  /** nút hành động — tối đa một nút chính + một nút phụ */
  children?: React.ReactNode;
}) {
  return (
    <header className="qt-dau-trang">
      <div>
        {loiVe && (
          <Link href={loiVe.duong} className="qt-loi-ve">
            <ArrowLeft size={16} aria-hidden />
            {loiVe.nhan}
          </Link>
        )}
        <h1>{tieuDe}</h1>
        {phu && <p className="qt-phu">{phu}</p>}
      </div>
      {children && <div className="qt-dau-nut">{children}</div>}
    </header>
  );
}

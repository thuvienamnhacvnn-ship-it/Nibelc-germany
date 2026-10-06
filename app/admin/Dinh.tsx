import Link from "next/link";
import { viecRa } from "./viec";

/**
 * Thanh trên cùng của trang quản trị. Dính đỉnh để lúc cuộn bảng dài vẫn
 * chuyển mục được mà không phải kéo ngược lên.
 *
 * CHỈ liệt kê mục ĐÃ DỰNG XONG. Để link tới trang chưa có thì nhân viên bấm
 * vào gặp trang trắng, tưởng hỏng. Thêm dần theo từng chặng.
 */
export function Dinh({ o }: { o: "don-hang" | "nhat-ky" }) {
  return (
    <div className="qt-dinh">
      <span className="qt-ten">NIBELC</span>
      <Link href="/admin" aria-current={o === "don-hang" ? "page" : undefined}>
        Đơn hàng
      </Link>
      <Link href="/admin/nhat-ky" aria-current={o === "nhat-ky" ? "page" : undefined}>
        Nhật ký
      </Link>
      <span className="qt-phai">
        <Link href="/" target="_blank" rel="noreferrer">
          Xem web ↗
        </Link>
        <form action={viecRa} style={{ display: "inline" }}>
          <button type="submit" style={{ minHeight: 34, padding: "0 12px", marginLeft: 8 }}>
            Thoát
          </button>
        </form>
      </span>
    </div>
  );
}

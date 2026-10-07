import type { Route } from "next";

/**
 * Đường dẫn nội bộ của trang quản trị, ép về kiểu `Route` của typedRoutes.
 *
 * Gom về một chỗ vì nhiều đường dẫn ở đây ghép từ biến (id đơn, tham số lọc)
 * — typedRoutes không suy ra được, mà rải `as Route` khắp nơi thì mất luôn
 * tác dụng kiểm. MỌI đường dẫn dưới đây đều có trang thật trong app/admin/.
 */
const r = (s: string) => s as Route;

export const DUONG = {
  tongQuan: r("/admin"),
  donHang: r("/admin/don-hang"),
  donMoi: r("/admin/don-hang/moi"),
  don: (id: string) => r(`/admin/don-hang/${encodeURIComponent(id)}`),
  baiViet: r("/admin/bai-viet"),
  baiMoi: r("/admin/bai-viet/moi"),
  bai: (id: string) => r(`/admin/bai-viet/${encodeURIComponent(id)}`),
  anh: r("/admin/anh"),
  noiDung: r("/admin/noi-dung"),
  nhatKy: r("/admin/nhat-ky"),
  matKhau: r("/admin/mat-khau"),
  /** thêm tham số lọc vào một đường dẫn danh sách */
  loc: (goc: Route, tham: Record<string, string>) => r(`${goc}?${new URLSearchParams(tham).toString()}`),
  /** chuỗi bất kỳ đã biết chắc là đường dẫn nội bộ (vd lấy từ thuộc tính href) */
  tu: r,
};

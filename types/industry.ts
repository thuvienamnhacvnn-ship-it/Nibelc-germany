/** Một nhóm ngành nghề trên rail phong bì của trang chủ. */
export interface Industry {
  id: string;
  slug: string;
  /** Số thứ tự cố định trong taxonomy 12 nhóm của KIT */
  code: string;
  titleVi: string;
  titleDe: string;
  /** Tên icon trong lucide-react */
  icon: string;
  /** Ảnh phong bì đã tách từ sprite; null nghĩa là nhóm chưa có phong bì riêng */
  envelope: string | null;
  /** Ảnh nền dùng khi hero chuyển sang chế độ giới thiệu đơn hàng của ngành này */
  cover: string | null;
  /** Màu nhấn của ngành, lấy trong bảng màu chung */
  accent: string;
}

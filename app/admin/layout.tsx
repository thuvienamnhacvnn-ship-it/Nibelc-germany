import type { Metadata } from "next";
import "./quan-tri.css";

/**
 * KHUNG TRANG QUẢN TRỊ.
 *
 * Tách hẳn khỏi khung web công khai: không header, không footer, không menu
 * đáy, không hiệu ứng chuyển trang. Nhân viên vào đây để LÀM VIỆC, mỗi hiệu
 * ứng chập màn là một nhịp chờ vô ích khi phải sửa hai chục đơn liên tiếp.
 *
 * Giao diện dùng nền SÁNG dù web công khai là nền navy: form nhập liệu nhiều
 * ô, nền tối đọc lâu mỏi mắt, và mọi phần mềm quản trị người ta quen dùng
 * đều nền sáng.
 */
export const metadata: Metadata = {
  title: "Quản trị — NIBELC",
  // Chặn mọi máy tìm kiếm: trang nội bộ, không có lý do gì để lọt lên Google.
  robots: { index: false, follow: false, nocache: true },
};

export default function KhungQuanTri({ children }: { children: React.ReactNode }) {
  return <div className="qt">{children}</div>;
}

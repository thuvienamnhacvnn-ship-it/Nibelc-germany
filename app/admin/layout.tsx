import type { Metadata } from "next";
import { daVao } from "@/lib/quan-tri/dang-nhap";
import { Khung } from "./_chung/Khung";
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
 *
 * Thanh bên chỉ dựng SAU khi đăng nhập. Chưa đăng nhập thì chỉ có cổng vào
 * đứng giữa trang — không để lộ tên các mục cho người chưa có mật khẩu.
 * Việc CHẶN vẫn nằm ở từng trang (`daVao()` đầu mỗi page) và từng server
 * action; khung này chỉ quyết định vẽ gì.
 */
export const metadata: Metadata = {
  title: "Quản trị — NIBELC",
  // Chặn mọi máy tìm kiếm: trang nội bộ, không có lý do gì để lọt lên Google.
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function KhungQuanTri({ children }: { children: React.ReactNode }) {
  // CSDL trục trặc thì coi như chưa vào: trang con sẽ tự báo lỗi của nó, khung
  // không nên là thứ làm trắng cả trang.
  const vao = await daVao().catch(() => false);
  return <div className="qt">{vao ? <Khung>{children}</Khung> : children}</div>;
}

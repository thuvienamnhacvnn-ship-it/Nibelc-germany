import { hoi } from "@/lib/db";

/**
 * Id các đơn / bài CÒN TỒN TẠI — để dòng nhật ký của bản ghi đã xoá không
 * thành liên kết dẫn tới trang 404. Chỉ chạy ở máy chủ; nơi gọi phải chặn
 * cổng trước.
 */
export async function banGhiConLai(): Promise<{ don: string[]; bai: string[] }> {
  const [don, bai] = await Promise.all([hoi<{ id: string }>("select id from don_hang"), hoi<{ id: string }>("select id from bai_viet")]);
  return { don: don.map((d) => d.id), bai: bai.map((b) => b.id) };
}
